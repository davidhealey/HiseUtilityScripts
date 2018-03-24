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
	const var articulations = []; //The articulations for the currently loaded instrument
	const var displayNames = []; //Articulation display names for the currently loaded instrument

	//Instrument loading
	inline function loadInstrument(name, sampleMaps)
	{
		local entry = instData.database[name]; //Get instrument entry from the database

        //Populate articulation and displayNames arrays
        for (k in entry.articulations)
        {
            displayNames.push(entry.articulations[k].displayName);
            articulations.push(k);
        }
		
        if (sampleMaps == true) loadSampleMaps(name, entry);
	}
	
		
	inline function loadSampleMaps(name, entry)
	{	
		local samplerIds = Synth.getIdList("Sampler");
		local sampleMaps = Sampler.getSampleMapList();
		local childSynth;
		local s;
		local sampleMapId = instData.database[name].sampleMapId;

		for (id in samplerIds)
	    {
	        childSynth = Synth.getChildSynth(id);
	        s = Synth.getSampler(id);

	        if (sampleMaps.contains(sampleMapId + "_" + id)) //A sample map for this instrument was found
	        {
	            childSynth.setBypassed(false); //Enable sampler
	            s.loadSampleMap(sampleMapId + "_" + id); //Load the sample map for this sampler
	        }
	        else
	        {
	            childSynth.setBypassed(true); //Bypass sampler
	            s.loadSampleMap("empty"); //Load the sample map for this sampler
	        }
	    }
	}
				
	//Returns the data entry for the given instrument
	inline function getData(name)
	{		
		local entry = instData.database[name]; //Get instrument entry from the database		
		return entry;
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
		
	//Returns the number of articulations either for the specified instrument or from allArticulations
	inline function getNumArticulations(all)
	{
		if (all == true) //All articulations
		{	
		    return instData.allArticulations.length;
		}
		else //Current instrument only
		{
			return instrumentsArticulations.length;
		}
	}
	
	//Returns an array containing the names of the instrument's articulations
	inline function getInstrumentsArticulationNames()
	{
		return articulations;
	}
	
	//Get all display names 
	inline function getDisplayNames()
    {
        return displayNames;
    }
    
	//Get the display name by index
	inline function getDisplayName(idx)
	{
	    return displayNames[idx];
	}
    
    //Get the display name from the articulation's name
    inline function getDisplayNameByArticulationName(a)
    {
        return displayNames[instrumentsArticulations.indexOf(a)];
    }
		
	//Returns the name of the articulation specified by the given index
	inline function getArticulationName(idx)
    {
        return articulations[idx];
    }
    
    inline function getArticulationIndex(a)
    {
        return articulations.indexOf(a);
    }
    	
	//For the given program number returns the index in the instData.programs array
	inline function getProgramIndex(n)
	{
		return instData.programs.indexOf(n);
	}
	
	inline function isMetaArticulation(idx)
    {
        //If the articulation has a parent then it's a meta articulation
        if (instData.allArticulations[idx].parent)
        {
            return true;
        }
        return false;
    }
    
    //Returns the index of the articulation's (a) parent, if it has one
    inline function getParentIdx(name, a)
    {
        local parent = instData.database[name].articulations[a].parent;
        
        if (typeof parent == "string")
        {
            return instData.articulations.indexOf(parent);
        }

        return -1;
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
    
    //Return keyswitches array for the passed instrument (name)
    inline function getKeyswitches(name)
    {
        return instData.database[name].keyswitches;
    }
}