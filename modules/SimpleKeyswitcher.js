/**
 * Title: Simple Keyswitcher.js
 * Author: David Healey
 * Date: 11/10/2020
 * License: Public Domain (CC0)
*/

//Get first sampler
const var synthIds = Synth.getIdList("Sampler");
const var sampler = Synth.getSampler(synthIds[0])

//Disable default round robin
sampler.enableRoundRobin(false);

reg ks = [];
reg currentGroup = 1;

//GUI
const var Groups = Content.addKnob("Groups", 0, 0);
Groups.setRange(0, 50, 1);
Groups.set("text", "Num Groups");
Groups.setControlCallback(update);

const var FirstKs = Content.addKnob("FirstKs", 150, 0);
FirstKs.setRange(0, 127, 1);
FirstKs.set("defaultValue", 24);
FirstKs.set("text", "First KS");
FirstKs.setControlCallback(update);

inline function update(component, value)
{
    //Clear old keyswitches
	for (i = 0; i < ks.length; i++)
        Engine.setKeyColour(ks[i], Colours.transparentWhite);
        
    //Get new keyswitches
    ks = [];    
    for (i = 0; i < Groups.getValue(); i++)
    {
        ks[i] = FirstKs.getValue() + i;
        Engine.setKeyColour(ks[i], Colours.withAlpha(Colours.red, 0.3));
    }
};
function onNoteOn()
{
	local n = Message.getNoteNumber();
	
	if (ks.contains(n))
	    currentGroup = ks.indexOf(n) + 1;
	    
	sampler.setActiveGroup(currentGroup);
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
 