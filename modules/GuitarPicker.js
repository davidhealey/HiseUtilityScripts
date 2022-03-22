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
Content.setHeight(200);

const var eventIds = Engine.createMidiList();

reg channel = 0;
reg forceString = -1;
reg lastTime = 0;
reg forceString = -1; //Force the use of a particular string
reg direction = 0;
reg lastVelocity;

//Round robin variables
const var NUM_RR = 2; //Total RRs
reg rr = 0; //Current RR
const var lastRR = Engine.createMidiList();
lastRR.fill(0);

const var noteString = Engine.createMidiList(); //Map string used for each note when played

//Polyphonic variables (1 element per string)
const var notes = []; //Current note for each string
const var slideDecays = []; //Volume decay value
const var timerCounters = []; //Timer loop counters
const var timers = []; //Timer objects
const var intervals = []; //Legato/slide interval
const var timerOrigin = [];
const var timerTarget = [];
const var lastTimes = []; //Last time each string was triggered
const var retrigger = []; //Legato retrigger notes

//Timer object callback
function timerAction()
{
    var s = timers.indexOf(this);
    var v;
    var note;
    var bend;
    var rate = knbSlideSpeed.getValue();
    var newId;
    var oldId = eventIds.getValue(timerOrigin[s]);
    
    //Select bend, either up or down
    intervals[s] > 0 ? bend = 100 : bend = -100;

    //Fade out old note   
    if (oldId > 0)
    {
        Synth.addPitchFade(oldId, rate, 0, bend); //Pitch fade old note to bend amount
        Synth.addVolumeFade(oldId, rate, -100); //Fade out last note
        eventIds.setValue(timerOrigin[s], 0);
    }

    //Move to next note, either up or down
    intervals[s] > 0 ? timerOrigin[s]++ : timerOrigin[s]--;
    
    note = timerOrigin[s] + knbCapo.getValue();
    
    v = 1 + (s * 4) + rr; //Get velocity to trigger corrent sample
        
    //Play new note
    newId = Synth.playNoteWithStartOffset(channel, note, v, 20000);

    //Fade in new note
    Synth.addVolumeFade(newId, 0, -99); //Set new note's initial volume
    Synth.addVolumeFade(newId, rate, Math.min(0, slideDecays[s] * timerCounters[s])); //Fade in new note
    Synth.addPitchFade(newId, 0, 0, -bend); //Set new note's initial detuning
    Synth.addPitchFade(newId, rate, 0, 0); //Pitch fade new note to 0
        
    eventIds.setValue(timerOrigin[s], newId);

    timerCounters[s]++;
        
    if (Synth.getNumPressedKeys() < 1 || timerOrigin[s] == timerTarget[s] || timerCounters[s] >= Math.abs(intervals[s]) || (intervals[s] < 0 && timerOrigin[s] == tuning[s]))
        this.stopTimer();
}

//Make timer object (7 = max strings)
for (i = 0; i < 7; i++)
{
    timers[i] = Engine.createTimerObject();
    timers[i].setTimerCallback(timerAction);
}

/*GUI*/
//btnMute
const var btnMute = Content.addButton("btnMute", 10, 10);
btnMute.set("text", "Mute");

//cmbDirection
const var cmbDirection = Content.addComboBox("cmbDirection", 160, 10);
cmbDirection.set("items", ["Down", "Up", "Alternate"].join("\n"));

//btnRetrigger
const var btnRetrigger = Content.addButton("btnRetrigger", 10, 60);
btnRetrigger.set("text", "Retrigger");

//knbCapo
const var knbCapo = Content.addKnob("knbCapo", 160, 50);
knbCapo.set("text", "Capo");
knbCapo.setRange(0, 16, 1);

//knbLegatoRange
const var knbLegatoRange = Content.addKnob("knbLegatoRange", 310, 50);
knbLegatoRange.set("text", "Legato Range");
knbLegatoRange.setRange(0, 15, 1);

//btnSlide
const var btnSlide = Content.addButton("btnSlide", 10, 110);
btnSlide.set("text", "Slide");

//knbSlideDecay
const var knbSlideDecay = Content.addKnob("knbSlideDecay", 160, 100);
knbSlideDecay.set("text", "Slide Decay");
knbSlideDecay.setRange(-50, 0, 1);
knbSlideDecay.set("suffix", " dB");

//knbSlideSpeed
const var knbSlideSpeed = Content.addKnob("knbSlideSpeed", 310, 100);
knbSlideSpeed.set("text", "Slide Speed");
knbSlideSpeed.set("mode", "Time");
knbSlideSpeed.set("defaultValue", 80);
knbSlideSpeed.setRange(50, 200, 1);

//Higher velocity = shorter slide time
inline function setSlideRateFromVelocity(v)
{
    local t = (knbSlideSpeed.get("max") - knbSlideSpeed.get("min")) / 127 * v;
    knbSlideSpeed.setValue(knbSlideSpeed.get("max") - t);
}function onNoteOn()
{
    if (!btnMute.getValue())
    {
        channel = Message.getChannel();
        local n = Message.getNoteNumber(); //Record incoming note number
        local d = 1 + g_velocityLayer * g_tuning.length * 4; //Dynamic velocity level
        local notesPerString = g_patch.notesPerString;

        local capo = knbCapo.getValue();
        
        if (n >= g_ranges[1][0] + capo && n <= g_ranges[1][1]) //Force string keys
        {
            forceString = g_ranges[1][1] - n;
        }
        else if (n >= g_ranges[2][0] && n <= g_ranges[2][1]) //Strum keys
        {
            for (i = 0; i < notes.length; i++)
            {
                if (notes[i] && eventIds.getValue(notes[i]) > 0)
                {
                    Synth.noteOffByEventId(eventIds.getValue(notes[i]));
                    eventIds.setValue(notes[i], 0);
                    notes[i] = undefined;
                }
            }
        }
        else
        {
            if (n >= g_ranges[0][0] + capo && n <= g_ranges[0][1])
            {
                //Get default string for note
                local s = g_map.getValue(n - capo);

                //Set direction
                if (cmbDirection.getValue() == 3)
                    direction == 0 ? direction = 1 : direction = 0;
                else
                    direction = cmbDirection.getValue()-1;

                //Set round robin - accounting for direction
                if (direction || cmbDirection.getValue() != 3)
                {
                    rr = (lastRR.getValue(n) - 1 + Math.randInt(2, NUM_RR)) % NUM_RR;
                    lastRR.setValue(n, rr);
                }
                
                if (knbLegatoRange.getValue() == 0) //Polyphonic
                {
                    local v = d + (s * 4) + (direction * 2) + rr;
                    local id = Synth.playNote(n + capo, v);
                    eventIds.setValue(n, id);
                }
                else
                {
                    //Forced string
                    if (forceString != -1 && n >= g_tuning[forceString] && n <= (g_tuning[forceString] + notesPerString-3))
                    {
                        s = forceString;
                    }
                    else
                    {
                        //Check for two notes on same string
                        local sameString;
                        if (notes[s])
                            sameString = (Engine.getUptime() - lastTimes[s]) < 0.025;
                        else
                            sameString = false;

                        //For two notes on same string at same time, find the next available string
                        if (sameString && Synth.getNumPressedKeys() > 1)
                        {
                            while (s < g_tuning.length-1 && notes[s])
                            {
                                s++;
                            }
                        }

                        //Two notes played together, on any strings
                        local isChord = (Engine.getUptime() - lastTime) < 0.025;

                        //Figure out legato string config
                        if (!isChord && Synth.getNumPressedKeys() > 1)
                        {
                            local lastS = s;

                            while (lastS < g_tuning.length-1 && !notes[lastS])
                            {
                                lastS++;
                            }

                            if (notes[lastS] && n - notes[lastS] < knbLegatoRange.getValue())
                                s = lastS;
                        }
                    }

                    //Calculate velocity, accounting for note, string, rr, and direction
                    local v = d + (s * 4) + rr + (direction * 2);

                    //Reset force string if no force key held
                    if (forceString != -1 && !Synth.isKeyDown(g_ranges[1][1]-forceString))
                        forceString = -1;

                    if (notes[s] && !sameString && Math.abs(n - notes[s]) <= knbLegatoRange.getValue()) //Phrase note
                    {
                        if (btnSlide.getValue() && notes[s] != n) //Slide
                        {
                            //Stop string's timer
                            timers[s].stopTimer();

                            //Set interval
                            intervals[s] = n - notes[s];

                            //Calculate slide decay
                            slideDecays[s] = knbSlideDecay.getValue() / Math.abs(intervals[s]);                            

                            //Set start and end note for timer
                            timerOrigin[s] = notes[s];
                            timerTarget[s] = n;

                            //Reset fail safe counter
                            timerCounters[s] = 0;

                            //Set slide rate
                            setSlideRateFromVelocity(g_velocity);
                            g_velocity = lastVelocity / 2;
                                
                            //Start timer
                            timers[s].startTimer(knbSlideSpeed.getValue());
                        }
                        else //Legato
                        {
                            local detune;

                            //Calculate played interval
                            intervals[s] = n - notes[s];
                            intervals[s] > 0 ? detune = -10 : detune = 10;

                            //Play and fade in new note
                            local newId = Synth.playNoteWithStartOffset(channel, n + capo, v, 5000);
                            Synth.addVolumeFade(newId, 0, -99);
                            Synth.addVolumeFade(newId, 20, 0);
                            Synth.addPitchFade(newId, 0, 0, detune); //Set initial deg_tuning
                            Synth.addPitchFade(newId, 20, 0, 0); //Fade to final pitch

                            //Fade out old note
                            local oldId = eventIds.getValue(notes[s]);
                            
                            if (oldId > 0)
                            {
                                //Adjust fade time if playing a retriggered note
                                local fadeTm;
                                retrigger[s] == n ? fadeTm = 20 : fadeTm = 300;

                                Synth.addVolumeFade(oldId, fadeTm, -100);
                                Synth.addPitchFade(oldId, 250, 0, -detune); //Fade to final pitch
                                eventIds.setValue(notes[s], 0);
                            
                                eventIds.setValue(n, newId);
                                retrigger[s] = notes[s];
                            }
                        }
                    }
                    else
                    {
                        //Turn off old note
                        if (notes[s] && eventIds.getValue(notes[s]))
                        {
                            Synth.noteOffByEventId(eventIds.getValue(notes[s]));
                            eventIds.setValue(notes[s], 0);
                        }

                        local id = Synth.playNote(n + capo, v);
                        eventIds.setValue(n, id);
                        retrigger[s] = notes[s];
                    }
                    
                    notes[s] = n; //Update current note for string
                    noteString.setValue(n, s); //Update current string for note
                }
            }
            
            if (s >= 0 && s !== undefined)
            {
                if (n + capo < g_tuning[s] + capo)
                    g_strings[s] = undefined;
                else
                    g_strings[s] = Math.abs(n - (g_tuning[s] + capo));

                lastTimes[s] = Engine.getUptime(); //Track time per string
            }
            
            lastVelocity = g_velocity;
            lastTime = Engine.getUptime(); //Track time all strings
        }
    }
} function onNoteOff()
{
    local n = Message.getNoteNumber();
    local s = noteString.getValue(n);
    local d = 1 + g_velocityLayer * g_tuning.length * 4; //Dynamic velocity level
    local capo = knbCapo.getValue();

    //Force string keys
    if (n >= g_ranges[1][0] + capo && n <= g_ranges[1][1])
    {
        forceString = -1;
    }    
    else
    {
        if (!eventIds.isEmpty() && n >= g_ranges[0][0] + capo && n <= g_ranges[0][1])
        {        
            if (knbLegatoRange.getValue() > 0)
            {
                //Turn off released note
                if (eventIds.getValue(n) > 0 && !Synth.isSustainPedalDown())
                {
                    Synth.noteOffByEventId(eventIds.getValue(n));
                    eventIds.setValue(n, 0);
                }
                
                //If retrigger note is released, reset retrigger note
                if (n == retrigger[s] && !Synth.isSustainPedalDown())
                    retrigger[s] = undefined;
                else if (Synth.isSustainPedalDown())
                    retrigger[s] = n;
                                
                //Handle Retrigger
                if (retrigger[s] && btnRetrigger.getValue() && n == notes[s])
                {
                    direction = 1-direction;
                    local v = d + (s * 4) + (direction * 2) + rr;
                
                    //Play retrigger note
                    local id = Synth.playNoteWithStartOffset(Message.getChannel(), retrigger[s] + capo, v, 5000);
                    eventIds.setValue(retrigger[s], id);
                    
                    //Update variables
                    notes[s] = retrigger[s];
                    g_strings[s] = Math.abs(retrigger[s] - g_tuning[s]);
                }
                else if (notes[s] && eventIds.getValue(notes[s]) <= 0)
                {
                    notes[s] = undefined;
                    g_strings[s] = undefined;
                }
            
                if (!Synth.getNumPressedKeys())
                    timers[s].stopTimer();
            }
            else //Polyphonic
            {
                if (eventIds.getValue(n) > 0 && (!Synth.isSustainPedalDown() || btnRetrigger.getValue()))
                {
                    local id = eventIds.getValue(n);
                    Synth.noteOffByEventId(id);
                    eventIds.setValue(n, 0);
                }
                
                if (btnRetrigger.getValue() && Synth.isSustainPedalDown())
                {
                    s = g_map.getValue(n);
                    direction = 1-direction;
                    local v = d + (s * 4) + (direction * 2) + rr;
                    
                    Synth.playNote(n, v);
                }   
            }
        }

        //All keys up
        if (!Synth.getNumPressedKeys() && !Synth.isSustainPedalDown())
        {
            //Stop all timers
            for (i = 0; i < timers.length; i++)
            {
                timers[i].stopTimer();
            }
            
            //Kill all notes
            for (i = 0; i < 128; i++)
            {
                if (eventIds.getValue(i) > 0)
                    Synth.noteOffByEventId(eventIds.getValue(i));
            }

            eventIds.clear();
            notes.clear();
            retrigger.clear();
            
            if (!btnMute.getValue() && g_strings)
                g_strings.clear();
        }
    }
}function onController()
{
    if (Message.getControllerNumber() == 64)
    {
        if (!btnMute.getValue())
            Message.ignoreEvent(true);
        
        if (!Synth.isSustainPedalDown() && !Synth.getNumPressedKeys())
        {
            eventIds.clear();
            notes.clear();
            
            if (!btnMute.getValue() && g_strings)
                g_strings.clear();
            
            Engine.allNotesOff();
            Synth.stopTimer();
        }
    }
} function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 