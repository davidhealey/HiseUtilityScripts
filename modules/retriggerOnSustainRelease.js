/**
 * Title: retriggerOnRelease
 * Author: David Healey
 * Date: 28/03/2017
 * License: Public Domain
*/

//INIT
Content.setWidth(650);

const var velocities = Engine.createMidiList();

//FUNCTIONS

//CALLBACKS
function onNoteOn()
{
	velocities.setValue(Message.getNoteNumber(), Message.getVelocity());
}

function onNoteOff()
{
	if (Synth.isSustainPedalDown())
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
