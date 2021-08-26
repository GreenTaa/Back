var express = require('express');
var router = express.Router();
var Supporter = require('../models/Supporter');

// Get all supporters
router.get("/", function (req, res, next) {
    Supporter.find(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

// Get supporter by ID
router.get('/:id', function(req, res, next) {
    Supporter.findById(req.params.id,function(err,data){
      if(err) throw err;
      res.json(data);
    })
  });

// Modify supporter
async (req, res, next) => {
if(req.body.image.startsWith("http")){
  Avatar = req.body.image
}else{
var Avatar = "http://res.cloudinary.com/dkqbdhbrp/image/upload/v1629639337/teams/p0w14tfpxonfmbrjfnnj.jpg"//a logo default

try {
  const fileStr = req.body.image
  const uploadedResponse = await cloudinary.uploader.upload(fileStr,{
      upload_preset : 'supporter'
  })
  Avatar = uploadedResponse.url
} catch (error) {
  console.log(error)
}
}
}
////
router.put('/:id', function(req, res, next) {
    Supporter.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ msg: 'Supporter modified' }))
    .catch(err => res.status(400).json({ error: err }))
})

//Delete supporter 
router.delete('/:id',function(req, res, next) {
    Supporter.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ msg: `Supporter with id : ${req.params.id} has been removed` }))
    .catch(err => res.status(400).json({ error: err }))
})
module.exports = router;