// sound files to play at certain events
const sound = {
	paddleHit: new Audio("../assets/sounds/pong/paddlehit.m4a"),
	wallHit: new Audio("../assets/sounds/pong/wallhit.m4a"),
	wallBounce: new Audio("../assets/sounds/pong/wallbounce.m4a"),
	ballStart: new Audio("../assets/sounds/pong/ballstart.m4a"),
	winner: new Audio("../assets/sounds/pong/winner.m4a"),
	loser: new Audio("../assets/sounds/pong/loser.m4a")
}

// player1 info
var player1 = {
	// start player score at 0
	score: 0,
	// get SVG rect element
	paddle: document.getElementById("player1"),
	// set getter for paddle y coord
	get y(){
		return Number(this.paddle.getAttribute("y"));
	},
	// set setter for paddle y coord
	set y(newY){
		this.paddle.setAttribute("y", newY);
	},
	// set getter for paddle height for use later in collision detection
	get paddleHeight(){
		return Number(this.paddle.getAttribute("height"));
	},
	// set setter for paddle height to use via easy/normal/hard buttons
	set paddleHeight(newHeight){
		this.paddle.setAttribute("height", newHeight);
	}
};

// player 2 info
var player2 = {
	// start player score at 0
	score: 0,
	// get SVG rect element
	paddle: document.getElementById("player2"),
	// set getter for paddle y coord
	get y(){
		return Number(this.paddle.getAttribute("y"));
	},
	// set setter for paddle y coord
	set y(newY){
		this.paddle.setAttribute("y", newY);
	},
	// set getter for paddle height for use later in collision detection
	get paddleHeight(){
		return Number(this.paddle.getAttribute("height"));
	},
	// set setter for paddle height to use via easy/normal/hard buttons
	set paddleHeight(newHeight){
		this.paddle.setAttribute("height", newHeight);
	},
	// set up player 2 ai functionality
	// this function is called by ball.movement
	ai: function(){
		// set paddle center to a variable
		let paddle = player2.y + Math.round(.5 * player2.paddleHeight);
		// check whether paddle center is above or below current ball position
		// adjust accordingly, 5 pixels at a time
		if(paddle < ball.y - 5){
			player2.y += 5;
		} else if (paddle > ball.y + 5){
			player2.y -= 5;
		}
	},
};



// ball info
var ball = {
	// set variable for whether or not a new game is being started
	restart: true,
	// set variable for whether or not ball is in motion
	moving: false,
	// set variable for optional "gravity mode"
	gravityOn: false,
	// get ball element from DOM
	element: document.getElementById("ball"),
	// set getter for x value of ball (left-most edge)
	get x(){
		return Number(this.element.getAttribute("x"));
	},
	// set setter for x value of ball
	set x(newX){
		this.element.setAttribute("x", newX);
	},
	// set getter for y value of ball (top-most edge)
	get y(){
		return Number(this.element.getAttribute("y"));
	},
	// set setter for y value of ball
	set y(newY){
		this.element.setAttribute("y", newY);
	},
	// set time (in ms) to wait between updating ball position
	// this shortens every time a paddle is struck until reaching zero
	// at that point, the lateral velocity is increased until it reaches 20
	// starts at 0 because it will be set below in newRound
	interval: 0,
	// set initial lateral velocity
	// starts at 0 because it will be set below in setBallMovement
	lateral: 0,
	// set initial vertical velocity
	// starts at 0 because it will be set below in setBallMovement
	vertical: 0,
	// when gameOver, show all buttons, scoreboard, and winAnnouncement
	gameOver: function(){
		pageElements.showAll();
		this.restart = true;
	},
	roundOver: function(){
		ball.moving = false;
		pageElements.scoreboard.style.visibility = "visible";
		ball.element.style.visibility = "hidden";
		document.body.style.cursor = "auto";
		ball.addPoint();
	},
	// when called by newRound (if restart is true)
	// reset player scores, update the display,
	// and hide difficulty buttons, scoreboard, and winAnnoucement
	newGame: function(){
		this.restart = false;
		player1.score = 0;
		player2.score = 0;
		ball.updateScore();
		pageElements.hideAll();
	},
	// runs at the start of each new round/game
	// sets ball.moving to true
	// sets interval between ball position updates (in ms)
	// hides scoreboard
	// calls setBallMovement to setup lateral/vertical values
	// plays sound
	// initializes "gravity mode" if player has set gravityOn to true
	// initializes ball.movement loop
	newRound: function(){
		ball.element.style.visibility = "visible";
		if(this.restart){
			ball.newGame();
		}
		ball.moving = true;
		ball.interval = 20;
		pageElements.scoreboard.style.visibility = "hidden";
		this.setBallMovement();
		sound.ballStart.play();
		if(this.gravityOn){
			this.gravity();
		}
		this.movement();
	},
	// called by newRound
	// resets ball position to center
	// picks random number b/w 0 and 6, subtracts from 3 for vertical speed
	// picks random number b/w 0 and 1, if 1 then lateral speed is negative
	// otherwise lateral speed is positive
	setBallMovement: function(){
		this.x = 480;
		this.y = 230;
		let rnd = Math.floor(Math.random() * 7);
		this.vertical = 3 - rnd;
		rnd = Math.floor(Math.random() * 2);
		if(rnd === 1){
			this.lateral = -6;
		} else {
			this.lateral = 6;
		}
	},
	// called by movement if ball is touching or slightly beyond paddle x position
	// sets variables for top, bottom, middle of ball and relevant paddle
	// if ball y is between paddle y,
	// add or subtract from vertical velocity depending on whether ball
	// struck top or bottom half of paddle
	// then paddleStrike is called
	// also reset x value to line up ball with front of paddle
	// (this prevents a bug where ball would sometimes still crash into
	// wall after a successful paddle strike)
	checkPaddleCollision: function(){
			ballTop = ball.y,
			ballBottom = ball.y + 40,
			ballMiddle = ball.y + 20;
		if(ball.x < 250){
			let player1PaddleTop = player1.y,
				player1PaddleBottom = player1.y + player1.paddleHeight,
				paddle1Middle = player1.y + (.5 * player1.paddleHeight);
			if(ballBottom >= player1PaddleTop && ballTop <= player1PaddleBottom){
				if(paddle1Middle > ballMiddle){
					ball.vertical--;
				}
				else if(paddle1Middle < ballMiddle){
					ball.vertical++;
				}
				ball.x = 20;
				ball.paddleStrike(1);
			}
		} else {
			let player2PaddleTop = player2.y,
				player2PaddleBottom = player2.y + player2.paddleHeight,
				paddle2Middle = player2.y + (.5 * player2.paddleHeight);
			if(ballBottom >= player2PaddleTop && ballTop <= player2PaddleBottom){
				if(paddle2Middle > ballMiddle){
					ball.vertical--;
				}
				else if(paddle2Middle < ballMiddle){
					ball.vertical++;
				}
				ball.x = 950;
				ball.paddleStrike(-1);
			}
		}
		
	},
	// this function is the heart of the game
	// starts by adding vertical and lateral velocity values to ball's x and y
	// then checks whether ball is within range of paddle by
	// checking range from paddle surface to x pixels beyond surface
	// where x is the current lateral velocity
	// this way the function checks only once for paddle collision, no matter
	// what the lateral speed of the ball
	// setTimeout is used, with ball.interval providing number of ms to wait
	// this interval is decreased with each paddle strike until reaching 0
	// if ball.y >= top/bottom of window, vertical velocity is reversed
	// y is also reset to avoid bug where ball would get "stuck" in ceiling
	// if y values were negative
	// if ball is checked for paddle collision and fails, it returns here
	// once ball x is beyond walls, ball.moving is set to false and addpoint is called
	movement: function(){
		this.x += this.lateral;
		this.y += this.vertical
		let curX = this.x;
		let curY = this.y;
		player2.ai();
		if((curX <=20 && curX > (20 - Math.abs(this.lateral))) | (curX >= 950 && curX < (950 + Math.abs(this.lateral)))) {
			ball.checkPaddleCollision();
		}
		setTimeout(function(){
			if(curX > 0 && curX < 980){
				if(curY > 0 && curY < 460){
					ball.movement();
				}
				else if(curY <= 0 | curY >= 460){
					if(curY <= 0){
						this.y = 0;
					}
					else if(curY >= 460){
						this.y = 460;
					}
					sound.wallBounce.play();
					ball.vertical*= -1;
					ball.movement();
				}
			} else {
				sound.wallHit.play();
				ball.roundOver();
			}
		}, ball.interval);
	},
	// optional "gravity mode"
	// adds 1 to vertical velocity every .1 seconds as long as ball.moving is true
	gravity: function(){
		if(ball.moving){
			ball.vertical ++;
			setTimeout(function(){ball.gravity()}, 100);
		}
	},
	// called from checkPaddleCollision if ball has collided with paddle
	// plays sound, reverses lateral velocity, and adds 2 to
	// lateral velocity until it reaches 20
	// d'oh, use math.abs for lateral velocity because it can be either pos or neg
	paddleStrike: function(plusMinus){
		sound.paddleHit.play();
		ball.lateral *= -1;
		if(Math.abs(ball.lateral) < 20){
			ball.lateral += 2 * plusMinus;
		}
	},
	// when ball strikes wall, movement calls this function
	// displays scoreboard while hiding ball
	// awards point to player opposite ball position and updates scoreboard
	// then runs check if game is over by checking whether either player has 5 points
	// if so, plays sound after .7 seconds (to allow other sounds to finish playing),
	// sets winAnnoucement text, and calls gameOver
	addPoint: function(){
		if(ball.x > 500){
			player1.score ++;
			ball.updateScore();
		} else {
			player2.score ++;
			ball.updateScore();
		}
		if(player1.score === 5){
			pageElements.winAnnouncement.innerHTML = "Player 1 Wins!";
			setTimeout(function(){sound.winner.play()}, 700);
			ball.gameOver();
		} else if (player2.score === 5){
			pageElements.winAnnouncement.innerHTML = "Player 2 Wins!";
			setTimeout(function(){sound.loser.play()}, 700);
			ball.gameOver();
		}
	},
	// creates variable from player scores
	// updates scoreboard element with current scores
	updateScore: function(){
		let score = player1.score + " - " + player2.score;
		pageElements.scoreboard.innerHTML = score;
	}
}
// set initial positions for player paddles and ball
player1.y = 200;
player2.y = 200;
ball.x = 480;
ball.y = 230;

// set const object for DOM elements which will be accessed above
const pageElements = {
		easy: document.getElementById("easy"),
		normal: document.getElementById("normal"),
		hard: document.getElementById("hard"),
		winAnnouncement: document.getElementById("win-announcement"),
		scoreboard: document.getElementById("scoreboard"),
		gravity: document.getElementById("gravity")
};
// use second object as prototype to allow for(in) loop to work correctly below when
// setting all elements to show/hide at gameOver and newGame
const elementsProto = {
	hideAll: function(){
		for(prop in this){
			if(this.hasOwnProperty(prop)){
					this[prop].style.visibility = "hidden";
			}
		}
	}.bind(pageElements),
	showAll: function(){
		for(prop in this){
			if(this.hasOwnProperty(prop)){
					this[prop].style.visibility = "visible";
			}
		}
	}.bind(pageElements),
	toggleActiveButton: function(newActive){
		pageElements.easy.classList.remove("active-button");
		pageElements.normal.classList.remove("active-button");
		pageElements.hard.classList.remove("active-button");
		newActive.classList.add("active-button");
	},
	svgWrapper: document.getElementById("svg-wrapper"),
}

// apply elementsProto as prototype of pageElements so that we can call its functions
// from the same place, but without looping through its functions/values when
// showing/hiding DOM elements
Reflect.setPrototypeOf(pageElements,elementsProto);


// add event listeners
// easy/normal/hard listeners to adjust paddle height
// also reset paddle y position to re-center paddle
// add listeners for mousemove and click to control paddle and start new game/round

pageElements.easy.addEventListener("click", function(){
	pageElements.toggleActiveButton(this);
	player1.paddleHeight = 120;
	player2.paddleHeight = 80;
	player1.y = 190;
	player2.y = 210;
});
pageElements.normal.addEventListener("click", function(){
	pageElements.toggleActiveButton(this);
	player1.paddleHeight = 100;
	player2.paddleHeight = 100;
	player1.y = 200;
	player2.y = 200;
});
pageElements.hard.addEventListener("click", function(){
	pageElements.toggleActiveButton(this);
	player1.paddleHeight = 80;
	player2.paddleHeight = 120;
	player1.y = 210;
	player2.y = 190;
});

pageElements.gravity.addEventListener("click", function(){
	ball.gravityOn = !ball.gravityOn;
	this.classList.toggle("active-button");
	if(ball.gravityOn){
		this.innerText = "Gravity: On";
	} else {
		this.innerText = "Gravity: Off";
	}
});

window.addEventListener("mousemove", function(e){
	if(e.path[0] === document.getElementById("wrapper") | e.path[0] === pageElements.svgWrapper){
		player1.y = Number(e.offsetY - 0.5 * player1.paddleHeight);
	}
});

pageElements.svgWrapper.addEventListener("click", function(){
	if(ball.moving === false){
		document.body.style.cursor = "none";
		ball.newRound();
	}
});