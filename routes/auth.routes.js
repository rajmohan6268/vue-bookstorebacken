module.exports = (app) => {
  const { verifySignUp } = require("../middlewares");
  const controller = require("../controllers/auth.controller");
  const router = require("express").Router();

  router.post(
    "/signup",
    [verifySignUp.checkDuplicateUsername],
    controller.signup
  );
  router.post(
    "/refreshtoken",
    controller.refreshtoken
  );

  router.post("/signin", controller.signin);
  app.use("/api/auth", router);
};
