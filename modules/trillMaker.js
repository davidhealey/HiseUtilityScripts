/**
 * Title: trillMaker.js
 * Author: David Healey
 * Date: 07/09/2017
 * Modified: 07/09/2017
 * License: Public Domain
*/

reg velocity; //Velocity of the notes[1] note
reg count; //Note number to be played - in the range of the and notes[1]
reg rate; //Tempo - taken from the host - to play the glide at.
reg interval;
reg notes = [-1, -1];
reg noteId = -1;
reg stopTimerFlag = 0;
reg microTuning;

//Get all child sample start constant modulators
const var modulatorNames = Synth.getIdList("Constant"); //Get child constant modulator names
const var startModulators = []; //For offsetting sample start position

for (modName in modulatorNames)
{
	if (Engine.matchesRegex(modName, "(?=.*ample)(?=.*tart)"))
	{
		startModulators.push(Synth.getModulator(modName));
	}
}

//GUI
Content.setHeight(100);

const var btnMute = Content.addButton("btnMute", 0, 10);
btnMute.set("text", "Mute");

const var knbOffset = Content.addKnob("knbOffset", 150, 0);
knbOffset.setRange(0, 1, 0.01);
knbOffset.set("text", "Offset");

const var knbRate = Content.addKnob("knbRate", 300, 0);
knbRate.set("mode", "TempoSync");
knbRate.set("text", "Rate");

const var knbMinInt = Content.addKnob("knbMinInt", 0, 50);
knbMinInt.setRange(1, 11, 1);
knbMinInt.set("text", "Min Interval");
knbMinInt.set("suffix", "st");

const var knbMaxInt = Content.addKnob("knbMaxInt", 150, 50);
knbMaxInt.setRange(1, 12, 1);
knbMaxInt.set("text", "Max Interval");
knbMaxInt.set("suffix", "st");

const var knbMinBendAmount = Content.addKnob("knbMinBendAmount", 300, 50);
knbMinBendAmount.setRange(0, 100, 1);
knbMinBendAmount.set("text", "Min Bend");
knbMinBendAmount.set("suffix", "Ct");

const var knbMaxBendAmount = Content.addKnob("knbMaxBendAmount", 450, 50);
knbMaxBendAmount.setRange(1, 100, 1);
knbMaxBendAmount.set("text", "Max Bend");
knbMaxBendAmount.set("suffix", "Ct");

//Microtuning knob
const var knbMicroTuning = Content.addKnob("Microtuning", 600, 50);
knbMicroTuning.setRange(0, 100, 0.1);

inline function getRate()
{
	rate = Engine.getMilliSecondsForTempo(knbRate.getValue()) / 1000;
	if (rate < 0.04) rate = 0.04;
	return rate;
}

inline function calculateBendAmount(lastNote, noteNumber)
{
	local bendAmount;
	reg interval = Math.abs(lastNote - noteNumber);

	bendAmount = (((interval - 1) * (knbMaxBendAmount.getValue() - knbMinBendAmount.getValue())) / (12 - 1)) + knbMinBendAmount.getValue();

	if (lastNote > noteNumber) bendAmount = -bendAmount; //Down interval - invert the bend amount

	return bendAmount;
}

inline function setOffsetIntensity(value)
{
	if (startModulators.length > 0)
	{
		for (mod in startModulators)
		{
			mod.setIntensity(value);
		}
	}
}

function onNoteOn()
{
	if (!btnMute.getValue())
	{
		Synth.stopTimer();

		Message.ignoreEvent(true);

		if (notes[0] != -1) interval = Math.abs(notes[0] - Message.getNoteNumber()); //Calculate interval

		//In interval range or no note played yet
		if ((interval >= knbMinInt.getValue() && interval <= knbMaxInt.getValue()) || noteId == -1)
		{
			if (noteId != -1 && notes[0] != -1)
			{
				setOffsetIntensity(knbOffset.getValue());

				count = 0;
				notes[1] = Message.getNoteNumber();
				velocity = Message.getVelocity();

				bendAmount = calculateBendAmount(notes[0], notes[1]);
				rate = getRate();

				Synth.startTimer(rate);
			}
			else if (notes[0] == -1) //notes[0] has not yet been played - first note
			{
				stopTimerFlag = 0;
				setOffsetIntensity(1);
				notes[0] = Message.getNoteNumber();
				noteId = Synth.playNote(notes[0], Message.getVelocity()); //Play first note
			}
		}
	}
}

function onNoteOff()
{
	if (!btnMute.getValue())
	{
		if (Message.getNoteNumber() == notes[0] || Message.getNoteNumber() == notes[1])
		{
			Message.ignoreEvent(true);

			if (Message.getNoteNumber() == notes[0]) //notes[0] released
			{
				notes[0] = -1;

				if (Synth.isKeyDown(notes[1])) //notes[1] is still held
				{
					if (count == 0)
					{
						stopTimerFlag = 1; //Timer will be stopped after next cycle so that notes[1] is sounding note
					}
					else
					{
						Synth.stopTimer();
					}

					notes[0] = notes[1]; //notes[1] becomes the new notes[0]
				}
			}

			if (Message.getNoteNumber() == notes[1]) //notes[1] released
			{
				notes[1] = -1;

				if (Synth.isKeyDown(notes[0])) //notes[0] is still held
				{
					if (count == 1)
					{
						stopTimerFlag = 1; //Timer will be stopped after next cycle so that notes[0] is sounding note
					}
					else
					{
						Synth.stopTimer();
					}
				}
			}

			if (!Synth.isKeyDown(notes[0]) && !Synth.isKeyDown(notes[1]) && noteId != -1) //Both keys have been lifted
			{
				Synth.stopTimer();
				Synth.noteOffByEventId(noteId);
				notes = [-1, -1];
				noteId = -1;
				setOffsetIntensity(1); //Reset sample start offset
			}
		}
	}
	else
	{
		//Turn off hanging note, if any
		if (noteId != -1)
		{
			Synth.noteOffByEventId(noteId);
			notes = [-1, -1];
			noteId = -1;
			setOffsetIntensity(1); //Reset sample start offset
		}
	}
}

function onController()
{
}

function onTimer()
{
	if (!btnMute.getValue())
	{
		count = 1-count; //Toggle count - to switch between origin and target notes

		//Get random microtuning, if any
		microTuning = 0;
		if (knbMicroTuning.getValue() > 0)
		{
			microTuning = (Math.random() * (knbMicroTuning.getValue() - -knbMicroTuning.getValue() + 1) + -knbMicroTuning.getValue());
		}

		Synth.addPitchFade(noteId, rate*1000, 0, bendAmount + microTuning); //Pitch fade old note to bend amount
		Synth.addVolumeFade(noteId, rate*1000, -100); //Fade out last note

		noteId = Synth.playNote(notes[count], velocity); //Play new note

		Synth.addVolumeFade(noteId, 0, -99); //Set new note's initial volume
		Synth.addVolumeFade(noteId, rate*1000, 0); //Fade in new note
		Synth.addPitchFade(noteId, 0, 0, -bendAmount + microTuning); //Set new note's initial detuning
		Synth.addPitchFade(noteId, rate*1000, 0, microTuning); //Pitch fade new note to 0

		if (stopTimerFlag == 1 || noteId == -1)
		{
			Synth.stopTimer();
			stopTimerFlag = 0;
		}
	}
}

function onControl(number, value)
{
	switch (number)
	{
		case btnMute:
			notes = [-1, -1];
			Synth.stopTimer();
			setOffsetIntensity(1);
		break;

		case knbRate:
			//If timer's already started then update its Rate
			if (Synth.isTimerRunning())
			{
				rate = getRate();
				Synth.startTimer(rate);
			}

			knbRate.set("text", "Rate"); //Default
			if (knbRate.getValue() == knbRate.get("max"))
			{
				knbRate.set("text", "Velocity");
			}
		break;
	}
}
