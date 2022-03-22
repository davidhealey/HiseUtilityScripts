/*
    Copyright 2019, 2020 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this file. If not, see <http://www.gnu.org/licenses/>.
*/

namespace ChordDictionary
{    
    const var chordTypes = [
        [0, 4, 7], //Major
        [0, 3, 7], //Minor
        [0, 4, 7, 9], //Major 6th
        [0, 2, 3, 7, 9], //Minor 6 add9
        [0, 4, 7, 10], //Dominant 7th
        [0, 4, 7, 11], //Major 7th
        [0, 3, 7, 10], //Minor 7th
        [0, 3, 7, 11], //mM7
        [0, 4, 6, 7, 11], //Major 7#11
        [0, 5, 7, 10], //7th sus4
        [0, 2, 4, 6, 9, 11], //Major 13th #11
        [0, 2, 3, 7, 10], //Minor 9th
        [0, 2, 3, 5, 7, 10], //Minor 11th
        [0, 2, 3, 5, 7, 9, 10], //Minor 13th
        [0, 3, 6], //Diminished
        [0, 3, 6, 9], //Diminished 7th
        [0, 3, 6, 10], //Half diminished 7th
        [0, 3, 6, 11], //Diminished Major 7th
        [0, 4, 8], //Augmented
        [0, 2, 7] //Sus2
    ];
    
    const var chordNames = [
        "Major",
        "Minor",
        "Major 6th",
        "Minor 6 add9",
        "Dominant 7th",
        "Major 7th",
        "Minor 7th",
        "mM7",
        "Major 7#11",
        "7th sus4",
        "Major 13th #11",
        "Minor 9th",
        "Minor 11th",
        "Minor 13th",
        "Diminished",
        "Diminished 7th",
        "7b5",
        "Dim M7",
        "Augmented",
        "Sus2"
    ];
    
    inline function getUserChord(tuning, fret, keys)
    {        
        local data = g_userChords; //Get persistent data object by ref
        
        if (data != undefined && data[tuning.join()] != undefined && data[tuning.join()][fret] != undefined)
        {
            keys.sort();

            //Search for existing entry
            local index = data[tuning.join()][fret].indexes.indexOf(keys.join());

            if (index != -1)
                return data[tuning.join()][fret].strings[index];
            else
                return [];
        }
        else
            return [];
    }
    
    inline function storeUserChord(tuning, fret, keys, strings)
    {
        local data = PersistentData.get("userChords"); //Get persistent data object

        if (data == undefined) data = {};
        if (data[tuning.join()] == undefined) data[tuning.join()] = [];
        if (data[tuning.join()][fret] == undefined) data[tuning.join()][fret] = {"indexes":[], "strings":[]};
        
        keys.sort();
        
        //Search for existing entry
        local index = data[tuning.join()][fret].indexes.indexOf(keys.join());

        if (index != -1)
            data[tuning.join()][fret].strings[index] = strings;
        else
        {
            data[tuning.join()][fret].indexes.push(keys.join());
            data[tuning.join()][fret].strings.push(strings);
        }
        
        g_userChords = data; //Update global object
        PersistentData.set("userChords", data); //Update persistent data object
    }

    inline function removeUserChord(tuning, fret, keys)
    {
        local data = PersistentData.get("userChords"); //Get persistent data object

        if (data != undefined && data[tuning.join()] != undefined && data[tuning.join()][fret] != undefined)
        {
            keys.sort();
            
            //Search for existing entry
            local index = data[tuning.join()][fret].indexes.indexOf(keys.join());

            if (index != -1)
            {
                data[tuning.join()][fret].indexes.remove(data[tuning.join()][fret].indexes[index]);
                data[tuning.join()][fret].strings.remove(data[tuning.join()][fret].strings[index]);
            }
        }
        
        g_userChords = data; //Update global object
        PersistentData.set("userChords", data); //Update persistent data object
    }
    
    inline function getChord(notes, fret)
    {
        local sorted = []; //Holds sorted note data
        local search = []; //Holds pattern to search for in the dictionary
        local chordRoot;
        local index;

        //Sort the note data and remove duplicates
        for ( i = 0; i < notes.length; i++)
        {
            if (notes[i] != undefined && !sorted.contains(notes[i] % 12))
                sorted.push(notes[i] % 12);
        }

        sorted.sort();

        /*Seach dictionary for match to sorted array
        Shuffle array if no match is found until all choices have been tried.*/
        for (i = 0; i < sorted.length; i++)
        {
            for (j = 0; j < sorted.length; j++)
            {
                chordRoot = sorted[i]; //Try next note as root
                search[j] = (sorted[j] + ((j < i) * 12)) - chordRoot;
            }

            search.sort();

            //Check if the search pattern is present in the dictionary
            index = chordTypes.indexOf(search);

            //Exit loop if search match entry in chord dictionary
            if (index != -1)
                break;
        }

        if (index != -1)
            return g_chordMap[chordRoot][index][fretPos];
        else
            return [];
    }
    
    inline function getChordVoicing(data, fretPos, ref)
    {
        local notes = []; //Holds sorted data
        local search = []; //Holds pattern to search for in the dictionary
        local chordRoot;
        local index;

        //Sort the note data and remove duplicates
        for ( i = 0; i < data.length; i++)
        {
            if (data[i] != undefined && !notes.contains(data[i] % 12))
                notes.push(data[i] % 12);
        }

        notes.sort();

        /*Seach dictionary for match to notes array
        Shuffle array if no match is found until all choices have been tried.*/
        for (i = 0; i < notes.length; i++)
        {
            for (j = 0; j < notes.length; j++)
            {
                chordRoot = notes[i]; //Try next note as root
                search[j] = (notes[j] + ((j < i) * 12)) - chordRoot;
            }

            search.sort();

            //Check if the search pattern is present in the dictionary
            index = chordTypes.indexOf(search);

            //Exit loop if search match entry in chord dictionary
            if (index != -1)
                break;
        }

        if (index != -1)
        {
            if (ref)
                return referenceMap[chordRoot][index][fretPos];
            else
                return g_chordMap[chordRoot][index][fretPos];
        }
        else
            return [];
    }
    
    inline function getType(index)
    {
        return chordTypes[index];
    }
    
    //Create chord voicing lookup table
    inline function generateChordTable(tuning, numFrets)
    {
        local result = [[], [], [], [], [], [], [], [], [], [], [], []]; //One object per root note
        local i;
        local j;
        local f;
        
        for (i = 0; i < result.length; i++) //Each root note
        {
            for (j = 0; j < chordTypes.length; j++) //Each chord type
            {
                for (f = 0; f < numFrets; f++) //Each fret
                {
                    local voicing = voiceChord(tuning, i, j, f);
                    
                    if (result[i][j] == undefined)
                        result[i][j] = [];

                    result[i][j][f] = voicing;
                }
            }
        }
        return result;
    }   
    
    //Wrapper function
    inline function voiceChord(tuning, rootNote, chordType, fretPos)
    {
        local intervals = chordTypes[chordType];
        local options = getOptions(tuning, rootNote, intervals, fretPos);
        return filterOptions(options, tuning, rootNote, intervals);
    }

    //Gather possible frets for each string
    inline function getOptions(tuning, rootNote, intervals, fretPos)
    {
        local result = [];
        local i;
        local j;
        
        for (i = 0; i < tuning.length; i++)
        {
            local s = (fretPos + tuning[i]) % 12;
        
            for (j = 0; j < intervals.length; j++)
            {
                local n = (rootNote + intervals[j]) % 12;

                if (n < s) n = n + 12;
                
                local f = Math.abs(n-s);

                if (f < 5)
                {
                    if (result[i] == undefined)
                        result[i] = [];
                    
                    result[i].push(f+fretPos);
                }
            }
        }
        return result;
    }

    //Filter fret options to generated chord voicing
    inline function filterOptions(options, tuning, rootNote, intervals)
    {
        local result = [];
        local fretted = 0;
        local count = [];
        local lowest = 99;
        local notes = [];
        local third = rootNote + intervals[1];
        local i;
        local j;
        
        for (i = 0; i < options.length; i++)
        {
            result[i] = -1;
            local lastFret = 0;
            local s = (tuning[i]) % 12;
        
            if (options[i])
            {
                for (j = 0; j < options[i].length; j++)
                {
                    local f = options[i][j];
                    local n = s + f; //Get normalized note number

                    if (count[f] == undefined)
                        count[f] = 0;

                    if (fretted < 4 || i < 5 || (f == lowest && count[f] > 1))
                    {
                        //Don't double fretted thirds
                        if (n == third && notes.contains(third) && f != 0)
                            continue;

                        local temp = result[i]; //Copy of fret for this string to compare

                        //Go for the lowest fret possible
                        if (f < result[i] || result[i] == -1)
                            result[i] = f;
                    
                        //Make sure the fret is compatible with the options on the previous and next strings
                        if (i > 0 && options[i-1] && options[i-1].contains(f) && i < options.length-1 && options[i+1] && !options[i+1].contains(result[i]))
                            result[i] = f;

                        if (typeof options[i+1] == "object" && i < options.length-1 && options[i+1].contains(f))
                            result[i] = f;

                        if (i > 2 && result[i-1] == -1)
                            result[i] = -1;
                                                
                        lastFret = f;

                        //Count number of frets being played
                        if (result[i] != 0)
                        {
                            fretted++;
                            count[f]++;
                        }
                        
                        //Compare string with comparison copy and record the note number
                        if (result[i] != temp && f != 0)
                            notes[i] = n;
                    }
                }
                
                //Keep track of lowest fret and fretted notes
                if (lastFret != 0 && lastFret < lowest)
                {
                    lowest = lastFret;
                }
            }
        }
        return result;
    }
}