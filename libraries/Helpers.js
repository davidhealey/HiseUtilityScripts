/**
 * Title: helpers.js
 * Main Author: David Healey
 * Additional Functions by Christoph Hart
 * Date: 29/07/2017
 * Modified: 03/12/2017
 * License: Public Domain
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
		local i;
		local allNoteNames = [];

		for (i = 0; i < 128; i++)
		{
			allNoteNames[i] = Engine.getMidiNoteName(i);
		}

		return allNoteNames;
	}

	inline function tempoIndexToString(tempoIndex)
	{
		local tempos = ["1/1", "1/2", "1/2T", "1/4", "1/4T", "1/8", "1/8T", "1/16", "1/16T", "1/32", "1/32T"];
		return tempos[tempoIndex];
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
		local blackKeys = [1, 3, 6, 8, 10]; //Black keys in one octave assuming C = 0

		if (blackKeys.indexOf(parseInt(n) % 12) != -1)
		{
			return true;
		}
		return false;
	}

  inline function skew(value, max, skewFactor)
  {
      // values > 1 will yield more resolution at the lower end
      local normalised = value / max;

      // this will "bend" the line towards the lower end
      local skewed = Math.pow(normalised, skewFactor);
      return skewed * max;    
  }

	inline function remapRange(value, oldMin, oldMax, newMin, newMax)
	{
	    if (oldMax - oldMin == 0)
	        return newMin;
	    else
	        return (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
	}

	inline function getSamplers(exclude)
	{
		local samplerIds = Synth.getIdList("Sampler");
		local samplers = [];

		for (id in samplerIds)
		{
			if (typeof exclude == "string")
				if (Engine.matchesRegex(id, exclude) == true) continue; // Skip IDs that match exclusion

			samplers.push(Synth.getSampler(id));
		}

		return samplers;
	}

	inline function getIdListContainingString(type, containing)
	{
		local idList = Synth.getIdList(type);
		local filteredIds = [];
		local i;

		for (i = 0; i < idList.length; i++)
		{
			if (idList[i].indexOf(containing) == -1) continue; // Skip ids that don't contain the substring
			filteredIds.push(idList[i]);
		}

		return filteredIds;
	}
  
  inline function keyExists(obj, key)
  {
    return !(obj[key] == void); // Important: not undefined!
  }

  inline function getSize(obj)
  {
    local count = 0;

    for (k in obj)
      count++;

    return count;
  }

  inline function getPropertyByIndex(obj, index)
  {
    local count = 0;

    for (k in obj)
    {
      if (count == index)
        return obj[k];

      count++;
    }

    return undefined;
  }

  inline function getIndexByProperty(obj, prop)
  {
    local count = 0;

    for (k in obj)
    {
      if (k == prop) return count;
      count++;
    }
    
    return -1;
  }
  
  inline function cartesianProduct(array)
  {
      local i;
      local j;
      local k;
    
      local result = [[]];

      for (i = 0; i < array.length; i++)
      {
          local subArray = array[i];
          local temp = [];
        
          for (j = 0; j < result.length; j++)
          {
              for (k = 0; k < subArray.length; k++)
              {
                  local c = concatArrays(result[j], [subArray[k]]);
                  temp.push(c);
              }
          }
          
          result = temp;
      }

      return result;
  }

  inline function concatArrays(a, b)
  {    
      local c = [];
      local i;
    
      for (i = 0; i < a.length; i++)
          c[i] = a[i];
    
      for (i = 0; i < b.length; i++)
          c.push(b[i]);
    
      return c;
  }  
}
