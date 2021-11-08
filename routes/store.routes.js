module.exports = (app) => {
  // const { authJwt } = require("../middlewares");
  const storecontroller = require("../controllers/store.controller");
  const router = require("express").Router();

  router.get("/getBooks", storecontroller.getbooks);

  router.post("/order", storecontroller.makeOrder);

  app.use("/api/store", router);
};
