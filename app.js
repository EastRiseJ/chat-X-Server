/**
 * Created by dsji on 2017/12/18 0018.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	socket = require('./config/socket');

var db = mongoose();
var app = express();
var ws = socket(app);
app.listen(3000,()=>{
	console.log('server start at http://localhost:3000/');
});
ws.listen(3001, () => {
	console.log('ws start at http://localhost:3001/');
})
module.exports = app;
