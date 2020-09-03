var express = require('express');
var app = express();
const path = require('path')
const server = require('http').createServer(app);
const options = { perMessageDeflate: false };
const io = require('socket.io')(server, options);

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var min = 0;
var max = 600;
var width = 1000;
var height = 800;
var left = 0;
var top = 0;

function getRandomInt() {
  return Math.floor(Math.random() * (max));
}

var Car = function () {
  this.x = getRandomInt()+50;
  this.y = getRandomInt()+50;
};

const num_cars = 15;
var cars = [];
for (let i = 0; i < num_cars; i++) {
  cars.push(new Car);
}

function move(car, cindex) {
  var x_or_y = cindex%2===0;
  if(x_or_y){
    car.x+=2;
    if(car.x>width){
      car.x=left;
    }
  }
  else{
    car.y+=2;
    if(car.y>height){
      car.y=top;
    }
  }  
}
console.log("Go to http://localhost:3000/");

var socket = io.on('connect', socket => {
  if (socket) {
    console.log('Connected!');
  }
  socket.on('dimension',dim=>{
    // console.log("setting screen dim to "+dim.width+"x"+dim.height);
    width=dim.width;
    height=dim.height;
    left=dim.left;
    top=dim.top;
    console.log(`left ${left} top ${top} width ${width} height ${height}`);
  });
  socket.emit('cars',num_cars);
  setInterval(() => {
    cars.forEach((car, index)=>{move(car, index)});
    socket.emit("location_change", cars);
  }, 20);
});

server.listen(3000);