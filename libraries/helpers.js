/**
 * Title: helpers.js
 * Main Author: David Healey
 * Additional Functions by Christoph Hart
 * Date: 29/07/2017
 * Modified: 03/12/2017
 * License: LGPL - https://www.gnu.org/licenses/lgpl-3.0.en.html
*/

namespace Helpers
{
	//Returns note letter only, for letter + octave use built in Engine.getMidiNoteName()
	inline function noteNumberToLetter(n)
	{
		var noteLetters = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
		return noteLetters[n % 12];
	}

	inline function getAllNoteNames()
	{
		reg i;
		reg allNoteNames = [];

		for (i = 0; i < 128; i++)
		{
			allNoteNames[i] = Engine.getMidiNoteName(i);
		}

		return allNoteNames;
	}

	inline function tempoIndexToString(tempoIndex)
	{
		reg tempos = ["1/1", "1/2", "1/2T", "1/4", "1/4T", "1/8", "1/8T", "1/16", "1/16T", "1/32", "1/32T"];
		return tempos[tempoIndex];
	}

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	inline function randomInt(min, max)
	{
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	inline function inRange(value, min, max)
	{
	    return value >= min && value <= max;
	}

	inline function isEven(n)
	{
		return !(n & 1);
	}

	inline function isBlackKey(n)
	{
		var blackKeys = [1, 3, 6, 8, 10]; //Black keys in one octave assuming C = 0

		if (blackKeys.indexOf(parseInt(n) % 12) != -1)
		{
			return true;
		}
		return false;
	}

  inline function skew(value, max, skewFactor)
  {
      // values > 1 will yield more resolution at the lower end
      var normalised = value / max;

      // this will "bend" the line towards the lower end
      var skewed = Math.pow(normalised, skewFactor);
      return skewed * max;    
  }

	inline function remapRange(value, oldMin, oldMax, newMin, newMax)
	{
	    if (oldMax - oldMin == 0)
	        return newMin;
	    else
	    {
	        return (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
	    }
	}

	// Author: Christoph Hart
	inline function capitalizeString(stringToCapitalize)
	{
		if (typeof stringToCapitalize == "string")
		{
			local firstLetter;
			local wordList = stringToCapitalize.split(" ");
			local uppercaseList = [];

			for(word in wordList)
			{
				firstLetter = word.substring(0, 1);
				firstLetter = firstLetter.toUpperCase();
				word = firstLetter + word.substring(1, 999);
				uppercaseList.push(word);
			}

			return uppercaseList.join(" ");
		}
		return false;
	};

	inline function getSamplers(exclude)
	{
		local samplerIds = Synth.getIdList("Sampler");
		local samplers = [];

		for (id in samplerIds)
		{
			if (typeof exclude == "string")
			{
				if (Engine.matchesRegex(id, exclude) == true) continue; //Skip IDs that match exclusion
			}

			samplers.push(Synth.getSampler(id));
		}

		return samplers;
	}

	inline function getIdListContainingString(type, containing)
	{
		reg idList = Synth.getIdList(type);
		reg filteredIds = [];
		local i;

		for (i = 0; i < idList.length; i++)
		{
			if (idList[i].indexOf(containing) == -1) continue; //Skip ids that don't contain the substring
			filteredIds.push(idList[i]);

		}

		return filteredIds;
	}
}
