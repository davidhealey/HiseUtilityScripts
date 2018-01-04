/**
 * Title: colourPicker.js
 * Author: David Healey
 * Date: 07/09/2017
 * Modified: 07/09/2017
 * License: Public Domain
*/

Content.setWidht(650);
Content.setHeight(175);

reg colour = [];
reg colourString;

const var alpha = Content.addKnob("Alpha", 0, 0);
alpha.setRange(0, 255, 1);
alpha.set("style", "Vertical");
alpha.set("itemColour", 0xFFAAAAAA);
alpha.set("bgColour", 0xFF000000);
const var red = Content.addKnob("Red", 150, 0);
red.setRange(0, 255, 1);
red.set("style", "Vertical");
red.set("itemColour", 0xFFFF0000);
red.set("bgColour", 0xFF000000);
const var green = Content.addKnob("Green", 300, 0);
green.setRange(0, 255, 1);
green.set("itemColour", 0xFF64FF4E);
green.set("bgColour", 0xFF000000);
green.set("style", "Vertical");
const var blue = Content.addKnob("Blue", 450, 0);
blue.setRange(0, 255, 1);
blue.set("style", "Vertical");
blue.set("itemColour", 0xFF1C00FF);
blue.set("bgColour", 0xFF000000);

const var code = Content.addLabel("code", 600, 10);
code.set("bgColour", 0xFF000000);

const var pnlColour = Content.addPanel("pnlColour", 0, 50);
pnlColour.set("width", 700);
pnlColour.set("height", 100);
pnlColour.setPaintRoutine(function(g){g.fillAll(parseInt(colourString));});

inline function convertToHex(v)
{
	reg hexTable = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
	reg d1 = hexTable[Math.floor(v/16)];
	reg d2 = hexTable[Math.floor(v % 16)];

	return d1 + d2;
}

inline function updateCode()
{
	code.set("text", "0x" + colour[0] + colour[1] + colour[2] + colour[3]);
	colourString = "0x" + colour[0] + colour[1] + colour[2] + colour[3];
}function onNoteOn()
{

}
function onNoteOff()
{

}
function onController()
{

}
function onTimer()
{

}
function onControl(number, value)
{
	switch (number)
	{
		case alpha:
			colour[0] = convertToHex(parseInt(value));
			updateCode();
			pnlColour.repaintImmediately();
		break;

		case red:
			colour[1] = convertToHex(parseInt(value));
			updateCode();
			pnlColour.repaintImmediately();
		break;

		case green:
			colour[2] = convertToHex(parseInt(value));
			updateCode();
			pnlColour.repaintImmediately();
		break;

		case blue:
			colour[3] = convertToHex(parseInt(value));
			updateCode();
			pnlColour.repaintImmediately();
		break;
	}
}
