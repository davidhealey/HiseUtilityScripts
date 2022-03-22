/**
 * Title: FX_MultiChannelGain.js
 * Author: David Healey
 * License: Public Domain
*/

const var core = Libraries.load("core");
const var gainer = core.createModule("smoothed_gainer");
const var stereo = core.createModule("stereo");

const var Gain = Content.addKnob("Gain", 0, 0);
Gain.set("mode", "Decibel");
Gain.setRange(-100, 3, 0.1);
Gain.set("middlePosition", -18);
Gain.set("defaultValue", -3);

const var knbSmooth = Content.addKnob("knbSmooth", 150, 0);
knbSmooth.setRange(0, 1000, 0.1);
knbSmooth.set("defaultValue", "250");
knbSmooth.set("mode", "Time");

const var Width = Content.addKnob("Width", 300, 0);
Width.setRange(0, 200, 0.01);
Width.set("middlePosition", 100);
Width.set("defaultValue", 100);

function prepareToPlay(sampleRate, blockSize)
{
    gainer.prepareToPlay(sampleRate, blockSize);
    stereo.prepareToPlay(sampleRate, blockSize);
}
function processBlock(channels)
{
	gainer >> channels[0];
	gainer >> channels[1];
	gainer >> channels[2];
	gainer >> channels[3];
	gainer >> channels[4];
	gainer >> channels[5];
	gainer >> channels[6];
	gainer >> channels[7];
	gainer >> channels[8];
	gainer >> channels[9];
	gainer >> channels[10];
	gainer >> channels[11];
	
	stereo >> channels[0];
	stereo >> channels[1];
	stereo >> channels[2];
	stereo >> channels[3];
	stereo >> channels[4];
	stereo >> channels[5];
	stereo >> channels[6];
	stereo >> channels[7];
	stereo >> channels[8];
	stereo >> channels[9];
	stereo >> channels[10];
	stereo >> channels[11];
	stereo >> channels[12];
}
function onControl(number, value)
{
    if (number == Gain)
	    gainer.setParameter(gainer.Gain,Engine.getGainFactorForDecibels(value));

    if (number == knbSmooth)
        gainer.setParameter(gainer.SmoothingTime, value);
        
    if (number == Width)
	    stereo.setParameter(stereo.Width,value);
}