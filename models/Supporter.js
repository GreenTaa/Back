var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Supporter = new Schema(
  {
    Id: String,
    firstname: String,
    Lastname: String,
    Avatar: String,
    Date_birth: String,
    Address: String,
    Phone: String,
    Team:String,
    Score: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("supporter",Supporter);