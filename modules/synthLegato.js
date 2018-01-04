/**
 * Title: synthLegato.js
 * Author: David Healey
 * Date: 02/07/2017
 * Modified: 02/07/2017
 * License: Public Domain
*/

Content.setWidth(650);
Content.setHeight(50);

reg lastNote = -1;
reg eventId;
reg tuning;

//GUI
const var bypass = Content.addButton("Bypass", 0, 10);
const var time = Content.addKnob("Time", 150, 0);
time.setRange(0, 2000, 0.01);

function onNoteOn()
{
	if (bypass.getValue() == 0)
	{
		if (lastNote == -1)
		{
			lastNote = Message.getNoteNumber();
			eventId = Message.getEventId();
		}
		else
		{
			Message.ignoreEvent(true);
			Synth.addPitchFade(eventId, time.getValue(), Message.getNoteNumber()-lastNote, 0);
		}
	}
}

function onNoteOff()
{
	if (bypass.getValue() == 0)
	{
		Message.ignoreEvent(true);

		if (!Synth.getNumPressedKeys() && eventId != -1)
		{
			lastNote = -1;
			eventId = -1;
			Engine.allNotesOff();
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
}
