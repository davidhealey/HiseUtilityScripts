/**
 * Title: mixerChannel.js
 * Author: David Healey
 * Date: 29/07/2017
 * Modified: 03/12/2017
 * License: LGPL
*/

namespace mixerChannel
{
	inline function newChannel(micIndex, gainEffect, controls)
	{
		local chan = {};

		chan.micIndex = micIndex;
		chan.effect = Synth.getEffect(gainEffect); //Set gain effect associated with channel channel
		chan.gui = {}; //Object for storing channel's GUI conrols

		//If GUI settings have been passed then create GUI controls for this channel
		if (controls != -1 && controls != undefined)
		{
			addMultipleGUIControls(chan, controls);
		}

		return chan;
	}

	inline function addControl(obj, controlName, control)
	{
		obj.gui[controlName] = control;
	}

	inline function addMultipleGUIControls(obj, controls)
	{
		if (_keyExists(controls, "volume")) {volumeKnob(obj, controls.volume);}
		if (_keyExists(controls, "delay")) {delayKnob(obj, controls.delay);}
		if (_keyExists(controls, "width")) {widthKnob(obj, controls.width);}
		if (_keyExists(controls, "balance")) {balanceKnob(obj, controls.balance);}
		if (_keyExists(controls, "mute")) {muteButton(obj, controls.mute);}
		if (_keyExists(controls, "solo")) {soloButton(obj, controls.solo);}
		if (_keyExists(controls, "purge")) {purgeButton(obj, controls.purge);}
	}

	inline function volumeKnob(obj, settings)
	{
		obj.gui.knbVolume = Content.addKnob("channel" + obj.micIndex + "volume", settings.x, settings.y);

		//Default properties
		if (_keyExists(settings, "filmstripImage")) settings.filmstripImage = "{PROJECT_FOLDER}" + settings.filmstripImage; //Uses project folder
		if (!_keyExists(settings, "min")) settings.min = -100;
		if (!_keyExists(settings, "max")) settings.max = 12;
		if (!_keyExists(settings, "defaultValue")) settings.defaultValue = 0;
		if (!_keyExists(settings, "middlePosition")) settings.middlePosition = 0;
		if (!_keyExists(settings, "text")) settings.text = "Volume " + obj.micIndex;
		if (!_keyExists(settings, "mouseSensitivity")) settings.mouseSensitivity = 0.3;

		//Set control properties
		for (k in settings) //Each key in settings object
		{
			obj.gui.knbVolume.set(k, settings[k]);
		}
	}

	inline function balanceKnob(obj, settings)
	{
		obj.gui.knbBalance = Content.addKnob("channel" + obj.micIndex + "knbBalance", settings.x, settings.y);

		//Default properties
		if (_keyExists(settings, "filmstripImage")) settings.filmstripImage = "{PROJECT_FOLDER}" + settings.filmstripImage; //Uses project folder
		if (!_keyExists(settings, "min")) settings.min = -100;
		if (!_keyExists(settings, "max")) settings.max = 100;
		if (!_keyExists(settings, "defaultValue")) settings.defaultValue = 0;
		if (!_keyExists(settings, "text")) settings.text = "Balance " + obj.micIndex;
		if (!_keyExists(settings, "mouseSensitivity")) settings.mouseSensitivity = 0.3;

		//Set control properties
		for (k in settings) //Each key in object
		{
			obj.gui.knbBalance.set(k, settings[k]);
		}
	}

	inline function delayKnob(obj, settings)
	{
		obj.gui.knbDelay = Content.addKnob("channel" + obj.micIndex + "knbDelay", settings.x, settings.y);

		//Default properties
		settings.mode = "Time";
		if (_keyExists(settings, "filmstripImage")) settings.filmstripImage = "{PROJECT_FOLDER}" + settings.filmstripImage; //Uses project folder
		if (!_keyExists(settings, "min")) settings.min = 0;
		if (!_keyExists(settings, "max")) settings.max = 500;
		if (!_keyExists(settings, "stepSize")) settings.stepSize = 0.1;
		if (!_keyExists(settings, "text")) settings.text = "Delay " + obj.micIndex;
		if (!_keyExists(settings, "mouseSensitivity")) settings.mouseSensitivity = 0.3;

		//Set control properties
		for (k in settings) //Each key in object
		{
			obj.gui.knbDelay.set(k, settings[k]);
		}
	}

	inline function widthKnob(obj, settings)
	{
		obj.gui.knbWidth = Content.addKnob("channel" + obj.micIndex + "knbWidth", settings.x, settings.y);

		//Default properties
		if (_keyExists(settings, "filmstripImage")) settings.filmstripImage = "{PROJECT_FOLDER}" + settings.filmstripImage; //Uses project folder
		if (!_keyExists(settings, "min")) settings.min = 0;
		if (!_keyExists(settings, "max")) settings.max = 200;
		if (!_keyExists(settings, "defaultValue")) settings.defaultValue = 100;
		if (!_keyExists(settings, "text")) settings.text = "Width " + obj.micIndex;
		if (!_keyExists(settings, "stepSize")) settings.stepSize = 1;
		if (!_keyExists(settings, "mouseSensitivity")) settings.mouseSensitivity = 0.3;

		//Set control properties
		for (k in settings) //Each key in object
		{
			obj.gui.knbWidth.set(k, settings[k]);
		}
	}

	inline function muteButton(obj, settings)
	{
		obj.gui.btnMute = Content.addButton("channel" + obj.micIndex + "btnMute", settings.x, settings.y);

		//Default properties
		if (_keyExists(settings, "filmstripImage")) settings.filmstripImage = "{PROJECT_FOLDER}" + settings.filmstripImage; //Uses project folder
		if (!_keyExists(settings, "text")) settings.text = "Mute " + obj.micIndex;

		//Set control properties
		for (k in settings) //Each key in object
		{
			obj.gui.btnMute.set(k, settings[k]);
		}
	}

	inline function soloButton(obj, settings)
	{
		obj.gui.btnSolo = Content.addButton("channel" + obj.micIndex + "btnSolo", settings.x, settings.y);

		//Default properties
		if (_keyExists(settings, "filmstripImage")) settings.filmstripImage = "{PROJECT_FOLDER}" + settings.filmstripImage; //Uses project folder
		if (!_keyExists(settings, "text")) settings.text = "Solo " + obj.micIndex;

		//Set control properties
		for (k in settings) //Each key in object
		{
			obj.gui.btnSolo.set(k, settings[k]);
		}
	}

	inline function purgeButton(obj, settings)
	{
		obj.gui.btnPurge = Content.addButton("channel" + obj.micIndex + "btnPurge", settings.x, settings.y);

		//Default properties
		if (_keyExists(settings, "filmstripImage")) settings.filmstripImage = "{PROJECT_FOLDER}" + settings.filmstripImage; //Uses project folder
		if (!_keyExists(settings, "text")) settings.text = "Purge " + obj.micIndex;

		//Set control properties
		for (k in settings) //Each key in object
		{
			obj.gui.btnPurge.set(k, settings[k]);
		}
	}

	inline function _keyExists(obj, key)
	{
		return !(obj[key] == void); // Important: not undefined!
	}

	//GETTERS AND SETTERS
	inline function getVolumeControl(obj) {return obj.gui.knbVolume;}

	inline function getEffect(obj)
	{
		return obj.effect;
	}

	inline function setVolume(obj, value)
	{
		obj.volume = value; //Store the value - for mute and solo
		obj.effect.setAttribute(obj.effect.Gain, value); //Set gain effect
		if (_keyExists(obj.gui, "knbVolume")) obj.gui.knbVolume.setValue(value); //If channel has a volume knob set it to the value
	}

	inline function setDelay(obj, value)
	{
		obj.effect.setAttribute(obj.effect.Delay, value);
	};

	inline function setWidth(obj, value)
	{
		obj.effect.setAttribute(obj.effect.Width, value);
	};

	inline function setBalance(obj, value)
	{
		obj.effect.setAttribute(obj.effect.Balance, value);
	};

	function setMute(obj, mixer, value)
	{
		if (value == true)
		{
			//If the channel has an active solo button, react to the button being turned off before reacting to the mute being enabled
			if (_keyExists(obj.gui, "btnSolo")) //Channel has a solo button
			{
				if (obj.gui.btnSolo.getValue() == 1) //Solo button is on
				{
					obj.gui.btnSolo.setValue(0); //Turn the solo button off
					setSolo(obj, mixer, false); //Run the solo off action
				}
			}

			//Set the volume of the effect manually (not using the setVolume function) so that the channel's saved volume is not overwritten
			obj.effect.setAttribute(obj.effect.Gain, -100);
			if (_keyExists(obj.gui, "knbVolume")) obj.gui.knbVolume.setValue(obj.gui.knbVolume.get("min"));
		}
		else
		{
			var isSolo = 0;

			//Check if any other channels are soloed
			for (chan in mixer)
			{
				if (!_keyExists(chan.gui, "btnSolo")) continue; //Skip channels without a solo button

				if (chan.gui.btnSolo.getValue() == 1)
				{
					isSolo = 1;
					break;
				}
			}

			//If no channels are soloed then unmute channel channel and restore its saved volume
			if (isSolo == 0) setVolume(obj, obj.volume);
		}
	};

	function setSolo(obj, mixer, value)
	{
		if (value == true) //channel channel is soloed
		{
			if (_keyExists(obj.gui, "btnMute")) obj.gui.btnMute.setValue(0); //If channel has a mute button, turn it off

			channel.setVolume(obj, obj.volume); //Set channel channel to it's saved volume - only really necessary if the channel was muted

			for (w = 0; w < mixer.length; w++) //Each channel in the mixer
			{
				//Mute all none soloed channels
				if (_keyExists(mixer[w].gui, "btnSolo")) //Check if channel has a solo button
				{
					if (mixer[w].gui.btnSolo.getValue() == 0) //Check if solo button is inactive
					{
						setMute(mixer[w], mixer, true);
					}
				}
				else //No solo button so just mute the channel
				{
					setMute(mixer[w], mixer, true);
				}
			}
		}
		else
		{
			var isSolo = 0; //Used to check if there is at least one channel soloed

			//Check if any other channels are soloed
			for (chan in mixer)
			{
				if (!_keyExists(chan.gui, "btnSolo")) continue; //Skip channels without a solo button

				if (chan.gui.btnSolo.getValue() == 1)
				{
					isSolo = 1;
					break;
				}
			}

			if (isSolo == 1) //A channel is soloed
			{
				setMute(obj, mixer, true); //Mute channel
			}
			else
			{
				//Unmute all channels that were muted by the solo action, but not those that have their mute buttons active
				for (chan in mixer)
				{
					if (obj == chan) continue; //Skip "channel" channel

					if (_keyExists(chan.gui, "btnMute")) //If channel has a mute button
					{
						if (chan.gui.btnMute.getValue() == 0) //Check that mute button is not active
						{
							setMute(chan, mixer, false);
						}
					}
					else //No mute button so just unmute the channel's gain effect
					{
						setMute(chan, mixer, false);
					}
				}
			}
		}
	};

	inline function setPurge(samplers, obj, value)
	{
		local micName;

		if (samplers.length > 0)
		{
			for (sampler in samplers)
			{
				if (sampler.getNumMicPositions() < obj.micIndex || sampler.getNumMicPositions() <= 1) continue; //Skip if not multi-mic or less than mic index

				micName = sampler.getMicPositionName(obj.micIndex);
				sampler.purgeMicPosition(micName, value); //Purge mic position
			}
		}
	}
}
