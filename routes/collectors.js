var express = require('express');
var router = express.Router();
var Collector = require('../models/Collector');

// Get all Collectors
router.get("/", function (req, res, next) {
    Collector.find(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

// Get Collector by ID
router.get('/:id', function(req, res, next) {
    Collector.findById(req.params.id,function(err,data){
      if(err) throw err;
      if(data)
      res.json(false);
      else res.json(true);
    })
  });

// Modify Collector
router.put('/:id', function(req, res, next) {
    Collector.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ msg: 'Collector modified' }))
    .catch(err => res.status(400).json({ error: err }))
})

//Delete Collector 
router.delete('/:id',function(req, res, next) {
    Collector.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ msg: `Collector with id : ${req.params.id} has been removed` }))
    .catch(err => res.status(400).json({ error: err }))
})
module.exports = router;