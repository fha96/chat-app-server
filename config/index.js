'use strict';

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');



module.exports = {
     PORT : process.env.PORT,
     http,
     app,
     cors,
     Server
}