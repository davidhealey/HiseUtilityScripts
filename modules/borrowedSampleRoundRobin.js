/**
 * Title: borrowedSampleRoundRobin.js
 * Author: David Healey
 * Date: 17/11/2017
 * Modified: 15/01/2019
 * License: Public Domain
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
			//Random RR
			if (btnRandom.getValue())
			{
				v = Math.randInt(0, 2);
			}

			//Random is disabled, or the randomly generated RR is the same as the last RR
			if (!btnRandom.getValue() || lastRR.getValue(n) == v)
			{
				v = (v + 1) % 3; //Max of 3 RRs
			}

			//Prevent rrStep resulting in note outside of playable range
			if (n+v < knbLowNote.getValue())
			{
				v = -1;
			}
			else if (n+v > knbHighNote.getValue())
			{
				v = 3;
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
