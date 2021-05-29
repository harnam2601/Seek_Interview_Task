const Ad = require('../models/ad');
const Special = require('../models/specials');

exports.getIndex = (req, res, next) => {
  let adsList = {};
  Ad.fetchAll()
    .then(ads => {
      ads.forEach(ad => {
        adsList[ad["_id"]] = ad;
      });
      return Special.fetchAll();
    })
    .then(specials => {
      specials.forEach((special, index) => {
        special.pricingRules.forEach((pricingRule, key) => {
          specials[index].pricingRules[key].adData = adsList[pricingRule['adId']];
        });
      });

      res.render('shop/index', {
        ads: Object.values(adsList),
        specials: specials,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {

  let specialId = req.user.cart.specialPricing;
  
  if(specialId !== ''){
    Special.findById(specialId)
    .then(special => {

      let pricingRules = special.pricingRules;
      let items = req.user.cart.items;
      items.forEach((item, index) => {
        for(let i = 0; i < pricingRules.length; i++){
          if(item.itemId == pricingRules[i].adId){
            if(pricingRules[i].type == 'getExtra'){
              items[index].extraQty = parseInt(item.qty / pricingRules[i].minBuy) * pricingRules[i].extra;
            }
            else if(pricingRules[i].type == 'discountedPrice'){
              items[index].discountedPrice = pricingRules[i].discountedPrice;
            }
            break;
          }
        }
      });

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        items: items,
      });
    })
    .catch(err => console.log(err));
  }
  else{
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      items: req.user.cart.items,
    });
  }
};

exports.applySpecial = (req, res, next) => {
  let specialId = req.body.specialId;

  req.user.cart.updateSpecial(specialId, req.user.cart['_id'].toString())
  .then(result => {
    // console.log(result);
    res.redirect("/cart");
  })
  .catch(err => console.log(err));

};

exports.postCart = (req, res, next) => {
  const cartData = req.body;
  Ad.findById(req.body.adId)
  .then(adData => {
    let item = {title: adData.title, price: adData.price, qty: parseInt(req.body.adQty), itemId: adData["_id"].toString()};

    if(req.user.cart.items.length > 0){
      let newItemFlag = true;
      req.user.cart.items.forEach((cartItem, index) => {
        if(cartItem.itemId == item.itemId){
          newItemFlag = false;
          req.user.cart.items[index].qty = cartItem.qty + item.qty;
        }
      });

      if(newItemFlag){
        return req.user.cart.addItem(item, req.user.cart["_id"].toString());
      }
      else{
        return req.user.cart.updateItems(req.user.cart.items, req.user.cart["_id"].toString());
      }

    }
    else{
      return req.user.cart.addItem(item, req.user.cart["_id"].toString());
    }
  })
  .then(result => {
    // console.log(result);
    res.redirect("/");
  })
  .catch(err => console.log(err));
};


exports.postOrder = (req, res, next) => {
  req.user.cart.updateItems([], req.user.cart["_id"].toString())
  .then(result => {
    //console.log(result);
    return req.user.cart.updateSpecial('', req.user.cart["_id"].toString());
  })
  .then(result => {
    //console.log(result);
    res.redirect("/cart");
  })
  .catch(err => console.log(err));
};

