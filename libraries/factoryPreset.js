/**
 * Title: factoryPreset.js
 * Author: David Healey
 * Date: 29/07/2017
 * Modified: 03/12/2017
 * License: LGPL - https://www.gnu.org/licenses/lgpl-3.0.en.html
*/

/***WARNING - THIS IS VERY BUGGY!!

namespace factoryPreset
{
	// Create a storage panel, hide it, and save it in the preset
	const var factoryPresetStoragePanel = Content.addPanel("factoryPresetStoragePanel", 0, 0);
	factoryPresetStoragePanel.set("visible", false);
	factoryPresetStoragePanel.set("saveInPreset", true);

	//Create an object that will hold the preset data
	reg factoryPresetData = {sampleMaps:{}, midiProcessors:{}, modulators:{}, effects:{}};

	// Set factoryPresetData as the widget value for the hidden panel.
	// Important: this will not clone the object, but share a reference!
	factoryPresetStoragePanel.setValue(factoryPresetData);

	//******************************************************************

	inline function mergeArrays(a, b)
	{
		if (typeof a == "object" && typeof b == "object")
		{
			for (i = 0; i < b.length; i++) a.push(b[i]);
		}
	}

	/**
	 * Stores the state of all scripts, sample maps, modulators, and effects in factoryPresetData.
	 * To avoid losing data this function MUST be called before saving HISE presets .hip and factory user presets.
	 * This function should be called in the on control callback via a button (hidden from the user).
	 * Make sure the button's saveInPreset property is set to false or else things won't go well.
	 */
	inline function exportData()
	{
		local samplerIds = Synth.getIdList("Sampler");
		local midiIds = getMidiProcessorIds();
		local modIds = getModulatorIds();
		local effectIds = getEffectIds();
		local t; //Thing being exported

		//Clear previous data
		factoryPresetData.sampleMaps = {};
		factoryPresetData.midiProcessors = {};
		factoryPresetData.modulators = {};
		factoryPresetData.effects = {};

		//Sample maps
		for (id in samplerIds)
		{
			t = Synth.getSampler(id);
			if (t.getCurrentSampleMapId() == "" || t.getCurrentSampleMapId() == "unused") continue; //Skip empty sample maps
			factoryPresetData.sampleMaps[id] = t.getCurrentSampleMapId();
		}

		//Script processors
		for (id in midiIds)
		{
			t = Synth.getMidiProcessor(id);
			factoryPresetData.midiProcessors[id] = t.exportScriptControls();
		}

		//Modulators
		for (id in modIds)
		{
			t = Synth.getModulator(id);
			factoryPresetData.modulators[id] = t.exportState();
		}

		//Effects
		for (id in effectIds)
		{
			t = Synth.getEffect(id);
			factoryPresetData.effects[id] = t.exportState();
		}

		Console.print("Preset Data Stored. Use the preset browser to save the factory preset.");
		return true;
	}

	//Alternative data export function that only exports the sample maps loaded in each sampler
	inline function exportSampleMaps()
	{
		local samplerIds = Synth.getIdList("Sampler");
		local t; //Thing being exported

		//Clear previous data
		factoryPresetData.sampleMaps = {};

		//Sample maps
		for (id in samplerIds)
		{
			t = Synth.getSampler(id);
			if (t.getCurrentSampleMapId() == "" || t.getCurrentSampleMapId() == "unused") continue; //Skip empty sample maps
			factoryPresetData.sampleMaps[id] = t.getCurrentSampleMapId();
		}

		Console.print("Sample Maps Stored. Use the preset browser to save the factory preset.");
		return true;
	}

	/**
	 * Restores the factoryPresetData from the factoryPresetStoragePanel. Call this function from the on control callback
	 * @param  {value} The "value" parameter from the on control callback
	 */
	inline function restoreData(value)
	{
		if (typeof value == "object")
		{
			local samplerIds = Synth.getIdList("Sampler");
			local midiIds = getMidiProcessorIds();
			local modIds = getModulatorIds();
			local effectIds = getEffectIds();
			local t; //Thing being restored

			factoryPresetData = value; //Restore data from storage panel

			//Sample maps
			for (id in samplerIds)
			{
				t = Synth.getSampler(id);
				if (typeof factoryPresetData.sampleMaps[id] == void) continue;
				t.loadSampleMap(factoryPresetData.sampleMaps[id]);
			}

			//Script processors
			for (id in midiIds)
			{
				t = Synth.getMidiProcessor(id);
				if (typeof factoryPresetData.midiProcessors[id] == void) continue;
				t.restoreScriptControls(factoryPresetData.midiProcessors[id]);
			}

			//Modulators
			for (id in modIds)
			{
				t = Synth.getModulator(id);
				if (typeof factoryPresetData.modulators[id] == void) continue;
				t.restoreState(factoryPresetData.modulators[id]);
			}

			//Effects
			for (id in effectIds)
			{
				t = Synth.getEffect(id);
				if (typeof factoryPresetData.effects[id] == void) continue;
				t.restoreState(factoryPresetData.effects[id]);
			}
			return true;
		}
		else
		{
			factoryPresetStoragePanel.setValue(factoryPresetData);
			return false;
		}
	}

	//Alternative restore function to restore just the sample maps of each sampler
	inline function restoreSampleMaps(value)
	{
		if (typeof value == "object")
		{
			local samplerIds = Synth.getIdList("Sampler");
			local t; //Thing being restored

			factoryPresetData = value; //Restore data from storage panel

			//Sample maps
			for (id in samplerIds)
			{
				t = Synth.getSampler(id);
				if (typeof factoryPresetData.sampleMaps[id] == void) continue;
				t.loadSampleMap(factoryPresetData.sampleMaps[id]);
			}
		}
	}

	inline function getMidiProcessorIds()
	{
		local midiIds = [];

		mergeArrays(midiIds, Synth.getIdList("Script Processor"));
		mergeArrays(midiIds, Synth.getIdList("Transposer"));
		mergeArrays(midiIds, Synth.getIdList("Legato with Retrigger"));
		mergeArrays(midiIds, Synth.getIdList("CC Swapper"));
		mergeArrays(midiIds, Synth.getIdList("Release Trigger"));
		mergeArrays(midiIds, Synth.getIdList("MIDI CC to Note Generator"));
		mergeArrays(midiIds, Synth.getIdList("MIDI Channel Filter"));
		mergeArrays(midiIds, Synth.getIdList("MIDI Channel Setter"));
		mergeArrays(midiIds, Synth.getIdList("MIDI Muter"));
		mergeArrays(midiIds, Synth.getIdList("Arpeggiator"));

		return midiIds;
	}

	inline function getModulatorIds()
	{
		local modIds = [];

		//Voice Start
		mergeArrays(modIds, Synth.getIdList("Velocity Modulator"));
		mergeArrays(modIds, Synth.getIdList("Notenumber Modulator"));
		mergeArrays(modIds, Synth.getIdList("Random Modulator"));
		mergeArrays(modIds, Synth.getIdList("Global Voice Start Modulator"));
		mergeArrays(modIds, Synth.getIdList("Array Modulator"));
		mergeArrays(modIds, Synth.getIdList("Script Voice Start Modulator"));

		//Time Variant
		mergeArrays(modIds, Synth.getIdList("LFO Modulator"));
		mergeArrays(modIds, Synth.getIdList("Midi Controller"));
		mergeArrays(modIds, Synth.getIdList("Pitch Wheel Modulator"));
		mergeArrays(modIds, Synth.getIdList("Macro Control Modulator"));
		mergeArrays(modIds, Synth.getIdList("Audio File Envelope"));
		mergeArrays(modIds, Synth.getIdList("Global Time Variant Modulator"));
		mergeArrays(modIds, Synth.getIdList("CC Ducker"));
		mergeArrays(modIds, Synth.getIdList("Script Time Variant Modulator"));

		//Envelopes
		mergeArrays(modIds, Synth.getIdList("Simple Envelope"));
		mergeArrays(modIds, Synth.getIdList("AHDSR Envelope"));
		mergeArrays(modIds, Synth.getIdList("Table Envelope"));
		mergeArrays(modIds, Synth.getIdList("Midi CC Attack Envelope"));
		mergeArrays(modIds, Synth.getIdList("Script Envelope Modulator"));

		return modIds;
	}

	inline function getEffectIds()
	{
		local effectIds = [];

		mergeArrays(effectIds, Synth.getIdList("Monophonic Filter"));
		mergeArrays(effectIds, Synth.getIdList("Polyphonic Filter"));
		mergeArrays(effectIds, Synth.getIdList("Harmonic Filter"));
		mergeArrays(effectIds, Synth.getIdList("Harmonic Filter Monophonic"));
		mergeArrays(effectIds, Synth.getIdList("Parametric EQ"));
		mergeArrays(effectIds, Synth.getIdList("Stereo FX"));
		mergeArrays(effectIds, Synth.getIdList("Simple Reverb"));
		mergeArrays(effectIds, Synth.getIdList("Simple Gain"));
		mergeArrays(effectIds, Synth.getIdList("Convolution Reverb"));
		mergeArrays(effectIds, Synth.getIdList("Delay"));
		mergeArrays(effectIds, Synth.getIdList("Limiter"));
		mergeArrays(effectIds, Synth.getIdList("Degrade"));
		mergeArrays(effectIds, Synth.getIdList("Chorus"));
		mergeArrays(effectIds, Synth.getIdList("Phase FX"));
		mergeArrays(effectIds, Synth.getIdList("Gain Collector"));
		mergeArrays(effectIds, Synth.getIdList("Routing Matrix"));
		mergeArrays(effectIds, Synth.getIdList("Saturator"));
		mergeArrays(effectIds, Synth.getIdList("Plugin Wrapper"));
		mergeArrays(effectIds, Synth.getIdList("Script FX"));
		mergeArrays(effectIds, Synth.getIdList("Effect Slot"));
		mergeArrays(effectIds, Synth.getIdList("Empty"));

		return effectIds;
	}

	inline function getStoragePanel()
	{
		return factoryPresetStoragePanel;
	}
}
