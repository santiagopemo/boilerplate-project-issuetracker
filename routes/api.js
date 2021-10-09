'use strict';

const { Issue, Project } = require('../models')
const {ObjectID} = require('mongodb');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      const {
        _id,
        assigned_to,
        status_text,
        open,
        issue_title,
        issue_text,
        created_by,
        created_on,
        updated_on  
      } =  req.query;
      const openToBool = open === 'true' ? true : false;

      Project.aggregate([
        { $match: { name: project}},
        { $unwind: "$issues"},
        _id != undefined ? { $match: {"issues._id": ObjectID(_id)} } : { $match: {}},
        open != undefined ? { $match: {"issues.open": openToBool} } : { $match: {}},
        issue_title != undefined ? { $match: {"issues.issue_title": issue_title} } : { $match: {}},
        issue_text != issue_text ? { $match: {"issues.open": issue_text} } : { $match: {}},
        created_by != undefined ? { $match: {"issues.created_by": created_by} } : { $match: {}},
        assigned_to != undefined ? { $match: {"issues.assigned_to": assigned_to} } : { $match: {}},
        status_text != undefined ? { $match: {"issues.status_text": status_text} } : { $match: {}}
      ]).exec((err, data) => {
        if (err) {
          res.send(err.message);
        } else {
          let issues = data.map((project) => project.issues);
          res.json(issues);
        }
      })
            
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const {
        assigned_to,
        status_text,
        open,
        issue_title,
        issue_text,
        created_by,
        created_on,
        updated_on  
      } =  req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: 'required field(s) missing' });
        return;
      }
      const newIssue = new Issue({
        assigned_to : assigned_to || '',
        status_text : status_text || '',
        open  : true,
        issue_title,
        issue_text,
        created_by,
        created_on  :   new Date(),
        updated_on  :   new Date()  
      });

      Project.findOne({name: project}, (err, projectData) => {
        if (err) {
          res.send(err.message)
        } else if (!projectData) {
          Project.create({ name: project, issues: [newIssue]}, (err, newProjectData) => {
            if (err) {
              res.send(err.message);
            } else {
              res.json(newIssue);
            }
          });
        } else {
          projectData.issues.push(newIssue);
          projectData.save((err, data) => {
            if (err) {
              res.send(err.message);
            } else {
              res.json(newIssue);
            }
          });
        }
      })
    })
    
    .put(function (req, res){
      let project = req.params.project;
      const {
        _id,
        assigned_to,
        status_text,
        open,
        issue_title,
        issue_text,
        created_by 
      } =  req.body;
      // const openToBool = open === 'true' ? true : false;
      if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }
      if (!issue_title && !issue_text && !created_by && !assigned_to && open === undefined && !status_text) {
        res.json({ error: 'no update field(s) sent', '_id': _id });
        return;
      }
      Project.findOne({name: project}, (err, projectData) => {
        if (err) {
          res.send({ error: 'could not update', '_id': _id });
        } else if (!projectData) {
          res.json({ error: 'could not update', '_id': _id });
        } else {
          const issueData = projectData.issues.id(_id);
          // let issueData = projectData.issues.find((issue) => issue._id === _id);
          if(!issueData) {
            res.json({ error: 'could not update', '_id': _id });
            return;
          }
          issueData.issue_title = issue_title || issueData.issue_title;
          issueData.assigned_to = assigned_to || issueData.assigned_to;
          issueData.status_text = status_text || issueData.status_text;
          issueData.open = open || false;
          issueData.issue_text = issue_text || issueData.issue_text;
          issueData.created_by = created_by || issueData.created_by;
          issueData.updated_on = new Date();
          projectData.save((err, updatedProjectData) => {
            if (err) {
              res.send({ error: 'could not update', '_id': _id });
            } else {
              res.json({ result: 'successfully updated', '_id': _id })
            }
          });
        }
      });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const {_id} = req.body;
      if(!_id) {
        res.json({ error: 'missing _id' });
        return;
      }
      Project.findOne({name: project}, (err, projectData) => {
        if ( err || !projectData) {
          res.json({ error: 'could not delete', '_id': _id });
        } else {
          const issue = projectData.issues.id(_id);
          if (!issue) {
            res.json({ error: 'could not delete', '_id': _id });
            return;
          }
          issue.remove();
          projectData.save((err, deletedProjectData) => {
            if (err || !deletedProjectData) {
              res.json({ error: 'could not delete', '_id': _id });
              return;
            }
            res.json({ result: 'successfully deleted', '_id': _id });
          });
        }
      })
    });
    
};
