/**
 * Title: cc64Retrigger
 * Author: David Healey
 * Date: 28/03/2017
 * Updated: 13/08/2020
 * License: Public Domain
*/

//INIT
Content.setWidth(650);

const var btnMute = Content.addButton("Mute", 10, 10);

const var velocities = Engine.createMidiList();

//FUNCTIONS

//CALLBACKS
function onNoteOn()
{
	velocities.setValue(Message.getNoteNumber(), Message.getVelocity());
}

function onNoteOff()
{
	if (!btnMute.getValue() && (Synth.isSustainPedalDown() && velocities.getValue(Message.getNoteNumber()) > 0))
	{
		Synth.playNote(Message.getNoteNumber(), velocities.getValue(Message.getNoteNumber()));
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

}

