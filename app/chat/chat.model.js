var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	mongoose.Promise = require('bluebird');

const MessageSchema = new Schema({
	message: String,
	date: Date,
	direction: String
})

const ChatsSchema = new Schema({
	sid: { type: Schema.Types.ObjectId, ref: 'User' },
	otherid: { type: Schema.Types.ObjectId, ref: 'User' },
	list: [ MessageSchema ]
})


module.exports = mongoose.model('Chat', ChatsSchema)