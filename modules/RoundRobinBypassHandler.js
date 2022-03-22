const var scriptIds = Synth.getIdList("Script Processor");
const var rrScripts = [];

for (id in scriptIds)
{
    if (id.indexOf("roundRobin") != -1)
        rrScripts.push(Synth.getMidiProcessor(id));
}

const var btnBypass = Content.addButton("btnBypass", 10, 10);
btnBypass.set("text", "Bypass");
btnBypass.setControlCallback(onbtnBypassControl);

inline function onbtnBypassControl(component, value)
{
	for (i = 0; i < rrScripts.length; i++)
    {
        rrScripts[i].setAttribute(rrScripts[i].btnBypass, 1-value);
    }
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
 