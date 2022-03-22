//License - Public Domain
//David Healey 2019

const var NUM_CHANNELS = 4;

const var samplerIds = Synth.getIdList("Sampler");
const var samplers = [];

for (id in samplerIds)
{
    samplers.push(Synth.getSampler(id));
}

const var btnPurge = [];

for (i = 0; i < NUM_CHANNELS; i++)
{
    btnPurge[i] = Content.addButton("btnPurge" + i, 10 + i * 150, 10);
    btnPurge[i].set("text", "Channel " + i);
    btnPurge[i].setControlCallback(purgeChannel);
}

inline function purgeChannel(component, value)
{
    local idx = btnPurge.indexOf(component);

    for (i = 0; i < samplers.length; i++)
    {
        if (samplers[i].getNumMicPositions() > 1)
        {
            local n = samplers[i].getMicPositionName(i);
            Sampler.purgeMicPosition(n, i == idx && value == 1);
        }
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
