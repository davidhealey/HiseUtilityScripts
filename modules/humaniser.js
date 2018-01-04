/**
 * Title: Humaniser
 * Author: David Healey
 * Date: 08/01/2017
 * Modified: 08/01/2017
 * License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.en.html
 */

//Includes

//Init
Content.setWidth(650);
Content.setHeight(100);

reg randNoteOnDelay;
reg randNoteOffDelay;
reg randVelocity;
reg randFineTune;
reg randVolume;
reg randCC;

const var noteOnDelays = Engine.createMidiList();
noteOnDelays.fill(0); // default is -1, so we need to set it to zero.

const var ccNumbers = [];

for (i = 0; i < 129; i++)
{
	ccNumbers[i] = i;
}

//GUI
const var knbNoteOn = Content.addKnob("Note On", 0, 0);
knbNoteOn.setRange(0, 100, 0.1);
knbNoteOn.set("suffix", "ms");
knbNoteOn.set("tooltip", "Note On: adds random delay (0 ms - 100 ms) to the Note On of each note.");

const var knbNoteOff = Content.addKnob("Note Off", 150, 0);
knbNoteOff.setRange(0, 100, 0.1);
knbNoteOff.set("suffix", "ms");
knbNoteOff.set("tooltip", "Note Off: adds random delay (0 ms - 100 ms) to the Note Off of each note.");

const var knbVelocity = Content.addKnob("Velocity", 300, 0);
knbVelocity.setRange(0, 100, 1);
knbVelocity.set("suffix", "%");
knbVelocity.set("tooltip", "Velocity: adds or subtracts random value in selected +-range of played velocity.");

const var knbFineTune = Content.addKnob("FineTuning", 450, 0);
knbFineTune.setRange(0, 100, 1);
knbFineTune.set("tooltip", "Fine Tuning: detunes each note randomly in the selected +-range - up to 1 semi-tone.");

const var knbVolume = Content.addKnob("Volume", 600, 0);
knbVolume.setRange(0, 8, 0.1);
knbVolume.set("suffix", "dB");
knbVolume.set("tooltip", "Volume: changes the volume of each note randomly from -8db to +8 db.");

const var cmbCC1 = Content.addComboBox("CC 1", 0, 60);
cmbCC1.set("items", ccNumbers.join("\n"));
cmbCC1.set("text", "First CC");
cmbCC1.set("tooltip", "First CC Number: Select a CC number to humaniser.");

const var knbCC1 = Content.addKnob("First CC", 150, 50);
knbCC1.setRange(0, 100, 1);
knbCC1.set("suffix", "%");
knbCC1.set("tooltip", "First CC: adjusts the CC value by a random percentage in the +-range selected.");

const var cmbCC2 = Content.addComboBox("CC 2", 300, 60);
cmbCC2.set("items", ccNumbers.join("\n"));
cmbCC2.set("text", "Second CC");
cmbCC2.set("tooltip", "Second CC Number: Select a CC number to humaniser.");

const var knbCC2 = Content.addKnob("Second CC", 450, 50);
knbCC2.setRange(0, 100, 1);
knbCC2.set("suffix", "%");
knbCC2.set("tooltip", "Second CC: adjusts the CC value by a random percentage in the +-range selected.");

//Functions

//Callbacks
function onNoteOn()
{
	//Note On
	if (knbNoteOn.getValue() > 0)
	{
		randNoteOnDelay = Math.floor(Math.random() * knbNoteOn.getValue());
		Message.delayEvent(Engine.getSamplesForMilliSeconds(randNoteOnDelay));
		noteOnDelays.setValue(Message.getNoteNumber(), randNoteOnDelay);
	}

	//Velocity
	if (knbVelocity.getValue() > 0)
	{
		randVelocity = -1;
		while (randVelocity == -1 || randVelocity < 1 || randVelocity > 127)
		{
			randVelocity = Math.ceil(Message.getVelocity() + ((Math.random() -0.5) * 127) * knbVelocity.getValue() / 100);
		}

		Message.setVelocity(randVelocity); //Apply random velocity
	}

	//Fine Tuning
	if (knbFineTune.getValue() > 0)
	{
		randFineTune = Math.floor(Math.random() * (knbFineTune.getValue() - -knbFineTune.getValue() + 1)) + -knbFineTune.getValue();
		Message.setFineDetune(Message.getFineDetune()+randFineTune);
	}

	//Volume
	if (knbVolume.getValue() > 0)
	{
		randVolume = Math.random() * (knbVolume.getValue() - -knbVolume.getValue() + 1) + -knbVolume.getValue();
		Message.setGain(Message.getGain() + randVolume);
	}
}

function onNoteOff()
{
	//Note Off
	if (knbNoteOff.getValue() > 0)
	{
		randNoteOffDelay = Math.floor(Math.random() * knbNoteOff.getValue());
		randNoteOffDelay += noteOnDelays.getValue(Message.getNoteNumber()); //Add any note on delay for this note

		Message.delayEvent(Engine.getSamplesForMilliSeconds(randNoteOffDelay));
	}
}

function onController()
{
	if (Message.getControllerNumber() == cmbCC1.getValue()-1 && knbCC1.getValue() > 0)
	{
		randCC = -1;
		while (randCC == -1 || randCC < 1 || randCC > 127)
		{
			randCC = Math.ceil(Message.getControllerValue() + ((Math.random() -0.5) * 127) * knbCC1.getValue() / 100);
		}

		Message.setControllerValue(randCC);
	}

	if (Message.getControllerNumber() == cmbCC2.getValue()-1 && knbCC2.getValue() > 0)
	{
		randCC = -1;
		while (randCC == -1 || randCC < 1 || randCC > 127)
		{
			randCC = Math.ceil(Message.getControllerValue() + ((Math.random() -0.5) * 127) * knbCC2.getValue() / 100);
		}

		Message.setControllerValue(randCC);
	}
}

function onTimer()
{
}

function onControl(number, value)
{
}
