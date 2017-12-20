module.exports = {
	db: 'mongodb://localhost/chat-x',
	sessionSecret:'developmentSessionSecret',
	secrets: {
			session: 'chatX'
	},
	redis: {
		post: 6379,
		host: '127.0.0.1',
		opts: {}
	}
};
