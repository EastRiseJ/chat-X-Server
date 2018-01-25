const Chat = require('./chat.model')
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

module.exports.getchats = (req, res) => {
	
}