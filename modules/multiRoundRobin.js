/**
 * Title: mulitRoundRobin
 * Author: David Healey, Christoph Hart
 * Date: 07/01/2017
 * Modified: 20/02/2017
 * License: Public Domain
 */

//INIT

reg noteNumber;
reg groupList = [];
reg groupIndex;
reg offsetList = [];
reg offsetIndex;
reg offset;

namespace RRTypes
{
	const var OFF = 1;
	const var REAL = 2;
	const var SYNTH = 3;
	const var HYBRID = 4;
};

namespace RRModes
{
	const var CYCLE = 1;
	const var RANDOM = 2;
	const var RANDOM_CYCLE = 3;
};

const var timer = Engine.createMidiList();

const var excludedIds = "(elease)"; //Regex string of words in sampler IDs to exclude RR from
const var samplerNames = Synth.getIdList("Sampler"); //Get the ids of all child samplers
const var samplers = [];

//Get child samplers
for (samplerName in samplerNames)
{
	if (Engine.matchesRegex(samplerName, excludedIds) == true) continue; //Skip excluded IDs

	samplers.push(Synth.getSampler(samplerName)); //Add sampler to array
	samplers[samplers.length-1].enableRoundRobin(false); //Disable default RR behaviour
}

//GUI
Content.setHeight(100);

//RR Type and Mode Combo Boxes
const var cmbType = Content.addComboBox("Type", 0, 10);
cmbType.set("items", ["Off", "Real", "Synthetic", "Hybrid"].join("\n"));

const var cmbMode = Content.addComboBox("Mode", 150, 10);
cmbMode.set("items", ["Cycle", "Random", "Random Full Cycle"].join("\n"));

//Number of groups knob
const var knbNumGroups = Content.addKnob("Num Groups", 300, 0);
knbNumGroups.setRange(1, 100, 1);

//Playable Range controls
const var knbLowNote = Content.addKnob("Low Note", 450, 0);
knbLowNote.setRange(0, 126, 1);

const var knbHighNote = Content.addKnob("High Note", 600, 0);
knbHighNote.setRange(1, 127, 1);

//Reset timeout knob
const var knbReset = Content.addKnob("Reset Time", 0, 50);
knbReset.setRange(1, 60, 1);
knbReset.set("suffix", " Seconds");

//Microtuning knob
const var knbMicroTuning = Content.addKnob("Microtuning", 150, 50);
knbMicroTuning.setRange(0, 100, 0.1);

//Borrowed Sample Range
const var knbSampleRange = Content.addKnob("Sample Range", 300, 50);
knbSampleRange.setRange(1, 12, 1);

//-----------------

//FUNCTIONS
/** Swaps two elements in an array randomly. */
inline function swapRandomly(arr)
{
	local firstIndex = Math.randInt(0, arr.length);
	local secondIndex = Math.randInt(0, arr.length);
	local temp = arr[firstIndex];
	arr[firstIndex] = arr[secondIndex];
	arr[secondIndex] = temp;
}

/** Swaps every element in the array. */
inline function swapEntirely(arr)
{
	local i = 0;
	while(++i < arr.length)
		swapRandomly(arr);
}

inline function resetGroupList(count)
{
	local i;

	for (i = 0; i < count; i++)
	{
		groupList[i] = i;
	}
}

inline function resetOffsetList(count)
{
	local i;

	//Build array going from -value to +value+1 (always need to account for 0)
	for (i = 0; i < count*2+1; i++)
	{
		offsetList[i] = i-count;
	}
}

//CALLBACKS
function onNoteOn()
{
	noteNumber = Message.getNoteNumber();

	if (cmbType.getValue() != RRTypes.OFF && noteNumber >= knbLowNote.getValue() && noteNumber <= knbHighNote.getValue())
	{
		//Group based RR
		if (knbNumGroups.getValue() > 1 && (cmbType.getValue() == RRTypes.REAL || cmbType.getValue() == RRTypes.HYBRID)) //Real or Hybrid RR
		{
			switch (cmbMode.getValue())
			{
				case RRModes.CYCLE:
					groupIndex = (groupIndex + 1) % groupList.length;
				break;

				case RRModes.RANDOM:
					groupIndex = Math.floor(Math.random() * groupList.length);
				break;

				case RRModes.RANDOM_CYCLE:
					if (++groupIndex >= groupList.length)
					{
						groupIndex = 0;
						swapEntirely(groupList);
					}
				break;
			}
		}

		//Reset groupIndex to 0 if only one group is present or the reset time has elapsed
		if (knbNumGroups.getValue() == 1 || Engine.getUptime() - timer.getValue(noteNumber) > knbReset.getValue())
		{
			groupIndex = 0;
			resetGroupList(knbNumGroups.getValue());
		}

		//Set active group for each sampler
		if (samplers.length > 0)
		{
			for (sampler in samplers)
			{
				sampler.setActiveGroup(1 + groupList[groupIndex]);
			}
		}

		//Synthetic sample borrowed RR
		if (cmbType.getValue() == RRTypes.SYNTH || cmbType.getValue() == RRTypes.HYBRID) //Synthetic or Hybrid RR
		{
			switch (cmbMode.getValue())
			{
				case RRModes.CYCLE:
					offsetIndex = (offsetIndex + 1) % offsetList.length;
				break;

				case RRModes.RANDOM:
					offsetIndex = Math.floor(Math.random() * offsetList.length);
				break;

				case RRModes.RANDOM_CYCLE:
					if (++offsetIndex >= offsetList.length)
					{
						offsetIndex = 0;
						swapEntirely(offsetList);
					}
				break;
			}

			//If reset time has elapsed, reset index
			if (Engine.getUptime() - timer.getValue(noteNumber) > knbReset.getValue())
			{
				offsetIndex = parseInt(Math.floor(offsetList.length / 2));
				resetOffsetList(knbSampleRange.getValue());
			}

			//If the played note + the offset are within the playable range
			if (noteNumber + offsetList[offsetIndex] > knbLowNote.getValue() && noteNumber + offsetList[offsetIndex] < knbHighNote.getValue())
			{
				Message.setTransposeAmount(offsetList[offsetIndex]); //Transpose the note
				Message.setCoarseDetune(-offsetList[offsetIndex]); //Use coarse detune so setting can be picked up by later scripts
			}
		}

		//Apply random microtuning, if any
		if (knbMicroTuning.getValue() > 0)
		{
			Message.setFineDetune(Math.random() * (knbMicroTuning.getValue() - -knbMicroTuning.getValue() + 1) + -knbMicroTuning.getValue());
		}

		timer.setValue(noteNumber, Engine.getUptime()); //Record time this note was triggered
	}
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
		case cmbType:
			switch (value)
			{
				case RRTypes.OFF:
					knbSampleRange.set("visible", false);
				break;

				case RRTypes.REAL:

					knbSampleRange.set("visible", false);

					if (knbNumGroups.getValue() == 1)
					{
						number.setValue(RRTypes.OFF);
					}
				break;

				case RRTypes.SYNTH:
					knbSampleRange.set("visible", true);
				break;

				case RRTypes.HYBRID:

					knbSampleRange.set("visible", true);

					if (knbNumGroups.getValue() == 1) //If there are no RR groups then Hybrid defaults to synth
					{
						number.setValue(RRTypes.SYNTH);
					}
				break;
			}
		break;

		case cmbMode:
			resetGroupList(knbNumGroups.getValue());
			resetOffsetList(knbSampleRange.getValue());
			offsetIndex = 0;
			groupIndex = 0;
		break;

		case knbNumGroups:
			groupList = [];
			resetGroupList(value);
		break;

		case knbSampleRange:
			offsetList = [];
			resetOffsetList(value);
		break;
	}
}
