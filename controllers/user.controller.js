const db = require("../models");
const User = db.user;
const Order = db.order;
const { decodedData } = require("./../utlis");

exports.getUser = async (req, res) => {
  let id = req.params.id;

  User.findById(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ sucess: false, message: "Not found user with id " + id });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        sucess: false,
        message: "Error retrieving user with id=" + id,
        err,
      });
    });
};
exports.orders = async (req, res) => {



  Order.find({
 
  })
    .populate("book")
    .populate("orderedBy",{ username:1 ,_id:1 })
    .exec((err, orders) => {
      if (err) {
        res.status(500).send({
          sucess: false,
          message: "Error while retrieving orders",
          err,
        });
        return;
      }

      if (!orders) {
        return res.status(404).send({ message: "no orders found" });
      }

      res.status(200).send({
        orders
      });
    })
}

exports.myorders = async (req, res) => {
  console.log("working");
  let user = await decodedData(req);

  if (!user.data.user) {
    return res.status(401).send({
      sucess: false,
      message: "Unauthorized user",
    });
  }

  console.log(user);

  let id = user.data.user.id;

  Order.find({
    orderedBy: id,
  })
    .populate("book")
    .populate("orderedBy",{ username:1 ,_id:1 })
    .exec((err, orders) => {
      if (err) {
        res.status(500).send({
          sucess: false,
          message: "Error while retrieving orders",
          err,
        });
        return;
      }

      if (!orders) {
        return res.status(404).send({ message: "no orders found" });
      }

      res.status(200).send({
        orders
      });
    })
};

// Order.find({
//   where: {
//     orderedBy: id,
//   },
// })
//   .populate("book", "name")
//   .populate("orderedBy", "username")
//   .exec((err, user) => {
//     if (err) {
//       res.status(500).send({ sucess: false,
//         message: "Error while retrieving orders",
//         err, });
//       return;
//     }

//     if (!orde) {
//       return res.status(404).send({ message: "User Not found." });
//     }

//     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

//     if (!passwordIsValid) {
//       return res.status(401).send({
//         accessToken: null,
//         message: "Incorrect Password!",
//       });
//     }

//     var token = jwt.sign({ id: user.id }, config.secret, {
//       expiresIn: 86400, // 24 hours
//     });

//     var authorities = [];

//     for (let i = 0; i < user.roles.length; i++) {
//       authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
//     }

//     res.status(200).send({
//       id: user._id,
//       username: user.username,

//       roles: authorities,
//       accessToken: token,
//     });
//   });

