var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	mongoose.Promise = require('bluebird');

var DirectorieSchema = new Schema({
  sid: String,
	list: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})


module.exports = mongoose.model('Directorie', DirectorieSchema)