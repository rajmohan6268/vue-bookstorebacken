module.exports = (app) => {
  const { authJwt } = require("../middlewares");
  const usercontroller = require("../controllers/user.controller");
  const router = require("express").Router();
  const storecontroller = require("../controllers/store.controller");

  router.get("/user/:id", usercontroller.getUser);

  router.get(
    "/orders/myorders",
    [authJwt.verifyToken],
    usercontroller.myorders
  );
  router.get("/admin/orders", [authJwt.verifyToken, authJwt.isAdmin], usercontroller.orders);
  router.post(
    "/admin/books/",
    [authJwt.verifyToken, authJwt.isAdmin],
    storecontroller.addbooks
  );
  router.delete(
    "/admin/books/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    storecontroller.deletebook
  );
  router.post(
    "/admin/books/quantity/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    storecontroller.quantity
  );

  app.use("/api/users", router);
};
