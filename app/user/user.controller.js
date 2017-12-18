/**
 * Created by dsji on 2017/12/18 0018.
 */
const User = require('./user.model')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')

const validationError = (res, statusCode) => {
  statusCode = statusCode || 422
  return function (err) {
    return res.status(statusCode).json(err)
  }
}
/**
 * 创建用户
 * @param req
 * @param res
 */
module.exports.create = (req, res) => {
	let newUser = new User(req.body)
		_query = {email: req.body.email};
	User.findOne(_query, function (err, doc){
		if(err){
			res.json({ code: 1, message: err });
		} else{
			if ( !doc || doc.length === 0  ) {
				newUser.save((err) => {
					if (err) console.log(err)
					else console.log()
				})
					.then((user) => {
						let token = jwt.sign({ _id: user._id }, config.secrets.session, {
							expiresIn: 60 * 60 * 5
						})
						user.token = token
						var updateUser = JSON.parse(JSON.stringify(user))
						delete updateUser._id
						User.findOneAndUpdate({ _id: user._id }, updateUser).exec()
						res.json({ code: 0, message: "注册成功" });
					})
					.catch(validationError(res))
				} else {
					res.json({ code: 1, message: '邮箱已被注册' });
				}
		}
	})
}

/*
 * 登录
 */
module.exports.signin = (req, res, next) => {
	var _email = req.body.email,
		_password = req.body.password,
		_query = {email: _email};
	User.findOne(_query)
		.then(user => {
			if ( !user  ) {
					res.json({ code: 1, message: '邮箱未被注册' });
				} else {
					if (user.authenticate(_password)) {
						res.json({ 
							code: 0, 
							data: {
								token: user.token
							},
							message: '登录成功' 
						});
					} else {
						res.json({ code: 1, message: '密码错误' });
					}
				}
		})
	// User.findOne(_query, function (err, doc){
	// 	if(err){
	// 		res.json({ code: 1, message: err });
	// 	} else{
	// 		if ( !doc || doc.length === 0  ) {
	// 				res.json({ code: 1, message: '邮箱未被注册' });
	// 			} else {
	// 				if (doc.authenticate(_password)) {
	// 					res.json({ 
	// 						code: 0, 
	// 						data: {
	// 							token: doc.token
	// 						},
	// 						message: '登录成功' 
	// 					});
	// 				} else {
	// 					res.json({ code: 1, message: '密码错误' });
	// 				}
	// 			}
	// 	}
	// })
}

// exports.authenticate = function(_query, cb){
// 	User.findOne(_query, function(err, doc){
// 		if(err){
// 			cb(err, null)
// 		} else{
// 			cb(null, doc)
// 		}
// 	})
// }
// exports.signup = function(req, res, next){
// 	let _name = req.body.name,
// 		_email = req.body.email,
// 		_password = req.body.password
// 	_query = { name: _name, email: _email, password: _password, avatar: '' };
// 	db.authenticate({ email: _email }, function(err, doc){
// 		if(err){
// 			res.json({ code: 1, message: err });
// 		} else if(doc === null || doc.length === 0){
// 			db.signup(_query, function(err, doc){
// 				if(err){
// 					res.json({ code: 1, message: err });
// 				} else{
// 					res.json({ code: 0, message: "注册成功" });
// 				}
// 			})
// 		} else{
// 			res.json({ code: 1, message: '邮箱已被注册' });
// 		}
// 	})
// }

// exports.signup = function(_query, cb){
// 	User.create(_query, function(err, doc){
// 		if(err){
// 			cb(err, null)
// 		} else{
// 			cb(null, doc)
// 		}
// 	})
// }