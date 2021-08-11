var express = require('express');
var router = express.Router();
var Team = require('../models/Team');

// Get all teams
router.get("/", function (req, res, next) {
    Team.find(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

// Get Team by ID
router.get('/:id', function(req, res, next) {
    Team.findById(req.params.id,function(err,data){
      if(err) throw err;
      res.json(data);
    })
  });

// Modify Team
router.put('/:id', function(req, res, next) {
    Team.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ msg: 'Team modified' }))
    .catch(err => res.status(400).json({ error: err }))
})

//Delete supporter 
router.delete('/:id',function(req, res, next) {
    Team.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ msg: `Team with id : ${req.params.id} has been removed` }))
    .catch(err => res.status(400).json({ error: err }))
})

module.exports = router ;