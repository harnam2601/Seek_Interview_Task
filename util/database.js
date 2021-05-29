const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const DotEnv = require('dotenv');

DotEnv.config();

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@harryscluster.g4myv.mongodb.net/seek_interview?retryWrites=true&w=majority`, { useUnifiedTopology: true }
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
