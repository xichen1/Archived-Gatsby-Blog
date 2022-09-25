---
title: Using Docker with Postgres
date: "2022-09-24"
description: "Using Docker with Postgres"
tags: ["database", "Docker"]
---

## Intro
Using Docker container to implement a PostgreSQL is not quite easy for a newcomer in Docker. Especially for those who are not familar with Database, it's very hard to configure and set everything correct. So that's why this artical is created. Let's start from a simple docker compose file.
```
version: "3.6"
services:
  postgres:
    image: postgres:latest
    container_name: test-postgres
```

## Docker compose's initialization
If you are not using a dockerfile to creating a Postgre image, instead, you are using docker compose file to directly a Postgre container, a lot of things will be done by the Docker itself. For example the `host name` of the database is the `container_name` you set for the db container. 

#### User, password and Database
It will also generate a user using the password and database name you provided in the envrionment variables.
```
version: "3.6"
services:
  postgres:
    image: postgres:latest
    container_name: test-postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=testdb
```

#### Connection db
So when you are writing the backend code to connect the database, you can use these values for connection. 

A example with gorm in Golang is:
```
import (
        "gorm.io/driver/postgres"
        "gorm.io/gorm"
)

dsn := "postgres://postgres:pass@test-postgres/testdb"
db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
```

#### Database initilization
To initilizate a database, you can use Docker volumes.
```
version: "3.6"
services:
  postgres:
    image: postgres:latest
    container_name: test-postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=testdb
    volumes:
      - ./migrations/init.sql:/docker-entrypoint-initdb.d/init.sql
volumes:
  postgres:
```
With this, init.sql will be run once the container starts.

Notice: When the database container's data directory is empty, the initilization script/sql won't be run.

#### networks and ports
If you want to use container's name as the host name and provide another container from same or different networks the access to the postgres db, you need to setup network and ports.

Using `networks`, all containers in the same compose fill will be running under the same specified network, which allows to call host name directly.

Using `ports`, you can specify the outside port the postgres container. So when a service from different network trying to access the postgres db, it can use that port.

```
version: "3.6"
services:
  postgres:
    image: postgres:latest
    container_name: test-postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=testdb
    volumes:
      - ./migrations/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - 5432:5432
    networks:
      - test-network
volumes:
  postgres:

networks:
  test-network:
    name: test-network
```

## First come first served
Docker enables the dependency feature which allows you specify which service to run first and second. This is important because database's initialization may take time and is usually slower than the startup of backend services.

However, the dependency only makes sure which services will run first, but Postgres container won't give a sign that the initialization is done. Docker compose will only know when database service is started successfully and will let it finish the remaining job, and start the next service. 

So usually when Docker starts the backend service, the init process isn't done, which will cause various errors such as `dial tcp [::1]:5432: connect: connection refused docker` and `FATAL:  role "root" does not exist`. 

I chose `health check` and `condition depend` on in Docker to solve the problem.

#### Healthcheck
The healthcheck feature in Docker will check run some user defined commands and see if there is any error (exit code 1) returned depending on the timeout, intervals, and retries you set.

```
version: "3.6"
services:
  postgres:
    image: postgres:latest
    container_name: test-postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=testdb
    volumes:
      - ./migrations/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - 5432:5432
    networks:
      - test-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]

volumes:
  postgres:

networks:
  test-network:
    name: test-network
```

#### Conditional depends on
As I mentioned before the `depends on` in Docker compose is not working well. However, we can add some condition to it and make it working with healthcheck.
```
version: "3.6"
services:
  backendserver:
    build: "."
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    network:
      - test-network
```
It will run the health check command in the service `postgres` and will only start this service if the condition is passed.

## Some other points when configing Docker with Postgres
Some other things I may mention next time include `environment variables`, other usage of volums and how to set correct interval, timeout and retires in healthcheck.

## Appendix
### Full docker compose file
```
version: "3.6"
services:
  postgres:
    image: postgres:latest
    container_name: test-postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=testdb
    volumes:
      - ./migrations/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - 5432:5432
    networks:
      - test-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]

  backendserver:
    build: "."
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    network:
      - test-network

volumes:
  postgres:

networks:
  test-network:
    name: test-network
```