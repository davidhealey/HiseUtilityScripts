/**
 * Title genericMicMixer
 * Author: David Healey
 * Date: 01/07/2017
 * Modified: 28/11/2017
 * License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.en.html
*/

//INIT
Content.setHeight(350);

//Retrieve simple gain FX with "mic" in their ID and store in gainFX array
const var simpleGainIds = Synth.getIdList("Simple Gain"); //Get IDs of simple gain FX - 1 per mic
const var gainFx = [];

reg soloOn = false; //Flag to indicate if at least one channel is soloed

for (g in simpleGainIds)
{
	if (!Engine.matchesRegex(g, "mic")) continue; //Skip if it doesn't contain "mic" in its ID
	gainFx.push(Synth.getEffect(g));
}

//Retrieve samplers and store in samplers array
const var samplerIds = Synth.getIdList("Sampler"); //Get IDs of samplers
const var samplers = [];

for (s in samplerIds)
{
	samplers.push(Synth.getSampler(s));
}

//GUI
const var vol = [];
const var delay = [];
const var width = [];
const var pan = [];
const var mute = [];
const var solo = [];
const var purge = [];

for (i = 0; i < Math.min(8, gainFx.length); i++)
{
	vol[i] = knobFactory(100*i, 0, "vol"+i, {width:95, max:4, defaultValue:1, text:"Vol " + (i+1)});
	delay[i] = knobFactory(100*i, 50, "delay"+i, {width:95, max:500, text:"Delay " + (i+1)});
	width[i] = knobFactory(100*i, 100, "width"+i, {width:95, max:200, text:"Width " + (i+1)});
	pan[i] = knobFactory(100*i, 150, "pan"+i, {width:95, min:-100, max:100, text:"Pan " + (i+1)});
	mute[i] = buttonFactory(100*i, 200, "mute"+i, {width:95, text:"Mute " + (i+1)});
	solo[i] = buttonFactory(100*i, 250, "solo"+i, {width:95, text:"Solo " + (i+1)});
	purge[i] = buttonFactory(100*i, 300, "purge"+i, {width:95, text:"Purge " + (i+1)});
}

//FUNCTIONS
inline function knobFactory(x, y, name, obj)
{
	var control = Content.addKnob(name, x, y);

	//Set control properties
	for (k in obj) //Each key in object
	{
		control.set(k, obj[k]);
	}

	return control;
};

inline function buttonFactory(x, y, name, obj)
{
	var control = Content.addButton(name, x, y);

	//Set control properties
	for (k in obj) //Each key in object
	{
		control.set(k, obj[k]);
	}

	return control;
};

inline function muteSolo()
{
	soloOn = false;
	//Determine if any channels are soloed in order to set soloOn flag
	for (i = 0; i < solo.length; i++) //Each solo slider
	{
		if (solo[i].getValue() == 1)
		{
			soloOn = true; //Flag that at least one channel is soloed
			mute[i].setValue(0); //Toggle mute state
		}
	}

	for (i = 0; i < mute.length; i++)
	{
		//If a channel is soloed set volume of all non-soloed channels to 0, if no channel is soloed restore volume of non-muted channels
		if (mute[i].getValue() == 1) continue; //Ignore muted channels

		if (solo[i].getValue() == 1) //Channel is soloed
		{
			gainFx[i].setAttribute(0, Engine.getDecibelsForGainFactor(vol[i].getValue()));
			mute[i].setValue(0); //Toggle mute state
		}
		else //Channel is not soloed
		{
			if (soloOn == true) //If at least one channel is soloed
			{
				gainFx[i].setAttribute(0, -100); //Mute the channel
			}
			else //No channels soloed
			{
				gainFx[i].setAttribute(0, Engine.getDecibelsForGainFactor(vol[i].getValue()));	//Restore channel's volume
			}
		}
	}
}
function onNoteOn()
{

}
function onNoteOff()
{

}
function onController()
{

}
function onTimer()
{

}
function onControl(number, value)
{
	for (i = 0; i < vol.length; i++) //Each mic position
	{
		if (number == vol[i])
		{
			if (mute[i].getValue() == 0) //Channel isn't muted
			{
				//No channels are soloed or this channel is soloed
				if (soloOn == false || (soloOn == true && solo[i].getValue()))
				{
					gainFx[i].setAttribute(gainFx[i].Gain, Engine.getDecibelsForGainFactor(value));
				}
			}
		}
		else if (number == delay[i])
		{
			gainFx[i].setAttribute(gainFx[i].Delay, value);
		}
		else if (number == width[i])
		{
			gainFx[i].setAttribute(gainFx[i].Width, value);
		}
		else if (number == pan[i])
		{
			gainFx[i].setAttribute(gainFx[i].Balance, value);
		}
		else if (number == mute[i])
		{
			if (value == 1) //Mute is active for channel
			{
				gainFx[i].setAttribute(gainFx[i].Gain, -100); //Silence channel
				solo[i].setValue(0); //Toggle solo state
			}
			muteSolo();
		}
		else if (number == solo[i])
		{
			muteSolo();
		}
		else if (number == purge[i])
		{
			for (s in samplers) //Each sampler
			{
				if (s.isMicPositionPurged(i) != value) //Only purge or load if it's not already purged or loaded
				{
					s.purgeMicPosition(s.getMicPositionName(i), value);
				}
			}
		}
	}
}
