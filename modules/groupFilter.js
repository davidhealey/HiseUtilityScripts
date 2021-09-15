const samplerIds = Synth.getIdList("Sampler");
const sampler = Synth.getChildSynth(samplerIds[0]);
sampler.asSampler().enableRoundRobin(false);

// knbGroup
const knbGroup = Content.addKnob("Group", 0, 0);
knbGroup.setRange(1, 100, 1);
knbGroup.setControlCallback(onknbGroupControl);

inline function onknbGroupControl(component, value)
{
    if (value <= sampler.getAttribute(sampler.RRGroupAmount))
        sampler.asSampler().setActiveGroup(value);
}function onNoteOn()
{
	
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
 