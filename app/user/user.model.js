/**
 * Created by dsji on 2017/12/18 0018.
 */
var mongoose = require('mongoose'),
	// crypto = require('crypto'),
	Schema = mongoose.Schema;
	mongoose.Promise = require('bluebird');
var UserSchema = new Schema({
	email: String,
	password: String,
	name: String,
	avatar: {
    type: String,
    default: ''
  },
	token: {
    type: String,
    default: ''
  }
})
// let User = mongoose.model('User', UserSchema)
UserSchema.methods = {
	/**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   */
  authenticate (password, callback) {
    if (!callback) {
      return this.password === password
    }

    // this.encryptPassword(password, (err, pwdGen) => {
    //   if (err) {
    //     return callback(err)
    //   }

    //   if (this.password === pwdGen) {
    //     return callback(null, true)
    //   } else {
    //     return callback(null, false)
    //   }
    // })
  },
}
module.exports = mongoose.model('User', UserSchema);
