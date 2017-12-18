/**
 * Created by dsji on 2017/12/18 0018.
 */
const express = require('express')
const controller = require('./user.controller')
const auth = require('../../auth/auth.service')

var router = express.Router()
router.post('/signup', controller.create)
router.post('/login', controller.signin)
router.post('/logout', auth.isAuthenticated(), controller.logout)
// router.get('/signup', (req, res) => {
//   res.json({
//     msg: 'route ok'
//   })
// })

module.exports = router
