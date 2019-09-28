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

Content.setHeight(100);

const var lastTime = Engine.createMidiList();
const var lastStep = Engine.createMidiList();
const var step = Engine.createMidiList();

lastTime.fill(0);
lastStep.fill(1);

const var samplerIds = Synth.getIdList("Sampler");
const var sampler = Synth.getSampler(samplerIds[0]); //Get first child sampler

//GUI
const var modes = ["Group", "Group Random", "Velocity", "Velocity Random", "Borrowed", "Borrowed Random"];
const var cmbType = Content.addComboBox("cmbType", 10, 10);
cmbType.set("items", modes.join("\n"));

const var knbCount = Content.addKnob("knbCount", 160, 0);
knbCount.set("text", "Num RRs");
knbCount.setRange(0, 50, 1);

const var knbLock = Content.addKnob("knbLock", 310, 0);
knbLock.set("text", "Lock Step");
knbLock.setRange(0, 50, 1);

const var knbReset = Content.addKnob("knbReset", 460, 0);
knbReset.set("text", "Reset Tm");
knbReset.set("suffix", " seconds");
knbReset.setRange(0, 5, 1);

const var knbLoNote = Content.addKnob("knbLoNote", 0, 45);
knbLoNote.set("text", "Low Note");
knbLoNote.setRange(0, 127, 1);

const var knbHiNote = Content.addKnob("knbHiNote", 160, 45);
knbHiNote.set("text", "High Note");
knbHiNote.setRange(0, 127, 1);

inline function oncmbTypeControl(component, value)
{
    knbCount.showControl(value != 5 && value != 6); //Hide for borrowed mode
	sampler.enableRoundRobin(value != 1 && value != 2);
};

cmbType.setControlCallback(oncmbTypeControl);function onNoteOn()
{
    local n = Message.getNoteNumber();
    local t = Message.getTransposeAmount();
    local s = lastStep.getValue(n);

    if (knbLock.getValue() > 0)
        s = knbLock.getValue();

    switch (cmbType.getValue())
    {
        case 1: case 2: //Group
            sampler.setActiveGroup(s+1);
        break;

        case 3: case 4: //Velocity
            Message.setVelocity(s);
        break;

        case 5: case 6: //Borrowed
            Message.setTransposeAmount(s-1 + t);
            Message.setCoarseDetune(-(s-1) + Message.getCoarseDetune());
        break;
    }

    //Get next step
    if (knbLock.getValue() == 0)
    {
        //Borrowed
        if ([5, 6].indexOf(cmbType.getValue()) != -1)
        {
            if (cmbType.getValue() == 5) //Cycle
                s = (s + 1) % 3;
            else //Random
                s = Math.randInt(0, 3);

            //Non-repeating
            if (s == lastStep.getValue(n))
                s = (s + 1) % 3;

            //Range limit (handles non-repeating too)
            if (n == knbLoNote.getValue() - t && s < 1)
                s = 1 + (1 == lastStep.getValue(n));
            else if (n == knbHiNote.getValue() - t && s)
                s = 1 + -(1 == lastStep.getValue(n));

        }
        else if (knbCount.getValue() > 1) //Group and velocity
        {
            if ([1, 3].indexOf(cmbType.getValue()) != -1) //Cycle
                s = (s + 1) % knbCount.getValue();
            else //Random
                s = Math.randInt(1, knbCount.getValue() + 1);

            //Non-repeating
            if (s == lastStep.getValue(n))
                s = (s + 1) % knbCount.getValue();
        }
        else
            s = 0;

        //RR Reset
        if (knbReset.getValue() > 0 && (Engine.getUptime() - lastTime.getValue(n)) >= knbReset.getValue())
            s = 1;
    }

    lastTime.setValue(n, Engine.getUptime());
    lastStep.setValue(n, s);
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
