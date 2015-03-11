// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// monst image
var monstReady = false;
var monstImage = new Image();
monstImage.onload = function () {
	monstReady = true;
};
monstImage.src = "images/monster.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";



// Game objects
var hero = {
	speed: 150 // movement in pixels per second
};
var princess = {};
var monst = {
	speed:25
};
var princessesCaught = 0;
var level = localStorage.getItem("level");
if (level == null){ 
	level = 0;
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - (64+32)));
	princess.y = 32 + (Math.random() * (canvas.height - (64+32)));

	monst.x = 32 + (Math.random() * (canvas.width - (64+32)));
	monst.y = 32 + (Math.random() * (canvas.height - (64+32)));
	
	
};

// Update game objects
var update = function (modifier) {

	//cada 5 princesas cogidas, aumenta un nivel de dificultad. hasta 5
	if (level >= 5){
		hero.speed = 130;
		monst.speed = 35;
	}
	if (level >= 10){
		hero.speed = 110;
		monst.speed = 40;
	}
	if (level >= 15){
		hero.speed = 90;
		monst.speed = 45;
	}
	if (level >= 20){
		hero.speed = 70;
		monst.speed = 55;
	}
	if (level >= 25){
		hero.speed = 60;
		monst.speed = 60;
	}
	//hero moving
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		if(hero.y < 32){
			hero.y=32;
		}
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		if(hero.y > canvas.height-64){
			hero.y=canvas.height - 64;
		}
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		if(hero.x < 32){
		 	hero.x = 32;
		}
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		if(hero.x > canvas.width-64){
			hero.x = canvas.width-64;
		}
	}
	
	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		++level;
		localStorage.setItem("level", level); //guarda el estado
		
		reset();
	}

	
	//monster moving
	Ax = monst.x - hero.x;
	Ay = monst.y - hero.y;
 	if(Ax > 0){
 		monst.x -= monst.speed * modifier;
 	}else if (Ax < 0){
 		monst.x += monst.speed * modifier;
 	}
 	if(Ay > 0){
 		monst.y -= monst.speed * modifier;
 	}else if (Ay < 0){
 		monst.y += monst.speed * modifier;
 	}

	//Are hero chaught?
	if ( monst.x <= (hero.x + 16)
		&& hero.x <= (monst.x + 16)
		&& monst.y <= (hero.y + 16)
		&& hero.y <= (monst.y + 32)
	) {
		reset();
	}
	
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}
	if (monstReady){
		ctx.drawImage(monstImage, monst.x, monst.y);
	}
	

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("Level: " + level, 32, 64);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
