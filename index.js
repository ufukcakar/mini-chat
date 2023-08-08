const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require("socket.io");
const os = require('os');


let users = [];




var app = express();
const server = http.createServer(app);  // http server
const io = new Server(server);          // socket.io server

server.listen(3000, () => {
    let host = server.address().address
    let port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static(__dirname + '/public'));

app.get('/hangman', function (req, res) {
  res.sendFile( __dirname + "/public/" + "hangman.html" );
});


io.on('connection', clientListener);

function clientListener(socket) {


  // console.log(socket);

  socket.on('message', (data) => {


    let time;
    let address;


    // time = socket.handshake.time.split("GMT")[0].split(" ")[4];

    time = new Date().toLocaleTimeString();

    address = socket.handshake.address.split(":")[3];


    console.log("[ " + time + "]" + users[address] + "      " + data.inputText);


    
    io.emit("newMessage", {message: data.inputText, address: address,
                          time: time, name: data.name});
  });



  socket.on('id', (data) => {


    users[socket.handshake.address.split(":")[3]] = data.name;
    console.log(users);
  });


}
