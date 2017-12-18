const userRoutes =  require('../app/user')
module.exports = function (app) {
  app.use('/user', userRoutes);
}
