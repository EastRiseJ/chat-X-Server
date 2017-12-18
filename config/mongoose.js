var config = require('./config'),
	mongoose = require('mongoose');

module.exports = () => {
	let db = mongoose.connect(config.db, {
		useMongoClient: true
	});
	// db.connection.on("error", function (error) {
	//     console.log("数据库连接失败：" + error);
	// });
	// db.connection.on("open", function () {
	//     console.log("------数据库连接成功！------");
	// });
	// require('../app/user/user.model');
	return db;
};