var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const SELLER = 'SELLER';
const BUYER = 'BUYER';


// namespace chat
var nsp_chat = io.of('/chat');

// namespace tracking
var nsp_tracking = io.of('/tracking');

// namespace transaction
var nsp_transaction = io.of('/transaction');

var users = [];

// dummy chat start
app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

nsp_chat.on('connection', function(socket){
  console.log('a user joined');
  socket.on('chat message', function(msg){
    nsp_chat.emit('chat message', msg);
  });
});

// dummy chat end

// app.get('/transaction', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

// app.get('/tracking', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

// chatting

// nsp_chat.on('connection', function(socket){
//     // get my namespace
//     console.log('a user connected');
//     console.log('my name space', socket.nsp.name);
    
//     // join all room

// });

// nsp_chat.on('connection', function(socket){

//     socket.on('login', function(login_msg) {
//         let login_msg = JSON.parse(login_msg);
//         users.push({ user_name : loginMsg.user_name, socket_id : socket.id })
        
//         console.log('joined user socket id ' + socket.id);
//         console.log('there are ' + users.length + ' users online');
//     });

//     socket.on('cek login', function(user_name) {
//         let user = users.find(u => u.user_name == user_name);
//         nsp_chat.emit('cek login', user == undefined);
//     });

//     socket.on('new room', function() {

//     })

//     socket.on('disconnect', function(){
//         console.log('user disconnected');
//     });

//     socket.on('typing', function(isTyping) {
//         console.log('typing', isTyping);
//         nsp_chat.broadcast.emit('typing', isTyping);
//     })

//     socket.on('chat message', function(msg){        
//         // let transaction = JSON.parse(msg);
//         // console.log('testing json', transaction);
//         console.log('chat message', msg);
//         nsp_chat.broadcast.emit('chat message', msg);
//     });

// });

// update transaction
nsp_transaction.on('connection', function(socket) {

    socket.on('login', function(login_msg) {
        console.log('login event');
        let login_data = JSON.parse(login_msg);
        login(socket.id, login_data);

        // let rooms = Object.keys(socket.rooms);
        // console.log('room list in this channel', rooms);
        // for(let r of rooms) {
        //     if(r.includes(login_data.user_name)) {
        //         socket.join(r);
        //     }
        // }
    });

    socket.on('transaction', function(data) {
        console.log('transaction event');
        let transaction_data = JSON.parse(data);
        // let room_name = socket.to(resolveRoomName(transaction_data)).emit('transaction', data.payload);
        // let rooms = Object.keys(socket.rooms);
        // if(!rooms.find(r => r == room_name)) {
        //     socket.join(room_name);
        //     console.log('new rooms created ' + room_name);
        //     console.log('all rooms name ', Object.keys(socket.rooms));
        // }

        socket.to(getSocketId(data.to)).emit('transaction', data);

        // socket.to(room_name).broadcast.emit('transaction', data);
    });

    socket.on('log out', function(login_msg){
        console.log('log out event');
        let login_data = JSON.parse(login_msg);
        logout(socket.id, login_data);
        leaveAllRoom();
    });

    socket.on('disconnect', function(){
        console.log('user disconnected ' + socket.id);
    });
}) 

function login(socket_id, login_data) {
    let idx = users.findIndex(u => u.user_name == login_data.user_name);
    console.log('login users index ' + idx);
    if(idx < 0) {
        users.push({ user_name : login_data.user_name, socket_id : socket_id })
    } else {
        users.splice(idx, 1, { user_name : login_data.user_name, socket_id : socket_id });
    }
    
    console.log('login user socket id ' + socket_id);
    console.log('there are ' + users.length + ' users online');
    console.log('all login user data ', users);
}

function logout(socket_id, login_data) {
    let idx = users.findIndex(u => u.user_name == login_data.user_name);
    users.splice(idx, 1);

    console.log('logout user socket id ' + socket_id);
    console.log('there are ' + users.length + ' users online');
    console.log('all login user data ', users);
}

function getSocketId(user_name) {
    let u = users.find(u => u.user_name == user_name);
    if(!u) return '';
    return u.socket_id;
}

function createRoom(socket, room_data) {
    socket.join('roomName', room_data.room_name);
}

function leaveRoom(socket, room_data) {
    socket.leave('roomName', room_data.room_name);
}

function checkLoginUser(login_data) {
    return users.indexOf(users.find(u => u.user_name == login_data.user_name));
}

function resolveRoomName(transaction_data) {
    return ''+ transaction.storage.id + '_' + SELLER + '-' + transaction.market.id + '_' + BUYER;
}

// tracking

http.listen(3000, function(){
    console.log('listening on *:3000');
});