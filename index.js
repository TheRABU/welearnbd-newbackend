const app = require("./src/app.js");
const port = process.env.PORT || 5000;
const connectDATABASE = require("./src/database/connectDatabase.js");
app.listen(port, () => {
  console.log("App started and running successfully");
});
connectDATABASE();
