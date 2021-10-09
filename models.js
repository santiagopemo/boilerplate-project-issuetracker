const mongoose = require('mongoose');
const {Schema} = mongoose;

const issueSchema = new Schema({
  assigned_to : String,
  status_text : String,
  open  : Boolean,
  issue_title :  {type: String, required: true},
  issue_text  :  {type: String, required: true},
  created_by  :   {type: String, required: true},
  created_on  :   Date,
  updated_on  :   Date  
});

const Issue = mongoose.model('Issue', issueSchema);

const projectSchema = new Schema({
  name: {type: String, required: true},
  issues: [issueSchema]
});
const Project = mongoose.model('Project', projectSchema);

exports.Issue = Issue;
exports.Project = Project;
