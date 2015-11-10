var express = require('express');
var Item = require('../services/item');
var router = express.Router();

router.get('/items', function(req, res) {
    Item.list(function(items) {
        res.json(items);
    }, function(err) {
        res.status(400).json(err);
    });
});

router.post('/items', function(req, res) {
    Item.save(req.body.name, function(item) {
        res.status(201).json(item);
    }, function(err) {
        res.status(400).json(err);
    });
});

router.delete('/items/:id', function(req, res) {
    //if id is not valid return json error message
    //else delete item[id] with status 200 (OK)
    var id = req.params.id;
    Item.delete(id, function(item) {
        res.status(200).json(item);
    }, function(err) {
        res.status(400).json(err);
    });
});


router.put('/items/:id', function(req,res) {
    //If successful, your endpoint should return the edited, with the appropriate status code.
    //If a non-existent ID is supplied, your endpoint should create a new item using the ID supplied.
    var id = req.params.id;
    var name = req.body.name;
    Item.update(id, name, function(item) {
        res.status(200).json(item);
    }, function(item) {
        res.status(201).json(item);
    });
});


module.exports = router;