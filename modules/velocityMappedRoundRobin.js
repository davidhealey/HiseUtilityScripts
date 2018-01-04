/**
 * Title: velocityMappedRoundRobin.js
 * Author: David Healey
 * Date: 31/10/2017
 * Modified: 31/10/2017
 * License: Public Domain
*/

/*Instructions:
Map each round robin sample to a single velocity range i.e 0-1, 2-3, 4-5.
Always start with 0-1 for RR1 and work up from there.
*/

reg rrStep = -1;

Content.setWidth(650);
Content.setHeight(50);

//Knob to lock to a specific RR - essentially disabling the round robin functionality - useful for finding duff samples
const var knbRRLock = Content.addKnob("knbRRLock", 0, 0);
knbRRLock.set("text", "Lock to RR");
knbRRLock.setRange(0, 50, 1);

const var btnRandom = Content.addButton("btnRandom", 150, 10);
btnRandom.set("text", "Random");

const var knbNumRR = Content.addKnob("knbNumRR", 300, 0);
knbNumRR.set("text", "Num RR");
knbNumRR.setRange(1, 50, 1);

function onNoteOn()
{
	if (knbRRLock.getValue() == 0) //RR not locked
	{
		if (!btnRandom.getValue())
		{
			rrStep = rrStep + 2;  //Each RR covers a velocity range of 2 (0-1, 2-3, 4-5, etc.)
			if (rrStep > knbNumRR.getValue()*2-1) rrStep = 1;
		}
		else
		{
			rrStep = Math.randInt(1, knbNumRR.getValue()+1);
			rrStep = rrStep * 2 - 1;
		}
	}
	else
	{
		rrStep = knbRRLock.getValue() * 2 - 1;
	}

	Message.setVelocity(rrStep);
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
