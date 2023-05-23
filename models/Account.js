const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  depositMethod: {
    type: String,
    required: true,
  },
  
  addComment: {
    type: String,
    required: true,
  },
}, {timestamps: true});

module.exports = Account = mongoose.model('Account', AccountSchema )

