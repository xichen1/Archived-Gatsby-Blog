---
title: Database Design and Implementation Note
date: "2021-10-09"
description: "Notes for the book about database"
tags: ["database", "note"]
---



In this post, I will record the notes when reading the book Database design and implementation (Sciore 2020). It mainly includes the points I feel important or unclear before reading the book. 

The current version starts from chapter 2 since chapter 1 is more like the environment and conclusion   content. So let's start.

## Chapter 2 JDBC

### Concepts

***Database engine:*** database engine is the software which manages(create, update, delete) the database directly. It is a part of DBSM.

***Database client application:*** it is a software which calls the database engine's APIs to manipulate the database.

***JDBC:*** it is a set of formats which regulates how to write database engine's APIs with Java. JDBC contains five interfaces: *Driver, Connection,Statement, ResultSet, and ResultSetMetadata*.

Usually, the client application does not want to adapt to different format of engine API, instead it wants to use fixed APIs for several operations, like connecting to db, operating statement and receiving from database. So JDBC provides a regulation for all db engine - they must implement the interfaces to provide the required features.

### Connect to database with JDBC

The Driver interface in JDBC provides the method to connect client and database(connect). 

It accepts the protocol of connection(who connects to who), location of the server(ip, path), and other arguments(authentication, create new or not).

#### Vendor-specific code in client program

Notice, even though JDBC provides the common format for all db engines, there is still vendor-specific command to call in JDBC client. The different db engines provide different Driver types, and to connect to server, the client must use those different Drivers. Also, when connecting to db, different engines require different connection string (to specify different configs). In this case, the Drive and the connection string in client may differ for different engines.

Because of the different types of Driver, in client program, it needs to import the engine specified Driver class.

#### Close a connection

The connection class provides a method close() which allows to close the connection between client and server.

### Exception Handle

There are various exception might happen during running database, different db engine usually handle them in different ways. So to regulate the exception showing for client, JDBC provides a exception class ***SQLException***, it wraps the db engine's personal exception and provides the client a error message according to the wrapped exception.

#### Try with resource syntax

```java
try (Connection conn = d.connect(url, null)){

} catch (SQLException e) {

}
```

In this example, it creates a connection resource in try parentheses, when it reaches the end of try block, no matter it has a exception or finishing the execution, java will close the connection resource implicitly which avoids the resource leak.

### Executing SQL statements

After the connection is created, the connection class can use the method createStatement() to create a Statement object. The Statement has three basic methods -- 

executeQuery, executeUpdate and close. 

- executeQuery's argument is a double quoted SQL query, and returns a ResultSet object.

- executeUpdate's argument is a double quoted SQL UPDATE query, and returns a ResultSet object.

- executeUpdate method returns the number of records that were updated.

- executeQuery method returns a ResultSet object which represents the output of the query.

#### RestultSet

It is a object used to store each row of the output after executing the SQL query. In the beginning it points to the position before the first row of output records. By calling the method  next(), it can move one row forward. When pointing to each, the client can use some methods to call that row's record. When next() method returns False, it's pointing to the end of the output records.

```java
// connection
String qry = "select ...";
ResultSet rs = stmt.executeQuery(qry);
while (rs.next()) {
... // process the record
    // getString(fieldName)
    // getInt(fieldName)
}
```

### ResultSetMetaData

The interface ResultSetMetaData of JDBC can be used to record the information of each column (eg name, type, data size of each field in one table). It is the output of method ```ResultSet.getMetaData();``` 

````java
// i is the index of column, starting from 1
// use a loop to get all columns' infor
String name = md.getColumnName(i);
int size = md.getColumnDisplaySize(i);
int typecode = md.getColumnType(i);
````

### Whole process for a client to execute one SQL statement

1. Accept one connection string from the input, determine it's connecting to server or Embedded by checking if there is "//" in connection string. Then create the proper Driver.
2. Using the Driver to create a connection, by calling ` Driver.connect(connStr, null)` , and put this call in try statement to prevent the resource leak.
3. Initializing a Statement object, to prepare for executing statement later.
4. Inside the try block, using while loop to accept each line of statement, operating bases on the start str of the statement:
   1. if starting with exit, close the connection, quit the process
   2. if starting with "select"
      1. Using the Statement object and query statement, calling ` stmt.executeQuery(SQLStatment)` and get the ResultSet object.
      2. Using loop and proper methods to get each column's info(type, name, size)
      3.  Using loop and ResultSet.next() to get each row's record.
   3. if starting with other str
      1. Using the Statement object and query statement, calling ` stmt.updateQuery(SQLStatment)`
      2. Output how many records are updated

### Transaction

#### Autocommit or Not

A Transaction is a set of work (SQL statements). When a set of work is completed successfully, the database engine will commit the change to the db. When any work inside the transaction fails, the engine will fail all work of this transaction and roll back the db's state.

In the base JDBC implementation, the process implemented in a way called Autocommit, each statement is a transaction, so the engine will not commit multiple changes in one transaction. 

This is reasonable since each transaction creates a lock which prevents the other transaction from committing, and executing one statement in each transaction will shorten the waiting time for the other transactions. But we may want the transaction to contain multiple work sometimes:

1. When we need more than one statement active. For example, if we need the result of the first statement to operate the second statement. If we release the lock after executing the first statement, the result might be different when executing the second statement. So we need to lock the resource during the whole process of executing these two statements.

2. When we need to execute more than one statement at the same time. For example, swapping two records:

   ```sql
   String cmd1 = "update SECTION set Prof= 'brando' where SectId = 43";
   String cmd2 = "update SECTION set Prof= 'einstein' where SectId = 53";
   ```

   If we commit the db after the first stmt, two names will be same and this is an undesirable result.

3. Because each stmt is independent, it might be inconvenient if we want to do a batch of work but it crashes in the middle of work. We have difficulty to determine which operations are successful and which failed. It's better to put them in one transaction and let them fail or succeed together.

#### Solution

To allow custom handle of commit/transaction, JDBC provides three APIs of Connection object for client.

```java
public void setAutoCommit(boolean ac) throws SQLException;
public void commit() throws SQLException;
public void rollback() throws SQLException;
```

By calling ` setAutoCommit(False)`, it closes the engine's one stmt each transaction strategy, giving the client rights to decide when to commit or rollback. Then the client can decide the time to complete the transaction by itself.

After all statements in one desired transaction is finished, the client can call commit(), and the client can call rollback() in catch block of the try statement of creating the connection, so that if any error happens, it can roll back the db.

### Handle concurrency

The concurrency in database is similar as it in operating system -- db engines handle the one transaction(process) first, stop it and move to handle another transaction(process), and move among different transactions. Similar as CPU, db engines cannot handle multiple transaction at the same time, instead, it stops one transaction, stores its states, and move to the other transactions. With the fast speed, it creates an illusion that it's handling multiple transaction at same time.

This leads to problem, because if part of one transaction is finished, and another transaction start to executing the stmts, it will use the wrong, uncommitted records created by the first transaction.

