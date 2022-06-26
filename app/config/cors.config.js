const cors = require("cors");

module.exports = function() {
  return cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://unergapp.herokuapp.com' :  'http://localhost:3000',
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  });
};