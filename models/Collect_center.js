var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Collect_center = new Schema(
  {
    Id: String,
    Name: String,
    QrCode: String,
    Region: String,
    Address: String,
    Phone: String,
    Active: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collect_center", Collect_center);