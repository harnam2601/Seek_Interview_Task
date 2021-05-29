const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Cart {
  constructor(items, specialPricing, userId, id) {
    this.items = items;
    this.specialPricing = specialPricing;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
      const db = getDb();
      let dbOp;

      dbOp = db.collection('carts').insertOne(this);

      return dbOp
      .then(result => {
        //   console.log(result);
      })
      .catch(err => console.log(err));
  }

  addItem(item, cartId) {
    const db = getDb();
    let dbOp;

    dbOp = db.collection('carts')
    .updateOne({_id: new mongodb.ObjectID(cartId)},{$push: {items: item}});

    return dbOp
    .then(result => {
        // console.log(result);
    })
    .catch(err => console.log(err));
  }

  updateItems(items, cartId) {
    const db = getDb();
    let dbOp;

    dbOp = db.collection('carts')
    .updateOne({_id: new mongodb.ObjectID(cartId)},{$set: {items: items}});

    return dbOp
    .then(result => {
        // console.log(result);
    })
    .catch(err => console.log(err));
  }

  updateSpecial(specialId, cartId) {
    const db = getDb();
    let dbOp;

    dbOp = db.collection('carts')
    .updateOne({_id: new mongodb.ObjectID(cartId)},{$set: {specialPricing: specialId}});

    return dbOp
    .then(result => {
        // console.log(result);
    })
    .catch(err => console.log(err));
  }

  static findById(cartId){
    const db = getDb();
    return db
      .collection('carts')
      .find({ _id: new mongodb.ObjectId(cartId) })
      .next()
      .then(cart => {
        // console.log(cart);
        return cart;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Cart;
