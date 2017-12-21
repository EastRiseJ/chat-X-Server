/**
 * Created by dsji on 2017/12/18 0018.
 */
const User = require('./user.model')
const Directorie = require('./directorie.model')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const redis = require('../../config/redis')

const validationError = (res, statusCode) => {
  statusCode = statusCode || 422
  return function (err) {
    return res.status(statusCode).json(err)
  }
}


const handleError = (res, statusCode) => {
  statusCode = statusCode || 500
  return function (err) {
    return res.status(statusCode).send(err)
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
	console.log(req)
	var _email = req.body.email,
		_password = req.body.password,
		_query = {email: _email},
		token = '';
	User.findOne(_query)
		.then(user => {
			if ( !user  ) {
					res.json({ code: 1, message: '邮箱未被注册' });
				} else {
					if (user.authenticate(_password)) {
						token = jwt.sign({ _id: user._id }, config.secrets.session, {
							expiresIn: 60 * 60 * 5
						})
						user.token = token
						var updateUser = JSON.parse(JSON.stringify(user))
						delete updateUser._id
						User.findOneAndUpdate({ _id: user._id }, updateUser).exec()
						res.json({ 
							code: 0, 
							data: {
								name: user.name,
								email: user.email,
								avatar: user.avatar,
								token: user.token
							},
							message: '登录成功' 
						});
					} else {
						res.json({ code: 1, message: '密码错误' });
					}
				}
		})
}


/**
 * 退出登录
 */
module.exports.logout = (req, res) => {
  var userId = req.user._id
  return User.findOneAndUpdate({ _id: userId }, { token: '' }).exec()
    .then(() => {
      res.status(200).json({
				code: 0,
				message: '退出成功'
			}).end()
    })
    .catch(handleError(res))
}

module.exports.findByToken = (token) => {
  return User.findOne({ token: token }).exec()
}

/*
 * 获取联系人
 */
module.exports.directories = (req, res, next) => {
	console.log('staaaa')
	var _id = req.user._id,
		_query = {sid: _id};
	return Directorie.findOne(_query).populate('list', 'email name')
		.then(data => {
            console.log(data)
			res.status(200).json({
						code: 0,
						data: data
					}).end()
		})
    	.catch(handleError(res))
}