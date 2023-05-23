const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Unique email for each user
  },

  retypeEmail: {
    type: String,
    required: true,
    unique: true, // Unique email for each user
  },

  password: {
    type: String,
    required: true,
  },

  confirmPassword: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
  },

  token: {
    type: String,
    required: true,
  },

  lastDeposit: {
    type: String,
    default: 0.00
  },

  lastWithdrawal: {
    type: String,
    default: 0.00
  },

  depositWalletbalance: {
    type: String,
    default: 0.00
  },
  
  interestWalletbalance: {
    type: String,
    default: 0.00
  },

  currentBalance: {
    type: String,
    default: 0.00
  },
  
  totalDeposit: {
    type: String,
    default: 0.00
  },
  
  totalInvest: {
    type: String,
    default: 0.00
  },

  totalWithdraw: {
    type: String,
    default: 0.00
  },
  withdrawal: {
    type: String,
    default: 0.00
  },
  totalInvest: {
    type: String,
    default: 0.00
  },
  date: {
    type: String,
    default: 12-05-23
  },

  status: {
    type: Boolean,
    default: false,
  },
  gateWay: {
    type: String,
    default: "Bitcoin BTC"
  },

  bitCoinYellow: {
    type: String,
    default: 0.00
  },

  bitCoinPurple: {
    type: String,
    default: 0.00
  },

  bitCoinGray: {
    type: String,
    default: 0.00
  },

  bitCoinGreen: {
    type: String,
    default: 0.00
  },

  verify: {
    type: Boolean,
    default: true,
  },

  isAdmin: {
    // Role of user it will be (normal or admin )
    type: Boolean,
    default: false,
  },

}, {timestamps: true});

module.exports = User = mongoose.model('User', UserSchema )

