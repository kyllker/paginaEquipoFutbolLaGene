var nave;
var balas;
var malos;
var timer = 0;
var delay = 400;
var aparecer;
var puntos;
var vidas;
var txtPuntos;
var txtVidas;

var Juego = {
  
    preload: function(){
        juego.load.image('nave', 'img/nave.png');
        juego.load.image('laser', 'img/laser.png');
        juego.load.image('malo', 'img/malo.png');
        juego.load.image('bg', 'img/bg.png');
    },
    
    create: function(){
        juego.add.tileSprite(0, 0, 400, 540, 'bg');
        
        juego.physics.startSystem(Phaser.Physics.ARCADE);
        
        malos = juego.add.group();
        malos.enableBody = true;
        malos.setBodyType = Phaser.Physics.ARCADE;
        malos.createMultiple(20, 'malo');
        malos.setAll('checkWorldBounds', true);
        malos.setAll('outOfBoundsKill', true);
        
        balas = juego.add.group();
        balas.enableBody = true;
        balas.setBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(50, 'laser');
        balas.setAll('checkWorldBounds', true);
        balas.setAll('outOfBoundsKill', true);
        
        nave = juego.add.sprite(juego.width/2, 485, 'nave');
        nave.anchor.setTo(0.5);
        juego.physics.arcade.enable(nave, true);
        nave.body.allowRotation = false;
        
        aparecer = juego.time.events.loop(2000, this.crearEnemigo, this);
        
        puntos = 0;
        vidas = 3;
        juego.add.text(20, 20, "Puntos:", {font: "14px Arial", fill: "#990000"});
        txtPuntos = juego.add.text(80, 20, "0", {font: "14px Arial", fill: "#990000"});
        juego.add.text(310, 20, "Vidas:", {font: "14px Arial", fill: "#990000"});
        txtVidas = juego.add.text(360, 20, "3", {font: "14px Arial", fill: "#990000"});
    }, 
    
    update: function(){
        juego.physics.arcade.overlap(balas, malos, this.choque, null, this);
        nave.rotation = juego.physics.arcade.angleToPointer(nave);
        
        if(juego.input.activePointer.isDown)
            {
                this.disparar();
            }
        malos.forEachAlive(function(m){
           if(m.position.y > 520 && m.position.y < 521)
            {
                vidas -= 1;
                txtVidas.text = vidas;
            }
        });
        
        if(vidas == 0)
        {
            juego.state.start('Terminado');
        }
    },
    
    disparar: function(){
        if(juego.time.now > timer && balas.countDead() > 0)
        {
            timer = juego.time.now + delay;    
            var bala = balas.getFirstDead();
            bala.anchor.setTo(0.5);
            bala.reset(nave.x, nave.y);
            bala.rotation = juego.physics.arcade.angleToPointer(bala);
            juego.physics.arcade.moveToPointer(bala, 200);
        }
    },
    
    crearEnemigo: function(){
        var enem = malos.getFirstDead();
        var num = Math.floor(Math.random()*10 + 1)
        enem.reset(num*38, 0);
        enem.anchor.setTo(0.5);
        enem.body.velocity.y = 100;
        enem.checkWorldBounds = true;
        enem.outOfBoundsKill = true;
    },
    
    choque: function(m, l){
        m.kill();
        l.kill();
        puntos++;
        txtPuntos.text = puntos;
    }
    
};