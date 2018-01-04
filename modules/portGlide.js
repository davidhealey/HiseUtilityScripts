/**
 * Title: portGlide.js
 * Author: David Healey
 * Date: 30/06/2017
 * Modified: 03/12/2017
 * License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.en.html
*/

reg note = -1;
reg noteId = -1;
reg origin = -1;
reg target = -1; //Last note of the run
reg velocity; //Velocity of the target note
reg rate; //Tempo - taken from the host - to play the glide at.
reg interval;

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
Content.setWidth(650);
Content.setHeight(100);

const var btnMute = Content.addButton("btnMute", 0, 10);
btnMute.set("text", "Mute");

const var knbOffset = Content.addKnob("knbOffset", 150, 0);
knbOffset.setRange(0, 1, 0.01);
knbOffset.set("text", "Offset");

const var knbRate = Content.addKnob("knbRate", 300, 0);
knbRate.set("mode", "TempoSync");
knbRate.set("text", "Rate");
knbRate.set("max", 11);

const var btnWholeStep = Content.addButton("btnWholeStep", 450, 10);
btnWholeStep.set("text", "Whole Step");

const var knbMinInt = Content.addKnob("knbMinInt", 0, 50);
knbMinInt.setRange(1, 24, 1);
knbMinInt.set("text", "Min Interval");
knbMinInt.set("suffix", "st");

const var knbMaxInt = Content.addKnob("knbMaxInt", 150, 50);
knbMaxInt.setRange(1, 36, 1);
knbMaxInt.set("text", "Max Interval");
knbMaxInt.set("suffix", "st");

const var knbBendAmount = Content.addKnob("knbBendAmount", 300, 50);
knbBendAmount.setRange(0, 100, 1);
knbBendAmount.set("text", "Bend Amount");
knbBendAmount.set("suffix", "Ct");

inline function getRate(range, velocity)
{
	reg rate = knbRate.getValue(); //Get rate knob value

	//If rate knob is set to the maximum then the actual rate will be determined by velocity
	if (rate == knbRate.get("max"))
	{
		rate = Math.floor((velocity / (knbRate.get("max") - 1)));

		if (rate > knbRate.get("max")) rate = max-1; //Cap rate at max rate
	}

	rate = (Engine.getMilliSecondsForTempo(rate) / 1000) / range; //Get rate based on host tempo and selected knob value

	if (rate < 0.04) rate = 0.04; //Cap lowest rate at timer's minimum

	return rate;
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

		if (origin != -1) interval = Math.abs(origin - Message.getNoteNumber()); //Calculate interval

		//In interval range or no note played yet
		if ((interval >= knbMinInt.getValue() && interval <= knbMaxInt.getValue()) || noteId == -1)
		{
			if (noteId != -1 && origin != -1)
			{
				setOffsetIntensity(knbOffset.getValue());

				note = origin;
				target = Message.getNoteNumber();
				velocity = Message.getVelocity();

				rate = getRate(Math.abs(origin - target), velocity);

				Synth.startTimer(rate);
			}
			else if (origin == -1) //Origin has not yet been played
			{
				setOffsetIntensity(1);
				origin = Message.getNoteNumber();
				noteId = Synth.playNote(origin, Message.getVelocity()); //Play first note
			}
		}
	}
}

function onNoteOff()
{
	if (!btnMute.getValue())
	{
		if (Message.getNoteNumber() == origin || Message.getNoteNumber() == target)
		{
			Message.ignoreEvent(true);

			if (Message.getNoteNumber() == target) //Target released
			{
				Synth.stopTimer();
				if (noteId != -1) Synth.noteOffByEventId(noteId);
				origin = -1;
				noteId = -1;
				target = -1;
			}

			if (!Synth.isKeyDown(origin) && !Synth.isKeyDown(target) && noteId != -1) //Both keys have been lifted
			{
				Synth.stopTimer();
				Synth.noteOffByEventId(noteId);
				noteId = -1;
				origin = -1;
				target = -1;
			}
		}
	}
	else
	{
		//Turn off hanging note, if any
		if (noteId != -1)
		{
			Synth.noteOffByEventId(noteId);
			noteId = -1;
			origin = -1;
			target = -1;
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
		target > origin ? note++ : note--; //Increment/decrement the note number by 1 (a half step)

		//If the whole step button is enabled then increment/decrement the note by another half step
		if (btnWholeStep.getValue())
		{
			target > origin ? note++ : note--;
		}

		if (noteId != -1 && origin != -1 && ((target > origin && note <= target) || (target < origin && note >= target)))
		{
			bendAmount = knbBendAmount.getValue();

			if (origin > target) bendAmount = -bendAmount;

			Synth.addVolumeFade(noteId, rate*1000, -100); //Fade out old note
			Synth.addPitchFade(noteId, rate*1000, 0, bendAmount); //Pitch fade old note to bend amount

			noteId = Synth.playNote(note, velocity); //Play new note and store its ID

			Synth.addVolumeFade(noteId, 0, -99); //Set new note's initial volume
			Synth.addVolumeFade(noteId, rate*1000, 0); //Fade in new note
			Synth.addPitchFade(noteId, 0, 0, -bendAmount); //Set new note's initial detuning
			Synth.addPitchFade(noteId, rate*1000, 0, 0); //Pitch fade new note to 0

		}
		else
		{
			origin = target;
			note = target;
			Synth.stopTimer();
		}
	}
}

function onControl(number, value)
{
	switch (number)
	{
		case btnMute:

			origin = -1;
			target = -1;

			Synth.stopTimer();
			setOffsetIntensity(1);
		break;

		case knbRate:
			//If timer's already started then update its Rate
			if (Synth.isTimerRunning() == 1)
			{
				rate = getRate(Math.abs(origin - target), velocity);
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
