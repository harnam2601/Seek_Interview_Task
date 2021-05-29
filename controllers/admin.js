const Ad = require('../models/ad');
const Special = require('../models/specials');

exports.getAdminPage = (req, res, next) => {
  let adList;
  Ad.fetchAll()
  .then(ads => {
    adList = ads;
    return Special.fetchAll();
  })
  .then(specials => {
    res.render('admin/admin', {
      pageTitle: 'Admin',
      path: '/admin',
      adList: adList,
      specialList: specials
    });
  })
  .catch(err => console.log(err));
};

exports.postSpecial = (req, res, next) => {

  let pricingRules = JSON.parse(req.body.pricingRulesData);

  pricingRules.forEach((rule, index) => {
    if(rule.type === 'getExtra') {
      pricingRules[index].extra = rule.extras;
      delete pricingRules[index].discountedPrice;
    }
    else if(rule.type === 'discountedPrice') {
      delete pricingRules[index].minBuy;
    }
    delete pricingRules[index].extras;
  });

  let newSpecial = new Special(req.body.title, pricingRules);

  newSpecial.save()
  .then(result => {
    //console.log(result);
    res.redirect("/admin");
  })
  .catch(err => console.log(err));
};

exports.postEditSpecial = (req, res, next) => {

  let editedSpecial = JSON.parse(req.body.editedSpecialData);

  editedSpecial.pricingRules.forEach((rule, index) => {
    if(rule.type === 'getExtra') {
      delete editedSpecial.pricingRules[index].discountedPrice;
    }
    else if(rule.type === 'discountedPrice') {
      delete editedSpecial.pricingRules[index].minBuy;
      delete editedSpecial.pricingRules[index].extra;
    }
  });

  Special.updateById(editedSpecial["_id"], editedSpecial.title, editedSpecial.pricingRules)
  .then(result => {
    //console.log(result);
    res.redirect("/admin");
  })
  .catch(err => console.log(err));
};
