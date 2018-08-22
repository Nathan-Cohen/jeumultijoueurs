//////////////serveur////////////////
const mongo = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
app.use("/html", express.static(path.join(__dirname + "/public/html/")));
app.use("/js", express.static(path.join(__dirname + "/public/js/")));
app.use("/css", express.static(path.join(__dirname + "/public/css/")));
app.use("/lib", express.static(path.join(__dirname + "/public/lib/jQuery")));
app.use("/socket", express.static(path.join(__dirname + "/node_modules/socket.io-client/dist/")));


    app.get('/', function(requete, reponse, next){
        reponse.sendFile('index-client.html', {root: './public/html/'});
        
    })


///////////parti websocket////////////

const socketIO = require('socket.io');
const socketIOServer = socketIO(server);
var tabConnection = [];
// var tabjoueur = [];

socketIOServer.on('connection', function(socket){
    tabConnection.push(socket);
    socket.on('name', function(data){
        var connexion = {connecter: false, username: ''}
        var url = "mongodb://localhost:27017/joueurs";
        mongo.connect(url, {useNewUrlParser: true}, function (err, client) {
            var collection = client.db('blackjack').collection('joueurs');
            collection.findOne({username: data.username}, function(err, o) {
                if (err) {
                     console.log(err.message);
                     } else { 
                            if(o === null){
                                collection.insert({username: data.username, idUnique: data.id, date: new Date()}, function(err, o) {
                                    if (err) {
                                        console.log(err.message);
                                        } else { 
                                            console.log("Connecter : ", data.username, data.id);
                                            connexion.connecter = true;
                                            connexion.username = data.username;
                                            socket.emit('connection', connexion);
                                            }
                                });
                            }
                            else{
                                connexion.username = data.username;
                                socket.emit('connection', connexion);
                            }
                         }
              });
        });
    });
});



server.listen(8080);