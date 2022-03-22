/**
 * Title: velocityFilter.js
 * Author: David Healey
 * Date: 07/09/2017
 * License: Public Domain
*/

Content.setWidth(650);
Content.setHeight(50);

const var min = Content.addKnob("Min", 0, 0);
min.setRange(1, 127, 1);
min.set("defaultValue", 1);

const var max = Content.addKnob("Max", 150, 0);
max.setRange(1, 127, 1);
max.set("defaultValue", 127);function onNoteOn()
{
	if (Message.getVelocity() < min.getValue() || Message.getVelocity() > max.getValue())
	{
		Message.ignoreEvent(true);
	}
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

}
