function ColorObject(){
	var selectorGroups = ["bg", "nb", "ft"],
		targets = [$("body"), $("nav"), $("footer")],
		selectorTypes = ["picker", "hex", "r", "g", "b", "submit", "random"];
	// loop through selector groups (background, navbar, footer)
	for(var x = 0; x < selectorGroups.length; x++){
		// put each selector group tag in a nice variable
		let selector = selectorGroups[x];
		// create an object for each selector group
		this[selector] = {};
		// set up selector prefix (i.e. "#bg-")
		let selectorMod = "#" + selectorGroups[x] + "-";
		// loop through different selector types
		for(var i = 0; i < selectorTypes.length; i++){
			// set up a variable for the key of each selectorType
			let key = selectorTypes[i];
			// assign value of each selector id to the appropriate key
			// build jQuery selector in form of $("#id")
			// use eval() to select from DOM and store that as value
			this[selector][key] = eval("$('" + selectorMod + selectorTypes[i] + "')");
		}
		// add the element to be targeted for color change
		this[selector].target = targets[x];
	}
}

// create the colorSelectors object using function constructor
var colorSelectors = new ColorObject();

// add the updateColorFields method to colorSelectors via prototype
ColorObject.prototype.updateColorFields = function(hex, selector){
	// use a variable for location to shorten further code
	let loc = this[selector];
	// set picker value
	loc.picker.val("#" + hex);
	// set hex value
	loc.hex.val(hex);
	// convert hex to rgb (base 10), then pass to r,g,b fields
	loc.r.val(parseInt(hex.slice(0,2), 16));
	loc.g.val(parseInt(hex.slice(2,4), 16));
	loc.b.val(parseInt(hex.slice(4), 16));
}

// assign event listeners to color selectors
// loop through each key, assign 4 event listeners per key
Object.keys(colorSelectors).forEach(function(x){
	// use a variable for location to shorten further code
	let loc = colorSelectors[x];
	// assign color picker listener
	loc.picker.on("change", function(){
		// to make life easier, assign value of picker to variable
		let newColor = loc.picker.val();
		// update color of target using value given by picker
		loc.target.css("background-color", newColor);
		// pass value to updateColorFields, first removing "#"
		colorSelectors.updateColorFields(newColor.slice(1), x);
	});
	// assign hex value listener
	loc.hex.on("change", function(){
		// set newColor value, add # to front before updating target
		let newColor = "#" + loc.hex.val();
		// check to make sure hex value was entered correctly
		if(newColor.length === 7){
			// update color of target with newColor
			loc.target.css("background-color", newColor);
			// pass newColor to updateColorFields, remove "#" first
			colorSelectors.updateColorFields(newColor.slice(1), x);
		}
		else {
			alert("Hex values must be 6 characters and may not include '#' character.")
		}
		
	});
	// assign rgb submit button listener
	loc.submit.on("click", function(){
		// place values from r, g, b fields into array
		var rgbArr = [loc.r.val(), loc.g.val(), loc.b.val()];
		// pass array to rgbtoHex to convert to hex value
		let hex = rgbtoHex(rgbArr);
		// update color of target with hex
		loc.target.css("background-color", hex);
		// pass hex to updateColorFields, remove "#" first
		colorSelectors.updateColorFields(hex.slice(1), x);
	});
	loc.random.on("click", function(){
		let hex = randomColor();
		loc.target.css("background-color", hex);
		colorSelectors.updateColorFields(hex.slice(1), x);
	});
});

// assign title random theme button listener
$("#all-random").on("click", function(){
	// loop through colorSelectors keys
	Object.keys(colorSelectors).forEach(function(x){
		// get var hex by calling randomColor
		let hex = randomColor();
		// set current target (background, navbar, footer) to hex color
		colorSelectors[x].target.css("background-color", hex);
		// update color fields
		colorSelectors.updateColorFields(hex.slice(1), x);
	});
});

function randomColor(){
	var rgbArr = [];
	for(var i = 0; i < 3; i++){
		rgbArr.push(Math.floor(Math.random() * 256));
	}
	var hex = rgbtoHex(rgbArr);
	return(hex);
}

function rgbtoHex(arr){
	// loop through array of r,g,b values
	for(var i = 0; i < 3; i++){
		// check to make sure rgb values are within acceptable range
		if(!(arr[i] <= 255 && arr[i] >= 0)){
			// if rgb value is not within range, alert user
			alert("rgb values must be an integer between 0 and 255.");
		}
		// change each value in array to number, then to base 16 value
		arr[i] = parseInt(Math.floor(arr[i])).toString(16);
		// check whether result is 1 digit, if so add a 0 to beginning
		if(arr[i].length === 1){
			arr[i] = "0" + arr[i];
		}
	}
	// build hex value from modified array values, then return
	var hex = "#" + arr[0] + arr[1] + arr[2];
	return hex;
}

// font selector
$("#font").on("change", function(){
	$("body").css("font-family", $(this).val());
});

// random font selector
$("#random-font").on("click", function(){
	// set const to names of fonts. use const so values can't be changed by accident.
	const fonts = ["'Slabo 27px', serif", "'Montserrat', sans-serif", "'Roboto Condensed', sans-serif", "'Raleway', sans-serif", "'Open Sans Condensed', sans-serif", "'Roboto Slab', serif", "'Noto Sans', sans-serif", "'Bitter', serif", "'PT Serif', serif", "'Dosis', sans-serif"];
	// use var limit when calculating random index so that number of fonts isn't hard-coded
	var limit = fonts.length;
	// get random number between 0 and length property of fonts array
	var rnd = Math.floor(Math.random() * limit);
	// check if font actually changed.
	if($("#font").val() === fonts[rnd]){
		//  if not, re-roll.
		rnd = Math.floor(Math.random() * limit);
	}
	// update document font by changing <body> style
	$("body").css("font-family", fonts[rnd]);
	// update font selector to match new font
	$("#font").val(fonts[rnd]);
});

// button color selector

// call function to set up color choice button event listeners
btnColorSelectors();

// define function to set event listeners on button color selectors
function btnColorSelectors(){
	// use const so values aren't changed by accident
	const btnColors = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "link"];
	// loop through each button id in btnColors
	for(var i = 0; i < btnColors.length; i++){
		// use let to set color so that its value remains available to selector below
		let color = btnColors[i];
		// define new class name to be given to nav buttons when color button is clicked
		let newClass = "nav-item nav-link btn" + " btn-" + color;
		// select color button by id and add event listener
		document.getElementById(color).addEventListener("click", function(){
			// set btns to array of nav buttons
			let btns = document.getElementsByClassName("nav-item nav-link");
			// loop through each item in btns array
			for(var x = 0; x < btns.length; x++){
				// set newClass for each btns item
				btns[x].className = newClass;
			}			
		});
	}
}

// toggle option panel display
$("#whole-page").on("click", function(){
	$("#show-hide-wp").toggleClass("hide");
});
$("#navigation-bar").on("click", function(){
	$("#show-hide-nb").toggleClass("hide");
});
$("#footer").on("click", function(){
	$("#show-hide-ft").toggleClass("hide");
});
