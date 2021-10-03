/*
    Copyright 2019, 2020, 2021 David Healey

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

const lastTime = Engine.createMidiList();
const lastStep = Engine.createMidiList();
const step = Engine.createMidiList();

lastTime.fill(0);
lastStep.fill(0);

const samplerIds = Synth.getIdList("Sampler");
const sampler = Synth.getSampler(samplerIds[0]); //Get first child sampler
sampler.enableRoundRobin(false);

//GUI

// Mute
const btnMute = Content.addButton("Mute", 10, 10);

const btnModes = [];

// Mode
btnModes[0] = Content.addButton("Group", 160, 10);
btnModes[1] = Content.addButton("Velocity", 310, 10);
btnModes[2] = Content.addButton("Borrowed", 460, 10);

for (i = 0; i < btnModes.length; i++)
    btnModes[i].setControlCallback(onbtnModesControl);

inline function onbtnModesControl(component, value)
{    
    btnRandom.showControl(btnModes[0].getValue() || btnModes[1].getValue());
    knbCount.showControl(btnModes[0].getValue() || btnModes[1].getValue());
    knbFirstGroup.showControl(btnModes[0].getValue());
    btnVelocityOffset.showControl(btnModes[1].getValue());
    btnVelocitySpread.showControl(btnModes[1].getValue());
}

// Random
const btnRandom = Content.addButton("Random", 10, 70);

// RR Count
const knbCount = Content.addKnob("Count", 10, 120);
knbCount.set("text", "Count");
knbCount.setRange(0, 30, 1);

// RR Lock
const knbLock = Content.addKnob("Lock", 610, 0);
knbLock.set("text", "Lock");
knbLock.setRange(0, 20, 1);

// Reset Tm
const knbReset = Content.addKnob("ResetTm", 610, 60);
knbReset.set("text", "Reset Tm");
knbReset.set("suffix", " seconds");
knbReset.setRange(0, 5, 1);

// Velocity offset in effect
const btnVelocityOffset = Content.addButton("VelocityOffset", 310, 70);
btnVelocityOffset.set("text", "Velocity Offset");

// Velocity spread
const btnVelocitySpread = Content.addButton("VelocitySpread", 310, 130);
btnVelocitySpread.set("text", "Velocity Spread");

// knbFirstGroup
const knbFirstGroup = Content.addKnob("FirstGroup", 160, 60);
knbFirstGroup.setControlCallback(onknbFirstGroupControl);
knbFirstGroup.setRange(1, 50, 1);
knbFirstGroup.set("text", "First Group");

inline function onknbFirstGroupControl(component, value)
{
	step.fill(0);
	lastStep.fill(0);
	lastTime.fill(0);
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
            sampler.setActiveGroup(knbFirstGroup.getValue() + s);

        //Velocity
        if (btnModes[1].getValue())
        {
            if (btnVelocitySpread.getValue())
                Message.setVelocity(128 / knbCount.getValue() * s + 1);
            else
                Message.setVelocity(v * btnVelocityOffset.getValue() + s + 1);
        }

        //Borrowed
        if (btnModes[2].getValue())
        {
            if (!knbLock.getValue())
                s = (s - 1 + Math.randInt(2, 4)) % 3;

            if (!sampler.isNoteNumberMapped(n + (s - 1)))
                s = 1;

            Message.setTransposeAmount(s - 1 + Message.getTransposeAmount());
            Message.setCoarseDetune(-(s - 1) + Message.getCoarseDetune());
        }

        //Get next step for group and velocity based
        if (!knbLock.getValue() && (btnModes[0].getValue() || btnModes[1].getValue()))
        {
            if (knbCount.getValue() > 1)
            {
                if (!btnRandom.getValue()) //Cycle
                    s = (s + 1) % knbCount.getValue();
                else //Random
                    s = (lastStep.getValue(n) - 1 + Math.randInt(2, knbCount.getValue() + 1)) % knbCount.getValue();
            }
            else
            {
                s = 0;
            }
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
 