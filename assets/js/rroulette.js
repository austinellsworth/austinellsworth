
var highScore = 4300;
var deaths = 0;

function checkHighScore(score){
	if(score > highScore){
		highScore = score;
		document.getElementById("high-score").innerHTML = "High Score: " + highScore;
		alert("Congratulations! You have the new high score!");
	}
}

var game = (function(){
	var score = 0,
		multiplier = 1,
		cylinderPos = Math.floor(Math.random() * 6),
		clickDisplay = document.getElementById("click-or-bang"),
		scoreDisplay = document.getElementById("score"),
		gameover = false;
		document.getElementById("high-score").innerHTML = "High Score: " + highScore;
		document.getElementById("pull-trigger").innerHTML = "Pull Trigger<br>(" + multiplier*100 + " points)<br>Odds: 1:" + (6 - multiplier);
	return {
		pullTrigger: function(){
		if (gameover === true){
			game.newGame();
		}
		if(cylinderPos === 0){
			clickDisplay.innerHTML += "BANG!";
			scoreDisplay.innerHTML = "Final Score: " + score;
			checkHighScore(score);
			game.dead();
			score = 0;
			multiplier = 1;
		} else if(cylinderPos === -1){
			cylinderPos = Math.floor(Math.random() * 6);
		}
		else {
			score += 100 * multiplier;
			multiplier++;
			clickDisplay.innerHTML += "Click. ";
			scoreDisplay.innerHTML = "Current Score: " + score;
			game.containerColor();
			document.getElementById("pull-trigger").innerHTML = "Pull Trigger<br>(" + multiplier*100 + " points)<br>Odds: 1:" + (6 - multiplier);
		}
		cylinderPos--;
		},
		spinCylinder: function(){
			cylinderPos = Math.floor(Math.random() * 6);
			multiplier = 1;
			document.getElementById("pull-trigger").innerHTML = "Pull Trigger<br>(" + multiplier*100 + " points)<br>Odds: 1:" + (6 - multiplier);
			game.containerColor();
			clickDisplay.innerHTML = "";
		},
		newGame: function(){
			score = 0;
			scoreDisplay.innerHTML = "Current Score: " + score;
			game.spinCylinder();
			clickDisplay.innerHTML = "";
			game.alive();
		},
		dead: function(){
			gameover = true;
			document.getElementById("spin-cylinder").disabled = true;
			document.getElementById("pull-trigger").disabled = true;
			document.getElementById("new-game").disabled = false;
			deaths ++;
			document.getElementById("death-counter").innerHTML = deaths + " deaths";
			document.getElementById("container").style.backgroundColor = "rgba(255,0,0,.8)";
		},
		alive: function(){
			gameover = false;
			document.getElementById("spin-cylinder").disabled = false;
			document.getElementById("pull-trigger").disabled = false;
			document.getElementById("new-game").disabled = true;
			document.getElementById("pull-trigger").innerHTML = "Pull Trigger<br>(" + multiplier*100 + " points)<br>Odds: 1:" + (6 - multiplier);
		},
		containerColor: function(){
			document.getElementById("container").style.backgroundColor = "rgba(255,255,255," + 0.2 * (multiplier - 1) + ")";
		}
	}
	
})();


document.getElementById("spin-cylinder").addEventListener("click", game.spinCylinder);
document.getElementById("pull-trigger").addEventListener("click", game.pullTrigger);
document.getElementById("new-game").addEventListener("click", game.newGame);
document.body.onkeyup = function(e) {
	if(e.keyCode == 32){
		game.pullTrigger();
	}
	if(e.keyCode == 17){
		game.spinCylinder();
	}
}