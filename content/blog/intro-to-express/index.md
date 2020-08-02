---
title: Intro to Express
date: "2020-08-02"
description: "backend"
---

### What is Express?

Express is a Web framework based on node.js. It provides ways to recognize and respond to http request through Middleware and Router.

### Start

To start using Express, we need to import express and create one instance using express(). To test the application, we also need a port and use the instance to listen to the port. This port can replace the real root dir and simulate the root page of the application.

```
const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

### Routing

Routing is the way to determining the response to the particular request. A route needs one method (GET, POST, PUT), one path and one or more handler callback function(s). An example is:

```
app.get('/', function(req, res))
```

The path represents the location of the request requires to change. The req object represents the HTTP request and res represents the HTTP response that the app will send when it receive a request.

### Serving static files

The work of the web application is the process of requests and responses. For example, when we open the main page of one web app, we send a request to GET index.html as a client. If such file is right in local dir, we can use express to get it directly as a static file. For example, if all our front-end file is in the dir path '~/build', we can use

```
app.use(express.static('build'))
```

In this case, whenever the server receives the request to GET something, it will go to the build folder and look for the responded file. If there is no such file locally, Express will then go to the connected database to look for it through some condition (model schema).

### Middleware

Middleware functions are functions that have access to req, res and the 'next' function. There are five types of middleware. The next function can assign the direction of the flow. If the middleware does not end the req, res cycle, a next() function is required to continue the flow into the next middleware function.

#### Application-level middleware

This middleware includes two methods, app.use() and app.METHOD().

If the app.use() only has one argument, the callback function, it will be executed every time the app receives a request. If there is the path in the arguments, the function will executed every time the app receives a request on the path.

#### Router-level middleware

The router middleware needs to be bound to an instance of "require('express').Router()". It can be seen as a middleware between app middleware and router. The RLM can only perform middleware and routing functions. After we bound the RLM to some routers, we can execute app.use(path, router_instance) and that will execute the corresponding method we bound to RLM instance.

#### Error-handling middleware

Whenever we catch some error in the middleware and route handlers, we need to pass the error to Express through next(error). The error will then be passed into the build-in error handler. We can also write error handlers and this is the error-handling middleware.

```
app.use(function(err, req, res, next) {})
```

We can handle different errors inside the function, and in the end, we can continue to use next(error) to pass the error we cannot handle now to Express.

### Handle unknown endpoints

If the client send an request which is not defined in any middleware, we need to handle it by responding a 404. The way to handle writing and adding an unknown endpoint middleware after all app-level middleware and router-level middleware and before Error-handling middleware.

```
app.use((request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
})
```

To learn more about Express, view [API reference](https://expressjs.com/en/5x/api.html).

