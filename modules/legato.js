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

reg coarseDetune = 0;
reg fineDetune = 0;

reg noteId0 = -1;
reg noteId1 = -1;

reg channel;
reg note = -1;
reg retriggerNote = -1;
reg velocity;
reg interval;
reg fadeTm = 10;
reg bendTm = 10;
reg bendAmt = 0;
reg lastTime;
reg offset;
reg rate;
reg isChord = false;
const var bendLookup = []; //Generated on init (onControl) and updated when bend amount changed
reg glideNote;
reg transposition = 0;
const var notes = [];
notes.reserve(2);

//Breath control
reg lastBreathValue = 0;
reg threshold;

//GUI
const var btnMute = Content.addButton("btnMute", 0, 10);
btnMute.set("text", "Mute");
btnMute.set("tooltip", "Enable this to bypass the script. Still responds to hanging notes.");

const var knbOffset = Content.addKnob("knbOffset", 0, 50);
knbOffset.set("text", "Offset");
knbOffset.setRange(0, 1000, 1);
knbOffset.set("suffix", "ms");
knbOffset.set("tooltip", "Sample start offset time for legato and glide notes.");

const var btnRetrigger = Content.addButton("btnRetrigger", 0, 110);
btnRetrigger.set("text", "CC64 Retrigger");
btnRetrigger.set("tooltip", "When enabled sustain pedal is used to retrigger notes, when disabled sustain pedal will hold legato notes.");

const var knbFadeMin = Content.addKnob("knbFadeMin", 150, 0);
knbFadeMin.set("text", "Fade Tm Min");
knbFadeMin.setRange(0, 1000, 1);
knbFadeMin.set("suffix", "ms");
knbFadeMin.set("tooltip", "Minimum legato fade time.");

const var knbFadeMax = Content.addKnob("knbFadeMax", 150, 50);
knbFadeMax.set("text", "Fade Tm Max");
knbFadeMax.setRange(0, 1000, 1);
knbFadeMax.set("suffix", "ms");
knbFadeMax.set("tooltip", "Maximum legato fade time.");

const var knbFadeIntensity = Content.addKnob("knbFadeIntensity", 150, 100);
knbFadeIntensity.set("text", "XFade Intensity");
knbFadeIntensity.setRange(0, 100, 1);
knbFadeIntensity.set("suffix", "%");
knbFadeIntensity.set("tooltip", "Percentage of overall xfade time. If 0% note off mode is enabled");

const var knbBendMin = Content.addKnob("knbBendMin", 300, 0);
knbBendMin.set("text", "Bend Min");
knbBendMin.setRange(0, 100, 1);
knbBendMin.set("suffix", "ct");
knbBendMin.set("tooltip", "Pitch bend amount for 1 semi-tone.");

const var knbBendMax = Content.addKnob("knbBendMax", 300, 50);
knbBendMax.set("text", "Bend Max");
knbBendMax.setRange(0, 100, 1);
knbBendMax.set("suffix", "ct");
knbBendMax.set("tooltip", "Pitch bend amount for 1 octave.");

const var knbBendIntensity = Content.addKnob("knbBendIntensity", 300, 100);
knbBendIntensity.set("text", "Bend Intensity");
knbBendIntensity.setRange(0, 100, 1);
knbBendIntensity.set("suffix", "%");
knbBendIntensity.set("tooltip", "Set the intensity of the bend.");

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

const var knbMaxGlide = Content.addKnob("knbMaxGlide", 450, 150);
knbMaxGlide.set("text", "Max Glide");
knbMaxGlide.setRange(0, 11, 1);
knbMaxGlide.set("tooltip", "Limits the maximum glide interval. A value of 0 means no limit");

//Breath controller GUI
const var btnBc = Content.addButton("btnBc", 600, 10);
btnBc.set("text", "Breath Control");
btnBc.set("tooltip", "Toggles breath controller mode.");

const var knbBreath = Content.addKnob("knbBreath", 600, 50);
knbBreath.set("text", "Breath");
knbBreath.setRange(0, 127, 1);
knbBreath.set("tooltip", "Breath controller knob, value should be set by CC.");
knbBreath.setControlCallback(breathTrigger);

const var knbThreshold = Content.addKnob("knbThreshold", 600, 100);
knbThreshold.set("text", "Trigger Level");
knbThreshold.setRange(10, 127, 1);
knbThreshold.set("defaultValue", 10);
knbThreshold.set("tooltip", "Breath controller trigger threshold.");

const var btnBreathVel = Content.addButton("btnBreathVel", 600, 160)
btnBreathVel.set("text", "Speed = Velocity");

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
    if (g_realVelocity != undefined)
        if (g_realVelocity > 64) fadeTm = fadeTm - (fadeTm * 0.3);
    else
        if (velocity > 64) fadeTm = fadeTm - (fadeTm * 0.3);

    //Apply intensity slider value
    fadeTm = fadeTm / 100 * knbFadeIntensity.getValue();
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
}

//Breath controller handler;
inline function breathTrigger(control, value)
{
    if (!btnMute.getValue() && btnBc.getValue() && !isChord)
    {
        //Going up and reached the threshold
        if (value >= threshold && lastBreathValue < threshold && note != -1)
        {
            //Turn off old note
            if (noteId0 != -1) Synth.noteOffByEventId(noteId0);

            //Breath controlled velocity - if enabled
            if (btnBreathVel.getValue())
                velocity = getBreathVelocity();

            //Play new note
            noteId0 = Synth.playNoteWithStartOffset(channel, note, velocity, 0);
            Synth.addPitchFade(noteId0, 0, coarseDetune, fineDetune);  //Add any detuning
        }
        else if (value < threshold && noteId0 != -1)
        {
            Synth.noteOffByEventId(noteId0);
            noteId0 = -1;
        }

        lastBreathValue = value;
    }
}

//Calculate the velocity based on the breath speed - up to 1 second window
inline function getBreathVelocity()
{
    local timeDiff = Math.min(1, Engine.getUptime()-lastBreathTime) / 1; //Limit timeDiff to 0-1 seconds
    local v = Math.pow(timeDiff, 0.3); //Skew value
    return parseInt(127-(v*117));
}function onNoteOn()
{
    if (!btnMute.getValue())
    {
        Synth.stopTimer(); //Stop the timer (if it's running)

        isChord = (Engine.getUptime() - lastTime) < 0.025;

        //If breath control enabled and value below threshold and not playing a chord
        if (btnBc.getValue() && knbBreath.getValue() < threshold)
            Message.ignoreEvent(true); //Ignore the event

        if (!isChord) //Not a chord
        {
            //Pick up values have been applied to the notes before this point
            coarseDetune = Message.getCoarseDetune();
            fineDetune = Message.getFineDetune();

            if (note != -1 && noteId0 != -1) //If there is a last note
            {
                //Calculate played interval - limit max to 12
                interval = Math.min(Math.abs(note - Message.getNoteNumber()), 12);

                if (Synth.isLegatoInterval() && Synth.isSustainPedalDown() && noteId0 != -1 && (knbMaxGlide.getValue() == 0 || interval <= knbMaxGlide.getValue())) //Glide
                {
                    Message.ignoreEvent(true);

                    //If glide rate determined by velocity
                    if (btnGlideVel.getValue())
                        knbRate.setValue((Message.getVelocity()/127) * 18);

                    transposition = Message.getTransposeAmount();
                    glideNote = note; //First note of glide (same as origin)
                    notes[0] = note; //Origin
                    notes[1] = Message.getNoteNumber(); //Target

                    //Get rate for timer
                    setRate(Math.abs(notes[0] - notes[1]));

                    //Start the timer
                    Synth.startTimer(rate);
                }
                else //Legato
                {
                    //Set global fadeTm value
                    setLegatoFadeTime(interval, Message.getVelocity());

                    //Set global bendAmt value
                    interval > 0 ? bendAmt = bendLookup[interval - 1] : bendAmt = bendLookup[0]; //Get value from lookup table
                    if (note > Message.getNoteNumber()) bendAmt = -bendAmt; //Invert for down interval
                    bendAmt = bendAmt / 100 * knbBendIntensity.getValue(); //Apply bend intensity

                    //Set start offset
                    Message.setStartOffset(offset);

                    //Update eventId
                    noteId1 = Message.makeArtificial();

                    if (knbFadeIntensity.getValue() > 0)
                    {
                        //Fade out old note
                        Synth.addVolumeFade(noteId0, fadeTm, -100); //Volume

                        //Fade in new note
                        Synth.addVolumeFade(noteId1, 0, -99); //Set initial volume
                        Synth.addVolumeFade(noteId1, fadeTm, Message.getGain());

                        if (knbBendIntensity.getValue() > 0)
                        {
                            //Get coarseDetune and fineDetune for new note
                            local fadeCoarse = coarseDetune + parseInt((-bendAmt+fineDetune) / 100);
                            local fadeFine = ((-bendAmt+fineDetune) % 100);

                            Synth.addPitchFade(noteId1, 0, fadeCoarse, fadeFine); //Set initial detuning
                            Synth.addPitchFade(noteId1, fadeTm, coarseDetune, fineDetune); //Fade to final pitch
                        }
                    }
                    else
                    {
                        Synth.noteOffByEventId(noteId0);
                    }

                    noteId0 = noteId1;
                }
            }
            else //First note of phrase
            {
                Message.setGain(0);
                noteId0 = Message.makeArtificial(); //Update eventId
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
            if ((Synth.isSustainPedalDown() == 0 && btnRetrigger.getValue() == 0) || btnRetrigger.getValue()) //CC64 sustain
            {
                Message.ignoreEvent(true);

                if (retriggerNote != -1 && (knbBreath.getValue() > threshold || btnBc.getValue() == 0) && noteId0 != -1)
                {
                    //Play new note
                    noteId1 = Synth.playNoteWithStartOffset(channel, retriggerNote+Message.getTransposeAmount(), velocity, offset);

                    if (knbFadeIntensity.getValue() > 0)
                    {
                        //Fade out old note
                        Synth.addVolumeFade(noteId0, fadeTm, -100); //Volume

                        //Fade in new note
                        Synth.addVolumeFade(noteId1, 0, -99); //Set initial volume
                        Synth.addVolumeFade(noteId1, fadeTm, 0);

                        if (knbBendIntensity.getValue() > 0)
                        {
                            //Get coarseDetune and fineDetune for the new note
                            coarseDetune = Message.getCoarseDetune();
                            fineDetune = Message.getFineDetune();

                            local fadeCoarse = coarseDetune + parseInt((-bendAmt+fineDetune) / 100);
                            local fadeFine = ((-bendAmt+fineDetune) % 100);

                            Synth.addPitchFade(noteId1, 0, fadeCoarse, fadeFine); //Set initial detuning
                            Synth.addPitchFade(noteId1, fadeTm, coarseDetune, fineDetune); //Pitch fade to fineDetune
                        }
                    }
                    else
                    {
                        Synth.noteOffByEventId(noteId0);
                    }

                    //Update variables
                    note = retriggerNote;
                    retriggerNote = -1;
                    noteId0 = noteId1;
                }
                else
                {
                    if (noteId0 != -1) Synth.noteOffByEventId(noteId0);
                    noteId0 = -1;
                    note = -1;
                }
            }

            Synth.stopTimer();
        }
    }
    else if (noteId0 != -1) //Prevent hanging notes
    {
        //Turn off old note
        Synth.noteOffByEventId(noteId0);
        noteId0 = -1;
        note = -1;
        Synth.stopTimer();
    }
}
function onController()
{
    if (!btnMute.getValue())
    {
        //Turn off the last note if the sutain pedal is lifted and last note is still playing
        if (!Synth.isSustainPedalDown() && Synth.getNumPressedKeys() == 0 && noteId0 != -1)
        {
            Synth.noteOffByEventId(noteId0);
            noteId0 = -1;
            note = -1;
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
        if (noteId0 != -1 && notes[0] != -1 && ((notes[1] > notes[0] && glideNote <= notes[1]) || (notes[1] < notes[0] && glideNote >= notes[1])))
        {
            if (notes[0] > notes[1]) glideBend = -glideBend; //Invert bend for down glide
        }
        else
        {
            notes[0] = notes[1]; //Origin becomes target
            glideNote = notes[1];
            Synth.stopTimer();
        }

		if (Synth.isTimerRunning()) //Timer may have been stopped if glide target reached, so check before proceeding
		{
            //Get coarseDetune and fineDetune for the old note
            local fadeCoarse = parseInt(glideBend / 100); //Coarse
            local fadeFine = (glideBend % 100); //Fine

		    //Fade out old note
			Synth.addPitchFade(noteId0, rate*1000, fadeCoarse, fadeFine); //Pitch fade old note to bend amount
			Synth.addVolumeFade(noteId0, rate*1000, -100); //Fade out last note

			//Play new note
			noteId1 = Synth.playNoteWithStartOffset(channel, glideNote+transposition, velocity, offset);

			//Fade in new note
			Synth.addVolumeFade(noteId1, 0, -99); //Set new note's initial volume
			Synth.addVolumeFade(noteId1, rate*1000, 0); //Fade in new note
			Synth.addPitchFade(noteId1, 0, 0, -glideBend); //Set new note's initial detuning
			Synth.addPitchFade(noteId1, rate*1000, coarseDetune, fineDetune); //Pitch fade new note to 0

			noteId0 = noteId1;
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
} 
