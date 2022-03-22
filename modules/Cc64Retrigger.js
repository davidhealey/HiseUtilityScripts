/*
    Copyright 2020 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this file. If not, see <http://www.gnu.org/licenses/>.
*/

//INIT
Content.setWidth(650);

const var eventId = Engine.createMidiList();
eventId.fill(-99);

const var heldKeys = [];

const var btnMute = Content.addButton("Mute", 10, 10);
const var velocities = Engine.createMidiList();

const var async = Engine.createTimerObject();
async.setTimerCallback(function(){
    
    for (i = 0; i < 127; i++)
    {
        if (eventId.getValue(i) != -99 && heldKeys.indexOf(i) == -1)
        {
            Synth.noteOffByEventId(eventId.getValue(i));
            eventId.setValue(i, -99);
        }
    }
    
    async.stopTimer();
});function onNoteOn()
{
    if (!btnMute.getValue() && Synth.isSustainPedalDown())
    {
        local n = Message.getNoteNumber();

        //Turn off retriggered note if there is one
        if (eventId.getValue(n) != -99)
        {
            Synth.noteOffByEventId(eventId.getValue(n));
            eventId.setValue(n, -99);
        }
    
        velocities.setValue(n, Message.getVelocity());
        heldKeys.push(n);
        async.startTimer(20); //Turn off old notes
    }
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
            heldKeys.remove(n);
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
