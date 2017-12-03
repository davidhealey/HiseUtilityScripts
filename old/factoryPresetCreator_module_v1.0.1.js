/**
 * Title: Factory Preset Creator v1.0.2.js
 * Author: David Healey
 * Date: 02/07/2017
 * Modified: 20/07/2017
 * License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.en.html
*/

//INIT
Content.setHeight(100);

/* Create object that will hold the preset values all modules - this stuff should go in the front panel script.
global userPresetData = {samplers:[], effects:[], modulators:[], midiProcessors:[]};
// Create a storage panel, hide it, and save it in the preset
const var storagePanel = Content.addPanel("storagePanel", 0, 0);
storagePanel.set("visible", false);
storagePanel.set("saveInPreset", true);

// Set the storage as widget value for the hidden panel.
// Important: this will not clone the object but share a reference!
storagePanel.setValue(userPresetData);*/

const var samplerIds = Synth.getIdList("Sampler");
const var effectIds = Synth.getIdList("Effect");
const var modulatorIds = Synth.getIdList("Modulator");
const var midiProcessorIds = Synth.getIdList("Script Processor");

const var samplers = [];
const var effects = [];
const var modulators = [];
const var midiProcessors = [];

for (s in samplerIds)
{
	samplers.push(Synth.getChildSynth(s));
}

for (e in effectIds)
{
	effects.push(Synth.getEffect(e));
}

for (m in modulatorIds)
{
	modulators.push(Synth.getModulator(m));
}

for (i = 1; i < midiProcessorIds.length; i++) //Skips first processor which should be this script
{
	midiProcessors.push(Synth.getMidiProcessor(midiProcessorIds[i]));
}

//GUI
const var load = Content.addButton("Load", 600, 10);
load.set("saveInPreset", false);

const var headings = [Content.addLabel("Label1", 0, 5), Content.addLabel("Label2", 150, 5), Content.addLabel("Label3", 300, 5)];
const var inputs = [Content.addLabel("Bank", 0, 25), Content.addLabel("Category", 150, 25), Content.addLabel("Name", 300, 25)];
for (i = 0; i < 3; i++)
{
	headings[i].set("textColour", 4278190080);
	headings[i].set("saveInPreset", false);
	headings[i].set("editable", false);

	inputs[i].set("bgColour", 4285953654);
	inputs[i].set("textColour", 4278190080);
	inputs[i].set("editable", true);
}
headings[0].setValue("Bank");
headings[1].setValue("Category");
headings[2].setValue("Name");

const var save = Content.addButton("Save", 450, 10);
save.set("saveInPreset", false);

//FUNCTIONS
function savePreset()
{
	/*for (s in samplers)
	{
		userPresetData.samplers.push(s.exportState());
	}

	for (e in effects)
	{
		userPresetData.effects.push(e.exportState());
	}

	for (m in modulators)
	{
		userPresetData.modulators.push(m.exportState());
	}

	for (m in midiProcessors)
	{
		userPresetData.midiProcessors.push(m.exportState());
	}

	Content.storeAllControlsAsPreset(inputs[0].getValue() + "/" + inputs[1].getValue() + "/" + inputs[2].getValue() + ".preset");*/
}

function restorePreset()
{
//	userPresetData = storagePanel.getValue(); //Restore from panel

	if (userPresetData.samplers.length > 0)
	{
		for (i = 0; i < samplers.length; i++)
		{
			//samplers[i].restoreState(userPresetData.samplers[i]);
		}
	}

	if (userPresetData.effects.length > 0)
	{
		for (i = 0; i < effects.length; i++)
		{
			effects[i].restoreState(userPresetData.effects[i]);
		}
	}

	if (userPresetData.modulators.length > 0)
	{
		for (i = 0; i < modulators.length; i++)
		{
			modulators[i].restoreState(userPresetData.modulators[i]);
		}
	}

	if (userPresetData.midiProcessors.length > 0)
	{
		for (i = 0; i < midiProcessors.length; i++)
		{
			midiProcessors[i].restoreState(userPresetData.midiProcessors[i]);
		}
	}
}

//CALLBACKS
function onNoteOn()
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
	switch(number)
	{
		//case storagePanel:
		//	restorePreset();
		//break;

		case save:
			savePreset();
			save.setValue(0);
		break;

		case load: 
		Console.print("HERRO");
			restorePreset();
		break;

	}
}