
// if all three reels match, highlight background
// if "cherry" then color reel which won

// Wrap in IIFE to do initial setup while keeping functions & variables off global obj
var slot = (function(){
	// set amount of credits to start
	let credits = 100,
		// set initial position of reels
		currentReels = [0,0,0],
		// set default bet amount
		bet = 5;
		// set page display elements to variables to shorten code
		betDisplay = document.getElementById("current-bet"),
		creditsWonDisplay = document.getElementById("credits-won"),
		spunCount = document.getElementById("spun-count");
		// set spinUntilWin to false, change to true with button push later
		spinUntilWin = false;
	// set array of possible values for reels to land on. Use 10 for easy % calculations
	const reelPositions = [0,1,2,3,4,5,6,7,3,2],
		// to be honest, this could use some work. I just tweaked it until the payout was slightly positive over 1000 iterations
		payTable = [200,25,50,75,100,150,125,150,50,50],
		// set corresponding images for reel values
		img = {
			0: "006-shapes.png",
			1: "001-shapes-2.png",
			2: "002-money.png",
			3: "003-shapes-1.png",
			4: "008-slot-machine-1.png",
			5: "004-fruit-1.png",
			6: "005-fruit.png",
			7: "007-slot-machine.png",
			8: "008-slot-machine-1.png",
			9: "006-shapes.png"
		},
		// set reel elements (img tags) to a variable (array) for easy acces later
		reels = [document.getElementById("reel1"),
			document.getElementById("reel2"),
			document.getElementById("reel3")];
		// set initial value of credits on page to correspond to above value
		document.getElementById("credits").innerHTML = "Credits: " + credits;
	// this is where the good stuff starts. all the functions which run the game!
	return {
		// triggered when user clicks "spin"
		// also triggered by spinToWin loop as long as spinUntilWin === true
		spinReels: function(){
			// loop through reels, setting each to a random position between 0 and 9
			for (let i = 0; i < reels.length; i++){
				let rnd = Math.floor(Math.random() * 10);
				currentReels[i] = reelPositions[rnd];
			}
			// update reels to reflect new positions
			slot.updateReels();
			// take the bet away from player's credits
			credits -= bet;
			// make sure new credit amount is displayed!
			slot.updateCreditsDisplay();
			// check to see if player has won
			slot.checkOutcome();
		},
		// function to check if player has won by matching 3 or getting a cherry
		checkOutcome: function(){
			// set new "win" variable; if 3 reels match, switch to true
			let win = false;
			// set bonus variable to represent # of cherries
			let bonus = 0;
			// loop through reels to check for cherry (value === 4)
			for(let i = 0; i < currentReels.length; i++){
				if(currentReels[i] === 4){
					// if cherry, add 1 to bonus multiplier
					bonus += 1;
				}
			}
			// check whether all 3 reels match. if so, win = true to send to payout func
			if(currentReels[0] === currentReels[1] && currentReels[1] === currentReels[2]){
				win = true;
			}
			// check to see if player won anything. if so, call payout.
			if(!(bonus === 0 && !win)){
				// set variable from payout's return value to compare below
				let payout = slot.payout(win, bonus);
				// after calculating payout, if it is a big win (over 20), stop spinToWin loop
				if(spinUntilWin && payout > 20){
					// this stops spinToWin
					spinUntilWin = false;
				}
			}
			// if player did not win
			else {
				// update "Credits Won" to be 0
				slot.updateCreditsWonDisplay(0);
				// make sure their credits are not 0 or less than bet amount
				slot.checkCredits();
			}
		},
		// calculate payout and add it to credits
		payout: function(win, bonus){
			// set variable for payout amount
			let payout;
			// if player matched 3 reels, multiply by payTable and add bonus
			if(win){
				payout = payTable[currentReels[0]] * bet + bonus * bet;
			}
			// otherwise just add cherry bonus
			else{
				payout = bonus * bet;
			}
			// add payout to credits
			credits += payout;
			// show user new amount of credits
			slot.updateCreditsDisplay();
			// show user how many credits they won
			slot.updateCreditsWonDisplay(payout);
			// no need to return payout unless spinning until we get a win
			if(spinUntilWin){
				return payout;	
			}
		},
		// update the player's display for current credits
		updateCreditsDisplay: function(){
			document.getElementById("credits").innerHTML = "Credits: " + credits;
		},
		// triggered when user selects button
		increaseBet: function(){
			// make sure player can't go above 10
			// also make sure player can't bet more than they have!
			if(bet < 10 && credits > bet){
				bet++;
			// update bet display to reflect new number
			slot.updateBetDisplay();
			}
		},
		// triggered when user selects button
		decreaseBet: function(){
			// make sure player can't go below 1
			if(bet > 1){
				bet--;
			// update bet display to reflect new number
			slot.updateBetDisplay();
			}
		},
		// when called by increase/decrease bet, update display to new bet amt
		updateBetDisplay: function(){
			betDisplay.innerHTML = "Bet: " + bet;
		},
		// when called by payout, update user display to reflect amount won
		updateCreditsWonDisplay: function(wonAmount){
			creditsWonDisplay.innerHTML = "Won: " + wonAmount;
		},
		// when called by checkOutcome (if player won nothing)
		checkCredits: function(){
			// first check if user is out of credits
			if(credits === 0){
				// if player is out of credits, alert user and give more
				alert("You're out of credits. :-( Here, have 100 more!");
				credits = 100;
				// reset bet to default in case it was lowered in code below on previous pull
				bet = 5;
				// show player new bet amount
				slot.updateBetDisplay();
				// show player new credits amount
				slot.updateCreditsDisplay();
				// end spinToWin loop, since player ran out of credits
				spinUntilWin = false;
			}
			// second check whether player has enough credits to match current bet
			else if(bet > credits){
				// if they are trying to bet more than they have, set bet to credits
				bet = credits;
				// show player new bet amount
				slot.updateBetDisplay();
			}
			
		},
		// use reel values to set corresponding image
		updateReels: function(){
			// first part of filepath is always the same, so use a const!
			const path = "../assets/img/slotmachine/";
			// loop through reels
			for(let i = 0; i < reels.length; i++){
				// set img src of each reel to path + the name of the image
				reels[i].setAttribute("src", path + img[currentReels[i]]);
			}
		},
		// set logic for bet minimum button
		betMin: function(){
			// set bet to 1 (lowest)
			bet = 1;
			// update player bet display
			slot.updateBetDisplay();
			// go ahead and spin the reels too. why not?
			slot.spinReels();
		},
		// set logic for bet maximum button
		betMax: function(){
			// set bet to 10 (highest)
			bet = 10;
			// update player bet display
			slot.updateBetDisplay();
			// go ahead and spin the reels too. why not?
			slot.spinReels();
		},
		// set logic for "Spin Until Win" button
		spinToWin: function(){
			// set spinUntilWin to true so other functions see this
			spinUntilWin = true;
			// create variable to count how many spins it takes to get the win
			let spinCount = 0;
			// loop until another function sets spinUntilWin to false
			while(spinUntilWin){
				// increment spinCount
				spinCount ++;
				// set off chain of functions
				slot.spinReels();
			}
			// after leaving loop, tell user how many spins it took to win
			spunCount.innerHTML = "You spun " + spinCount + " times.";

		}
	}
}());

// used for testing/debugging purposes
// enter number of times you want to spin (I frequently used 1000) to see trends
function spin(num){
	for(let i = 0; i < num; i++){
		slot.spinReels();
	}
}

// set click listeners for player interface buttons
document.getElementById("spin-reels").addEventListener("click", slot.spinReels);
document.getElementById("increase-bet").addEventListener("click", slot.increaseBet);
document.getElementById("decrease-bet").addEventListener("click", slot.decreaseBet);
document.getElementById("bet-min").addEventListener("click", slot.betMin);
document.getElementById("bet-max").addEventListener("click", slot.betMax);
document.getElementById("spin-to-win").addEventListener("click", slot.spinToWin);