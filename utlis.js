const jwt = require("jsonwebtoken");
const config = require("./config/auth.config");

const decodedData = (req) => {
  //console.log(req)

  let token = req.headers["x-access-token"];

  let data = jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return {
        sucess: false,
        invalid: true,
        user: null,
      };
    } else {
      return {
        sucess: true,
        invalid: false,
        user: decoded,
      };
    }
  });

  return {
    data,
  };
};



const decodedrfData = (token) => {
  //console.log(req)

  //let token = req.headers["x-access-token"];

  let data = jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return {
        sucess: false,
        invalid: true,
        user: null,
      };
    } else {
      return {
        sucess: true,
        invalid: false,
        user: decoded,
      };
    }
  });

  return {
    data,
  };
};


module.exports = { decodedData, decodedrfData };
