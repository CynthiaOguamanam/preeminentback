const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  msg: {
    type: String,
    required: true,
  },
  
}, {timestamps: true});

module.exports = Contact = mongoose.model('Contact', ContactSchema )

