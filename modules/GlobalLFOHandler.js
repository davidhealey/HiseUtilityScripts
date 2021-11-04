/*
    Copyright 2021 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with This file. If not, see <http://www.gnu.org/licenses/>.
*/

Content.setWidth(800);
Content.setHeight(125);

const modulatorIds = Synth.getIdList("Global Time Variant Modulator");
const gainMods = [];
const pitchMods = [];
const xfadeMods = [];

const lfoIds = Synth.getIdList("LFO Modulator");
const lfos = [];

for (id in lfoIds)
	lfos.push(Synth.getModulator(id));

// knbIntensity
const knbIntensity = Content.addKnob("knbIntensity", 0, 0);
knbIntensity.set("text", "Intensity");
knbIntensity.setControlCallback(onknbIntensityControl);

inline function onknbIntensityControl(component, value)
{	
	lfos[cmbLfo.getValue() - 1].setIntensity(value != 0);
	
	local v = Math.pow(value, 0.5);
	
	for (x in gainMods)
		x.setIntensity(knbGain.getValue() * v);
	
	for (x in pitchMods)
		x.setIntensity(knbPitch.getValue() * v);	

	for (x in xfadeMods)
		x.setIntensity(knbXfade.getValue() * v);
};

// knbFrequency
const knbFrequency = Content.addKnob("knbFrequency", 150, 0);
knbFrequency.set("text", "Frequency");
knbFrequency.set("mode", "Frequency");
knbFrequency.setRange(1, 70, 1);
knbFrequency.setControlCallback(onknbFrequencyControl);

inline function onknbFrequencyControl(component, value)
{
	local mod = lfos[cmbLfo.getValue() - 1];
	mod.setAttribute(mod.Frequency, value);
}

// knbGain
const knbGain = Content.addKnob("knbGain", 300, 0);
knbGain.set("text", "Gain");

// knbPitch
const knbPitch = Content.addKnob("knbPitch", 450, 0);
knbPitch.setRange(-12, 12, 0.01);
knbPitch.set("text", "Pitch");

// knbXfade
const knbXfade = Content.addKnob("knbXfade", 600, 0);
knbXfade.set("text", "Xfade");

// cmbType
const cmbType = Content.addComboBox("cmbType", 0, 75);
cmbType.set("items", ["Vibrato", "Flutter", "Growl"].join("\n"));
cmbType.setControlCallback(oncmbTypeControl);

inline function oncmbTypeControl(component, value)
{
	local text = component.getItemText();
	
	gainMods.clear();
	pitchMods.clear();
	xfadeMods.clear();
	
	for (id in modulatorIds)
	{
		if (id.indexOf(text) == -1) continue;

		if (id.indexOf("Gain") != -1)
			gainMods.push(Synth.getModulator(id));
		else if (id.indexOf("Pitch") != -1)
			pitchMods.push(Synth.getModulator(id));
		else if (id.indexOf("XF") != -1)
			xfadeMods.push(Synth.getModulator(id));
	}
}

// cmbLfo
const cmbLfo = Content.addComboBox("cmbLfo", 150, 75);
cmbLfo.set("items", lfoIds.join("\n"));function onNoteOn()
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
 