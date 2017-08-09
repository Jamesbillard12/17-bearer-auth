'use strict';
const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const User = require('../model/user.js');
const Brewery = require('../model/brewery.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

let tempBrewery;

const exampleBrewery = {
  name: 'the brewery name',
  address: 'the address',
  phoneNumber: '555-555-5555',
  timestamp: new Date()
};

const exampleBeer = {
  name: 'test beer',
  style: 'test style',
  ibu: '45'
};

const newBrewery = {
  name: 'new test brewery name',
  address: 'new test address',
  phoneNumber: '777-777-7777',
};

describe('Brewery Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Brewery.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/brewery', function() {
    beforeEach( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => {
        return user.save();
      })
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    describe('with a valid req body',() => {
      it('should return a brewery', done => {
        request.post(`${url}/api/brewery`)
        .send(exampleBrewery)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err,res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('the brewery name');
          expect(res.body.address).to.equal('the address');
          expect(res.body.phoneNumber).to.equal('555-555-5555');
          done();
        });
      });
    });
    describe('with an invalid request', () => {
      it('should return 400', done => {
        request.post(`${url}/api/brewery`)
        .send()
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err,res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET: /api/brewery/:id', () => {
    beforeEach( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => {
        return user.save();
      })
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });
    beforeEach( done => {
      exampleBrewery.userID = this.tempUser._id.toString();
      new Brewery(exampleBrewery).save()
      .then( brewery => {
        this.tempBrewery = brewery;
        return Brewery.findByIdAndAddBeer(brewery._id, exampleBeer);
      })
      .then( beer => {
        this.tempBeer = beer;
        done();
      })
      .catch(done);
    });

    it('should return a brewery', done => {
      request.get(`${url}/api/brewery/${this.tempBrewery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end( (err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('the brewery name');
        expect(res.body.address).to.equal('the address');
        expect(res.body.phoneNumber).to.equal('555-555-5555');
        expect(res.body.beers.length).to.equal(1);
        expect(res.body.beers[0].name).to.equal('test beer');
        expect(res.body.beers[0].style).to.equal('test style');
        expect(res.body.beers[0].ibu).to.equal('45');
        done();
      });
    });
    //   describe('with an invalid request', function(){
    //     it('should return 404', done => {
    //       request.get(`${url}/api/brewery/1231231231241413212`)
    //       .end( (err, res) => {
    //         expect(res.status).to.equal(404);
    //         done();
    //       });
    //     });
    //   });
    // });
    // describe('testing PUT /api/brewery/:id', () => {
    //   before( done => {
    //     exampleBrewery.timestamp = new Date();
    //     new Brewery(exampleBrewery).save()
    //     .then( brewery => {
    //       this.tempBrewery = brewery;
    //       done();
    //     })
    //     .catch(done);
    //   });
    //
    //   it('should respond with a 200 status code and an updated brewery object.', () => {
    //     return request.put(`${url}/api/brewery/${this.tempBrewery._id}`)
    //     .send(newBrewery)
    //     .then(res => {
    //       expect(res.status).to.equal(200);
    //       expect(res.body.name).to.equal('new test brewery name');
    //       expect(res.body.address).to.equal('new test address');
    //       expect(res.body.phoneNumber).to.equal('777-777-7777');
    //       tempBrewery = res.body;
    //     });
    //   });
    // });
    //
    // it('should respond with a 400 error code.', () => {
    //   return request.post(`${url}/api/brewery`)
    //   .send(tempBrewery)
    //   .then((res) => {
    //     tempBrewery = res.body;
    //     return request.put(`${url}/api/brewery/${this.tempBrewery._id}`)
    //     .send(null);
    //   })
    //   .catch(err => {
    //     expect(err.status).to.equal(400);
    //   });
    // });
    // it('should respond with a 404 error code if an ID is not found.', () => {
    //   return request.get(`${url}/api/brewery/12345`)
    //   .catch(err => {
    //     expect(err.status).to.equal(404);
    //   });
  });
});
