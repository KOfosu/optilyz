const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  startTime: Date,
  reminderTime: Date,
  isCompleted: Boolean
});

module.exports = mongoose.model('Task', TaskSchema);