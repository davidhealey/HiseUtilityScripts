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

Content.setHeight(100);

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
const var btnBypass = Content.addButton("btnBypass", 10, 10);
btnBypass.set("text", "Bypass");

const var modes = ["Group", "Group Random", "Velocity", "Velocity Random", "Borrowed", "Borrowed Random"];
const var cmbType = Content.addComboBox("cmbType", 160, 10);
cmbType.set("items", modes.join("\n"));

const var knbCount = Content.addKnob("knbCount", 310, 0);
knbCount.set("text", "Num RRs");
knbCount.setRange(0, 50, 1);

const var knbLock = Content.addKnob("knbLock", 460, 0);
knbLock.set("text", "Lock Step");
knbLock.setRange(0, 50, 1);

const var knbReset = Content.addKnob("knbReset", 0, 45);
knbReset.set("text", "Reset Tm");
knbReset.set("suffix", " seconds");
knbReset.setRange(0, 5, 1);

const var knbLoNote = Content.addKnob("knbLoNote", 160, 45);
knbLoNote.set("text", "Low Note");
knbLoNote.setRange(0, 127, 1);
knbLoNote.setControlCallback(onknbLoNoteControl);

inline function onknbLoNoteControl(component, value)
{
	low = value;
};

const var knbHiNote = Content.addKnob("knbHiNote", 310, 45);
knbHiNote.set("text", "High Note");
knbHiNote.setRange(0, 127, 1);
knbHiNote.setControlCallback(onknbHiNoteControl);

inline function onknbHiNoteControl(component, value)
{
	high = value;
};

inline function oncmbTypeControl(component, value)
{
    knbCount.showControl(value != 5 && value != 6); //Hide for borrowed mode
    knbLoNote.showControl(value == 5 || value == 6);
    knbHiNote.showControl(value == 5 || value == 6);
    btnVelocityOffset.showControl(value == 3 || value == 4); //Only show for velocity modes
	sampler.enableRoundRobin(value != 1 && value != 2);
};

cmbType.setControlCallback(oncmbTypeControl);

//knbVelocity
const var btnVelocityOffset = Content.addButton("btnVelocityOffset", 470, 55);
btnVelocityOffset.set("text", "Velocity Offset");function onNoteOn()
{
    if (!btnBypass.getValue())
    {
        local n = Message.getNoteNumber();
        local t = Message.getTransposeAmount();
        local s = lastStep.getValue(n);

        //RR Reset
        if (knbReset.getValue() > 0 && (Engine.getUptime() - lastTime.getValue(n)) >= knbReset.getValue())
        {
            lastStep.setValue(n, 0);
            s = 0;
        }   

        //Borrowed
        if ([5, 6].indexOf(cmbType.getValue()) != -1)
        {
            if (cmbType.getValue() == 5) //Cycle
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

        //Lock to RR
        if (knbLock.getValue() > 0)
            s = knbLock.getValue();

        switch (cmbType.getValue())
        {
            case 1: case 2: //Group
                sampler.setActiveGroup(s+1);
            break;

            case 3: case 4: //Velocity
                local v = (Message.getVelocity() * btnVelocityOffset.getValue()) + s;
                Message.setVelocity(v);
            break;

            case 5: case 6: //Borrowed
                Message.setTransposeAmount(s-1 + t);
                Message.setCoarseDetune(-(s-1) + Message.getCoarseDetune());
            break;
        }

        //Get next step
        if (knbLock.getValue() == 0)
        {
            if ([5, 6].indexOf(cmbType.getValue()) == -1)  //Group and velocity
            {
                if (knbCount.getValue() > 1)
                {
                    if ([1, 3].indexOf(cmbType.getValue()) != -1) //Cycle
                        s = (s + 1) % knbCount.getValue();
                    else //Random
                        s = (lastStep.getValue(n) - 1 + Math.randInt(2, knbCount.getValue()+1)) % knbCount.getValue();
                }
                else
                    s = 0;
            }
        }

        lastTime.setValue(n, Engine.getUptime());
        lastStep.setValue(n, s);
    }
}
function onNoteOff()
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
 