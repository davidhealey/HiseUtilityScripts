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
    const var containerIds = Synth.getIdList("Container"); //One container per articulation
    const var containers = [];
    const var samplerIds = Synth.getIdList("Sampler");
    const var samplers = {};
    const var childSynths = {};
    
    //Index samplers by their ID
    for (id in samplerIds)
    {
        childSynths[id] = Synth.getChildSynth(id); //Need child synth to set bypassed state
        samplers[id] = Synth.getSampler(id); //Need sampler to load sample map
    }
    
    //Build array of containers - one per keyswitchable articulation
    for (c in containerIds)
    {
        containers.push(Synth.getChildSynth(c));
    }

	inline function loadSampleMaps(name)
	{	
	    local sampleMapId = instData.database[name].sampleMapId;
		local sampleMaps = Sampler.getSampleMapList();
        local childSynth;
		local s;

		for (id in samplerIds) //Each sampler
	    {
	        childSynth = childSynths[id];
	        s = samplers[id];

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

	inline function loadContainerGain(name)
    {
        local entry = instData.database[name]; //Get instrument entry from the database
        
        for (i = 0; i < containers.length; i++)
        {
            for (a in entry.articulations)
            {
                //Container has articulation id and articulation has gain property
                if (containerIds[i] == a && entry.articulations[a].gain != undefined)
                {
                    containers[i].setAttribute(0, Engine.getGainFactorForDecibels(entry.articulations[a].gain));
                }
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
	    
    //Return keyswitches array for the passed instrument (name)
    inline function getKeyswitches(name)
    {
        return instData.database[name].keyswitches;
    }
}