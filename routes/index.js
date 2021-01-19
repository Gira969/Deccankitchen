var express = require('express');
var router = express.Router();
var Cart  =  require('../models/cart');
var Order  =  require('../models/order');
var Product = require('../models/product');
var Cod = require('../models/cod');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var  csrf = require('csurf');
var passport = require('passport');
var csrfProtection = csrf();
router.use(csrfProtection);
mongoose.connect("mongodb://127.0.0.1:27017/shopping",{ useNewUrlParser: true }, { useUnifiedTopology: true });
let ts = Date.now();
let d = new Date(ts);
var date = d.getDate();
var month = d.getMonth() + 1;
var year = d.getFullYear();
var hours = d.getHours(); //returns 0-23
var minutes = d.getMinutes(); //returns 0-59
var seconds = d.getSeconds(); //returns 0-59
var dateStr = date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds ;

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err , docs){
  
     var productChunks = new Array();
     var chunkSize = 3;
     for(var i = 0;i<docs.length; i += chunkSize){
       productChunks.push(docs.slice(i , i + chunkSize));
     }
     res.render('shops/index', { title: 'The Deccan Kitchen' , products : productChunks , successMsg : successMsg , noMessages : !successMsg});
   });
  });
router.get('/add-to-cart/:id', function(req, res ,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items : {}});
  Product.findById(productId, function(err, product) {
      if(err){
        return res.redirect("/");
      }
      cart.add(product,product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect("/");
  });

});

router.get("/shopping-cart", function(req , res ,next){
    if(!req.session.cart){
      return res.render('shops/shopping-cart', {products : null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shops/shopping-cart',{products: cart.generateArray() , totalPrice : cart.totalPrice});

});

router.get('/checkout' ,isLoggedIn, function(req , res ,next){
  if(!req.session.cart){
    return res.redirect('shops/shopping-cart' , {products : null});
  }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('erro')[0];
    res.render('shops/checkout',{total : cart.totalPrice , csrfToken: req.csrfToken() , errMsg : errMsg , noError : !errMsg });


});
router.get('/paymentoptions' , function(req , res){
  res.render('shops/paymentoptions');
});
router.get('/checkout' ,isLoggedIn, function(req , res ,next){
  if(!req.session.cart){
    return res.redirect('shops/shopping-cart' , {products : null});
  }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('erro')[0];
    res.render('shops/checkout',{total : cart.totalPrice , csrfToken: req.csrfToken() , errMsg : errMsg , noError : !errMsg });


});

// Card Payment

router.post('/checkout',isLoggedIn , function(req,res,next){
  if(!req.session.cart){
    return res.redirect('shops/shopping-cart' , {products : null});
  }
  var cart = new Cart(req.session.cart);
  const stripe = require('stripe')(
    'sk_test_51I52zbD4mIfJcCL7iz8fXk7dONumGQ1jhctZpEPOsJPCE8wPgkHv1Ns29bi6m2WCRyl7SaepqDZwxh0jYc6wJuMn00g3RESEEk'
    );

     stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: 'inr',
      description: 'Example charge',
      source: req.body.stripeToken,
    } , function ( err , charge){
        if(err){
          req.flash('erro' , err.message);
          return res.redirect('/checkout');
        }
        var order = new Order({
          user: req.user,
          cart: cart,
          address: req.body.address,
          name: req.body.name,
          paymentId: charge.id
        });
        order.save(function(err,result){
        req.flash('success', 'Successfully bought the product!');
        req.session.cart = null;
        res.redirect('/user/profile');
        });
        
    });
});

// Cash On Delivery

router.get('/cod' ,isLoggedIn, function(req , res ,next){
  if(!req.session.cart){
    return res.redirect('shops/shopping-cart' , {products : null});
  }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('erro')[0];
    res.render('shops/cod',{total : cart.totalPrice , csrfToken: req.csrfToken() , errMsg : errMsg , noError : !errMsg , order_Date : dateStr  });


});

router.post('/cod',isLoggedIn , function(req,res,next){
  
  if(!req.session.cart){
    return res.redirect('shops/shopping-cart' , {products : null});
  }
  var cart = new Cart(req.session.cart);
     
        var cod = new Cod({
          user: req.user,
          cart: cart,
          address: req.body.address,
          name: req.body.name,
          contact : req.body.contact,
          order_Date : dateStr 
        });
        cod.save(function(err,result){
        req.flash('success', 'Successfully bought the product!');
        req.session.cart = null;
        res.redirect('/user/profile');
        });
        
    });
//remove items from cart
router.get('/remove/:id',function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
})

//reduce by one
router.get('/reduce/:id',function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
module.exports = router;
