const var core = Libraries.load("core");
const var gain = core.createModule("smoothed_gainer");

const knbGain = Content.getComponent("knbGain");
const knbSmooth = Content.getComponent("knbSmooth");
function prepareToPlay(sampleRate, blockSize)
{
    gain.prepareToPlay(sampleRate, blockSize);
}
function processBlock(channels)
{
	gain >> channels[0];
	gain >> channels[1];
	gain >> channels[2];
	gain >> channels[3];
	gain >> channels[4];
	gain >> channels[5];
}
function onControl(number, value)
{
    if (number == knbGain)
	    gain.setParameter(gain.Gain,Engine.getGainFactorForDecibels(value));
	    
	if (number == knbSmooth)
        gain.setParameter(gain.SmoothingTime, value);	    
}
