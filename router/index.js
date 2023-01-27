const book_controller = require("../controller/book_controller");

module.exports = (app) => {
  app.get("/", book_controller.test);
  app.post("/read", book_controller.read);
  app.post("/create", book_controller.create);
  app.post("/delete", book_controller.delete);
};
