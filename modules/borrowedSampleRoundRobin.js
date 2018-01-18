/**
 * Title: borrowedSampleRoundRobin.js
 * Author: David Healey
 * Date: 17/11/2017
 * Modified: 17/11/2017
 * License: Public Domain
*/

reg rrStep = -1;
reg lastRR = -1; //RR step number used for the last onNote
reg lastTime = 0; //Track how long between notes

Content.setWidth(650);
Content.setHeight(50);

const var btnBypass = Content.addButton("Bypass", 0, 10); //Script bypass

const var btnRandom = Content.addButton("Random", 150, 10); //Random mode button

//Knobs used to set instrument's playable range
const var knbLowNote = Content.addKnob("Low Note", 300, 0); //Lowest playable note
knbLowNote.setRange(0, 127, 1);

const var knbHighNote = Content.addKnob("High Note", 450, 0); //Highest playable note
knbHighNote.setRange(0, 127, 1);
knbHighNote.set("defaultValue", 127);function onNoteOn()
{
	if (!btnBypass.getValue() && (Message.getNoteNumber() >= knbLowNote.getValue() && Message.getNoteNumber() <= knbHighNote.getValue())) //Not bypassed and note in range
	{
		if (Engine.getUptime() - lastTime > 2) //More than 2 seconds between notes
		{
			rrStep = 1; //Reset RR counter
		}
		else
		{
			//Random RR
			if (btnRandom.getValue())
			{
				rrStep = Math.randInt(0, 2);
			}

			//Random is disabled, or the randomly generated RR is the same as the last RR
			if (!btnRandom.getValue() || lastRR == rrStep)
			{
				rrStep = (rrStep + 1) % 3; //Max of 3 RRs
			}

			//Prevent rrStep resulting in note outside of playable range
			if (Message.getNoteNumber()+(1-rrStep) < knbLowNote.getValue())
			{
				rrStep = -1;
			}
			else if (Message.getNoteNumber()+(1-rrStep) > knbHighNote.getValue())
			{
				rrStep = 3;
			}
		}

		lastRR = rrStep; //Make a note of the RR number for next time
		lastTime = Engine.getUptime();

		Message.setTransposeAmount(1-rrStep); //Use transpose rather than change note, this can be picked up by later scripts if needed
		Message.setCoarseDetune(-(1-rrStep)); //This can also be picked up by later scripts if needed using .getCoarseDetune
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
