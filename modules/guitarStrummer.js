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

Content.setWidth(750);
Content.setHeight(250);
//include("chordDictionary.js"); //Chord dictionary is required

Synth.deferCallbacks(true);

reg channel;
reg direction = 0;
reg stringCounter;
reg startString;
reg chordTones;
reg strings = []; //One element per string
reg timerNote;
reg timerString;
reg capo = 0;
reg dynamic;
const var ids = []; //One element per string

reg rr = 0;
const var NUM_RR = 2;
const var lastRR = Engine.createMidiList();
lastRR.fill(0);

/*GUI*/

//btnMute
const var btnMute = Content.addButton("btnMute", 10, 10);
btnMute.set("text", "Mute");

//cmbDirection
const var cmbDirection = Content.addComboBox("cmbDirection", 160, 10);
cmbDirection.set("items", ["Silent", "Down", "Up", "Alternate"].join("\n"));

//knbFret
const var knbFret = Content.addKnob("knbFret", 310, 0);
knbFret.set("text", "Fret Position");
knbFret.setRange(0, 30, 1);

//knbCapo
const var knbCapo = Content.addKnob("knbCapo", 460, 0);
knbCapo.set("text", "Capo");
knbCapo.setRange(0, 16, 1);

//btnAutoPos - not implemented
const var btnAutoPos = Content.addButton("btnAutoPos", 10, 60);
btnAutoPos.set("text", "Auto Fret Position");

//knbStart
const var knbStart = Content.addKnob("knbStart", 160, 50);
knbStart.set("text", "Start String");
knbStart.setRange(0, 3, 1);

//knbLength
const var knbLength = Content.addKnob("knbLength", 310, 50);
knbLength.set("text", "Strum Length");
knbLength.setRange(2, 6, 1);

//knbDecay
const var knbDecay = Content.addKnob("knbDecay", 460, 50);
knbDecay.set("text", "Decay");
knbDecay.set("mode", "normalizedPercentage");
knbDecay.set("middlePosition", 0.5);

//knbSpeed
const var knbSpeed = Content.addKnob("knbSpeed", 610, 50);
knbSpeed.set("text", "Speed");
knbSpeed.setRange(100, 600, 1);
knbSpeed.set("mode", "Time");
knbSpeed.set("middlePosition", 150);

inline function strum()
{
    Synth.stopTimer();

    local start = knbStart.getValue();
    local end = start + knbLength.getValue();

    stringCounter = 0;
    direction == 0 ? startString = g_tuning.length-1 : startString = start;

    Synth.startTimer(knbSpeed.getValue()/10000);
}function onNoteOn()
{
    if (!btnMute.getValue() && !Message.isArtificial())
    {
        local n = Message.getNoteNumber();
        dynamic = 1 + g_velocityLayer * g_tuning.length * 4; //Dynamic velocity level
        channel = Message.getChannel();
        capo = knbCapo.getValue(); //Set capo variable

        if (n >= g_ranges[2][0] && n <= g_ranges[2][1]) //Strum keys
        {
            if (strings)
            {
                //Determine strum direction based on strum key
                if (n - g_ranges[2][0] == 0 || n - g_ranges[2][0] == 1)
                    direction = 0;
                else if (n - g_ranges[2][0] == 2 || n - g_ranges[2][0] == 3)
                    direction = 1;

                //Set round robin
                rr = (lastRR.getValue(n) - 1 + Math.randInt(2, NUM_RR)) % NUM_RR;
                lastRR.setValue(n, rr);
                
                //Muted samples only have 1 dynamic
                if (n == g_ranges[2][0]+1 || n == g_ranges[2][1])
                    dynamic = 1;

                g_strings = strings.clone();
                strum();
            }
        }
        else //Playable range and picking keys
        {
            //Determine strum/pick direction
            if (cmbDirection.getValue() != 1)
            {
                if (cmbDirection.getValue() == 4)
                    direction = 1-direction;
                else
                    direction = cmbDirection.getValue() - 2;
            }
            
            //Set round robin - accounting for direction
            if (direction == 1 || cmbDirection.getValue() != 4)
            {
                rr = (lastRR.getValue(n) - 1 + Math.randInt(2, NUM_RR)) % NUM_RR;
                lastRR.setValue(n, rr);
            }            
            
            if (n >= g_ranges[0][0] && n <= g_ranges[0][1]) //Playable range
            {
                if (Synth.getNumPressedKeys() > 2) //At least 3 keys are pressed
                {
                    Synth.stopTimer();
            
                    //Check for userChord
                    strings = ChordDictionary.getUserChord(g_tuning, knbFret.getValue(), g_heldKeys);

                    //If no userChord found check for chord in chordMap
                    if (strings.length == 0)
                        strings = ChordDictionary.getChordVoicing(g_heldKeys, knbFret.getValue(), false);        

                    //Strum the chord if direction is not set to Silent
                    if (cmbDirection.getValue() != 1)
                    {
                        g_strings = strings.clone();
                        strum();
                    }
                }
            }
            else if (n >= g_ranges[1][0] && n <= g_ranges[1][1]) //Picking keys
            {
                local s = g_ranges[1][1] - n;
                local stringNote = g_tuning[s] + parseInt(strings[s]);

                //If chord string is unused, use open string
                if (stringNote < g_ranges[0][0])
                    stringNote = g_tuning[s];
                
                if (ids[s])
                {
                    Synth.noteOffByEventId(ids[s]);
                    ids[s] = undefined;
                }
            
                if (stringNote - g_ranges[0][0] > -1)
                {
                    local v = dynamic + (s * 4) + (2 * direction) + rr;
                    ids[s] = Synth.playNote(stringNote + capo, v);
                }
            }
        }
    }
}function onNoteOff()
{
    local n = Message.getNoteNumber();

    if (!Message.isArtificial() && (!Synth.isSustainPedalDown() || cmbDirection.getValue()))
    {
        if (n >= g_ranges[1][0] && n <= g_ranges[1][1])
        {
            local s = g_ranges[1][1] - n;

            if (ids[s])
                Synth.noteOffByEventId(ids[s]);

            ids[s] = undefined;
        }
        
        if (!Synth.getNumPressedKeys() && !Synth.isSustainPedalDown())
        {
            if (!btnMute.getValue())
                g_strings = [];
        
            Synth.stopTimer();
        
            for (i = 0; i < ids.length; i++)
            {
                if (ids[i])
                {
                    Synth.noteOffByEventId(ids[i]);
                    ids[i] = undefined;
                }
            }
        }
    }
} function onController()
{
    if (!Synth.isSustainPedalDown() && !Synth.getNumPressedKeys())
    {
        if (!btnMute.getValue())
            g_strings = [];
        
        Synth.stopTimer();
        
        for (i = 0; i < ids.length; i++)
        {
            if (ids[i])
            {
                Synth.noteOffByEventId(ids[i]);
                ids[i] = undefined;
            }
        }   
    }
}
 function onTimer()
{    
    local s;

    if (stringCounter < g_tuning.length && stringCounter <= knbLength.getValue())
    {       
        if (!direction) //Down
        {
            s = startString - stringCounter;
            
            //Skip unplayed strings
            if (strings[s] == -1)
            {
                startString--;
                s--;
            }
        }
        else //Up
        {            
            s = startString + stringCounter;
            
            //Skip unplayed strings
            if (strings[s] == -1)
            {
                startString++;
                s++;
            }
        }
        
        //Turn off old note
        if (ids[stringCounter])
        {
            Synth.noteOffByEventId(ids[stringCounter]);
            ids[stringCounter] = undefined;
        }

        if (s > -1 && s < strings.length && strings[s] != -1)
        {
            //Get note number
            local n = g_tuning[s] + strings[s] + capo;

            //Play new note
            local v = dynamic + (4 * s) + rr + (2 * direction);
            ids[stringCounter] = Synth.playNote(n, v);

            //String decay
            local decay = (stringCounter) * knbDecay.getValue() * -10 / (g_tuning.length-1);
            Synth.addVolumeFade(ids[stringCounter], 0, decay);
        }
    }

    stringCounter++; //Count played strings
    
    if (stringCounter > g_tuning.length)
        Synth.stopTimer();
} function onControl(number, value)
{
	
}
 