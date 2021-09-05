var express = require('express');
var router = express.Router();
var Trash = require('../models/Trash_Bin');
const Supporter = require('../models/Supporter');


// Get all teams
router.get("/", function (req, res, next) {
    Trash.find(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

// Get trash by ID
router.get('/:id', function(req, res, next) {
    Trash.findById(req.params.id,function(err,data){
      if(err) throw err;
      res.json(data);
    })
  });

// Modify trash
router.put('/:id', function(req, res, next) {
    Trash.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ msg: 'Team modified' }))
    .catch(err => res.status(400).json({ error: err }))
})

//Delete trash 
router.delete('/:id',function(req, res, next) {
    Trash.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ msg: `Team with id : ${req.params.id} has been removed` }))
    .catch(err => res.status(400).json({ error: err }))
})


router.post("/addtrash", async function (req, res, next) {
    const obj = JSON.parse(JSON.stringify(req.body));

    const trash = {
      State: obj.State,
      Location: obj.Location,
      Lat: obj.Lat,
      Lng: obj.Lng,
      Status: "0",
      Bottles: 0,
      
    };
    Trash.create(trash)
    res.send("Done");
  });

   router.post("/addbottle",  async function (req, res, next) {
    const obj = JSON.parse(JSON.stringify(req.body));
    const test = {
        Bottles: obj.Bottles,
      };
      var simpbottles =parseInt(obj.Simpbottles) * 5;
      var compbottles =parseInt(obj.Compbottles) * 10;
      var bottles = parseInt(obj.Compbottles) + parseInt(obj.Simpbottles);
      console.log(bottles);
      var myscore =compbottles+simpbottles;

       await Supporter.findByIdAndUpdate(
        { _id: obj.id_supporter },
        {$inc : {'Bottles' : bottles,'Score' : myscore}}
     );
       res.send("Done");
  });

module.exports = router ;