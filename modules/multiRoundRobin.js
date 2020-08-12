/*
    Copyright 2019, 2020 David Healey

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

Content.setHeight(250);
Content.setWidth(750);

//Low and high note variables, set by knobs
reg low = 0;
reg high = 127;

const var lastTime = Engine.createMidiList();
const var lastStep = Engine.createMidiList();
const var step = Engine.createMidiList();

lastTime.fill(0);
lastStep.fill(0);

const var samplerIds = Synth.getIdList("Sampler");
const var sampler = Synth.getSampler(samplerIds[0]); //Get first child sampler

//GUI

//Mute
const var btnMute = Content.addButton("Mute", 10, 10);

//Random
const var btnRandom = Content.addButton("Random", 160, 10);

const var btnModes = [];

//Group mode
btnModes[0] = Content.addButton("Group", 10, 60);

//velocity mode
btnModes[1] = Content.addButton("Velocity", 160, 60);

//Borrowed mode
btnModes[2] = Content.addButton("Borrowed", 310, 60);

for (i = 0; i < btnModes.length; i++)
    btnModes[i].setControlCallback(onbtnModesControl);

//RR Count
const var knbCount = Content.addKnob("Count", 310, 0);
knbCount.set("text", "Count");
knbCount.setRange(0, 50, 1);

//Reset Tm
const var knbReset = Content.addKnob("ResetTm", 460, 0);
knbReset.set("text", "Reset Tm");
knbReset.set("suffix", " seconds");
knbReset.setRange(0, 5, 1);

//RR Lock
const var knbLock = Content.addKnob("Lock", 610, 0);
knbLock.set("text", "Lock");
knbLock.setRange(0, 20, 1);

//Borrowed lowest note
const var knbLoNote = Content.addKnob("LowNote", 310, 100);
knbLoNote.set("text", "Low Note");
knbLoNote.setRange(0, 127, 1);
knbLoNote.setControlCallback(onknbLoNoteControl);

//Borrowed highest note
const var knbHiNote = Content.addKnob("HighNote", 310, 150);
knbHiNote.set("text", "High Note");
knbHiNote.setRange(0, 127, 1);
knbHiNote.setControlCallback(onknbHiNoteControl);

//Velocity offset in effect
const var btnVelocityOffset = Content.addButton("VelocityOffset", 160, 110);
btnVelocityOffset.set("text", "Velocity Offset");

//UI Callbacks
inline function onknbLoNoteControl(component, value)
{
	low = value;
}

inline function onknbHiNoteControl(component, value)
{
	high = value;
}

inline function onbtnModesControl(component, value)
{
    knbCount.showControl(btnModes[0].getValue() || btnModes[1].getValue());
    knbLoNote.showControl(btnModes[2].getValue());
    knbHiNote.showControl(btnModes[2].getValue());
    btnVelocityOffset.showControl(btnModes[1].getValue());
    sampler.enableRoundRobin(btnModes[0].getValue());
}function onNoteOn()
{
    if (!btnMute.getValue() && (btnModes[0].getValue() || btnModes[1].getValue() || btnModes[2].getValue()))
    {
        local n = Message.getNoteNumber();
        local v = Message.getVelocity();
        local s = lastStep.getValue(Message.getNoteNumber());

        //RR Reset
        if (knbReset.getValue() > 0 && (Engine.getUptime() - lastTime.getValue(n)) >= knbReset.getValue())
        {
            lastStep.setValue(n, 0);
            s = 0;
        }

        //Lock to RR
        if (knbLock.getValue() > 0)
            s = knbLock.getValue() - 1;

        //Group
        if (btnModes[0].getValue())
            sampler.setActiveGroup(s+1);

        //Velocity
        if (btnModes[1].getValue())
            Message.setVelocity(v * btnVelocityOffset.getValue() + s);

        //Borrowed
        if (btnModes[2].getValue())
        {
            if (!knbLock.getValue())
            {
                if (!btnRandom.getValue()) //Cycle
                    s = (s + 1) % 3;
                else //Random non-repeating within playable range
                {
                    switch (n)
                    {
                        case low:
                            s == 1 ? s = 2 : s = 1;
                        break;

                        case high:
                            s == 1 ? s = 0 : s = 1;
                        break;

                        default:
                            s = (s - 1 + Math.randInt(2, 4)) % 3;
                    }
                }
            }

            Message.setTransposeAmount(s-1 + Message.getTransposeAmount());
            Message.setCoarseDetune(-(s-1) + Message.getCoarseDetune());
        }

        //Get next step for group and velocity based
        if (!knbLock.getValue() && (btnModes[0].getValue() || btnModes[1].getValue()))
        {
            if (knbCount.getValue() > 1)
            {
                if (!btnRandom.getValue()) //Cycle
                    s = (s + 1) % knbCount.getValue();
                else //Random
                    s = (lastStep.getValue(n) - 1 + Math.randInt(2, knbCount.getValue()+1)) % knbCount.getValue();
            }
            else
                s = 0;
        }

        lastTime.setValue(n, Engine.getUptime());
        lastStep.setValue(n, s);
    }
}function onNoteOff()
{

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
