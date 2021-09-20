var express = require('express');
var router = express.Router();
var Trash = require('../models/Trash_Bin');
const Supporter = require('../models/Supporter');
const Hys = require('../models/history');
const history = require('../models/history');


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

  router.get('/history/:id', function(req, res, next) {
    Hys.find({ Supp: req.params.id } ,function(err, data) {
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
    var  mytrash;
       var Bottles = obj.Bottles;
        var id_trash = obj.id_poubelle;
      var myscore =parseInt(Bottles) * 10;
     var history;
      Trash.findById(id_trash,function(err,data){
        if(err) throw err;
        mytrash=data;
        const myhistory = {
          Supp: obj.id_supporter,
          Bottles: Bottles,
          Score: myscore,
          Place:mytrash.Location
        };
        history = myhistory;
      })
     
    
       await Supporter.findByIdAndUpdate(
        { _id: obj.id_supporter },
        {$inc : {'Bottles' : Bottles,'Score' : myscore}}
     );
     await Trash.findByIdAndUpdate(
      { _id:id_trash },
      {$inc : {'Bottles' : Bottles}}
   );
   await Hys.create(history);
   console.log(mytrash.Location);
       res.send("Done");
  });
  router.post("/setprs",  async function (req, res, next) {
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj);
       var trash = obj.id_poubelle;
        var prs = obj.prs;

       await Trash.findByIdAndUpdate(
        trash,
        {
          $set: { Status: prs },
        })
       res.send("Done");
  });
module.exports = router ;