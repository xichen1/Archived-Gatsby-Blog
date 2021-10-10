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

Notice, even though JDBC provides the common format for all db engines, there is still vendor-specific command to call in JDBC client. The different db engines provide different Driver types, and to connect to server, the client must use those different Drives. Also, when connecting to db, different engines require different connection string (to specify different configs). In this case, the Drive and the connection string in client may differ for different engines.

Because of the different types of Driver, in client program, it needs to import the engine specified Driver class.

#### Close a connection

The connection class provides a method close() which allows to close the connection between client and server.

