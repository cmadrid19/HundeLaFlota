const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();

var wsServer = null;
var clients = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('./www'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

function initUsersDb(){
  let db = new sqlite3.Database('./db/usuarios.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the users database.');
  });

  let initQuery = `
  CREATE TABLE [IF NOT EXISTS] [proyecto1].usuarios (
    id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    passwd VARCHAR(1024) NOT NULL,
    maxScore DEFAULT 0,
  ) [WITHOUT ROWID];
  `.trim();

  db.exec(initQuery, function(stmt, err){
    console.log(stmt, err);
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

app.get('/', function(req, res) {
  res.sendFile('./views/index.html', { root: __dirname });
});

app.get('/login', function(req, res) {
  let dataSend = {
    nombre: "Prueba",
    nivel: 0
  };
  
  res.send(JSON.stringify(dataSend));
});

app.post('/signup', function(req, res) {
  let dataSend = {
    loginState: true,
    maxScore: 1000
  };

  console.log(req.body.nick);
  
  
  
  db.exec();
   
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });

  res.send(JSON.stringify(dataSend));
});

initUsersDb();

app.listen(4740, function() {
  console.log('Aplicación ejemplo, escuchando el puerto 4740!');
});

wsServer = new WebSocket.Server({ port: 8080 });

wsServer.on('connection', function(ws, req){

  ws.on('message', message => {
    let msg = JSON.parse(message);
    
    if(msg.type){
      switch(msg.type){
      case "userData":
        let cliente = {
          nombre: msg.data.nombre,
          nivel: msg.data.nivel,
          ip: req.connection.remoteAddress
        };

        clients.push(cliente);

        console.log("New user: " + cliente.nombre);

        let dataSend = {
          type: "clients",
          data: clients
        };
      
        ws.send(JSON.stringify(dataSend));

        break;
      }
    }
  });
});