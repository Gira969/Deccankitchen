var Product = require('../models/product');

var mongoose = require("mongoose");

// mongoose.connect("localhost:27017/shopping");
mongoose.connect("mongodb://127.0.0.1:27017/shopping",{ useNewUrlParser: true }, { useUnifiedTopology: true });

var products = [
new Product({
  imagePath : 'https://www.whiskaffair.com/wp-content/uploads/2018/07/Achari-Paneer-Tikka-1-1.jpg',
  title :'Paneer Tikka' ,
  descripation : 'Baked Paneer Tikka',
  price :340
}),
new Product({
  imagePath : "https://www.tarladalal.com/members/9306/big/big_paneer_tikka_kathi_rolls-12911.jpg?size=696X905",
  title :"Paneer KAdhi Roll" ,
  descripation : "Delicious!!!",
  price :340
}),
new Product({
  imagePath : "https://i0.wp.com/vegecravings.com/wp-content/uploads/2018/10/Paneer-Makhani-Recipe-Step-By-Step-Instructions.jpg?w=1612&quality=65&strip=all&ssl=1",
  title :"Paneer Makhani" ,
  descripation : "Indain Curry!!",
  price :340
}),
new Product({
  imagePath : "https://32z9bn1e2dzdx5p6o4a6n7l1-wpengine.netdna-ssl.com/wp-content/uploads/2016/03/LachchaParatha2-1.jpg",
  title :"Lachcha Paratha" ,
  descripation : "Indain Bread!!!",
  price :340
}),


];
var done = 0;
for (var i = 0 ;  i<products.length ; i++){
  products[i].save(function(err , result){
    done ++ ;
    if (done === products.length){
        exit();
    }
  });
}

function exit(){
  mongoose.disconnect();

}
