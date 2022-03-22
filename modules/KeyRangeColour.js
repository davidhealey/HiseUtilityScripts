/**
 * Title: keyRangeColour.js
 * Author: David Healey
 * Date: 30/06/2017
 * Modified: 30/06/2017
 * License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.en.html
*/

//Init
Content.setWidth(650);
Content.setHeight(50);

const var colours = [Colours.blue, Colours.cyan, Colours.yellow, Colours.green, Colours.red, Colours.purple, Colours.black, Colours.white, Colours.orange, Colours.pink];
var noteRange = [];

//GUI
const var knbLow = Content.addKnob("knbLow", 0, 0);
knbLow.set("text", "Low Note");
knbLow.setRange(0, 127, 1);
knbLow.set("defaultValue", 0);

const var knbHigh = Content.addKnob("knbHigh", 150, 0);
knbHigh.set("text", "High Note");
knbHigh.setRange(0, 127, 1);
knbHigh.set("defaultValue", 1);

const var cmbColour = Content.addComboBox("cmbColour", 300, 10);
cmbColour.set("width", 100);
cmbColour.set("text", "Colour");
cmbColour.set("items", ["Blue", "Cyan", "Yellow", "Green", "Red", "Purple", "Black", "White", "Orange", "Pink"].join("\n"));

const var btnSkipBlack = Content.addButton("btnSkipBlack", 410, 10);
btnSkipBlack.set("width", 100);
btnSkipBlack.set("text", "Skip Black");

const var btnSkipWhite = Content.addButton("btnSkipWhite", 520, 10);
btnSkipWhite.set("width", 100);
btnSkipWhite.set("text", "Skip White");

const var btnIgnore = Content.addButton("btnIgnore", 630, 10);
btnIgnore.set("width", 100);
btnIgnore.set("text", "Ignore Events");

//Functions
inline function inRange(value, min, max)
{
    return value >= min && value <= max;
}

inline function isBlackKey(n)
{
	var blackKeys = [1, 3, 6, 8, 10]; //Black keys in one octave assuming C = 0

	if (blackKeys.indexOf(parseInt(n) % 12) != -1)
	{
		return true;
	}
	return false;
}

inline function updateKeyboardColours()
{
	local i;

	//Reset old range key colours
	for (i = noteRange[0]; i <= noteRange[1]; i++)
	{
		Engine.setKeyColour(i, Colours.withAlpha(Colours.white, 0.0));
	}

	//Set new range key colours
	for (i = knbLow.getValue(); i <= knbHigh.getValue(); i++)
	{
		if (btnSkipBlack.getValue() == 1 && isBlackKey(i)) continue;
		if (btnSkipWhite.getValue() == 1 && !isBlackKey(i)) continue;

		Engine.setKeyColour(i, Colours.withAlpha(colours[cmbColour.getValue()-1], 0.38));
	}
}

//Callbacks
function onNoteOn()
{
	if (btnIgnore.getValue())
	{
		if (!inRange(Message.getNoteNumber(), noteRange[0], noteRange[1]) || (btnSkipBlack.getValue() == 1 && isBlackKey(Message.getNoteNumber())) || (btnSkipWhite.getValue() == 1 && !isBlackKey(Message.getNoteNumber())))
		{
			Message.ignoreEvent(true);
		}
	}
}

function onNoteOff()
{
	if (btnIgnore.getValue())
	{
		if (!inRange(Message.getNoteNumber(), noteRange[0], noteRange[1]) || (btnSkipBlack.getValue() == 1 && isBlackKey(Message.getNoteNumber())) || (btnSkipWhite.getValue() == 1 && !isBlackKey(Message.getNoteNumber())))
		{
			Message.ignoreEvent(true);
		}
	}
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
		case knbLow:
			updateKeyboardColours();
			noteRange[0] = value;
			if (value > knbHigh.getValue()) knbHigh.setValue(value);
		break;

		case knbHigh:
			updateKeyboardColours();
			noteRange[1] = value;
			if (value < knbLow.getValue()) knbLow.setValue(value);
		break;

		case cmbColour:
			updateKeyboardColours();
		break;

		case btnSkipBlack:
			btnSkipWhite.setValue(0);
			updateKeyboardColours();
		break;

		case btnSkipWhite:
			btnSkipBlack.setValue(0);
			updateKeyboardColours();
		break;
	}
}
