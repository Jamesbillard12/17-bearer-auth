'use strict';

const express = require('express');
const debug = require('debug')('beertap:server');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`server on ${PORT}`);
});
