/*
    Copyright 2018 David Healey

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

reg lastChan = 0;
reg lastNote = -1;
reg lastEventId = -1;
reg retriggerNote = -1;
reg lastVelo = 0;
reg lastTime;
reg interval;
reg fadeTime;
reg bendTime;
reg bendAmount = 0;
reg bendLookup = []; //Bend amount lookup table - generated on init (onControl) and updated when bend amount changed

reg glideBend; //The bend amount for glides, either 100 or -100 depending on if an up or down glide
reg glideNote; //Currently sounding note during a glide
reg rate; //Timer rate for glide/trill
reg notes = []; //Origin and target notes for glide/trill
notes.reserve(2);
reg count; //Counter for switching between origin and target notes for trill

//Loop iterators
reg i;
reg j;

const var CHORD_THRESHOLD = 25; //If two notes are played within this many milliseconds then it's a chord

//GUI
Content.setWidth(700);
Content.setHeight(150);

const var btnBypass = Content.addButton("Sustain", 0, 10);
btnBypass.set("radioGroup", 1);

const var btnLegato = Content.addButton("Legato", 150, 10);
btnLegato.set("radioGroup", 1);

const var btnGlide = Content.addButton("Glide", 300, 10);
btnGlide.set("radioGroup", 1);

const var btnWholeStep = Content.addButton("Whole Step Glide", 450, 10);
btnWholeStep.set("tooltip", "When active each step of a glide will be a whole tone rather than chromatic.");

const var knbBendTm = Content.addKnob("Bend Time", 0, 50);
knbBendTm.setRange(-50, 50, 0.1);
knbBendTm.set("suffix", "ms");
knbBendTm.set("tooltip", "The pitch bend lasts the same duration as the crossfade time by default but can be adjusted with this knob. If the bend time ends up being less than 0 it will automatically (behind the scenes) be set to 10ms.");

const var knbMinBend = Content.addKnob("Min Bend", 150, 50);
knbMinBend.setRange(0, 100, 1);
knbMinBend.set("suffix", "ct");
knbMinBend.set("tooltip", "The amount of pitch bend in cents (ct) for an interval of 1 semitone");

const var knbMaxBend = Content.addKnob("Max Bend", 300, 50);
knbMaxBend.setRange(0, 100, 1);
knbMaxBend.set("suffix", "ct");
knbMaxBend.set("tooltip", "The amount of pitch bend in cents (ct) for an interval of 12 semitones");

const var knbFadeTm = Content.addKnob("Fade Time", 450, 50);
knbFadeTm.setRange(10, 500, 0.1);
knbFadeTm.set("suffix", "ms");
knbFadeTm.set("tooltip", "Maximum crossfade time in milliseconds, the actual time used will vary based on playing speed and velocity.");

const knbFadeOutRatio = Content.addKnob("Fade Out Ratio", 600, 50);
knbFadeOutRatio.setRange(0, 100, 1);
knbFadeOutRatio.set("defaultValue", 100);
knbFadeOutRatio.set("text", "Fade Out Ratio");
knbFadeOutRatio.set("suffix", "%");
knbFadeOutRatio.set("tooltip", "Shortens the fade out time to a percentage of the fade time. 100% = the same as fade in time.");

const var knbOffset = Content.addKnob("Offset", 0, 100);
knbOffset.setRange(0, 1, 0.01);
knbOffset.set("mode", "NormalizedPercentage");
knbOffset.set("tooltip", "Sets the startMod constant modulator (required) for legato phrase and glide notes.");

const var knbRate = Content.addKnob("Glide Rate", 150, 100);
knbRate.set("mode", "TempoSync");
knbRate.set("max", 19);
knbRate.set("tooltip", "Rate for glide timer relative to current tempo. If velocity is selected then the glide time will be based on the played velocity.");

const var btnSameNote = Content.addButton("Same Note Legato", 300, 110);
btnSameNote.set("tooltip", "When active releasing a note in normal legato mode will retrigger the note that was released with a transition.");

const var btnKillOld = Content.addButton("Kill Old Notes", 450, 110);
btnKillOld.set("tooltip", "If enabled old notes will be turned off, triggering releases, rather than faded out. Use an evelope to control the fade out time when enabled.");

//FUNCTIONS

/**
 * A lookup table is used for pitch bending to save CPU. This function fills that lookup table based on the min bend and max bend values.
 * @param  {number} minBend The amount of bend for an interval of 1 semitone
 * @param  {number} maxBend The amount of bend for an interval of 12 semitones
  */
inline function updateBendLookupTable(minBend, maxBend)
{
	for (i = 0; i < 12; i++) //Each semitone
	{
		bendLookup[i] = ((i + 1) * (maxBend - minBend)) / 12 + minBend;
	}
}

/**
 * Returns the timer rate for glides
 * @param  {number} interval [The distance between the two notes that will be glided]
 * @param  {number} velocity [A velocity value for velocity based glide rates]
 * @return {number}          [Timer rate]
 */
inline function getRate(interval, velocity)
{
	local rate = knbRate.getValue(); //Get rate knob value
	local invl = interval;

	//If rate knob is set to the maximum then the actual rate will be determined by velocity
	if (rate == knbRate.get("max"))
	{
		rate = Math.min(knbRate.get("max")-1, Math.floor((velocity / (knbRate.get("max") - 1)))); //Capped rate at max rate
		invl = interval + 3; //Increase interval to improve velocity controlled resolution
	}

	rate = Engine.getMilliSecondsForTempo(rate) / 1000; //Rate to milliseconds for timer

	rate = Math.max(0.04, rate / invl); //Rate is per glide step - capped at timer's min

	return rate;
}

/**
* Helper function to turn off the last recorded note and reset its related variables
*/
inline function turnOffLastNote()
{
    Synth.noteOffByEventId(lastEventId);
    lastEventId = -1;
    lastNote = -1;
}

/**
* For switching between the three modes (sustain, legato, glide) internally
* and making sure each button is set to the correct value.
*/
inline function changeMode(mode)
{
    //Turn off all buttons
    btnLegato.setValue(0);
    btnGlide.setValue(0);
    btnBypass.setValue(0);

    //Enable passed mode
    if (mode == 0) btnBypass.setValue(1); //Sustain
    if (mode == 1) btnLegato.setValue(1); //Legato
    if (mode == 2) btnGlide.setValue(1); //Glide
}function onNoteOn()
{
	if (!btnBypass.getValue())
	{
		Synth.stopTimer();

		//Pick up any detuning that has been applied to the notes before this point
		local coarseDetune = Message.getCoarseDetune();
		local fineDetune = Message.getFineDetune();

		//Switch between legato and glide based on sustain pedal
	    if (btnLegato.getValue() && Synth.isLegatoInterval() && Synth.isSustainPedalDown())
	    {
            changeMode(2); //Switch to glide mode
            btnSameNote.setValue(0); //Turn off same note legato
	    }

		if ((Engine.getUptime() - lastTime) * 1000 > CHORD_THRESHOLD) //Not a chord
		{
			if (lastNote != -1) //First note of phrase has already been played
			{
				interval = Math.abs(Message.getNoteNumber() - lastNote); //Get played interval
				fadeTime = knbFadeTm.getValue();
				bendTime = fadeTime + knbBendTm.getValue(); //Get bend time

				//Get bend amount
				bendAmount = 0;
				if (interval != 0) //Not same note legato
				{
					interval > 12 ? bendAmount = bendLookup[11] : bendAmount = bendLookup[interval - 1]; //Get bend amount from lookup table
					if (lastNote > Message.getNoteNumber()) bendAmount = -bendAmount; //Invert bend amount for down interval
				}

				if (btnGlide.getValue()) //Glide mode
				{
			        Message.ignoreEvent(true);

					count = 0; //Reset count, for trills
					notes[0] = lastNote; //Origin
					notes[1] = Message.getNoteNumber();; //Target
					glideNote = lastNote; //First glide note is the same as the origin
					lastVelo = Message.getVelocity();

					rate = getRate(Math.abs(notes[0] - notes[1]), lastVelo);

					Synth.startTimer(rate);
				}
				else //Legato mode
				{
				    if (btnKillOld.getValue() == 0) //Old notes are faded out
				    {
					    Synth.addVolumeFade(lastEventId, fadeTime / 100 * knbFadeOutRatio.getValue(), -100); //Fade out old note
					    Synth.addPitchFade(lastEventId, bendTime / 100 * knbFadeOutRatio.getValue(), 0, fineDetune + bendAmount); //Pitch fade old note
				    }
				    else //Old notes are turned off, use envelope release to control fade out
				    {
				        Synth.noteOffByEventId(lastEventId);
				    }

					retriggerNote = lastNote;

					Message.setStartOffset(Engine.getSamplesForMilliSeconds(knbOffset.getValue()*500)); //Apply offset time to phrase note
					lastEventId = Message.makeArtificial();

					Synth.addVolumeFade(lastEventId, 0, -99); //Set new note's initial volume
					Synth.addVolumeFade(lastEventId, fadeTime, 0); //Fade in new note

					Synth.addPitchFade(lastEventId, 0, coarseDetune, fineDetune - bendAmount); //Set new note's initial detuning
					Synth.addPitchFade(lastEventId, bendTime, coarseDetune, fineDetune); //Pitch fade new note to 0 (or fineDetune)
				}
			}
			else //First note of phrase
			{
				lastEventId = Message.makeArtificial();
				Synth.addPitchFade(lastEventId, 0, coarseDetune, fineDetune); //Pass on any message detuning to new note
			}

			lastChan = Message.getChannel();
			lastNote = Message.getNoteNumber();
			lastVelo = Message.getVelocity();
			lastTime = Engine.getUptime();
		}
	}
}

function onNoteOff()
{
	if (!btnBypass.getValue())
	{
		Synth.stopTimer();

		if (Message.getNoteNumber() == retriggerNote)
		{
			retriggerNote = -1;
		}

		//Legato mode active and same note legato button enabled
		if (btnLegato.getValue() && btnSameNote.getValue())
		{
			retriggerNote = lastNote; //Retrigger note becomes the last note
		}

		if (Message.getNoteNumber() == lastNote)
		{
			Message.ignoreEvent(true);

			if (retriggerNote != -1)
			{
				if (btnKillOld.getValue() == 0)
				{
				    Synth.addVolumeFade(lastEventId, fadeTime / 100 * knbFadeOutRatio.getValue(), -100); //Fade out old note
				    Synth.addPitchFade(lastEventId, bendTime / 100 * knbFadeOutRatio.getValue(), 0, bendAmount); //Pitch fade old note
				}
				else
		    {
		        Synth.noteOffByEventId(lastEventId);
		    }

				lastEventId = Synth.playNoteWithStartOffset(lastChan, retriggerNote, lastVelo, Engine.getSamplesForMilliSeconds(knbOffset.getValue()*500));

				Synth.addVolumeFade(lastEventId, 0, -99); //Set new note's initial volume
				Synth.addVolumeFade(lastEventId, fadeTime, 0); //Fade in new note

				lastNote = retriggerNote;
				retriggerNote = -1;
			}
			else
			{
                turnOffLastNote();
			}
		}
	}
	else //Script is bypassed
	{
		//Turn off any hanging notes
		if (lastEventId != -1)
		{
            turnOffLastNote();
		}
	}
}

function onController()
{
    if (Message.getControllerNumber() == 64) //Sustain pedal
    {
        if (btnGlide.getValue() && !Synth.isSustainPedalDown()) //Glide mode, and sustain pedal up
        {
            changeMode(1); //Switch to legato mode
        }
        else
        {
            btnSameNote.setValue(Synth.isSustainPedalDown()); //Use sustain pedal to toggle same note legato

            //Turn off the last note if the sutain pedal is lifted and last note is still playing
            if (!Synth.isSustainPedalDown() && Synth.getNumPressedKeys() == 0 && lastEventId != -1)
            {
                turnOffLastNote();
            }
        }
    }

}
function onTimer()
{
	if (!btnBypass.getValue())
	{
		if (btnGlide.getValue()) //Glide
		{
			notes[1] > notes[0] ? glideNote++ : glideNote--; //Increment/decrement the glideNote number by 1 (a half step)

			//If the whole step button is enabled then increment/decrement the glideNote by another half step
			if (btnWholeStep.getValue())
			{
				notes[1] > notes[0] ? glideNote++ : glideNote--;
			}

			//If glide has not completed - i.e. it hasn't reached the target note yet
			if (lastEventId != -1 && notes[0] != -1 && ((notes[1] > notes[0] && glideNote <= notes[1]) || (notes[1] < notes[0] && glideNote >= notes[1])))
			{
				glideBend = 100;
				if (notes[0] > notes[1]) glideBend = -glideBend;
			}
			else
			{
				notes[0] = notes[1]; //Origin becomes target
				glideNote = notes[1];
				Synth.stopTimer();
			}
		}

		if (Synth.isTimerRunning()) //Timer may have been stopped if glide target reached, so check before proceeding
		{
			Synth.addPitchFade(lastEventId, rate*1000, 0, glideBend); //Pitch fade old note to bend amount
			Synth.addVolumeFade(lastEventId, rate*1000, -100); //Fade out last note

			lastEventId = Synth.playNoteWithStartOffset(lastChan, glideNote, lastVelo, Engine.getSamplesForMilliSeconds(knbOffset.getValue()*500));

			Synth.addVolumeFade(lastEventId, 0, -99); //Set new note's initial volume
			Synth.addVolumeFade(lastEventId, rate*1000, 0); //Fade in new note
			Synth.addPitchFade(lastEventId, 0, 0, -glideBend); //Set new note's initial detuning
			Synth.addPitchFade(lastEventId, rate*1000, 0, 0); //Pitch fade new note to 0
		}
	}
}

function onControl(number, value)
{
	switch (number)
	{
		case btnBypass: case btnLegato: case btnGlide:
			Synth.stopTimer();
			btnSameNote.setValue(0);
		break;

		case knbMinBend: case knbMaxBend:
			updateBendLookupTable(knbMinBend.getValue(), knbMaxBend.getValue()); //Update the bend amount lookup table
		break;

		case knbFadeTm:
			fadeTime = value; //Default fade time
		break;

		case knbRate:
			//If timer's already started then update its Rate
			if (Synth.isTimerRunning())
			{
				rate = getRate(Math.abs(notes[0] - notes[1]), lastVelo);
				Synth.startTimer(rate);
			}

			knbRate.set("text", "Rate"); //Default text
			if (knbRate.getValue() == knbRate.get("max")) knbRate.set("text", "Velocity");
		break;

		case btnSameNote:

			if (value == 0 && !Synth.isKeyDown(lastNote) && lastEventId != -1)
			{
	            turnOffLastNote();
			}

			retriggerNote = -1;
		break;

		case btnKillOld:
		    knbFadeOutRatio.showControl(1-value);
		break;
	}
}
 
