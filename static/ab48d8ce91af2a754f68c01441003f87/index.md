---
title: A web service deployed on Raspberry Pi based on Nginx
date: "2022-03-23"
description: "Use Raspberry Pi to deploy a Nginx web service"
tags: ["web", "deployment"]
---

## Prepare the Raspberry Pi

1. install the Raspberry Pi os into the microSD card, setup the username/password before write into card
2. power on the Pi and plug in the network cable
3. get the ip address of the Pi through the router admin page
4. on another machine ssh into the Pi

```
ssh pi@<ip address of pi>
```

5. enable tcp forwarding for ssh(if you want to use vscode to remote work on it)

```
sudo vim /etc/ssh/sshd_config

# Change AllowTcpForwarding to yes
```

## Write a service using express and nodeJS

1. prepare the work space

```
mkdir dev
cd dev
npm init -y
npm install express
touch server.js
```

2. write the welcome service

```
# in server.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Welcome</h1>
      </body>
    </html>
  );
});

app.listen(5000, () => {console.log(`http://localhost:5000`)});
```

3. run the service and we should be able to see the welcome page on any machine's browser using the ip address

```
node server.js
# open browser on any machine under the same wifi network of the Pi and enter the ip address of the Pi and port 5000 in address bar of the browser.
# e.g., 192.168.1.75:5000
# You should be able to see a welcome page.
```

## Replace the Nodejs server with the Nginx server

1. install Nginx

```
sudo apt install nginx
```

2. set up the reverse proxy, by enabling the reverse proxy, we added a layer between nodeJS server and the client side to realize the load balance

```
sudo vim /etc/nginx/sites-available/default
# in the default file, add one line (proxy_pass) to the location / section

location / {
          proxy_pass http://localhost:5000;
          try_files $uri $uri/ =404;
}
```

3. now if we use any browser under the same wifi network to access the ip address, we can see the welcome page. All the request going to the ip will be handled by Nginx and be sent to localhost:5000 then.

##
