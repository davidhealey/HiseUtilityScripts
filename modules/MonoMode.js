/*
The MIT License (MIT)

Copyright © 2017, 2018, 2019, 2020, 2021, 2022 David Healey

Permission is hereby granted, free of charge, to any person obtaining
a copy of this file (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
            if (time.getValue() > 0 && eventId != -1)
            {
                Message.ignoreEvent(true);                
                Synth.addPitchFade(eventId, time.getValue(), lastTuning + Message.getNoteNumber()-lastNote, 0);                    
                lastTuning = lastTuning + Message.getNoteNumber()-lastNote;
            }
            else
            {
                if (eventId != -1) Synth.noteOffByEventId(eventId);
                    
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