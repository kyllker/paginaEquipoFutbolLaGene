// JavaScript Document
/* Global variables */

var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");

var canvas_width = canvasElement.width;
var canvas_height =canvasElement.height;
var botX = 2;
var botY = 2;
var mx = 2;
var my = 4;
var points = 0;

var init = {};
var FPS = {};

FPS.set = 30;

function level(){

	FPS.set = $('#level').val();

}

function start(){
	
	$('#canvas').focus();
	
	init.interval = setInterval(function(){
		update();
		draw();
	}, 1000/FPS.set);
	$('#start').attr('disabled', 'disabled');
	$('#level').attr('disabled', 'disabled');
	

}


var player = {
	color: "#000",
	x: 220,
	y: 310,
	width: 50,
	height: 10,
	draw: function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	}
};

var player2 = {
	color: "#000",
	x: 220,
	y: 0,
	width: 50,
	height: 10,
	draw: function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	}
};

var ball = {
	x : 2,
	y : 2,
	r : 5,
	draw: function() {
		canvas.beginPath();
		canvas.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
		canvas.fill();
		}

};

function collides(a, b) {
	if(a.y == b.y || a.y <= b.height){
		if(a.x >= b.x && a.x <= b.x+b.width){
			return true;
		}else{
			return false;
		}
}
	
}

function update() {
	if (keydown.left) {
		player.x -= 5;
		player2.x -= 5;
	}

	if (keydown.right) {
		player.x += 5;
		player2.x += 5;
	}
	
	player.x = player.x.clamp(0, canvas_width - player.width);
	
	player2.x = player.x.clamp(0, canvas_width - player.width);
	
}


function gameOver(){
	canvas.fillStyle    = '#000';
	canvas.font         = '18px verdana';
	canvas.textBaseline = 'top';
	canvas.fillText('You scored : ' + points, 50, 100);
	canvas.fillText('Game Over, refresh the page to restart game', 50, 150);
	
	clearInterval(init.interval);
	
	$('#level').removeAttr('disabled');
}


function draw() {
	canvas.clearRect(0, 0, canvas_width, canvas_height);
	player.draw();
	player2.draw();
	ball.draw();
	
	
	if (collides(ball, player)) {
		
		my = -my;
		points = points + 1;
		
	}else if (collides(ball, player2)) {
		
		my = +my;
		points = points + 1;
		
	}else
	{
		if (ball.x + mx > canvas_width || ball.x + mx < 0){
			mx = -mx;
		}
		if (ball.y + my > canvas_height || ball.y + my < 0){
			my = -my;
			gameOver();
		}
		
		
	}
	$('#points').html(points);
	ball.x += mx;
	ball.y += my;
	
} 

(function(jQuery){

	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},

		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}

		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");

		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}

			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}

			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );

(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  $(document).bind("keydown", function(event) {
    keydown[keyName(event)] = true;
  });
  
  $(document).bind("keyup", function(event) {
    keydown[keyName(event)] = false;
  });
});


/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * <pre>
 * (x * 255).clamp(0, 255)
 * </pre>
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};