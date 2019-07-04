const var core = Libraries.load("core");
const var gain = core.createModule("smoothed_gainer");

Content.setWidth(500);

const knbGain = Content.addKnob("Gain", 0, 0);
knbGain.set("mode", "Decibel");
knbGain.setRange(-100, 3, 0.1);

const knbSmooth = Content.addKnob("Smoothing", 150, 0);
knbSmooth.set("mode", "Time");
knbSmooth.setRange(0, 1000, 1);
knbSmooth.set("middlePosition", 500);

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
