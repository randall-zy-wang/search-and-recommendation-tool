const mongoose = require("mongoose")
const {MongoMemoryServer} = require('mongodb-memory-server');

const mongoEndPoint = "mongodb://mongoDB:27017/searecDB"
const TESTING = false

const connect = () => {
    if (TESTING) {
        console.log('Connecting to a mock db for testing purposes.');

        const mongoServer = new MongoMemoryServer();

        mongoose.Promise = Promise;
        mongoServer.getUri()
            .then((mongoUri) => {
                const mongooseOpts = {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useUnifiedTopology: true
                };

                mongoose.connect(mongoUri, mongooseOpts);

                mongoose.connection.on('error', (e) => {
                    if (e.message.code === 'ETIMEDOUT') {
                        console.log(e);
                        mongoose.connect(mongoUri, mongooseOpts);
                    }
                    console.log(e);
                })
                .on('disconnected', connect);
            });
    } else {
        mongoose.connect(mongoEndPoint, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
            .then(() => console.log('Now connected to MongoDB!'))
            .catch(err => console.error('Something went wrong when connecting to the db', err));
    }
}

module.exports = {connect, mongoose};
