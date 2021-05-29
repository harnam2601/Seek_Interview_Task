const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Special {
  constructor(title, pricingRules, id) {
    this.title = title;
    this.pricingRules = pricingRules;
    this._id = id ? new mongodb.ObjectId(id) : new mongodb.ObjectID();
  }

  save() {
    const db = getDb();
    let dbOp;
    dbOp = db.collection('specials').insertOne(this);

    return dbOp
      .then(result => {
        //console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('specials')
      .find()
      .toArray()
      .then(specials => {
        // console.log(specials);
        return specials;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(specialId) {
    const db = getDb();
    return db
      .collection('specials')
      .find({ _id: new mongodb.ObjectId(specialId) })
      .next()
      .then(special => {
        // console.log(special);
        return special;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static updateById(speciaId, title, pricingRules) {
    const db = getDb();
    return db
    .collection('specials')
    .updateOne({_id: new mongodb.ObjectID(speciaId)}, {$set: {title: title, pricingRules: pricingRules}})
    .then(result => {
        //console.log(result);
    })
    .catch(err => console.log(err));
  }

  static deleteById(specialId) {
    const db = getDb();
    return db
      .collection('specials')
      .deleteOne({ _id: new mongodb.ObjectId(specialId) })
      .then(result => {
        console.log('Deleted');
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Special;