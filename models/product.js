var mongoose  = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/shopping",{ useNewUrlParser: true }, { useUnifiedTopology: true });
var Schema = mongoose.Schema;


var schema = new Schema({
  imagePath : {type: String , required : true},
  title : {type: String , required : true},
  descripation : {type: String , required : true},
  price : {type: Number , required : true}

});

module.exports = mongoose.model("Product" , schema);
