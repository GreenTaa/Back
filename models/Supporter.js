var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Supporter = new Schema(
  {
    Id: String,
    Firstname: String,
    Lastname: String,
    Avatar: String,
    Date_birth: String,
    Address: String,
    Phone: String,
    Team:String,
    Bottles:String,
    Score: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("supporter",Supporter);