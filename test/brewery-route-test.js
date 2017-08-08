'use strict';
const expect = require('chai').expect;
const require = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const User = require('../model/user.js');
const beertap = require('../model/brewery.js');
