const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path'),
  port = process.env.PORT || 3000;

const index = require('./routes/index');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', index);

app.listen(port, () => console.log(`Listening on port ${port}`));
