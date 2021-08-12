var express = require('express');
var router = express.Router();
var Collect = require('../models/Collect_center');

// Get all collect centers
router.get("/", function (req, res, next) {
    Collect.find(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

// Get collect center by ID
router.get('/:id', function(req, res, next) {
    Collect.findById(req.params.id,function(err,data){
      if(err) throw err;
      res.json(data);
    })
  });

// Modify collect center
router.put('/:id', function(req, res, next) {
    Collect.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ msg: 'Collect center modified' }))
    .catch(err => res.status(400).json({ error: err }))
})

//Delete collect center 
router.delete('/:id',function(req, res, next) {
    Collect.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ msg: `Collect center with id : ${req.params.id} has been removed` }))
    .catch(err => res.status(400).json({ error: err }))
})
module.exports = router;