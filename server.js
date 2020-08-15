const http = require("http");
const app = require("./app");
const port = process.env.PORT || 4000;
const server = http.createServer(app);
require("./api/configs/socket")(server);

server.listen(port, () => {
  console.log("Server is running on ", port);
});

module.exports = server;
