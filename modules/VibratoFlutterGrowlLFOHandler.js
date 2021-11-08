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

Content.setWidth(750);

// LFOs
const lfoIds = Synth.getIdList("LFO Modulator");
const lfos = [];

// Target modulators
const modulatorIds = Synth.getIdList("Global Time Variant Modulator");
const gainMods = [];
const pitchMods = [];
const xfadeMods = [];

// Mode
const Mode = Content.addComboBox("Mode", 0, 10);
Mode.set("items", ["Vibrato", "Flutter", "Growl"].join("\n"));
Mode.setControlCallback(onModeControl);

inline function onModeControl(component, value)
{
	local text = component.getItemText();
	
	gainMods.clear();
	pitchMods.clear();
	xfadeMods.clear();
	lfos.clear();
	
	for (id in lfoIds)
	{
		if (id.indexOf(text.toLowerCase()) == -1 || id.indexOf("Random") != -1) continue;
		lfos.push(Synth.getModulator(id));
	}

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

// Frequency
const Frequency = Content.addKnob("Frequency", 150, 0);
Frequency.set("mode", "Frequency");
Frequency.setRange(0.5, 100, 0.5);
Frequency.set("middlePosition", 50);
Frequency.setControlCallback(onFrequencyControl);

inline function onFrequencyControl(component, value)
{
	for (x in lfos)
		x.setAttribute(x.Frequency, value);
}

// Gain
const Gain = Content.addKnob("Gain", 300, 0);
Gain.setControlCallback(onGainControl);

inline function onGainControl(component, value)
{
	for (x in gainMods)
		x.setIntensity(value);
}

// Pitch
const Pitch = Content.addKnob("Pitch", 450, 0);
Pitch.setRange(-2, 2, 0.01);
Pitch.set("middlePosition", 0);
Pitch.setControlCallback(onPitchControl);

inline function onPitchControl(component, value)
{
	for (x in pitchMods)
		x.setIntensity(value);
}

// Xfade
const Xfade = Content.addKnob("Xfade", 600, 0);
Xfade.setControlCallback(onXfadeControl);

inline function onXfadeControl(component, value)
{
	for (x in xfadeMods)
		x.setIntensity(value);
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
 