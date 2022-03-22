/**
 * Title: syntheticRelease.js
 * Author: David Healey
 * Date: 07/09/2017
 * Modified: 07/09/2017
 * License: Public Domain
*/

//INIT
Content.setWidth(650);
Content.setHeight(50);

const var envelopeNames = Synth.getIdList("Table Envelope"); //Get all child table envelopes
reg pitchEnvelope;

//Get pitch envelope
for (envelope in envelopeNames)
{
	if (Engine.matchesRegex(envelope,  "(?=.*itch)(?=.*elease)") == true) //Pitch Release envelope
	{
		pitchEnvelope = Synth.getModulator(envelope);
	}
}

const var knbPitch = Content.addKnob("Pitch", 0, 0);
knbPitch.setRange(-1, 1, 0.01);

const var knbReleaseTime = Content.addKnob("Release Time", 150, 0);
knbReleaseTime.setRange(1, 50, 0.01);

const var btnLegato = Content.addButton("Legato", 300, 10);

//FUNCTIONS

//CALLBACKS
function onNoteOn()
{
}

function onNoteOff()
{
	if (btnLegato.getValue() == 1)
	{
		if (Globals.keyCount == 0) //All keys up
		{
			pitchEnvelope.setIntensity(knbPitch.getValue()); //Set pitch adjustment
		}
		else
		{
			pitchEnvelope.setIntensity(0); //No pitch adjustment
		}
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
		case knbPitch:
			pitchEnvelope.setIntensity(value);
		break;

		case knbReleaseTime:
			pitchEnvelope.setAttribute(1, value);
		break;
	}
}
