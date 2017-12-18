/**
 * Created by dsji on 2017/12/18 0018.
 */
const express = require('express')
const controller = require('./user.controller')
// const auth = require('../../auth/auth.service')

var router = express.Router()
// router.get('/', auth.hasRole('admin'), controller.index)
// router.delete('/:id', auth.hasRole('admin'), controller.destroy)
// router.get('/me', auth.isAuthenticated(), controller.me)
// router.put('/:id/password', auth.isAuthenticated(), controller.changePassword)
// router.get('/:id', auth.isAuthenticated(), controller.show)
router.post('/signup', controller.create)
router.post('/login', controller.signin)
// router.get('/signup', (req, res) => {
//   res.json({
//     msg: 'route ok'
//   })
// })

module.exports = router
