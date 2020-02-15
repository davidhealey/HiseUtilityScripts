/**
 * Title: FX_6ChannelGain.js
 * Author: David Healey
 * License: Public Domain
*/

const var core = Libraries.load("core");
const var gain = core.createModule("smoothed_gainer");

const var knbGain = Content.addKnob("knbGain", 0, 0);
knbGain.set("mode", "Decibel");
knbGain.set("middlePosition", -18);
knbGain.set("defaultValue", -6);
knbGain.setRange(-100, 3, 0.1);

const var knbSmooth = Content.addKnob("knbSmooth", 150, 0);
knbSmooth.setRange(0, 1000, 0.1);
knbSmooth.set("defaultValue", "250");
knbSmooth.set("mode", "Time");function prepareToPlay(sampleRate, blockSize)
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