/**
 * Title: multiCCMapper.js
 * Author: David Healey
 * Date: 30/06/2017
 * Modified: 30/06/2017
 * License: Public Domain
*/
Content.setWidth(650);
Content.setHeight(275);

const var COUNT = 15; //The number of CCs you want to remap

const var origin = Content.addSliderPack("sliOrigin", 0, 0);
const var target = Content.addSliderPack("sliTarget", 260, 0);
const var ccValue = Content.addSliderPack("sliValue", 520, 0);

origin.set("sliderAmount", COUNT);
target.set("sliderAmount", COUNT);
ccValue.set("sliderAmount", COUNT);
origin.set("min", 0);
target.set("min", 0);
ccValue.set("min", 0);
origin.set("max", 127);
target.set("max", 127);
ccValue.set("max", 127);
origin.set("stepSize", 1);
target.set("stepSize", 1);
ccValue.set("stepSize", 1);
origin.set("width", 250);
target.set("width", 250);
ccValue.set("width", 250);
origin.set("height", 200);
target.set("height", 200);
ccValue.set("height", 200);
origin.set("flashActive", false);
target.set("flashActive", false);
ccValue.set("flashActive", false);

const var lblOrigin = Content.addLabel("Origin", 105, 225);
const var lblTarget = Content.addLabel("Target", 365, 225);
const var lblValue = Content.addLabel("Value", 625, 225);

function onNoteOn()
{
}

function onNoteOff()
{
}

function onController()
{
	for (i = 0; i < origin.getNumSliders(); i++)
	{
		if (origin.getSliderValueAt(i) == 0) continue; //0 = not used

		if (Message.getControllerNumber() == origin.getSliderValueAt(i))
		{
			Message.ignoreEvent(true);
			if (target.getSliderValueAt(i) > 0)
			{
				Synth.sendController(target.getSliderValueAt(i), Message.getControllerValue());
				ccValue.setSliderAtIndex(i, Message.getControllerValue());
			}
		}
	}
}

function onTimer()
{
}

function onControl(number, value)
{
	if (number == ccValue)
	{
		if (target.getSliderValueAt(value) > 0)
		{
			Synth.sendController(target.getSliderValueAt(value), ccValue.getSliderValueAt(value));
		}
	}
}
