var result = {};
var rgb = {};
var newColor;
var fonts = ["'Slabo 27px', serif", "'Montserrat', sans-serif", "'Roboto Condensed', sans-serif", "'Raleway', sans-serif", "'Open Sans Condensed', sans-serif", "'Roboto Slab', serif", "'Noto Sans', sans-serif", "'Bitter', serif", "'PT Serif', serif", "'Dosis', sans-serif"];
var selectorGroups = [".bg", ".nb", ".bt", ".ft"];
var selectorTypes = [".pick", ".hex", ".r", ".g", ".b", ".submit"];
var colorSelectors = {"body":[$("body",)], "nav":[$(".nav")], "btn":[$(".btn")], "footer":[$("footer")]};
	
// Define colorSelectors
Object.keys(colorSelectors).forEach(function(x,y){
	for(i = 0; i < selectorTypes.length; i++){
		colorSelectors[x].push(eval('$\(\"' + selectorGroups[y] + selectorTypes[i] + '\"\)'));		
	}
})

// Add event listeners to color selectors
Object.keys(colorSelectors).forEach(function(x,y){
	//assign picker event listener
	(colorSelectors[x])[1].on("change", function(){
		//set newColor variable
		newColor = $(this).val();
		//update bG to new color
		colorUpdate(newColor, colorSelectors[x]);
	});
	//assign hex event listener
	(colorSelectors[x])[2].on("change", function(){
		//define newColor variable
		newColor = "#" + $(this).val();
		//update bG to new color
		colorUpdate(newColor, colorSelectors[x]);
	});
	//assign submit rgb event listener
	(colorSelectors[x])[6].on("click", function(){
		//define newColor variable
		rgbToHex(colorSelectors[x]);
		//update bG to new color
		colorUpdate(newColor, colorSelectors[x]);
	});
});

// Assign Random Color Button event handlers
$("#bgRandom").on("click", function(){
	randColor(colorSelectors.body);
});
$("#navRandom").on("click", function(){
		randColor(colorSelectors.nav);
	});
$("#btnRandom").on("click", function(){
		randColor(colorSelectors.btn);
	});
$("#footerRandom").on("click", function(){
		randColor(colorSelectors.footer);
	});

// Whole Page

//Pre-defined Styles

var styles = [
// Style 0 (Default)
	{
	body: "#317df7",
	nav: "#c0c0c0",
	footer: "#c0c0c0",
	btn: "#c0c0c0",},
// Style 1	
	{
	body: "#000000",
	nav: "#000000",
	footer: "#000000",
	btn: "#FFFFFF",},
// Style 2	
	{
	body: "",
	nav: "",
	footer: "",
	btn: "",},
// Style 3	
	{
	body: "",
	nav: "",
	footer: "",
	btn: "",},
// Style 4	
	{
	body: "",
	nav: "",
	footer: "",
	btn: "",},
// Style 5	
	{
	body: "",
	nav: "",
	footer: "",
	btn: "",},
// Style 6	
	{
	body: "",
	nav: "",
	footer: "",
	btn: "",},
// Style 7	
	{
	body: "",
	nav: "",
	footer: "",
	btn: "",},
// Style 8	
	{
	body: "",
	nav: "",
	footer: "",
	btn: "",},

];

// TODO Make it a loop
$("#stylePresets").on("change", function(){
	var x = $(this).val();
	colorUpdate(styles[x].body, colorSelectors.body);
	colorUpdate(styles[x].nav, colorSelectors.nav);
	colorUpdate(styles[x].footer, colorSelectors.footer);
	colorUpdate(styles[x].btn, colorSelectors.btn);
});



// Color Choice Functions
function colorUpdate(newColor, colorSelectors){
	// update element to new color
	colorSelectors[0].css("backgroundColor", newColor);
	//update Color Picker
	colorSelectors[1].val(newColor);
	//update hex field
	colorSelectors[2].val((newColor.replace("#","")));
	//convert to RGB, update R,G,B fields
	hexToRgb(newColor, colorSelectors);
}

// Convert rgb color to hex
function rgbToHex(colorSelectors) {
    // parseInt(r,g,b);
    var r = parseInt(colorSelectors[3].val()).toString(16);
    if(r.length === 1){r = "0" + r};
    var g = parseInt(colorSelectors[4].val()).toString(16);
    if(g.length === 1){g = "0" + g};
    var b = parseInt(colorSelectors[5].val()).toString(16);
    if(b.length === 1){b = "0" + b};
    newColor = "#" + r + g + b;
}

// Convert hex color to rgb, update rgb input with id x,y,z
function hexToRgb(hex, colorSelectors) {
    var result = [hex.slice(1,3), hex.slice(3,5), hex.slice(5)];
    result = {
        r: parseInt(result[0], 16),
        g: parseInt(result[1], 16),
        b: parseInt(result[2], 16)
    };
    colorSelectors[3].val(result.r);
	colorSelectors[4].val(result.g);
	colorSelectors[5].val(result.b);
}

// Get Random RGB color then update color and fields
function randColor(colorSelectors){
	for(i = 3; i < 6; i++){
		colorSelectors[i].val(Math.floor(Math.random() * 256));
	}
	colorSelectors[6].trigger("click");
}

// Update other color fields (convert to hex first!)
function updateFields(newColor, colorSelectors){
	//update Color Picker
	colorSelectors[1].val(newColor);
	//update hex field
	colorSelectors[2].val((newColor.replace("#","")));
	//convert to RGB, update R,G,B fields
	hexToRgb(newColor, colorSelectors);
}

// Font Selector
$("#font").on("change", function(){
	$("body").css("font-family", $("#font").val());
});

// Random Font Button
$("#randomFont").on("click", function(){
	x = Math.floor(Math.random()*10);
	$("body").css("font-family", fonts[x]);
	$("#font").val(fonts[x]);
});
// Toggle Page Elements

//Toggle Navbar Display On/Off
$("input[name='navOnOff']").on("click", function(){
	$("nav").toggle();
});

//Navbar alignment Top/Bottom
$("input[name='navLocation']").on("change", function(){
	$(".nav").toggleClass("top");
	$(".nav").toggleClass("bottom");
});

// Toggle Footer On/Off
$("#footerToggle").on("click", function(){
	$("footer").toggle();
});

// Navigation Bar

// Navigation Bar Link Button Text
$("#btn1txt").on("input", function(){
	$("#link1").text($(this).val());
});
$("#btn2txt").on("input", function(){
	$("#link2").text($(this).val());
});
$("#btn3txt").on("input", function(){
	$("#link3").text($(this).val());
});
$("#btn4txt").on("input", function(){
	$("#link4").text($(this).val());
});


// Navigation Buttons

// Button Alignment Left/Center/Right
$("input[name='navAlign']").on("change", function(){
	var align = $(this).val();
	$(".nav li").removeClass("left right");
	$(".nav li").addClass(align);
});

// Button Appearance

// Corner Rounding (Navbar Button Border-Radius)
$("#btnRnd").on("input", function(){
	$(".nav a").css("border-radius", $("#btnRnd").val() + "px");
});

// Space Between Navbar Buttons
$("#btnMar").on("input", function(){
	$(".nav a").css("margin", "0 " + $("#btnMar").val() + "px");
});

// Footer

// Footer Text
$("#footerTxt").on("input", function(){
	$("footer").text($(this).val());
});

