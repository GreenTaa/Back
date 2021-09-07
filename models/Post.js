var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Post = new Schema(
  {
    Id: String,
    Title: String,
    Content: String,
    Picture: string
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", Post);