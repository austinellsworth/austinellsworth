// var key = {
// 	 37: false,
// 	 38: false,
// 	 39: false,
// 	 40: false
// };

var canvas = {
	element: document.getElementById("canvas"),
	get ctx(){
		return canvas.element.getContext('2d');
	},
	get height(){
		return canvas.element.height;
	},
	get width(){
		return canvas.element.width;
	},
};

var playerCircle = {
	newX: null,
	newY: null,
	setValues: function(){
		let x = Math.floor(canvas.width * .5);
		let y = Math.floor(canvas.height * .5);
		if(playerCircle.x === 0){
			playerCircle.x = x;	
		}
		if(playerCircle.y === 0){
			playerCircle.y = y;
		}
		playerCircle.radius = playerCircle.startRadius;
		playerCircle.rgb = playerCircle.rndRGB;
		playerCircle.newRadius = playerCircle.radius;
	},
	draw: function(){
		canvas.ctx.beginPath();
		canvas.ctx.fillStyle = playerCircle.color;
		canvas.ctx.arc(playerCircle.x, playerCircle.y, playerCircle.radius, 0, Math.PI * 2);
		canvas.ctx.fill();
		canvas.ctx.closePath();
	},
	move: function(keyCode){
		// if(key[38]){
		// 	playerCircle.y-= 4;
		// }
		// if(key[40]){
		// 	playerCircle.y+= 4;
		// }
		// if(key[37]){
		// 	playerCircle.x-= 4;
		// }
		// if(key[39]){
		// 	playerCircle.x+= 4;
		// }
		if(playerCircle.newX || playerCircle.newY){
			let difX = playerCircle.x - playerCircle.newX;
			let difY = playerCircle.y - playerCircle.newY;
			if(Math.abs(difX) > 4){
				// if(playerCircle.x > playerCircle.newX){
				// 	playerCircle.x -= 4;
				// } else {
				// 	playerCircle.x += 4;
				// }
				playerCircle.x -= Math.round(.04* difX);
			}
			if(Math.abs(difY) > 4){
				// if(playerCircle.y > playerCircle.newY){
				// 	playerCircle.y -= 4;
				// } else {
				// 	playerCircle.y += 4;
				// }
				playerCircle.y -= Math.round(.04* difY);
			}
		}
	},
	grow: function(circleRadius){
		let pRadius = playerCircle.radius;
		let playerArea = Math.PI * pRadius * pRadius;
		let circleArea = Math.PI * circleRadius * circleRadius;
		let radiusGrowth = Math.ceil(pRadius * circleArea / playerArea);
		playerCircle.newRadius += radiusGrowth;
		playerCircle.lighten();
	},
	shrink: function(){
		let pRadius = playerCircle.radius;
		let playerArea = Math.PI * pRadius * pRadius;
		let circleArea = Math.PI * playerCircle.startRadius * playerCircle.startRadius;
		let radiusShrink = Math.ceil(pRadius * circleArea / playerArea);
		playerCircle.newRadius -= radiusShrink;
		playerCircle.darken();
		if(playerCircle.newRadius < playerCircle.startRadius){
			playerCircle.newRadius = playerCircle.startRadius;
		}
	},
	embiggen: function(){
		playerCircle.radius ++;
	},
	ensmallen: function(){
		playerCircle.radius --;
	},
	lighten: function(){
		let rgb = playerCircle.rgb;
		if(rgb.r < 255){
			playerCircle.rgb.r++;
		}
		if(rgb.g < 255){
			playerCircle.rgb.g++;
		}
		if(rgb.b < 255){
			playerCircle.rgb.b++;
		}
	},
	darken: function(){
		let rgb = playerCircle.rgb;
		if(rgb.r > 0){
			playerCircle.rgb.r--;
		}
		if(rgb.g > 0){
			playerCircle.rgb.g--;
		}
		if(rgb.b > 0){
			playerCircle.rgb.b--;
		}
	},
	get rndRGB(){
		let rgbObj = {
			r: Math.floor(Math.random() * 256),
			g: Math.floor(Math.random() * 256),
			b: Math.floor(Math.random() * 256)
		}
		return rgbObj;
	},
	get color(){
		let rgb = playerCircle.rgb
		let rgbColor = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
		return rgbColor;
	},
	rgb: {},
	x: 0,
	y: 0,
	radius: 10,
	newRadius: 0,
	get startRadius(){
		return Math.floor(canvas.height * .03);
	}
};

var circles = {
	makeCircle: function(){
		if(!game.gameOver){
			if(circles.list.length <= 30){
				circles.list.push({
					x: circles.rndX,
					y: circles.rndY,
					radius: circles.rndRadius,
					color: circles.rndColor
				});
			}
			else {
				circles.list.splice(0, 1);
				return circles.makeCircle();
			}
			game.popIn();
			let interval = Math.floor(Math.random() * 500 + 500);
			setTimeout(function(){circles.makeCircle()}, interval);
		}
	},
	drawCircles: function(){
		for(let i = 0; i < circles.list.length; i++){
			let circle = circles.list[i];
			canvas.ctx.beginPath();
			canvas.ctx.fillStyle = circle.color;
			canvas.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
			canvas.ctx.fill();
			canvas.ctx.closePath();
		}
	},
	newWinCircle: function(){
		let xV = 10 - (Math.floor(Math.random() * 21));
		let yV = 10 - (Math.floor(Math.random() * 21));
		if(Math.abs(xV) <= 3 && Math.abs(yV) <= 3){
			return circles.newWinCircle();
		}
		circles.list.push({
			x: playerCircle.x,
			xVelocity: xV,
			y: playerCircle.y,
			yVelocity: yV,
			radius: playerCircle.startRadius,
			color: circles.rndColor
		});
		game.shootOut();
	},
	moveCircles: function(){
		for(let i = 0; i < circles.list.length; i++){
			let circle = circles.list[i];
			let maxX = canvas.width;
			let maxY = canvas.height;
			circle.x += circle.xVelocity;
			circle.y += circle.yVelocity;
			if(circle.x >= maxX || circle.x <= 0 || circle.y >= maxY || circle.y <= 0){
				circles.list.splice(i, 1);
			}
		}
	},
	get rndX(){
		let maxX = canvas.width;
		let newX = Math.floor(Math.random() * maxX);
		return newX;
	},
	get rndY(){
		let maxY = canvas.height;
		let newY = Math.floor(Math.random() * maxY);
		return newY;
	},
	get rndRadius(){
		let max = .3 * playerCircle.radius;
		let radius = Math.floor(Math.random() * (max - 5 + 1) + 5);
		return radius;
	},
	get rndColor(){
		let newRGB = [];
		for(let i = 0; i < 3; i++){
			newRGB.push(Math.floor(Math.random() * 256));
		}
		let newColor = "rgb(" + newRGB[0] + "," + newRGB[1] + "," + newRGB[2] + ")";
		return newColor;
	},
	list: [],
};
var game = {
	firstClick: true,
	gameOver: false,
	music: new Audio("../assets/sounds/circles/bensound-slowmotion.mp3"),
	suckIn: function(){
		let audio = document.createElement("audio");
		audio.src = "../assets/sounds/circles/suckin.m4a";
		audio.addEventListener("ended", function(){
			audio.remove(this);
		}, false);
		audio.play();
	},
	popIn: function(){
		let audio = document.createElement("audio");
		audio.src = "../assets/sounds/circles/popin.m4a";
		audio.volume = .1;
		audio.addEventListener("ended", function(){
			audio.remove(this);
		}, false);
		audio.play();
	},
	shootOut: function(){
		let audio = document.createElement("audio");
		audio.src = "../assets/sounds/circles/shootout.m4a";
		audio.volume = .3;
		audio.addEventListener("ended", function(){
			audio.remove(this);
		}, false);
		audio.play();
	},
	gameLoop: function(){
		if(playerCircle.radius >= .5 * canvas.height || playerCircle.radius >= .5 * canvas.width){
			return game.win();
		} else{
			canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
			playerCircle.move();
			playerCircle.draw();
			circles.drawCircles();
			game.detectCollision();
			if (playerCircle.newRadius > playerCircle.radius){
				playerCircle.embiggen();
			}
			setTimeout(function(){game.gameLoop();},17);
		}
	},
	newGame: function(){
		game.gameOver = false;
		playerCircle.setValues();
		circles.makeCircle();
		game.gameLoop();
	},
	detectCollision: function(){
		for(i = 0; i < circles.list.length; i++){
			let circle = circles.list[i];
			let dx = playerCircle.x - circle.x;
			let dy = playerCircle.y - circle.y;
			let dist = Math.sqrt(dx * dx + dy * dy);
			if(dist < playerCircle.radius + circle.radius){
				playerCircle.grow(circle.radius);
				game.suckIn();
				circles.list.splice(i, 1);
			}
		}
	},
	win: function(){
		game.gameOver = true;
		circles.list = [];
		game.resetLoop(0);

	},
	resetLoop: function(val){
		let i = val;
		if(playerCircle.radius <= playerCircle.startRadius && circles.list.length === 0){
			return game.newGame();
		}
		else if (playerCircle.radius > playerCircle.startRadius) {
			if(playerCircle.newRadius < playerCircle.radius){
				playerCircle.ensmallen();
			}
			if(i === 5 && playerCircle.newRadius > playerCircle.startRadius){
				circles.newWinCircle();
				playerCircle.shrink();
				i = 0;
			}
			i++;
		}
		playerCircle.move();
		circles.moveCircles();
		canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
		playerCircle.draw();
		circles.drawCircles();
		setTimeout(function(){game.resetLoop(i)}, 17);
	}
}

// window.addEventListener("keydown", function(e){
// 	if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40){
// 		let code = e.keyCode;
// 		key[code] = true;
// 	}
// 	if(e.keyCode === 77){
// 		game.music.muted = !game.music.muted;
// 	}
// });
// window.addEventListener("keyup", function(e){
// 	if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40){
// 		let code = e.keyCode;
// 		key[code] = false;
// 	}
// })

canvas.element.addEventListener("touchstart", function(e){
	let x = e.changedTouches[0].clientX;
	let y = e.changedTouches[0].clientY;
	playerCircle.newX = x;
	playerCircle.newY = y;
	if(game.firstClick){
		game.music.loop = true;
		game.music.play();
		game.newGame();
		game.firstClick = false;
	}
});
canvas.element.addEventListener("touchmove", function(e){
	let x = e.changedTouches[0].clientX;
	let y = e.changedTouches[0].clientY;
	playerCircle.newX = x;
	playerCircle.newY = y;
});
canvas.element.addEventListener("touchend", function(){
	playerCircle.newX = null;
	playerCircle.newY = null;
});
canvas.element.addEventListener("mousemove", function(e){
	let x = e.clientX;
	let y = e.clientY;
	playerCircle.newX = x;
	playerCircle.newY = y;
});
canvas.element.addEventListener("click", function(){
	if(game.firstClick){
		game.music.loop = true;
		game.music.play();
		game.newGame();
		game.firstClick = false;
	}
});
(function(){
	window.addEventListener("resize", resizeThrottler, false);

	let resizeTimeout;
	function resizeThrottler() {
		if(!resizeTimeout){
			resizeTimeout = setTimeout(function(){
				resizeTimeout = null;
				adjustCanvasSize();
			}, 200);
		}
	}
	function adjustCanvasSize(){
		canvas.element.width = canvas.element.scrollWidth;
		canvas.element.height = canvas.element.scrollHeight;
		let x = Math.floor(canvas.width * .5);
		let y = Math.floor(canvas.height * .5);
		playerCircle.x = x;
		playerCircle.y = y;
	}
}());

canvas.element.width = canvas.element.scrollWidth;
canvas.element.height = canvas.element.scrollHeight;



//