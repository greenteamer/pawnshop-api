const { server } = require("./src/App.js");

// Run the server!
server.listen({ host: "0.0.0.0", port: 4000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
