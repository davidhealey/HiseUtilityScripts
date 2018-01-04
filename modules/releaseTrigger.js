/**
 * Title: releaseTrigger.js
 * Author: Christoph Hart, David Healey
 * Date: 09/01/2017
 * Modified: 30/06/2017
 * License: Public Domain
 */

//Includes

//Init
Content.setWidth(650);
Content.setHeight(175);

Content.setName("Release Trigger");

reg attenuationLevel = 1.0;
reg timeIndex = 0;
reg time;
const var velocityValues = Engine.createMidiList();
const var lengthValues = Engine.createMidiList();

const var btnMute = Content.addButton("btnMute", 0, 10);
btnMute.set("text", "Mute");

const var btnLegato = Content.addButton("btnLegato", 150, 10);
btnLegato.set("text", "Legato");
btnLegato.set("tooltip", "When enabled release samples will only be triggered when no other keys are held.");

const var btnAttenuate = Content.addButton("Attenuate", 300, 10);

const var knbTime = Content.addKnob("Time", 450, 0);
knbTime.setRange(0, 20, 0.1);

const var tblTime = Content.addTable("tblTime", 140, 0);
tblTime.setPosition(0, 60, 575, 100);

for(i = 0; i < 127; i++)
{
	velocityValues.setValue(i, 0);
	lengthValues.setValue(i, 0.0);
}

//Functions

//Callbacks
function onNoteOn()
{
	if (!btnMute.getValue())
	{
		Message.ignoreEvent(true);
		velocityValues.setValue(Message.getNoteNumber(), Message.getVelocity());
		lengthValues.setValue(Message.getNoteNumber(), Engine.getUptime());
	}
}

function onNoteOff()
{
	//If not muted and a velocity was recorded in the note on callback - this prevents release triggering for the wrong articulation
	if (!btnMute.getValue() && velocityValues.getValue(Message.getNoteNumber()) > 0)
	{
		Message.ignoreEvent(true);

		//Only play release triggers if legato is disabled or legato is enabled and no keys are held
		if (btnLegato.getValue() == 0 || (btnLegato.getValue() == 1 && Synth.getNumPressedKeys() == 0))
		{
			//Calculate attenuation
			if(btnAttenuate.getValue() == 1)
			{
				time = Engine.getUptime() - lengthValues.getValue(Message.getNoteNumber());

				timeIndex = (time / (knbTime.getValue()) * 127.0);

				if (timeIndex > 127) timeIndex = 127;
				if (timeIndex < 0) timeIndex = 0;

				attenuationLevel = /*velocityValues.getValue(Message.getNoteNumber()) **/ parseInt(tblTime.getTableValue(timeIndex) * 127);
			}
			else
			{
				attenuationLevel = velocityValues.getValue(Message.getNoteNumber());
			}

			if (attenuationLevel < 1) attenuationLevel = 1;

			Synth.playNote(Message.getNoteNumber(), attenuationLevel); //Play release note
		}
		velocityValues.setValue(Message.getNoteNumber(), 0); //Reset velocity for note
	}
}

function onController()
{
}

function onTimer()
{
}

function onControl(number, value)
{
	switch (number)
	{
		case btnMute:
			velocityValues.clear();
			lengthValues.clear();
		break;

		case btnAttenuate:
			knbTime.set("visible", value);
			tblTime.set("visible", value);
		break;
	}
}
