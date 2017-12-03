include("D:/Xtant Audio/Products/Virtual Instruments/_Frameworks/_HISE Development Framework v1.0/libraries/userInterface_v1.1.js");

namespace Articulation
{
	inline function define(id, isScripted)
	{
		local i;
		local art = {};

		const var samplerNames = Synth.getIdList("Sampler"); //Get all child sampler names
		const var muterNames = Synth.getIdList("MidiMuter"); //Get all child Midi Muter names
		const var scriptNames = Synth.getIdList("Script Processor"); //Get all child script processors

		art.id = id;
		art.triggers = [];
		art.state;
		art.simpleEnvelopes = [];
		art.samplerNames = []; //Just the names of the samplers for this articulation
		art.isScripted = isScripted; //Is it a real articulation or one created through scripting?
		art.samplers = [];
		art.releaseSamplers = [];
		art.muters = []; //MIDI muters used by articulation

		if (isScripted == false)
		{
			if (samplerNames.length > 0)
			{
				for (samplerName in samplerNames)
				{
					if (samplerName.indexOf(id) == -1) continue; //Skip samplers that don't contain the id
					art.samplerNames.push(samplerName); //Build array of this articulation's sampler names

					if (Engine.matchesRegex(samplerName, "(?=.*"+id+")(?=.*elease)")) //Release sampler
					{
						art.releaseSamplers.push(Synth.getSampler(samplerName)); //Build array of articulation's release trigger samplers
					}
					else
					{
						art.samplers.push(Synth.getSampler(samplerName)); //Build array of articulation's samplers
					}
				}

				//Get each of the articulation's sampler's envelopes
				for (i = 0; i < art.samplers.length; i++)
				{
					if (Engine.matchesRegex(art.samplerNames[i], "(elease)") == true) continue //Skip release samplers

					if (Engine.matchesRegex(art.samplerNames[i], id) == true)
					{
						art.simpleEnvelopes[i] = Synth.getModulator(id + "Envelope" + i);
					}
				}

				//Get the MIDI muters for this articulation
				for (muter in muterNames)
				{
					if (!Engine.matchesRegex(muter, "(" + id + ")")) continue; //Skip scripts that aren't MIDI muters for this articulation
					art.muters.push(Synth.getMidiProcessor(muter));
				}

				//Get release trigger scripts - for muting release triggers - add them to muters array
				for (script in scriptNames)
				{
					if (Engine.matchesRegex(script, "(?=.*"+id+")(?=.*elease)"))
					{
						art.muters.push(Synth.getMidiProcessor(script));
					}
				}
			}
		}

		return art;
	}

	inline function changeArticulation(artArray, obj)
	{
		for (art in artArray)
		{
			mute(art);
		}

		unmute(obj);
	}

	inline function mute(obj)
	{
		if (obj.isScripted == false)
		{
			for (muter in obj.muters)
			{
				muter.setAttribute(0, 1);
			}
		}

		obj.state = 0;
	}

	inline function unmute(obj)
	{
		if (obj.isScripted == false)
		{
			for (muter in obj.muters)
			{
				muter.setAttribute(0, 0);
			}
		}

		obj.state = 1;
	}

	//GETTERS
	inline function getIsScripted(obj) {return obj.isScripted;}
	inline function getEnvelope(obj, layer) {return obj.simpleEnvelopes[layer];}
	inline function getAttack(obj) {return obj.simpleEnvelopes[0].getAttribute(0);}
	inline function getRelease(obj)	{return obj.simpleEnvelopes[0].getAttribute(1);}
	inline function getId(obj) {return obj.id;}
	inline function getKs(obj) {return obj.triggers[0];}
	inline function getUacc(obj) {return obj.triggers[3];}
	inline function getVelMin(obj) {return obj.triggers[1];}
	inline function getVelMax(obj) {return obj.triggers[2];}
	inline function getState(obj) {return obj.state;}

	//SETTERS
	inline function setKs(obj, v) {obj.triggers[0] = v;}
	inline function setVelMin(obj, v) {obj.triggers[1] = v;}
	inline function setVelMax(obj, v) {obj.triggers[2] = v;}
	inline function setUacc(obj, v) {obj.triggers[3] = v;}
	inline function setState(obj, v) {obj.state = v;}

	inline function setAttack(obj, v)
	{
		if (obj.isScripted == false)
		{
			for (env in obj.simpleEnvelopes) //Each layer's envelope
			{
				env.setAttribute(0, v);
			}
		}
	}

	inline function setRelease(obj, v)
	{
		if (obj.isScripted == false)
		{
			for (env in obj.simpleEnvelopes) //Each layer's envelope
			{
				env.setAttribute(1, v);
			}
		}
	}

	inline function purge(obj, value)
	{
		for (sampler in obj.samplers) //Each sampler
		{
			sampler.setAttribute(12, value); //Purge all
		}
	}

	inline function purgeReleases(obj, value)
	{
		for (sampler in obj.releaseSamplers) //Each release sampler
		{
			sampler.setAttribute(12, value); //Purge all
		}
	}
};
