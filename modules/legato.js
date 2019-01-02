/*
    Copyright 2018, 2019 David Healey

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

Content.setWidth(730);
Content.setHeight(200);

reg channel;
reg note = -1;
reg retriggerNote = -1;
reg velocity;
reg interval;
reg fadeTm = 10;
reg bendTm = 10;
reg bendAmt = 0;
reg eventId = -1;
reg lastTime;
reg offset;
reg rate;
const var bendLookup = []; //Generated on init (onControl) and updated when bend amount changed
reg glideNote;
const var notes = [];
notes.reserve(2);

//Pitch calculations
reg coarseDetune = 0;
reg fineDetune = 0;
reg fadeInCoarse;
reg fadeInFine;
reg fadeOutCoarse;
reg fadeOutFine;

//Breath control
reg ccTime;
reg ccValue;
reg lastCcValue;
reg threshold;

//GUI
const var btnMute = Content.addButton("btnMute", 0, 10);
btnMute.set("text", "Mute");
btnMute.set("tooltip", "Enable this to bypass the script. Still responds to hanging notes.");

const var knbOffset = Content.addKnob("knbOffset", 150, 0);
knbOffset.set("text", "Offset");
knbOffset.setRange(0, 1000, 1);
knbOffset.set("suffix", "ms");
knbOffset.set("tooltip", "Sample start offset time for legato and glide notes.");

const var knbFadeMin = Content.addKnob("knbFadeMin", 0, 50);
knbFadeMin.set("text", "Fade Tm Min");
knbFadeMin.setRange(0, 1000, 1);
knbFadeMin.set("suffix", "ms");
knbFadeMin.set("tooltip", "Minimum legato fade time.");

const var knbFadeMax = Content.addKnob("knbFadeMax", 150, 50);
knbFadeMax.set("text", "Fade Tm Max");
knbFadeMax.setRange(0, 1000, 1);
knbFadeMax.set("suffix", "ms");
knbFadeMax.set("tooltip", "Maximum legato fade time.");

const var knbFadeOut = Content.addKnob("knbFadeOut", 300, 50);
knbFadeOut.set("text", "Fade Out Ratio");
knbFadeOut.setRange(10, 100, 1);
knbFadeOut.set("suffix", "%");
knbFadeOut.set("tooltip", "Percentage of overall fade time to be used to fade out old notes.");

const var knbBendTm = Content.addKnob("knbBendTm", 0, 100);
knbBendTm.set("text", "Bend Tm");
knbBendTm.setRange(-50, 50, 1);
knbBendTm.set("suffix", "%");
knbBendTm.set("tooltip", "Use this knob to set +-50% of fade time that will be used for bend time.");

const var knbBendMin = Content.addKnob("knbBendMin", 150, 100);
knbBendMin.set("text", "Bend Min");
knbBendMin.setRange(0, 100, 1);
knbBendMin.set("suffix", "ct");
knbBendMin.set("tooltip", "Pitch bend amount for 1 semi-tone.");

const var knbBendMax = Content.addKnob("knbBendMax", 300, 100);
knbBendMax.set("text", "Bend Max");
knbBendMax.setRange(0, 100, 1);
knbBendMax.set("suffix", "ct");
knbBendMax.set("tooltip", "Pitch bend amount for 1 octave.");

const var knbRate = Content.addKnob("knbRate", 450, 0);
knbRate.set("text", "Glide Rate");
knbRate.set("mode", "TempoSync");
knbRate.set("tooltip", "Rate for glide timer relative to current tempo.");

const var btnGlideVel = Content.addButton("btnGlideVel", 450, 60);
btnGlideVel.set("text", "Velocity = Rate");
btnGlideVel.set("tooltip", "When enabled glide rate knob will be controlled by note on velocity.");

const var btnWholeStep = Content.addButton("btnWholeStep", 450, 110);
btnWholeStep.set("text", "Whole Step Glide");
btnWholeStep.set("tooltip", "When enabled glides will be per whole step rather than each semi-tone.");

//Breath controller GUI
const var btnBc = Content.addButton("btnBc", 600, 10);
btnBc.set("text", "Breath Control");
btnBc.set("tooltip", "Toggles breath controller mode.");

const var knbBcSkew = Content.addKnob("knbBcSkew", 600, 150);
knbBcSkew.set("text", "Skew");
knbBcSkew.setRange(0, 1, 0.1);
knbBcSkew.set("tooltip", "Breath controller velocity skew factor.");

const var btnRetrigger = Content.addButton("btnRetrigger", 0, 160);
btnRetrigger.set("text", "CC64 Retrigger");
btnRetrigger.set("tooltip", "When enabled sustain pedal is used to retrigger notes, when disabled sustain pedal will hold legato notes.");

const var knbCC = Content.addKnob("knbCC", 600, 50);
knbCC.set("text", "Breath CC");
knbCC.setRange(1, 127, 1);
knbCC.set("tooltip", "Select the CC used in breath controller mode.");

const var knbThreshold = Content.addKnob("knbThreshold", 600, 100);
knbThreshold.set("text", "Trigger Level");
knbThreshold.setRange(10, 127, 1);
knbThreshold.set("tooltip", "Breath controller trigger threshold.");

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

inline function setLegatoFadeTime(interval, velocity)
{
    local fadeMin = knbFadeMin.getValue();
    local fadeMax = knbFadeMax.getValue();

    //fadeTm is time between notes / 2 (*500), limited to upper and lower range
    fadeTm = Math.range((Engine.getUptime() - lastTime) * 500, fadeMin, fadeMax);

    //Adjust fadeTm based on interval
    fadeTm = fadeTm + (interval * 2);

    //Reduce fadeTm by 30% is velocity > 64
    if (velocity > 64) fadeTm = fadeTm - (fadeTm * 0.3);
}

inline function setBreathVelocity()
{
    local timeDiff = Math.min(1, Engine.getUptime()-ccTime) / 1; //Limit timeDiff to 0-1
    local v = Math.pow(timeDiff, knbBcSkew.getValue()); //Skew values
    velocity = parseInt(127-(v*117));
    ccTime = 0;
}

/**
 * Returns the timer rate for glides
 * @param  {number} interval [The distance between the two notes that will be glided]
 * @return {number}          [Timer rate]
 */
inline function setRate(interval)
{
	rate = knbRate.getValue(); //Get rate knob value

	rate = Engine.getMilliSecondsForTempo(rate) / 1000; //Rate to milliseconds for timer

	rate = Math.max(0.04, rate / interval); //Rate is per glide step - capped at timer's min
}function onNoteOn()
{
    if (!btnMute.getValue())
    {
        Synth.stopTimer(); //Stop the timer (if it's running)

        if ((Engine.getUptime() - lastTime) > 0.025) //Not a chord
        {
            //Pick up any detuning that has been applied to the notes by other scripts
            coarseDetune = Message.getCoarseDetune();
            fineDetune = Message.getFineDetune();

            if (btnBc.getValue() && ccValue < 2) //If breath controller enabled and the bcc is below 2
            {
                Message.ignoreEvent(true); //Ignore the event
            }
            else if (Synth.isLegatoInterval() && Synth.isSustainPedalDown()) //Glide
            {
                Message.ignoreEvent(true);

                //Glide rate determined by velocity
                if (btnGlideVel.getValue())
                {
                    knbRate.setValue((Message.getVelocity()/127) * 18);
                }

                glideNote = note; //First note of glide (same as origin)
                notes[0] = note; //Origin
                notes[1] = Message.getNoteNumber(); //Target

                //Get rate for timer
                setRate(Math.abs(notes[0] - notes[1]));

                //Start the timer
                Synth.startTimer(rate);
            }
            else if (note != -1) //Legato
            {
                //Calculate played interval - limit max to 12
                interval = Math.min(Math.abs(note - Message.getNoteNumber()), 12);

                //Set global fadeTm value
                setLegatoFadeTime(interval, Message.getVelocity());

                //Set global bendTm value
                bendTm = fadeTm / 100 * (100 + knbBendTm.getValue());

                //Set global bendAmt value
                interval > 0 ? bendAmt = bendLookup[interval - 1] : bendAmt = bendLookup[0]; //Get value from lookup table
                if (note > Message.getNoteNumber()) bendAmt = -bendAmt; //Invert for down interval

                //Set start offset
                Message.setStartOffset(offset);

                //Get coarseDetune and fineDetune for old notes
                fadeOutCoarse = coarseDetune + parseInt((bendAmt+fineDetune) / 100);
                fadeOutFine = ((bendAmt+fineDetune) % 100);

                //Get coarseDetune and fineDetune for new note
                fadeInCoarse = coarseDetune + parseInt((-bendAmt+fineDetune) / 100);
                fadeInFine = ((-bendAmt+fineDetune) % 100);

                //Fade out old note
                Synth.addVolumeFade(eventId, fadeTm / 100 * knbFadeOut.getValue(), -100); //Volume
                Synth.addPitchFade(eventId, bendTm / 100 * knbFadeOut.getValue(), fadeOutCoarse, fadeOutFine); //Pitch

                //Update eventId
                eventId = Message.makeArtificial();

                //Fade in new note
                Synth.addVolumeFade(eventId, 0, -99); //Set initial volume
                Synth.addVolumeFade(eventId, fadeTm, 0);

                Synth.addPitchFade(eventId, 0, fadeInCoarse, fadeInFine); //Set initial detuning
                Synth.addPitchFade(eventId, bendTm, coarseDetune, fineDetune); //Pitch fade to fineDetune
            }
            else //First note of phrase
            {
                eventId = Message.makeArtificial(); //Update eventId
                Synth.addPitchFade(eventId, 0, coarseDetune, fineDetune); //Set initial detuning
            }

            //Update variables
            channel = Message.getChannel();
            retriggerNote = note;
            note = Message.getNoteNumber();
            velocity = Math.max(1, Message.getVelocity());
            lastTime = Engine.getUptime();
        }
    }
}
function onNoteOff()
{
    if (!btnMute.getValue())
    {
        //Pick up any detuning that has been applied to the notes before this point
        coarseDetune = Message.getCoarseDetune();
        fineDetune = Message.getFineDetune();

        if (Message.getNoteNumber() == retriggerNote)
        {
            retriggerNote = -1;
        }

        //Sustain pedal retrigger
		if (Synth.isSustainPedalDown() && btnRetrigger.getValue())
		{
            retriggerNote = note; //Retrigger note becomes the last note
		}

        if (Message.getNoteNumber() == note)
        {
            ccTime = 0;

            if ((Synth.isSustainPedalDown() == 0 && btnRetrigger.getValue() == 0) || btnRetrigger.getValue()) //CC64 sustain
            {
                Message.ignoreEvent(true);

                if (retriggerNote != -1)
                {
                    //Fade out old note
                    Synth.addVolumeFade(eventId, fadeTm / 100 * knbFadeOut.getValue(), -100); //Volume
                    Synth.addPitchFade(eventId, bendTm / 100 * knbFadeOut.getValue(), fadeOutCoarse, fadeOutFine); //Pitch

                    //Play new note
                    eventId = Synth.playNoteWithStartOffset(channel, retriggerNote, velocity, offset);

                    //Fade in new note
                    Synth.addVolumeFade(eventId, 0, -99); //Set initial volume
                    Synth.addVolumeFade(eventId, fadeTm, 0);

                    Synth.addPitchFade(eventId, 0, fadeInCoarse, fadeInFine); //Set initial detuning
                    Synth.addPitchFade(eventId, bendTm, coarseDetune, fineDetune); //Pitch fade to fineDetune

                    //Update variables
                    note = retriggerNote;
                    retriggerNote = -1;
                }
                else
                {
                    if (eventId != -1) Synth.noteOffByEventId(eventId);
                    eventId = -1;
                    note = -1;
                }
            }

            Synth.stopTimer();
        }
    }
    else if (eventId != -1) //Prevent hanging notes
    {
        //Turn off old note
        Synth.noteOffByEventId(eventId);
        eventId = -1;
        note = -1;
        Synth.stopTimer();
    }
}
function onController()
{
    if (!btnMute.getValue())
    {
        //Turn off the last note if the sutain pedal is lifted and last note is still playing
        if (!Synth.isSustainPedalDown() && Synth.getNumPressedKeys() == 0 && eventId != -1)
        {
            Synth.noteOffByEventId(eventId);
            eventId = -1;
            note = -1;
        }

        //Breath controller handler;
        if (btnBc.getValue())
        {
            if (Message.getControllerNumber() == knbCC.getValue())
            {
                ccValue = Message.getControllerValue();

                //Going up but haven't reached threshold
                if (ccValue < threshold && ccValue > lastCcValue && ccTime == 0 && note != -1)
                {
                    ccTime = Engine.getUptime();
                }

                //Going up and reached the threshold
                if (ccValue >= threshold && lastCcValue < threshold && ccTime > 0 && note != -1)
                {
                    //Calculate velocity based on breath attack
                    setBreathVelocity();

                    //Turn off old note
                    if (eventId != -1) Synth.noteOffByEventId(eventId);

                    //Play new note
                    eventId = Synth.playNoteWithStartOffset(channel, note, velocity, 0);
                    Synth.addPitchFade(eventId, 0, coarseDetune, fineDetune);  //Add any detuning
                }

                if (ccValue < 2 && eventId != -1)
                {
                    Synth.noteOffByEventId(eventId);
                    eventId = -1;
                }

                lastCcValue = ccValue;
            }
        }
    }
}
function onTimer()
{
    if (!btnMute.getValue())
	{
	    local glideBend = 100;

        notes[1] > notes[0] ? glideNote++ : glideNote--; //Increment/decrement the glideNote number by 1 (a half step)

        //If the whole step button is enabled then increment/decrement the glideNote by another half step
        if (btnWholeStep.getValue()) notes[1] > notes[0] ? glideNote++ : glideNote--;

        //If glide has not completed - i.e. it hasn't reached the target note yet
        if (eventId != -1 && notes[0] != -1 && ((notes[1] > notes[0] && glideNote <= notes[1]) || (notes[1] < notes[0] && glideNote >= notes[1])))
        {
            if (notes[0] > notes[1]) glideBend = -glideBend; //Invert bend for down glide

            //Get coarseDetune and fineDetune for the old note
            fadeOutCoarse = coarseDetune + parseInt((glideBend+fineDetune) / 100); //Coarse
            fadeOutFine = ((glideBend+fineDetune) % 100); //Fine

            //Get coarseDetune and fineDetune for the new note
            fadeInCoarse = coarseDetune + parseInt((-glideBend+fineDetune) / 100); //Coarse
            fadeInFine = ((-glideBend+fineDetune) % 100); //Fine
        }
        else
        {
            notes[0] = notes[1]; //Origin becomes target
            glideNote = notes[1];
            Synth.stopTimer();
        }

		if (Synth.isTimerRunning()) //Timer may have been stopped if glide target reached, so check before proceeding
		{
		    //Fade out old note
			Synth.addPitchFade(eventId, rate*1000, fadeOutCoarse, fadeOutFine); //Pitch fade old note to bend amount
			Synth.addVolumeFade(eventId, rate*1000, -100); //Fade out last note

			//Play new note
			eventId = Synth.playNoteWithStartOffset(channel, glideNote, velocity, offset);

			//Fade in new note
			Synth.addVolumeFade(eventId, 0, -99); //Set new note's initial volume
			Synth.addVolumeFade(eventId, rate*1000, 0); //Fade in new note
			Synth.addPitchFade(eventId, 0, fadeInCoarse, fadeInFine); //Set new note's initial detuning
			Synth.addPitchFade(eventId, rate*1000, coarseDetune, fineDetune); //Pitch fade new note to 0
		}
	}
}
function onControl(number, value)
{
	switch (number)
    {
        case knbOffset:
            offset = Engine.getSamplesForMilliSeconds(value);
        break;

        case knbBendMin: case knbBendMax:
            updateBendLookupTable(knbBendMin.getValue(), knbBendMax.getValue());
        break;

		case knbRate:
			if (Synth.isTimerRunning()) //If timer's already started then update its Rate
			{
				setRate(Math.abs(notes[0] - notes[1]));
				Synth.startTimer(rate);
			}
		break;

		case knbThreshold:
		    threshold = value;
		break;
    }
}
