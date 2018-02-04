module.exports.isOnline = (id) => {
    return new Promise((resolve,reject)=>{
        redis.hexists('online', id, (err, reply) => {
            if (reply === 1) {
                redis.hget('online', id, (err, reply) => {
                    resolve(reply)
                })
            } else {
                resolve(false)
            }
        })
    })
}