import { startBot } from './bot/start-bot';

startBot();

//Stay awake on Glitch.com
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  console.log('server pinged');
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);