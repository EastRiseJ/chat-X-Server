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
	User.findOne(_query).populate('list', 'email name')
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
								id: user.id,
								name: user.name,
								email: user.email,
								avatar: user.avatar,
								token: user.token,
								list: user.list
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
 * 搜索用户
 */
module.exports.searchUser = (req, res, next) => {
	var _email = req.body.email,
		_query = {email: _email};
	return User.findOne(_query, 'id name email avatar')
		.then(data => {
			if ( !data  ) {
				res.json({ code: 1, message: '该用户不存在' });
			} else {
				res.status(200).json({
							code: 0,
							data: {
								id: data.id,
								name: data.name,
								email: data.email,
								avatar: data.avatar
							}
						}).end()
			}
		})
    	.catch(handleError(res))
}