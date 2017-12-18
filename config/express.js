const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
module.exports = ()=>{
	var app = express();
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  
  //设置跨域访问
  app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });
  /*
   * 路由
  */
  require('./routers')(app)
  return app
}