/*
    Copyright 2017, 2018, 2019 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

Content.setWidth(650);
Content.setHeight(50);

reg lastNote = 0;
reg eventId;
reg lastTuning = 0;

//GUI
const var time = Content.addKnob("Time", 0, 0);
time.setRange(0, 2000, 0.01);

function onNoteOn()
{
    if (lastNote == 0)
    {
        lastNote = Message.getNoteNumber();
        eventId = Message.makeArtificial();
    }
    else
    {
        if (time.getValue() > 0)
        {
            Message.ignoreEvent(true);
            Synth.addPitchFade(eventId, time.getValue(), lastTuning + Message.getNoteNumber()-lastNote, 0);
            lastTuning = lastTuning + Message.getNoteNumber()-lastNote;
        }
        else
        {
            Synth.noteOffByEventId(eventId);
            eventId = Message.makeArtificial();
        }
        lastNote = Message.getNoteNumber();
    }
}

function onNoteOff()
{
    Message.ignoreEvent(true);

    if (eventId != -1 && Message.getNoteNumber() == lastNote)
    {
        Synth.noteOffByEventId(eventId);
        eventId = -1;
    }

    if (!Synth.getNumPressedKeys())
    {
        lastNote = 0;
        lastTuning = 0;
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
