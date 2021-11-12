const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const { decodedData, decodedrfData } = require("./../utlis");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Incorrect Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: '1h', // 10 sec
      });
      let refreshToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      const _user = await User.findOne({ _id: user.id });

      _user.token = token;
      _user.refreshtoken = refreshToken;

      // user.token = token;
      // user.refreshtoken = refreshToken;

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      _user
        .save((err, user) => {
          console.log(user, "user");
          res.status(200).send({
            id: user._id,
            username: user.username,

            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
          });
        })
        .catch((err) => {
          res.status(500).send({
            sucess: false,

            message: err.message || "Some error occurred while processing .",
          });
        });
    });
};

exports.refreshtoken = async (req, res) => {
  //  console.log(req.headers["x-access-token"]);

  try {
    let rf = req.body["refreshToken"];
    console.log(rf, "rf");
    if (!rf) {
      return res.status(400).send({ sucess: false, message: "invalid token" });
    }

    let rftoken = decodedrfData(rf);
    console.log(rftoken);
    const _user = await User.findOne({ refreshtoken: rf }).populate(
      "roles",
      "-__v"
    );

    console.log(_user);

    if (!_user) {
      return res.status(400).send({ sucess: false, message: "bad request" });
    }

    let token = jwt.sign({ id: _user.id }, config.secret, {
      expiresIn: '1h', // 10 sec
    });
    let refreshToken = jwt.sign({ id: _user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    _user.token = token;
    _user.refreshtoken = refreshToken;
    _user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        sucess: true,
        id: user._id,
        username: user.username,

        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
      });
    });
  } catch (e) {
    res.status(500).send({
      sucess: false,

      message: e.message || "Some error occurred while refreshing token .",
    });
  }

  //console.log(req.body);
  //
};
