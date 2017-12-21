/**
 * 用户权限认证方法
 */
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const config = require('../config/config')
const compose = require('composable-middleware')
const User = require('../app/user/user.model')
const UserController = require('../app/user/user.controller')

const validateJwt = expressJwt({
    secret: config.secrets.session
})

/**
 * 验证用户是否有权限操作
 * @returns {function()}
 */
module.exports.isAuthenticated = () => {
    return compose()
        .use(function (req, res, next) {
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = `Bearer ${req.query.access_token}`;
            }
            if(req.body && req.body.hasOwnProperty('access_token')) {
                req.headers.authorization = `Bearer ${req.body.access_token}`;
            }
            // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
            if (req.query && typeof req.headers.authorization === 'undefined') {
                req.headers.authorization = `Bearer ${req.cookies.token}`;
            }
            //验证是否服务端生成的token
            var token = req.headers.authorization.split('Bearer ')[1]
            UserController.findByToken(token).then((user) => {
                if (user) {
                    //验证token是否过期
                    validateJwt(req, res, next);
                }else{
                    return res.status(401).json({
                        code: 1,
                        message: 'token过期或不存在'
                    }).end();
                }
            })

        })
        // Attach user to request
        .use(function (req, res, next) {
            User.findById(req.user._id).exec()
                .then(user => {
                    if (!user) {
                        return res.status(401).end();
                    }
                    req.user = user;
                    next();
                    return null;
                })
                .catch(err => next(err));
        });
}

/**
 * 返回一个JWT TOKEN
 * @param id 用户ID
 * @param role 用户权限
 * @returns {*} JWT TOKEN
 */
module.exports.signToken = (id, role) => {
    return jwt.sign({_id: id, role}, config.secrets.session, {
        expiresIn: 60 * 60 * 5
    })
}