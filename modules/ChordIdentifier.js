/*
    Copyright 2019 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with This file. If not, see <http://www.gnu.org/licenses/>.
*/

namespace ChordDictionary
{
    const var patterns = [
        [0, 4, 7], //Major
        [0, 4, 7, 9], //Major 6th
        [0, 2, 4, 7, 9], //Major 6 add9
        [0, 4, 7, 11], //Major 7th
        [0, 4, 6, 7, 11], //Major 7#11
        [0, 2, 4, 7, 11], //Major 9th
        [0, 2, 4, 5, 7, 11], //Major 11th
        [0, 2, 4, 6, 7, 9, 11], //Major 13th
        [0, 2, 4, 6, 9, 11], //Major 13th #11
        [0, 3, 7], //Minor
        [0, 3, 7, 9], //"Minor 6th"
        [0, 2, 3, 7, 9], //Minor 6 add9
        [0, 3, 7, 10], //Minor 7th
        [0, 4, 6, 8, 11], //Minor 7#11
        [0, 2, 3, 7, 10], //Minor 9th
        [0, 2, 3, 5, 7, 10], //Minor 11th
        [0, 2, 3, 5, 7, 9, 10], //Minor 13th
        [0, 3, 7, 11], //mM7
        [0, 3, 6], //Diminished
        [0, 3, 6, 9], //Diminished 7th
        [0, 3, 6, 11], //Diminished Major 7th
        [0, 3, 6, 10], //Half diminished 7th
        [0, 4, 7, 10], //Dominant 7th
        [0, 2, 7], //Sus2
        [0, 5, 7], //Sus4
        [0, 4, 7, 10], //Harmonic 7th
        [0, 4, 8], //Augmented
        [0, 6, 10], //Augmented 6th v1
        [0, 4, 6, 10], //Augmented 6th v2
        [0, 4, 7, 10], //Augmented 6th v3
        [0, 4, 8, 10], //Augmented 7th
        [0, 2, 4, 6, 7, 10], //Augmented 11th
        [0, 4, 8, 11], //Augmented major seventh chord
        [0, 2, 4, 7, 10], //Dominant 9th
        [0, 1, 3, 5, 6, 10], //Magic chord
        [0, 2, 4, 7], //Mu Chord
        [0, 2, 4, 6, 9, 10], //Mystic chord
        [1, 5, 8], //Neapolitan chord
        [0, 2, 4, 8, 10], //9th Augmented 5th
        [0, 2, 4, 6, 10], //9th flat 5th
        [0, 1, 4, 6, 7, 10], //Petrushka chord
        [0, 7], //Power chord
        [0, 4, 7, 9, 10], //7 6 Chord
        [0, 5, 7, 10], //7th sus4
        [0, 3, 5, 7, 10], //So What
        [0, 3, 6, 10], //Tristan
        [0, 1, 6], //Viennese trichord 1
        [0, 6, 7], //Viennese trichord 2
        [0, 5, 6, 7], //Dream chord
        [0, 1, 4, 7, 9], //Elektra
        [0, 4, 8, 9, 11], //Farben
    ];

    const var names = [
        "Major",
        "Major 6th",
        "Major 6 add9",
        "Major 7th",
        "Major 7#11",
        "Major 9th",
        "Major 11th",
        "Major 13th",
        "Major 13th #11",
        "Minor",
        "Minor 6th",
        "Minor 6 add9",
        "Minor 7th",
        "Minor 7#11",
        "Minor 9th",
        "Minor 11th",
        "Minor 13th",
        "mM7",
        "Dimished",
        "Dimished 7th",
        "Diminished Major 7th",
        "Half Diminished 7th",
        "Dominant 7th",
        "Sus2",
        "Sus4",
        "Harmonic 7th",
        "Augmented",
        "Augmented 6th", //v1
        "Augmented 6th", //v2
        "Augmented 6th", //v3
        "Augmented 7th",
        "Augmented 11th",
        "Augmented major seventh chord",
        "Dominant 9th",
        "Magic Chord",
        "Mu",
        "Mystic",
        "Neapolitan",
        "9th Augmented 5th",
        "9th flat 5",
        "Petrushka",
        "Power Chord",
        "7/6",
        "7th Sus4",
        "So What",
        "Tristan",
        "Viennese trichord", //v1
        "Viennese trichord", //v2
        "Dream",
        "Elektra",
        "Farben"
    ];
}

const var noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

reg heldKeys = [];

inline function determineChord(data)
{
    local notes = []; //Holds sorted data
    local search = []; //Holds pattern to search for in the dictionary
    local chordRoot;
    local chordName = "";

    //Sort the data and remove duplicates
    for ( i = 0; i < data.length; i++)
    {
        if (data[i] != undefined && !notes.contains(data[i] % 12))
            notes.push(data[i] % 12);
    }

    notes.sort();

    //Seach dictionary for match to notes array
    //Shuffle array if no match is found until all choices have been tried.
    for (i = 0; i < notes.length; i++)
    {
        for (j = 0; j < notes.length; j++)
        {
            chordRoot = notes[i]; //Try next note as root
            search[j] = (notes[j] + ((j < i) * 12)) - chordRoot;
        }

        search.sort();

        //Check if the search pattern is present in the dictionary
        local result = ChordDictionary.patterns.indexOf(search);

        //Exit loop if search match entry in chord dictionary
        if (result != -1)
        {
            local chordType = ChordDictionary.patterns[result];
            chordName = noteNames[chordRoot] + " " + ChordDictionary.names[result];
            break;
        }
        else //No matching chord in dictionary
            chordName = "---";
    }
    Console.print(chordName);
}function onNoteOn()
{
    heldKeys.push(Message.getNoteNumber()); //Add this key to end of the heldKeys array

    if (heldKeys.length > 2)
        determineChord(heldKeys);
}
 function onNoteOff()
{
	if (Synth.getNumPressedKeys() == 0) //All keys up
        heldKeys.clear(); //Reset array
	else
    {
        local index = heldKeys.indexOf(Message.getNoteNumber()); //Get index of released key
        heldKeys.remove(heldKeys[index]); //Remove matching element from the heldKeys array

        //Check for chord based on updated heldKeys array
        if (heldKeys.length > 2)
            determineChord(heldKeys);
    }
}
 function onController()
{

}
 function onTimer()
{

}
 function onControl(number, value)
{

}
