

// event listeners
const input = document.getElementById("result"),
	lastCalc = document.getElementById("last-calculation");

document.getElementById("0").addEventListener("click", function(){
	input.innerText += "0";
});
document.getElementById("1").addEventListener("click", function(){
	input.innerText += "1";
});
document.getElementById("2").addEventListener("click", function(){
	input.innerText += "2";
});
document.getElementById("3").addEventListener("click", function(){
	input.innerText += "3";
});
document.getElementById("4").addEventListener("click", function(){
	input.innerText += "4";
});
document.getElementById("5").addEventListener("click", function(){
	input.innerText += "5";
});
document.getElementById("6").addEventListener("click", function(){
	input.innerText += "6";
});
document.getElementById("7").addEventListener("click", function(){
	input.innerText += "7";
});
document.getElementById("8").addEventListener("click", function(){
	input.innerText += "8";
});
document.getElementById("9").addEventListener("click", function(){
	input.innerText += "9";
});
document.getElementById("decimal").addEventListener("click", function(){
	input.innerText += ".";
});
document.getElementById("divide").addEventListener("click", function(){
	input.innerText += "/";
	lastCalc.innerText += input.innerText;
	input.innerText = "";
});
document.getElementById("multiply").addEventListener("click", function(){
	input.innerText += "*";
	lastCalc.innerText += input.innerText;
	input.innerText = "";
});
document.getElementById("subtract").addEventListener("click", function(){
	input.innerText += "-";
	lastCalc.innerText += input.innerText;
	input.innerText = "";
});
document.getElementById("add").addEventListener("click", function(){
	input.innerText += "+";
	lastCalc.innerText += input.innerText;
	input.innerText = "";
});
document.getElementById("square-root").addEventListener("click", function(){
	input.innerText += "sqrt";
});
document.getElementById("exponent").addEventListener("click", function(){
	input.innerText += "^";
});
document.getElementById("clear-entry").addEventListener("click", function(){
	input.innerText = "";
});
document.getElementById("all-clear").addEventListener("click", function(){
	input.innerText = "";
	lastCalc.innerText = "";
	// do some more logic here
});
document.getElementById("equals").addEventListener("click", function(){
	lastCalc.innerText += input.innerText;
	input.innerText = "";
	// do all the logic
});
