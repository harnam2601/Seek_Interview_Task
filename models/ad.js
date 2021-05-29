const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Ad {
  constructor(title, price, description) {
    this.title = title;
    this.price = price;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db
        .collection('ads')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('ads').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('ads')
      .find()
      .toArray()
      .then(ads => {
        // console.log(ads);
        return ads;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('ads')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(ad => {
        // console.log(ad);
        return ad;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteById(adId) {
    const db = getDb();
    return db
      .collection('ads')
      .deleteOne({ _id: new mongodb.ObjectId(adId) })
      .then(result => {
        console.log('Deleted');
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Ad;