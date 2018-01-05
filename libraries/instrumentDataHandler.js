/*
    Copyright 2018 David Healey

    This library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

include("instrumentData.js");

namespace idh
{	
	reg articulationIndexes = []; //Instrument's articulations indexed against allArticulations

	//Instrument loading functions
	inline function loadInstrument(name, sampleMaps)
	{
		local entry = instData.database[name]; //Get instrument entry from the database
		
		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		articulationIndexes = indexArticulations(name);
		bypassUnusedSamplers(entry);
		if (sampleMaps == true) loadSampleMaps(name, entry);
	}
	
	inline function bypassUnusedSamplers(entry)
	{
		local samplerIds = Synth.getIdList("Sampler");
		local s;
		reg bypassSet;
		
		for (i = 0; i < samplerIds.length; i++)	//Each sampler ID
		{
			bypassSet = false;
			
			s = Synth.getChildSynth(samplerIds[i]); //Get the sampler
		
			for (a in entry.articulations) //Each of the entry's articulations
			{
				if (samplerIds[i].indexOf(a) != -1) //Sample ID contains articulation name (case sensitive)
				{
					s.setBypassed(false);
					bypassSet = true; //Set flag
					break; //Exit inner loop
				}
			}
			
			if (bypassSet == false) //Bypass state has not yet been set for this sampler
			{
				s.setBypassed(true); //Bypass unused sampler
			}
		}
	}
			
	inline function loadSampleMaps(name, entry)
	{	
		local samplerIds = Synth.getIdList("Sampler");
		local s;
		reg loaded; //Flag to keep check if sample map has been loaded into sampler
				
		for (i = 0; i < samplerIds.length; i++)	//Each sampler ID
		{		
			loaded = false;
			
			s = Synth.getSampler(samplerIds[i]);
			
			for (a in entry.articulations)
			{	
				if (samplerIds[i].indexOf(a) != -1)
				{
					s.loadSampleMap(name + "_" + samplerIds[i]); //Load sample map for this instrument
					loaded = true; //Flag that a sample map has been loaded into this sampler
					break; //Exit the inner loop
				}
			}
			
			if (loaded == false) //If no sample map was loaded
			{
				s.loadSampleMap("empty"); //Load empty sample map
			}
		}
	}
			
	//Returns the data entry for the given instrument
	inline function getData(name)
	{
		local entry = instData.database[name]; //Get instrument entry from the instData.database
		
		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		return entry;
	}
	
	//Returns the full range of the instrument (maximum range of all articulations)
	inline function getRange(name)
	{
		local entry = instData.database[name]; //Get instrument entry from the instData.database
		
		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		return entry.range;
	}
	
	//Returns the range of the specified articulation
	inline function getArticulationRange(name, a)
	{
		local entry = instData.database[name]; //Get instrument entry from the instData.database
		
		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		return entry.articulations[a].range;
	}
	
	/**
	* Indexes the instrument's articulations agains all available articulations.
	*/
	inline function indexArticulations(name)
	{
		local entry = instData.database[name]; //Get instrument entry from the instData.database
		
		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		local index = [];

		for (k in entry.articulations)
		{
			if (instData.allArticulations.contains(k))
			{
				index.push(instData.allArticulations.indexOf(k));
			}
		}
		
		return index;
	}
	
	//Returns the number of articulations either for the specified insturment or from allArticulations
	inline function getNumArticulations(name)
	{
		if (name != null) //Return num of articulations used by specified instrument
		{
			local entry = instData.database[name]; //Get instrument entry from the instData.database
		
			Console.assertIsObjectOrArray(entry); //Error if entry not found
		
			local i = 0;
		
			for (k in entry.articulations)
			{
				i++;
			}
		
			return i;			
		}
		else 
		{
			return instData.allArticulations.length; //Return total available articulations
		}
	}
	
	//Returns an array containing the names of all of the insturment's articulations
	inline function getArticulationNames(name)
	{
		if (name != null)
		{
			local entry = instData.database[name]; //Get instrument entry from the instData.database
		
			Console.assertIsObjectOrArray(entry); //Error if entry not found
		
			local n = [];
		
			for (k in entry.articulations)
			{
				n.push(k);
			}
		
			return n;
		}
		else 
		{
			return instData.allArticulations;
		}

	}
	
	//Returns an array containing the names of all of the insturment's articulations display names
	inline function getArticulationDisplayNames(name)
	{
		if (name != null)
		{
			local entry = instData.database[name]; //Get instrument entry from the instData.database

			Console.assertIsObjectOrArray(entry); //Error if entry not found
		
			local n = [];
		
			for (k in entry.articulations) //Each of the insturment's articulations
			{
				n.push(instData.articulationDisplayNames[instData.allArticulations.indexOf(k)]);
			}
		
			return n;
		}
		else 
		{
			return instData.articulationDisplayNames;
		}

	}
	
	//Returns the name of the articulation specified by the given index
	inline function getArticulationNameByIndex(idx)
	{
		return instData.allArticulations[articulationIndexes[idx]];
	}
	
	//Given an index in the allArticulations array, returns the corrosponding index for the instrument's articulations
	inline function allArticulationIndexToInstrumentArticulationIndex(idx)
	{
		return articulationIndexes[idx];
	}
	
    //Looks for a value in the articulationIndexes array and returns its index if found
    inline function searchArticulationIndexes(value)
    {
        return articulationIndexes.indexOf(value);
    }
	
	//Given an index in the instrument's articulations array, returns the corrosponding index in allArticulations
	inline function instrumentArticulationIndexToAllArticulationIndex(idx)
	{
		return articulationIndexes.indexOf(idx);
	}
		
	//Returns the note number for the given index in the instrumentsKeyswitches array
	inline function getKeyswitch(name, idx)
	{
	    local entry = instData.database[name]; //Get instrument entry from the instData.database

		Console.assertIsObjectOrArray(entry); //Error if entry not found
			
		return entry.keyswitches[idx];
	}
	
	//Returns the index of the given note number from the instData.keyswitches array
	inline function getKeyswitchIndex(name, noteNum)
	{
	    local entry = instData.database[name]; //Get instrument entry from the instData.database

		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		return entry.keyswitches.indexOf(noteNum);
	}
	
	//Set the index in the instData.keyswitches array to the given note number
	inline function setKeyswitch(name, idx, noteNum)
	{
	    local entry = instData.database[name]; //Get instrument entry from the instData.database

		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		entry.keyswitches[idx] = noteNum;
	}
	
	//For the given program number returns the index in the instData.programs array
	inline function getProgramIndex(progNum)
	{
		return instData.programs.indexOf(progNum);
	}
	
	inline function isMetaArticulation(idx)
    {        Console.print(instData.allArticulations[idx]);
        if (instData.allArticulations[idx].indexOf("meta_") == -1)
        {
            return false;
        }
        return true;
    }
}