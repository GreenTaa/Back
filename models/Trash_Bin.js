var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Trash_Bin = new Schema(
  {
    Id: String,
    State: String,
    Bottles:Number,
    Location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trash_Bin", Trash_Bin);