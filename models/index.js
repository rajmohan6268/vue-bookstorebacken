const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dbConfig = require('../config/db.config.js')

const db = {};
db.url = dbConfig.url

db.mongoose = mongoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.book = require('./book.model');
db.order = require('./order.model');

db.ROLES = ['user', 'admin'];

module.exports = db;