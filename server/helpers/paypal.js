// const paypal = require("paypal-rest-sdk");

// paypal.configure({
//   mode: "",
//   client_id: "",
//   client_secret: "",
// });

// module.exports = paypal;

const paypal = require('paypal-rest-sdk');

// Load environment variables
require('dotenv').config();

paypal.configure({
  mode: process.env.PAYPAL_MODE, // Set to 'sandbox' or 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

module.exports = paypal;