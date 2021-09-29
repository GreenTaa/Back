var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Trash_Bin = require("./Trash_Bin")

var Collect_center = new Schema(
  {
    Id: String,
      Name: String,
    QrCode: String,
    Region: String,
    Address: String,
    Phone: String,
    Bottles: Number,
    Active: String
  },
  { timestamps: true }
);



module.exports = mongoose.model("Collect_center", Collect_center);