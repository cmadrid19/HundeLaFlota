var main = null;

class Battleship{
  constructor(){
    this.width = 800;
    this.height = 550;
    this.offsetX = 0;
    this.offsetY = 0;

    this.ws = null;
    this.isRunning = true;

    this.usuariosList = document.getElementById("usuariosList");
    this.canvas = document.getElementById("canvasMain");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = null;


    this.user = {
      username: ""
    };
    this.casillas = [];
    this.barcosColocados = [];
    this.barcos = [
      {
        nombre: "pesquero",
        casillas: 2,
        vida: 20,
        ataque: 10
      },
      {
        nombre: "buque",
        casillas: 5,
        vida: 150,
        ataque: 40
      }
    ];
  }

  canvasCalcOffset(){
    let bounds = this.canvas.getBoundingClientRect();
    this.offsetX = bounds.left;
    this.offsetY = bounds.top;  
  }

  colocarBarco(){

  }

  generarBarcos(){
    let marginTop = 440;
    let standardWidth = 38;
    let standardHeight = 38;

    
  }

  generarCasillas(){
    let marginTop = 40;

    for(let k=0;k<10;k++){
      let y = (k * 40) + marginTop;

      for(let i=0;i<20;i++){
        let x = i * 40;
        let casilla = {
          x: x,
          y: y,
          w: 38,
          h: 38,
          color: "#000",
          pantalla: 0
        };

        if(i >= 10){
          casilla.color = "#0f0";
          casilla.pantalla = 1;
        }else{
          casilla.color = "#f00";
          casilla.pantalla = 0;
        }

        this.casillas.push(casilla);
      }
    }
  }

  init(){
    this.ctx = this.canvas.getContext('2d');

    this.generarCasillas();
    this.generarBarcos();

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    this.ws = new WebSocket('ws://localhost:8080');

    this.user.username = prompt("Introduce tu nombre de usuario: ");

    this.ws.onopen = function () {
      console.log("OPEN");
      let userData = {
        nombre: main.user.username
      };

      let dataSend = {
        type: "userData",
        data: userData
      };

      main.ws.send(JSON.stringify(dataSend));
    };

    this.ws.onerror = function (error) {
      console.error(error);
      
    };

    this.ws.onmessage = function (message) {
      try {
        let msg = JSON.parse(message.data);

        console.log(msg);

        if(msg.type === "clients"){
          for(let client of msg.data){
            let root = document.createElement("div");
            let html = `
              <li>
                ${client.nombre} - ${client.nivel}
              </li>
            `.trim();
            root.innerHTML = html;

            main.usuariosList.getElementsByTagName("ul")[0]
            .appendChild(root.firstChild);
          }
        }else{

        }
      } catch (e) {
        console.error(e);

        return;
      }
      // handle incoming message
    };

    this.canvas.addEventListener("keypress", function(ev){
      ev.preventDefault();
      ev.stopPropagation();

      console.log(ev);
      
    });

    this.canvas.addEventListener("mousedown", function(ev){
      ev.preventDefault();
      ev.stopPropagation();

      main.canvasCalcOffset();

      let mouseX = parseInt(ev.clientX-main.offsetX);
      let mouseY = parseInt(ev.clientY-main.offsetY);

      for(let casilla of main.casillas){
        if(mouseX >= casilla.x && mouseY >= casilla.y 
          && mouseX <= (casilla.x + casilla.w) 
          && mouseY <= (casilla.y + casilla.h)){
          
        }
      }
    });

    this.canvas.addEventListener("mousemove", function(ev){
      ev.preventDefault();
      ev.stopPropagation();

      main.canvasCalcOffset();

      let mouseX = parseInt(ev.clientX-main.offsetX);
      let mouseY = parseInt(ev.clientY-main.offsetY);

      for(let casilla of main.casillas){
        if(mouseX >= casilla.x && mouseY >= casilla.y 
          && mouseX <= (casilla.x + casilla.w) 
          && mouseY <= (casilla.y + casilla.h)){
          
        }
      }
    });

    setInterval(function(){
      let dataSend = {
        type: "getMap",
        data: userData
      };

      main.ws.send(JSON.stringify(dataSend));

      main.update();
    }, 500);

    // RENDERIZAR
    requestAnimationFrame(this.render);
  }

  update(){

  }

  render(){
    console.log("Running...");

    main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);

    for(let casilla of main.casillas){
      main.ctx.fillStyle = casilla.color;
      main.ctx.fillRect(casilla.x, casilla.y, casilla.w, casilla.h);
    }

    main.ctx.restore();

    main.ctx.fillStyle = "#000";
    main.ctx.font = "30px Arial";
    main.ctx.fillText(main.user.username, 5, 30);

    if (main.isRunning) requestAnimationFrame(main.render);
  }
}

window.addEventListener("load", () => {
  main = new Battleship();
  main.init();
});