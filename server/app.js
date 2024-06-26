const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "https://localhost:8080",
    }
});

// Маршруты для HTTP
app.get('/', async (req, res) => {
    return res.send(123);
});

app.listen(3000, async () => {
    console.log('Server is running on port 3000');
});

// Запуск сокет-сервера

// // Выключенный мидлвейр
// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (token === 'secret') {
//         next();
//     } else {
//         const err = new Error("not authorized");
//         err.data = { content: "Please retry later"};
//         next(err);
//     }
// });

io.on('connection', (socket) => {
    socket.on('message', (data) => {
        // socket.join('room:' + data.room_id);
        // io.to('room:' + data.room_id).emit('message', data.message)
        socket.emit('message', data);
    })
});

setInterval(() =>{
    const count = io.engine.clientsCount;
    console.log(count);
}, 5000);

httpServer.listen(3001);