const { createServer } = require("http");
const fs = require("fs");
const socket = require("socket.io");

const isProd = process.env.NODE_ENV && process.env.NODE_ENV === "production";
const isHerokuEnv = process.env.HEROKU_ENVIRONMENT;
const { PORT = isProd ? 443 : 8000 } = process.env;
const app = isProd ? require("./app.prod") : require("./app.dev");
const credentials = {
  key: /* fs.readFileSync('./../config/ssl/server.key') || */ null,
  cert: /* fs.readFileSync('./../config/ssl/server.cert') || */ null,
};


const server = createServer(
  ...isProd
    ? [...isHerokuEnv ? [ app ] : [ credentials, app ] ]
    : [ app ]
);

server.listen(...isProd ? [ PORT ] : [ PORT, () => {
  console.log("Server running at: 'http://localhost:8000'");
}]);

const io = socket(server, {
  cors: {
    origin: isProd ? 'https://unergapp.herokuapp.com' : 'http://localhost:3000',
    credentials: true
  },
});


global.onlineUsers = new Map();

io.on("connection", socket => {
  global.chatSocket = socket;
  // console.log("Socket server started");
  socket.on("add-user", userId => {
    // console.log("Adding user Sk");
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", data => {
    // console.log("Sending message");
    const sendUserSocket = onlineUsers.get(data.to);
    if ( sendUserSocket ) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});