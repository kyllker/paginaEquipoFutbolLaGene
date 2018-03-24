// JavaScript Document
var juego = new Phaser.Game(370, 550, Phaser.CANVAS, 'bloque_juego');

juego.state.add('Menu', Menu);
juego.state.add('Juego', Juego);


juego.state.start('Menu');