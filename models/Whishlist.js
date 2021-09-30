var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Product = require('./models/Product');

var Whishlist = new Schema(
  {
    Id: String,
    IdUser : String,
    Product : Product
  },
  { timestamps: true }
);

module.exports = mongoose.model("Whishlist",Whishlist);