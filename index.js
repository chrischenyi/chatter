const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on ${port}`);    
});

// when someone tried to get this address, they will get this response
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname+'/public/javascript.html');
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname+'/public/swift.html');
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname+'/public/css.html');
});

// Create a tech namespace
const tech = io.of('/tech');

// when someone trys to make a connection, this is the response
tech.on('connection',(socket) => {

    // listening to joint event (psocket.io API)
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message',`New user joint ${data.room} room!`);
    });

    // When there's a event call nessage, pass the value and append to the HTML
    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect',() => {
        console.log('user disconnected');
        tech.emit('message','user disconnected');
    })
});