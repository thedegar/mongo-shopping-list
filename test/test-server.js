var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {

    before(function(done) {
        seed.run((err, items) => {
            this.items = items;
            done();
        });
    });

    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        var items = this.items;
        chai.request(app)
            .post('/items')
            .send({'name':'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Kale');
                items[0].name.should.equal('Broad beans');
                items[1].name.should.equal('Tomatoes');
                items[2].name.should.equal('Peppers');
                done();
            });
            //Had to throw in a get request to see the new item posted.  
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                items = res.body;
                items.should.have.length(4);
                items[3].should.be.a('object');
                items[3].should.have.property('_id');
                items[3].should.have.property('name');
                items[3].id.should.be.a('number');
                items[3].name.should.be.a('string');
                items[3].name.should.equal('Kale');
                console.log(items);
            });
    });
    it('should edit an item on put', function(done) {
        chai.request(app)
            .put('/items/' + this.items[1]._id)
            .send({'name': 'Apples'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Apples');
                done();
            });
    });
    it('should delete an item on delete', function(done) {
        chai.request(app)
            .delete('/items/' + this.items[2]._id)
            .end(function(err,res) {
                should.equal(err,null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Peppers');
                done();
            });
    });
    it("should fail if deleting an item that doesn't exist",function(done) {
        chai.request(app)
            .delete('/items/99')
            .end(function(err,res) {
                should.equal(err,null);
                res.should.have.status(400);
                done();
            });
    });
    it("should create a new item if updating an id that doesn't exist yet",function(done) {
        var items;
        chai.request(app)
            .put('/items/99')
            .send({'name': 'Missing Item'})
            .end(function(err,res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.name.should.be.a('string');
                //res.body.name.should.equal('Missing Item');
                done();
            });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
});