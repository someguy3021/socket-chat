require("dotenv").config({});
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const ChatService = require("./services/ChatService");
const { init } = require('./models/init');

const chatService = new ChatService();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io", "https://localhost:8080"],
    credentials: true,
  },
});

// Маршруты для HTTP
app.get("/", async (req, res) => {
  return res.send(123);
});

app.listen(3000, async () => {
  console.log("Server is running on port 3000");
  await init();
});

// Запуск сокет-сервера
io.on("connection", async (socket) => {
  try {
    // Send history
    const history = await chatService.getMessages();
    const rooms = await chatService.getRooms();
    socket.emit("get-rooms", rooms);
    socket.emit("history", history);
  } catch (e) {
    console.error(e);
  }

  socket.on("create_room", async (data) => {
    //Create room in DB
    try {
      const room = await chatService.createRoom(data.name);

      socket.emit("rooms_list_changed", room);
      socket.broadcast.emit("rooms_list_changed", room);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("join_room", async (data) => {
    //Join room
    try {
      const history = await chatService.getMessages(data.room_id);
      socket.join("room-" + data.room_id);
      socket.emit("history", history);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("leave_room", (data) => {
    try {
      if (data.room_id) {
        socket.leave("room-" + data.room_id);
      }
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("message", async (data) => {
    try {
      await chatService.saveMessage(data);
      if (data.room_id) {
        io.to("room-" + data.room_id).emit("message", {
          name: data.name,
          message: data.message,
        });
      } else {
        socket.emit("message", {
          name: data.name,
          message: data.message,
        });
        socket.broadcast.emit("message", {
          name: data.name,
          message: data.message,
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
});

// setInterval(() =>{
//     const count = io.engine.clientsCount;
//     console.log(count);
// }, 5000);

instrument(io, {
  auth: false,
  mode: "development",
});

httpServer.listen(3001);
