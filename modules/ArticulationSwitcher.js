/**
 * Title: Articulation Switcher.js
 * Author: David Healey
 * Date: 30/06/2017
 * Modified: 20/07/2017
 * License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.en.html
*/

Content.setWidth(650);
Content.setHeight(50);

const var UACC_NUM = 32;

// Create a storage panel, hide it, and save it in the preset
const var storagePanel = Content.addPanel("storagePanel", 0, 0);
storagePanel.set("visible", false);
storagePanel.set("saveInPreset", true);

// Create object that will hold the preset values.
var data = {channels:[], ks:[], uacc:[]};

// Set the storage as widget value for the hidden panel.
// Important: this will not clone the object but share a reference!
storagePanel.setValue(data);

const var muterList = Synth.getIdList("MidiMuter"); //Get MIDI Muter IDs
const var filterList = Synth.getIdList("MIDI Channel Filter"); //Get MIDI Channel filter IDs
const var containerList = Synth.getIdList("Container"); //Get containers ids
const var articulations = []; //IDs of containers that have a midi muter whose ID includes the container name

reg muters = []; //MIDI Muter modules - every articulation must have a MIDI muter with an ID that includes its container's ID
reg filters = []; //MIDI Channel Filters - either every articulation must have one or none of them, other combinations may lead to strange results.
reg current; //Current articulation/container

//GUI
const var cmbContainers = Content.addComboBox("Containers", 0, 0);
const var cmbChan = Content.addComboBox("Channel", 150, 0);
const var cmbKs = Content.addComboBox("Key Switch", 300, 0);
const var cmbUacc = Content.addComboBox("UACC", 450, 0);

//Populate cmbContainers with the names of container that have midiMuters
for (i = 0; i < containerList.length; i++) //Each container
{
	for (m in muterList) //Each MIDI Muter
	{
		if (m.indexOf(containerList[i]) == -1) continue; //Skip MIDI muter if it does not have the container name as part of its ID
		muters.push(Synth.getMidiProcessor(m)); //Add MIDI Muter to muters object
		articulations.push(containerList[i]); //Add container ID to array of articulation names
		cmbContainers.addItem(containerList[i]); //Populate container drop down
	}
}

//If the channel filters list was populated find the correct filter for each articulation
if (filterList.length > 0)
{
	for (i = 0; i < articulations.length; i++) //Each articulation (containers with a MIDI muter that have the include the container ID in their ID)
	{
		for (f in filterList) //Each channel filter
		{
			if (f.indexOf(articulations[i]) == -1) continue; //Skip filter if it does not have the articulation name as part of its ID
			filters.push(Synth.getMidiProcessor(f)); //Add channel filter for this articulation/container to the filters object
		}
	}
}

//Populate channel dropdwon
for (i = 0; i < 17; i++)
{
	i == 0 ? cmbChan.addItem("Omni") : cmbChan.addItem(i);
}

//Populate KS and UACC dropdownsContent.setHeight(50);
for (i = 0; i < 128; i++)
{
	cmbKs.addItem(Engine.getMidiNoteName(i)); //Populate KS dropdown
	i == 0 ? cmbUacc.addItem("Disabled") : cmbUacc.addItem(i); //Populate UACC dropdown
}

inline function displayCurrentSettings()
{
	cmbContainers.setValue(current+1);
	if (data.channels[current] != undefined) cmbChan.setValue(data.channels[current]+1);
	if (data.ks[current] != undefined) cmbKs.setValue(data.ks[current]+1);
	if (data.uacc[current] != undefined) cmbUacc.setValue(data.uacc[current]+1);
}

function onNoteOn()
{
	if (data.ks.contains(Message.getNoteNumber())) //A KS triggered callback
	{
		//Mute all articulations by default
		for (m in muters)
		{
			m.setAttribute(0, 1);
		}
		current = data.ks.indexOf(Message.getNoteNumber());
		muters[current].setAttribute(0, 0); //Unmute
		displayCurrentSettings();
	}
}

function onNoteOff()
{

}
function onController()
{
	if (Message.getControllerNumber() == UACC_NUM && Message.getControllerValue() > 0) //UACC
	{
		if (data.uacc.contains(Message.getControllerValue())) //Triggered UACC value is assigned to an articulation
		{
			//Mute all articulations by default
			for (m in muters)
			{
				m.setAttribute(0, 1);
			}
			current = data.ks.indexOf(Message.getControllerValue());
			muters[current].setAttribute(0, 0); //Unmute
			displayCurrentSettings();
		}
	}
}

function onTimer()
{

}
function onControl(number, value)
{
	switch(number)
	{
		case storagePanel:
			if (typeof storagePanel.getValue() == "object") //If the data object has been stored
			{
				data = storagePanel.getValue(); //Restore data from panel
			}
		break;

		case cmbContainers:
			current = value-1; //Currently selected articulation
			displayCurrentSettings();
		break;

		case cmbChan:
			if (filters.length > 0)
			{
				if (value == 1) //Omni
				{
					filters[current].setBypassed(true);
				}
				else
				{
					filters[current].setBypassed(false);
					filters[current].setAttribute(0, value-1);
				}
				data.channels[current] = value-1;
			}
		break;

		case cmbKs:
			data.ks[current] = value-1;
		break;

		case cmbUacc:
			data.uacc[current] = value-1;
		break;
	}
}
