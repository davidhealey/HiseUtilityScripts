/*
  Copyright (c) 2019 David Healey

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

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
