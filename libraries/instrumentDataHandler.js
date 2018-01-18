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
	reg instrumentsArticulations = []; //Just the instrument's articulations names
	reg displayNames = [];

	//Instrument loading functions
	inline function loadInstrument(name, sampleMaps)
	{
		local entry = instData.database[name]; //Get instrument entry from the database
		
		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		instrumentsArticulations = getArticulations(name); //Populate array of instrument's articulation names
		
		//Populate displayNames array
		for (k in entry.articulations)
        {
            displayNames.push(entry.articulations[k].displayName);
        }
		
		bypassUnusedSamplers(entry);
		if (sampleMaps == true) loadSampleMaps(name, entry);
	}
	
	inline function bypassUnusedSamplers(entry)
	{
		local samplerIds = Synth.getIdList("Sampler");
		local s;
		local bypassSet;
		
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
		local loaded; //Flag to keep check if sample map has been loaded into sampler
				
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
		local entry = instData.database[name]; //Get instrument entry from the database
		
		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		return entry;
	}
	
	inline function getArticulations(name)
    {		
		local data = instData.database[name].articulations; //Get instrument entry from the database
		local articulations = [];

		for (k in data)
		{
			articulations.push(k);
		}
		
		return articulations;
    }
	
	//Returns the full range of the instrument (maximum range of all articulations)
	inline function getRange(name)
	{				
		return instData.database[name].range;
	}
	
	//Returns the range of the specified articulation
	inline function getArticulationRange(name, a)
	{		
		return instData.database[name].articulations[a].range;
	}
		
	//Returns the number of articulations either for the specified insturment or from allArticulations
	inline function getNumArticulations(all)
	{
		if (all != false) //All articulations
		{	
		    return instData.allArticulations.length;
		}
		else //Current instrument only
		{
			return instrumentsArticulations.length;
		}
	}
	
	//Returns an array containing the names of either the instrument's or all articulations
	inline function getArticulationNames(all)
	{
		if (all != false) //All articulations
		{
            return instData.allArticulations;
		}
		else //Current instrument only
		{
			return instrumentsArticulations;
		}
	}
	
	//Returns the display names array
	inline function getArticulationDisplayNames()
	{
        return displayNames;
	}
	
	//Get the display name from the instruments articulation index
	inline function getDisplayName(idx)
    {
        return displayNames[idx];
    }
    
    //Get the display name from the articulation's name
    inline function getDisplayNameFromArticulationName(a)
    {
        return displayNames[instrumentsArticulations.indexOf(a)];
    }
		
	//Returns the name of the articulation specified by the given index
	inline function getArticulationName(idx, all)
    {
        if (all == true)
        {
            return instData.allArticulations[idx];
        }
        else 
        {
            return instrumentsArticulations[idx];
        }            
    }
    
    inline function getArticulationIndex(articulationName, all)
    {
        if (all == true)
        {
            return instData.allArticulations.indexOf(articulationName);
        }
        else
        {
            return instrumentsArticulations.indexOf(articulationName);   
        }
    }
    				
	//Returns the note number for the given index in the instrumentsKeyswitches array
	inline function getKeyswitch(name, idx)
	{			
		return instData.database[name].keyswitches[idx];
	}
	
	//Returns the index of the given note number from the instData.keyswitches array
	inline function getKeyswitchIndex(name, noteNum)
	{		
		return instData.database[name].keyswitches.indexOf(noteNum);
	}
	
	//Set the index in the instData.keyswitches array to the given note number
	inline function setKeyswitch(name, idx, noteNum)
	{		
		instData.database[name].keyswitches[idx] = noteNum;
	}
	
	//For the given program number returns the index in the instData.programs array
	inline function getProgramIndex(progNum)
	{
		return instData.programs.indexOf(progNum);
	}
	
	inline function isMetaArticulation(idx)
    {
        if (instData.allArticulations[idx].indexOf("meta_") == -1)
        {
            return false;
        }
        return true;
    }
    
    //Returns the attack for the given insturment name and articulation (a)
    inline function getAttack(name, a)
    {
        return instData.database[name].articulations[a].attack;
    }
    
    //Returns the release for the given insturment name and articulation (a)
    inline function getRelease(name, a)
    {
        return instData.database[name].articulations[a].release;
    }
}