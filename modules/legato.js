/**
 * Title: legato
 * Author: David Healey
 * License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.en.html
*/

reg inPhrase = 0;
reg lastNote = -1;
reg lastEventId = -1;
reg retriggerNote = -1;
reg lastVelo = 0;
reg lastTime;
reg interval;
reg fadeTime;
reg bendTime;

reg bendAmount = 0;
reg bendLookup = []; //Bend amount lookup table - generated on init and updated when bend amount changed

reg glideBend; //The bend amount for glides, either 100 or -100 depending on if an up or down glide
reg glideNote; //Currently sounding note during a glide
reg rate; //Timer rate for glide/trill
reg notes = []; //Origin and target notes for glide/trill
reg count; //Counter for switching between origin and target notes for trill

reg CHORD_THRESHOLD = 25; //If two notes are played within this many milliseconds then it's a chord

//Get all child sample start constant modulators
const var constantModIds = Synth.getIdList("Constant"); //Get child constant modulator names
const var velocityModIds = Synth.getIdList("Velocity Modulator"); //Get child velocity modulator names

var constantMod; //Offseting start position during transition
var velocityMod; //Optional, for offsetting start position for first note based on velocity

//Get constant start time modulator
for (m in constantModIds)
{
	if (Engine.matchesRegex(m, "(?=.*tart)(?=.*od)")) //Sample start offset
    {
	    constantMod = Synth.getModulator(m);
    }
	
}

//Get velocity start time modulator
for (m in velocityModIds)
{
	if (Engine.matchesRegex(m, "(?=.*tart)(?=.*od)")) //Sample start offset
	{
		velocityMod = Synth.getModulator(m);
	}
}

//GUI
Content.setWidth(700);
Content.setHeight(150);

const var btnBypass = Content.addButton("Bypass", 0, 10);
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
knbOffset.set("tooltip", "Sets the startMod constant modulator (required) for legato phrase and glide notes.");

const var knbRate = Content.addKnob("Rate", 150, 100);
knbRate.set("mode", "TempoSync");
knbRate.set("max", 19);
knbRate.set("tooltip", "Rate for glide timer relative to current tempo. If velocity is selected then the glide time will be based on the played velocity.");

const var btnSameNote = Content.addButton("Same Note Legato", 300, 110);
btnSameNote.set("tooltip", "When active releasing a note in normal legato mode will retrigger the note that was released with a transition.");

//FUNCTIONS
/**
 * Sets the sample start offset constant modulators to the given value.
 * @param {number} value Constant modulator value between 0 and 1
 */
inline function setModulators(value)
{
    if (velocityMod) //Instrument has velocity based start modulation
    {
        velocityMod.setIntensity(1-(value > 0)); //Set to min/max depending on value
    }
    
    if (constantMod) //Instrument has constant based start modulation
    {
        constantMod.setIntensity(value);
    }
}

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
 * The fade time to be used when crossfading legato notes
 * @param  {number} interval Distance between the two notes that will be crossfaded
 * @param  {number} velocity Velocity of the note that will be faded in, a higher velocity = shorter fade time
 * @return {number}          Crossfade time in ms
 */
inline function getFadeTime(interval, velocity)
{
	local timeDif = (Engine.getUptime() - lastTime) * 1000; //Get time difference between now and last note
	local fadeTime = timeDif; //Default fade time is played time difference

	if (timeDif <= knbFadeTm.getValue() * 0.5) fadeTime = knbFadeTm.getValue() * 0.5; //Fade time minimum is 50% of knbFadeTm.getValue() - when playing fast
	if (timeDif >= knbFadeTm.getValue()) fadeTime = knbFadeTm.getValue();

	fadeTime = fadeTime + (interval * 2); //Adjust the fade time based on the interval size

    if (velocity > 64) fadeTime = fadeTime - (fadeTime * 0.2); //If a harder velocity is played reduce the fade time by 20%

	return fadeTime;
}

/**
 * Returns the timer rate for glides
 * @param  {number} interval [The distance between the two notes that will be glided]
 * @param  {number} velocity [A velocity value for velocity based glide rates]
 * @return {number}          [Timer rate]
 */
inline function getRate(interval, velocity)
{
	reg rate = knbRate.getValue(); //Get rate knob value
	reg invl = interval;

	//If rate knob is set to the maximum then the actual rate will be determined by velocity
	if (rate == knbRate.get("max"))
	{
		rate = Math.min(knbRate.get("max")-1, Math.floor((velocity / (knbRate.get("max") - 1)))); //Capped rate at max rate
		invl = interval + 3; //Increase interval to improve velocity controlled resolution
	}

	rate = Engine.getMilliSecondsForTempo(rate) / 1000; //Rate to milliseconds for timer

	rate = rate / invl; //Rate is per glide step

	if (rate < 0.04) rate = 0.04; //Cap lowest rate at timer's minimum

	return rate;
}

function onNoteOn()
{
	if (!btnBypass.getValue())
	{
		Synth.stopTimer();

		if ((Engine.getUptime() - lastTime) * 1000 > CHORD_THRESHOLD) //Not a chord
		{
			Message.ignoreEvent(true);

			if (lastNote != -1) //First note of phrase has already been played
			{
				interval = Math.abs(Message.getNoteNumber() - lastNote); //Get played interval
				fadeTime = getFadeTime(interval, Message.getVelocity()); //Get fade time
				bendTime = fadeTime + knbBendTm.getValue(); //Get bend time
				if (bendTime < 10) bendTime = 10; //Bend time can't be less than 10ms*/

				//Get bend amount
				bendAmount = 0;
				if (interval != 0) //Same note legato
				{
					interval > 12 ? bendAmount = bendLookup[11] : bendAmount = bendLookup[interval - 1]; //Get bend amount from lookup table
					if (lastNote > Message.getNoteNumber()) bendAmount = -bendAmount; //Invert bend amount for down interval
				}

				//If this is the second note of the phrase set start offset modulators
				if (inPhrase == 0) setModulators(knbOffset.getValue());

				if (btnGlide.getValue()) //Glide mode
				{
					count = 0; //Reset count, for trills
					notes[0] = lastNote; //Origin
					notes[1] = Message.getNoteNumber(); //Target
					glideNote = lastNote; //First glide note is the same as the origin
					lastVelo = Message.getVelocity();

					rate = getRate(Math.abs(notes[0] - notes[1]), lastVelo);

					Synth.startTimer(rate);
				}
				else //Legato mode
				{
					Synth.addVolumeFade(lastEventId, fadeTime / 100 * knbFadeOutRatio.getValue(), -100); //Fade out old note
					Synth.addPitchFade(lastEventId, bendTime / 100 * knbFadeOutRatio.getValue(), 0, Message.getFineDetune() + bendAmount); //Pitch fade old note

					retriggerNote = lastNote;

					lastEventId = Synth.playNote(Message.getNoteNumber() + Message.getTransposeAmount(), Message.getVelocity()); //Play new note
					Synth.addPitchFade(lastEventId, 0, Message.getCoarseDetune(), Message.getFineDetune()); //Pass on any message detuning to new note

					Synth.addVolumeFade(lastEventId, 0, -99); //Set new note's initial volume
					Synth.addVolumeFade(lastEventId, fadeTime, 0); //Fade in new note
					Synth.addPitchFade(lastEventId, 0, Message.getCoarseDetune(), Message.getFineDetune() - bendAmount); //Set new note's initial detuning
					Synth.addPitchFade(lastEventId, bendTime, Message.getCoarseDetune(), Message.getFineDetune()); //Pitch fade new note to 0 (or fineDetune)
				}
				inPhrase = 1;
			}
			else //First note of phrase
			{
			    inPhrase = 0;
				lastEventId = Synth.playNote(Message.getNoteNumber() + Message.getTransposeAmount(), Message.getVelocity()); //Play new note
				Synth.addPitchFade(lastEventId, 0, Message.getCoarseDetune(), Message.getFineDetune()); //Pass on any message detuning to new note
			}

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
				Synth.addVolumeFade(lastEventId, fadeTime / 100 * knbFadeOutRatio.getValue(), -100); //Fade out old note
				Synth.addPitchFade(lastEventId, bendTime / 100 * knbFadeOutRatio.getValue(), 0, bendAmount); //Pitch fade old note

				lastEventId = Synth.playNote(retriggerNote, lastVelo);

				Synth.addVolumeFade(lastEventId, 0, -99); //Set new note's initial volume
				Synth.addVolumeFade(lastEventId, fadeTime, 0); //Fade in new note

				lastNote = retriggerNote;
				retriggerNote = -1;
			}
			else
			{
				Synth.noteOffByEventId(lastEventId);
				lastEventId = -1;
				lastNote = -1;
				setModulators(0); //Reset sample start offset modulators
			}
		}
	}
	else //Script is bypassed
	{
		//Turn off any hanging notes
		if (lastEventId != -1)
		{
			Synth.noteOffByEventId(lastEventId);
			lastEventId = -1;
			lastNote = -1;
			setModulators(0); //Reset sample start offset modulators
		}
	}
}

function onController()
{
	
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

			lastEventId = Synth.playNote(glideNote, lastVelo); //Play new note

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
				Synth.noteOffByEventId(lastEventId);
				lastEventId = -1;
				lastNote = -1;
			}

			retriggerNote = -1;

		break;
	}
}

