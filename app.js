/**
 * Created by dsji on 2017/12/18 0018.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose'),
	express = require('./config/express');

var db = mongoose();
var app = express();
app.listen(3000,()=>{
	console.log('server start');
});
module.exports = app;
console.log('server start at http://localhost:3000/');
