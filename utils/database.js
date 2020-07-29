const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;

let db;

const dbconnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://anagh:onineshop1024@onlineshop.ksyr2.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useUnifiedTopology: true }
  )
    .then((client) => {
      db = client.db('shop');
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (db) {
    return db;
  }
  throw 'No db found';
};

exports.dbconnect = dbconnect;
exports.getDb = getDb;
