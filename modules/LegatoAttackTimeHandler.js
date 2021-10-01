/*
    Copyright 2021 David Healey

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

Synth.deferCallbacks(true);

reg attack;
reg lastAttack;
reg lastTime;
reg lastNote;

// Table Envelopes
const envelopes = [];
const envelopeIds = Synth.getIdList("Table Envelope");

for (id in envelopeIds)
	envelopes.push(Synth.getModulator(id));
	
// knbMax
const knbMax = Content.addKnob("Max", 0, 0);
knbMax.set("text", "Max");
knbMax.setRange(50, 1000, 1);
knbMax.set("suffix", "ms");

// cmbEnvelope
const cmbEnvelope = [];
cmbEnvelope.push(Content.addComboBox("Envelope 1", 150, 10));
cmbEnvelope.push(Content.addComboBox("Envelope 2", 300, 10));

cmbEnvelope[0].set("items", envelopeIds.join("\n"));
cmbEnvelope[1].set("items", envelopeIds.join("\n"));function onNoteOn()
{
    local n = Message.getNoteNumber();
    local v = Message.getVelocity();

    attack = knbMax.getValue();

    if (v > 20)
    {
        if (Synth.isLegatoInterval() && n != lastNote)
        {
            attack = knbMax.getValue() / 2;
        }   
        else
        {
            if (Engine.getUptime() - lastTime < 0.2)
                attack = knbMax.getValue() / 3;
            else if (Engine.getUptime() - lastTime < 0.6)
                attack = knbMax.getValue() / 2;
        }
    }
    
    if (attack != lastAttack)
    {
        for (x in cmbEnvelope)
	        envelopes[x.getValue() - 1].setAttribute(envelopes[0].Attack, attack);
    }
        
    lastAttack = attack;
    lastTime = Engine.getUptime();
    lastNote = n;
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
 