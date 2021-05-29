const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const Cart = require('./models/cart');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  let userCart;
  User.findById('60b02cc87e7cba054aed5942')
    .then(user => {
      req.user = new User(user.name, user.email, user._id, user.cartId);
      return Cart.findById(user.cartId);
    })
    .then(cart => {
      if(cart){
        userCart = new Cart(cart.items, cart.specialPricing, cart.userId, cart['_id'].toString());
      }
      else{
        userCart = new Cart([], '', req.user["_id"].toString(), req.user.cartId);
        return userCart.save();
      }  
    })
    .then(result => {
      req.user.cart = userCart;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
