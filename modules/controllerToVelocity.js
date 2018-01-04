/**
 * Title: controllerToVelocity.js
 * Author: David Healey
 * Date: 30/06/2017
 * Modified: 30/06/2017
 * License: Public Domain
*/

Content.setWidth(650);
Content.setHeight(50);

const var knbCC = Content.addKnob("CC Number", 0, 0);
knbCC.setRange(1, 127, 1);

reg lastCCValue = 1;


function onNoteOn()
{
	Message.setVelocity(lastCCValue);
}

function onNoteOff()
{
}

function onController()
{
	if (Message.getControllerNumber() == knbCC.getValue())
	{
		lastCCValue = Math.max(1, Message.getControllerValue());
	}
}

function onTimer()
{
}

function onControl(number, value)
{
}
