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
	inline function loadSampleMaps(name)
	{	
	    local entry = instData.database[name]; //Get instrument entry from the database
		local samplerIds = Synth.getIdList("Sampler");
		local sampleMaps = Sampler.getSampleMapList();
		local childSynth;
		local s;
		local sampleMapId = instData.database[name].sampleMapId;

		for (id in samplerIds) //Each sampler
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
				
	inline function getArticulationNames(name)
    {
        local entry = instData.database[name]; //Get instrument entry from the database
        local a = [];
        
        for (k in entry.articulations)
        {
            a.push(k);
        }
        
        return a;
    }
	
	inline function getArticulationDisplayNames(name)
    {
        local entry = instData.database[name]; //Get instrument entry from the database
        local a = [];
        
        for (k in entry.articulations)
        {
            a.push(entry.articulations[k].displayName);
        }
        
        return a;
    }
    
	//Returns the data entry for the given instrument
	inline function getData(name)
	{		
		return instData.database[name]; //Get instrument entry from the database
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
    
    //Return keyswitches array for the passed instrument (name)
    inline function getKeyswitches(name)
    {
        return instData.database[name].keyswitches;
    }
}