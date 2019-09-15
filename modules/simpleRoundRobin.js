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


const var samplerIds = Synth.getIdList("Sampler");
const var sampler = Synth.getSampler(samplerIds[0]); //Get first child sampler

//GUI
const var cmbType = Content.addComboBox("cmbType", 10, 10);
cmbType.set("items", ["Group Based", "Velocity Based"].join("\n"));

const var knbCount = Content.addKnob("knbCount", 160, 0);
knbCount.set("text", "Num RRs");
knbCount.setRange(0, 50, 1);

//RR step counter
reg step = 0;

inline function oncmbTypeControl(component, value)
{
	sampler.enableRoundRobin(value != 1);
};

cmbType.setControlCallback(oncmbTypeControl);
function onNoteOn()
{
    if (cmbType.getValue() == 1)
        sampler.setActiveGroup(step);// Group based
    else
        Message.setVelocity(step);// Velocity based

    if (knbCount.getValue() > 1)
        step = Math.randInt(1, knbCount.getValue()+1);
    else
        step = 0;
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
