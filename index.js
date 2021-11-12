const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./config/db.config");
var bcrypt = require("bcryptjs");

const app = express();

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
// app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;
const User = db.user;

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
    initial();
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Book store." });
  });
  
// simple route
app.get("/api/", (req, res) => {
  res.json({ message: "Welcome to Book store." });
});
// routes
require("./routes/auth.routes.js")(app);
require("./routes/user.routes.js")(app);
require("./routes/store.routes.js")(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          //  console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save(async (err) => {
        if (err) {
          // console.log("error", err);
        }

        let _admindata = await Role.findOne({ name: "admin" });

        console.log("added 'admin' to roles collection", _admindata);

        // console.log(_admindata);

        let passwod = bcrypt.hashSync("admin", 8);

        new User({
          username: "admin",
          password: passwod,
          roles: _admindata._id,
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log("added 'admin' to users collection");
        });
      });
    }
  });
}
