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

include("manifest.js");

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
	    local sampleMapId = manifest.patches[name].sampleMapId; //Get patch's sample map id
		local sampleMaps = Sampler.getSampleMapList();
        local childSynth;
		local s;

		for (id in samplerIds) //Each sampler
	    {
	        childSynth = childSynths[id];
	        s = samplers[id];

	        if (sampleMaps.contains(sampleMapId + "_" + id)) //A sample map for this patch was found
	        {
	            childSynth.setBypassed(false); //Enable sampler
	            s.loadSampleMap(sampleMapId + "_" + id); //Load the sample map for this sampler
	        }
	        else
	        {
	            childSynth.setBypassed(true); //Bypass sampler
	            s.loadSampleMap("empty"); //Load empty sample map for this sampler
	        }
	    }
	}

	//If the patch's articulation has a gain property set the articulation's container's gain
	inline function loadContainerGain(name)
    {
        local entry = manifest.patches[name]; //Get patch entry from the database
        
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
    
    inline function getPatchNames()
    {
        local a = [];
        
        for (k in manifest.patches)
        {
            a.push(k);
        }
        return a;
    }
	
	inline function getArticulationNames(name)
    {
        local entry = manifest.patches[name]; //Get patch entry from the database
        local a = [];
        
        for (k in entry.articulations)
        {
            a.push(k);
        }
        
        return a;
    }
	
	inline function getArticulationDisplayNames(name)
    {
        local entry = manifest.patches[name]; //Get patch entry from the database
        local a = [];
        
        for (k in entry.articulations)
        {
            a.push(entry.articulations[k].displayName);
        }
        
        return a;
    }
    
	//Returns the data entry for the given patch name
	inline function getData(name)
	{		
		return manifest.patches[name];
	}
	
	//Returns the full range of the patch
	inline function getRange(name)
	{				
		return manifest.patches[name].range;
	}
	
	//Returns the range of the specified articulation
	inline function getArticulationRange(name, a)
	{		
		return manifest.patches[name].articulations[a].range;
	}
		
	//Returns the number of articulations either for the specified patch or from allArticulations
	inline function getNumArticulations(all)
	{
		if (all == true) //All articulations
		{	
		    return manifest.allArticulations.length;
		}
		else //Current instrument only
		{
			return instrumentsArticulations.length;
		}
	}
	     	
	//For the given program number returns the index in the manifest.programs array
	inline function getProgramIndex(n)
	{
		return manifest.programs.indexOf(n);
	}
	    
    //Return keyswitches array for the specified patch (name)
    inline function getKeyswitches(name)
    {
        return manifest.patches[name].keyswitches;
    }
}