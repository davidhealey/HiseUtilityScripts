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
reg lastTime = Engine.createMidiList(); //Track how long between notes
lastTime.fill(0);
reg lastRR = Engine.createMidiList(); //RR step number used for the last onNote

Content.setWidth(730);
Content.setHeight(50);

const var btnEnable = Content.addButton("Enable", 0, 10); //Script bypass

const var btnRandom = Content.addButton("Random", 150, 10); //Random mode button

//Knobs used to set instrument's playable range
const var knbLowNote = Content.addKnob("Low Note", 300, 0); //Lowest playable note
knbLowNote.setRange(0, 127, 1);

const var knbHighNote = Content.addKnob("High Note", 450, 0); //Highest playable note
knbHighNote.setRange(0, 127, 1);
knbHighNote.set("defaultValue", 127);

const var knbReset = Content.addKnob("Reset Time", 600, 0); //Time in seconds until RR reset
knbReset.setRange(1, 60, 1);
knbReset.set("defaultValue", 3);function onNoteOn()
{
    local n = Message.getNoteNumber();

	if (btnEnable.getValue() && (n >= knbLowNote.getValue() && n <= knbHighNote.getValue())) //Not bypassed and note in range
	{
	    local v = lastRR.getValue(n); //Transpose value

		if (Engine.getUptime() - lastTime.getValue(n) > knbReset.getValue()) //Reset time between notes
		{
			v = 1; //Reset RR counter
		}
		else
		{
		    local range = [0, 3];

		    switch(n)
            {
                case knbHighNote.getValue(): //Highest note
                    range[0] = 1;
                    range[1] = 3;
                break;

                case knbLowNote.getValue(): //Lowest note
                    range[0] = 0;
                    range[1] = 2;
                break;
            }

			//Random RR
			if (btnRandom.getValue())
			{
                v = Math.randInt(range[0], range[1]);
			}

			//Random is disabled, or the randomly generated RR is the same as the last RR
			if (!btnRandom.getValue() || lastRR.getValue(n) == v)
			{
			    v = v + 1;
			    if (v > range[1]-1) v = range[0];
			    if (v < range[0]) v = range[1];
			}
		}

		lastRR.setValue(n, v); //Record the RR tranpose value for n
		lastTime.setValue(n, Engine.getUptime());

		Message.setTransposeAmount(1-v);
		Message.setCoarseDetune(-(1-v)); //This can be picked up by later scripts
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
 
