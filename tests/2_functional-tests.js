const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let firtIssueId, fistIssueCreatetedOn, fistIssueUpdatedOn;
  suite('POST requests', () => {
    test('Create an issue with every field', (done) => {
      chai
        .request(server)
        .post('/api/issues/mytestproject')
        .send({
          assigned_to: 'santiago',
          status_text: 'Starting',
          issue_title: 'test with every field',
          issue_text: 'Create an issue with every field test',
          created_by: 'santiagopemo'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.assigned_to, 'santiago');
          assert.equal(res.body.status_text, 'Starting');
          assert.equal(res.body.issue_title, 'test with every field');
          assert.equal(res.body.issue_text, 'Create an issue with every field test');
          assert.equal(res.body.open, true);
          assert.equal(res.body.created_by, 'santiagopemo');
          assert.property(res.body, '_id');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'open');
          firtIssueId = res.body._id;
          fistIssueCreatetedOn = res.body.created_on;
          fistIssueUpdatedOn = res.body.updated_on;
          done();
        });
    });
    test('Create an issue with only required fields', (done) => {
      chai
        .request(server)
        .post('/api/issues/mytestproject')
        .send({
          issue_title: 'test with required fields only',
          issue_text: 'Create an issue with only required fields test',
          created_by: 'santiagopemo'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.equal(res.body.issue_title, 'test with required fields only');
          assert.equal(res.body.issue_text, 'Create an issue with only required fields test');
          assert.equal(res.body.open, true);
          assert.equal(res.body.created_by, 'santiagopemo');
          assert.property(res.body, '_id');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'open');
          done();
        });
    });
    test('Create an issue with missing required fields', (done) => {
      chai
        .request(server)
        .post('/api/issues/mytestproject')
        .send({
          
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });
  suite('GET requests', () => {
    test('View issues on a project', (done) => {
      chai
        .request(server)
        .get('/api/issues/mytestproject')
        .query({
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isAtLeast(res.body.length, 2);
          done();
        });
    });
    test('View issues on a project with one filter', (done) => {
      chai
        .request(server)
        .get('/api/issues/mytestproject')
        .query({
          "_id": firtIssueId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body[0], {
            assigned_to: 'santiago',
            status_text: 'Starting',
            issue_title: 'test with every field',
            issue_text: 'Create an issue with every field test',
            open: true,
            created_by: 'santiagopemo',
            _id: firtIssueId,
            created_on: fistIssueCreatetedOn,
            updated_on: fistIssueUpdatedOn
          });
          // assert.equal(res.body[0].assigned_to, 'santiago');
          // assert.equal(res.body[0].status_text, 'Starting');
          // assert.equal(res.body[0].issue_title, 'test with every field');
          // assert.equal(res.body[0].issue_text, 'Create an issue with every field test');
          // assert.equal(res.body[0].open, true);
          // assert.equal(res.body[0].created_by, 'santiagopemo');
          // assert.equal(res.body[0]._id, firtIssueId);
          // assert.property(res.body[0], 'updated_on');
          // assert.property(res.body[0], 'created_on');
          // assert.property(res.body[0], 'open');
          done();
        });
    });
    test('View issues on a project with one filter', (done) => {
      chai
        .request(server)
        .get('/api/issues/mytestproject')
        .query({
          assigned_to: 'santiago',
          status_text: 'Starting',
          issue_title: 'test with every field',
          issue_text: 'Create an issue with every field test',
          created_by: 'santiagopemo',
          open: true,
          created_on: fistIssueCreatetedOn,
          updated_on: fistIssueUpdatedOn,
          _id: firtIssueId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body[0], {
            assigned_to: 'santiago',
            status_text: 'Starting',
            issue_title: 'test with every field',
            issue_text: 'Create an issue with every field test',
            open: true,
            created_by: 'santiagopemo',
            _id: firtIssueId,
            created_on: fistIssueCreatetedOn,
            updated_on: fistIssueUpdatedOn
          });
          done();
        });
    });
  });
  suite('PUT requests', () => {
    test('Update one field on an issue', (done) => {
      chai
        .request(server)
        .put('/api/issues/mytestproject')
        .send({
          _id: firtIssueId,
          created_by: 'charo',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, firtIssueId);
          done();
        });
    });
    test('Update multiple fields on an issue', (done) => {
      chai
        .request(server)
        .put('/api/issues/mytestproject')
        .send({
          _id: firtIssueId,
          issue_title: 'updated title test',
          issue_text: 'updated issue with multipes fields',
          open: false
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, firtIssueId);
          done();
        });
    });
    test('Update an issue with missing _id', (done) => {
      chai
        .request(server)
        .put('/api/issues/mytestproject')
        .send({
          issue_title: 'updated title test',
          issue_text: 'updated issue with multipes fields',
          open: false
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
    test('Update an issue with no fields to update', (done) => {
      chai
        .request(server)
        .put('/api/issues/mytestproject')
        .send({
          _id: firtIssueId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, firtIssueId);
          done();
        });
    });
    test('Update an issue with an invalid _id', (done) => {
      chai
        .request(server)
        .put('/api/issues/mytestproject')
        .send({
          _id: 'Invalid Id',
          issue_title: 'updated title test',
          issue_text: 'updated issue with multipes fields',
          open: false
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, 'Invalid Id');
          done();
        });
    });
  });
  suite('DELETE requests', () => {
    test('Delete an issue', (done) => {
      chai
        .request(server)
        .delete('/api/issues/mytestproject')
        .send({
          _id: firtIssueId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id, firtIssueId);
          done();
        });
    });
    test('Delete an issue with an invalid _id', (done) => {
      chai
        .request(server)
        .delete('/api/issues/mytestproject')
        .send({
          _id: 'Invalid Id'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, 'Invalid Id');
          done();
        });
    });
    test('Delete an issue with missing _id', (done) => {
      chai
        .request(server)
        .delete('/api/issues/mytestproject')
        .send({
          
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
