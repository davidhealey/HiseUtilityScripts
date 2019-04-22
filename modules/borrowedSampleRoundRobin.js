/*
    Copyright 2018, 2019 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this file. If not, see <http://www.gnu.org/licenses/>.
*/
Content.setWidth(730);
Content.setHeight(50);

reg lastTime = Engine.createMidiList(); //Track how long between notes
lastTime.fill(0);
reg lastRR = Engine.createMidiList(); //RR step number used for the last onNote

//Knobs used to set instrument's playable range
const var knbLowNote = Content.addKnob("knbLowNote", 0, 0); //Lowest playable note
knbLowNote.set("text", "Low Note");
knbLowNote.setRange(0, 127, 1);

const var knbHighNote = Content.addKnob("knbHighNote", 150, 0); //Highest playable note
knbHighNote.setRange(0, 127, 1);
knbHighNote.set("text", "High Note");
knbHighNote.set("defaultValue", 127);

const var knbReset = Content.addKnob("knbResetTime", 300, 0); //Time in seconds until RR reset
knbReset.setRange(1, 60, 1);
knbReset.set("text", "Reset Time");
knbReset.set("defaultValue", 3);

const var knbFine = Content.addKnob("knbFineTune", 450, 0);
knbFine.setRange(0, 50, 1);
knbFine.set("text", "Fine Tune");
knbFine.set("defaultValue", 0);

const var knbGain = Content.addKnob("knbGain", 600, 0);
knbGain.setRange(0, 3, 1);
knbGain.set("mode", "Decibel");
knbGain.set("text", "knbGain");
knbGain.set("defaultValue", 0);function onNoteOn()
{
    local n = Message.getNoteNumber();

    //Not legato and in playable range
	if (n >= knbLowNote.getValue() && n <= knbHighNote.getValue())
	{
	    local v = lastRR.getValue(n); //Transpose value

		if (Engine.getUptime() - lastTime.getValue(n) > knbReset.getValue()) //Reset time between notes
		{
			v = 1; //Reset RR counter
		}
		else
		{
		    local range = [0, 3];

            if (n == knbHighNote.getValue())
            {
                range[0] = 1;
                range[1] = 3;
            }
            else if (n == knbLowNote.getValue())
            {
                range[0] = 0;
                range[1] = 2;
            }

            v = Math.randInt(range[0], range[1]);

            //Generated RR is the same as the last RR
            if (lastRR.getValue(n) == v)
            {
                v = v + 1;
                if (v > range[1]-1) v = range[0];
                if (v < range[0]) v = range[1];
            }
        }

		lastRR.setValue(n, v); //Record the RR tranpose value for n
		lastTime.setValue(n, Engine.getUptime());

		Message.setTransposeAmount(1-v);
		Message.setCoarseDetune(Message.getCoarseDetune()+-(1-v));
	}

	if (knbFine.getValue() > 0)
        Message.setFineDetune(Message.getFineDetune() + Math.randInt(-knbFine.getValue(), knbFine.getValue()+1));

    if (knbGain.getValue() > 0)
        Message.setGain(Math.randInt(-knbGain.getValue(), knbGain.getValue()+1));
}function onNoteOff()
{
	if (knbFine.getValue() > 0)
        Message.setFineDetune(Message.getFineDetune() + Math.randInt(-knbFine.getValue(), knbFine.getValue()+1));

    if (knbGain.getValue() > 0)
        Message.setGain(Math.randInt(-knbGain.getValue(), knbGain.getValue()+1));
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
