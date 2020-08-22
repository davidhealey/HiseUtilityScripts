/**
 * Title: cc64Retrigger
 * Author: David Healey
 * Date: 28/03/2017
 * Updated: 22/08/2020
 * License: Public Domain
*/

//INIT
Content.setWidth(650);

const var eventId = Engine.createMidiList();
eventId.fill(-99);

const var btnMute = Content.addButton("Mute", 10, 10);
const var velocities = Engine.createMidiList();

//FUNCTIONS

//CALLBACKS
function onNoteOn()
{
    local n = Message.getNoteNumber();

    //Turn off retriggered note if there is one
    if (eventId.getValue(n) != -99)
    {
        Synth.noteOffByEventId(eventId.getValue(n));
        eventId.setValue(n, -99);
    }

	velocities.setValue(n, Message.getVelocity());
}function onNoteOff()
{
	if (!btnMute.getValue())
	{
        local n = Message.getNoteNumber();

	    if (Synth.isSustainPedalDown() && velocities.getValue(n) > 0)
	    {
            if (eventId.getValue(n) != -99)
	        {
                Synth.noteOffByEventId(eventId.getValue(n));
                eventId.setValue(n, -99);
	        }

            eventId.setValue(n, Synth.playNote(n, velocities.getValue(n)));
	    }
	}
}function onController()
{
    if (Message.getControllerNumber() == 64)
    {
        Message.ignoreEvent(true);

		if (!Synth.isSustainPedalDown())
        {
            Engine.allNotesOff();
            eventId.fill(-99);
        }
    }
}function onTimer()
{

}
 function onControl(number, value)
{

}
