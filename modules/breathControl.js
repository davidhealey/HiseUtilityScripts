/*
    Copyright 2019 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with This file. If not, see <http://www.gnu.org/licenses/>.
*/

Content.setWidth(730);
Content.setHeight(50);

reg eventId = -1;
reg ccValue = 0;
reg lastValue = 0;
reg ccNumber = 2;
reg threshold = 20;
reg lastTime = 0;
reg channel;
reg note = -1;
reg velocity;
reg offset = 0;
reg fineDetune = 0;
reg coarseDetune = 0;

inline function getVelocity()
{
    local timeDiff = Math.min(1, Engine.getUptime()-lastTime) / 1; //Limit timeDiff to 0-1
    local v = Math.pow(timeDiff, 0.2); //Skew values
    velocity = parseInt(127-(v*117));

    lastTime = 0;
}function onNoteOn()
{
    if (eventId != -1)
    {
        Synth.noteOffByEventId(eventId);
        eventId = -1;
    }

    ccValue > 2 ? eventId = Message.makeArtificial() : Message.ignoreEvent(true);

	channel = Message.getChannel();
	note = Message.getNoteNumber();
	velocity = Message.getVelocity();
	fineDetune = Message.getFineDetune();
	coarseDetune = Message.getCoarseDetune();
}function onNoteOff()
{
	if (Message.getNoteNumber() == note)
    {
        note = -1;
        lastTime = 0;
        if (eventId != -1)
        {
            Synth.noteOffByEventId(eventId);
            eventId = -1;
        }
    }
}
function onController()
{
    if (Message.getControllerNumber() == ccNumber)
    {
        ccValue = Message.getControllerValue();

        //Going up but haven't reached threshold
        if (ccValue < threshold && ccValue > lastValue && lastTime == 0 && note != -1)
        {
            lastTime = Engine.getUptime();
        }

        if (ccValue >= threshold && lastValue < threshold && lastTime > 0 && note != -1) //Going up and reached the threshold
        {
            //Calculate velocity
            getVelocity();

            if (eventId != -1)
            {
                Synth.noteOffByEventId(eventId); //Turn off old note
            }

            eventId = Synth.playNoteWithStartOffset(channel, note, velocity, offset);
        }

        if (ccValue < 2 && eventId != -1)
        {
            Synth.noteOffByEventId(eventId);
            eventId = -1;
        }

        lastValue = ccValue;
    }
}
function onTimer()
{

}
function onControl(number, value)
{

}
 
