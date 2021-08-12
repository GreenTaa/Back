var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Collector = new Schema(
  {
    Id: String,
    Name: String,
    QrCode: String,
    Center: String,
    Address: String,
    Phone: String,
    Date_birth: String,
    Active: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collector", Collector);