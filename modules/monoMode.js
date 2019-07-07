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

reg lastNote = -1;
reg retrigger = -1;
reg eventId;
reg lastTuning = 0;

//GUI
const var bypass = Content.addButton("Bypass", 10, 10);

const var time = Content.addKnob("Time", 160, 0);
time.setRange(0, 2000, 0.01);

function onNoteOn()
{
    if (!bypass.getValue())
    {
        if (lastNote == -1)
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
                if (eventId != -1)
                    Synth.noteOffByEventId(eventId);
                    
                eventId = Message.makeArtificial();
            }
            retrigger = lastNote;
            lastNote = Message.getNoteNumber();
        }
    }
}

function onNoteOff()
{
    if (!bypass.getValue())
    {
        Message.ignoreEvent(true);

        if (eventId != -1 && Message.getNoteNumber() == lastNote)
        {
          if (Synth.isKeyDown(retrigger))
          {
              Synth.addPitchFade(eventId, time.getValue(), 0, 0);
              lastTuning = 0;
              lastNote = retrigger;
              retrigger = -1;
          }
          else
          {
              Synth.noteOffByEventId(eventId);
              eventId = -1; 
          }
        }

        if (!Synth.getNumPressedKeys())
        {
            lastNote = -1;
            lastTuning = 0;
        }
    }
    else if (eventId != -1 && eventId != undefined)
    {
        Synth.noteOffByEventId(eventId);
        eventId = -1;
        lastNote = -1;
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