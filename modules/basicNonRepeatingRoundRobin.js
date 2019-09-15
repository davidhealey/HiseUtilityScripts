/**
 * Title: basicRoundRobin.js
 * Author: David Healey
 * Date: 02/01/2018
 * License: GPL V3.0
*/

Content.setHeight(50);
Content.setWidth(650);

const var samplerIds = Synth.getIdList("Sampler");
const var childSamplers = [];
reg rr = -1;
reg lastRR = -1; //RR step number used for the last onNote
reg lastTime = 0; //Track how long between notes

const var btnBypass = Content.addButton("Bypass", 0, 10); //Script bypass
const var btnRandom = Content.addButton("Random", 150, 10); //Random mode button
const var knbGroups = Content.addKnob("Groups", 300, 0); //Number of groups
knbGroups.setRange(0, 100, 1);

for (id in samplerIds)
{
    childSamplers.push(Synth.getSampler(id)); //Get child sampler
    childSamplers[childSamplers.length-1].enableRoundRobin(false); //Disable default RR behaviour
}function onNoteOn()
{
	if (!btnBypass.getValue()) //Not bypassed and note in range
	{
    if (Engine.getUptime() - lastTime > 2) //More than 2 seconds between notes
    {
      rr = -1; //Reset RR counter
    }
    else
    {
  		//Random RR
  		if (btnRandom.getValue())
  		{
  			rr = Math.randInt(0, parseInt(knbGroups.getValue()));
  		}

  		//Random is disabled, or the randomly generated RR is the same as the last RR
  		if (!btnRandom.getValue() || lastRR == rr)
  		{
  			rr = (rr + 1) % parseInt(knbGroups.getValue());
  		}
    }

		lastRR = rr; //Make a note of the RR number for next time
    lastTime = Engine.getUptime();

		for (s in childSamplers)
	    {
	        s.setActiveGroup(rr+1);
	    }
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
