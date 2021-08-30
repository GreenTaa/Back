var express = require('express');
var router = express.Router();
var Supporter = require('../models/Supporter');
var User = require('../models/User');
const { cloudinary } = require('../utils/cloudinary');

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

////
router.put('/:id', async function (req, res, next) {
  var Avatar = "http://res.cloudinary.com/dkqbdhbrp/image/upload/v1629639337/teams/p0w14tfpxonfmbrjfnnj.jpg"//a logo default
  
  try {
      const fileStr = req.body.Avatar
       await cloudinary.uploader.upload(fileStr,{
          upload_preset : 'supporter'
      }).then((res)=>{
          Avatar = res.url
          console.log("photo added")
      })
  } catch (error) {
      console.log(error)
  }
    (Supporter.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id, Avatar: Avatar })
    .then(() => res.status(200).json({ msg: 'Supporter modified' }))
    .catch(err => res.status(400).json({ error: err })),
    User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id}))
})

//Delete supporter 
router.delete('/:id',function(req, res, next) {
    (Supporter.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ msg: `Supporter with id : ${req.params.id} has been removed` }))
    .catch(err => res.status(400).json({ error: err })),
    User.deleteOne({ _id: req.params.id }))
  })
module.exports = router;