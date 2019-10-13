/**
 * Title: globalVariables.js
 * Author: David Healey
 * License: Public Domain
*/

/*Should be placed directly after interface script*/

global g_realVelocity; //Keeps track of velocity as it comes into the chain
global g_keys = 0; //Keeps track of number of pressed keys - avoids issues with artificial notes
function onNoteOn()
{
	g_realVelocity = Message.getVelocity();
	g_keys++;
}
 function onNoteOff()
{
	g_keys--;
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
