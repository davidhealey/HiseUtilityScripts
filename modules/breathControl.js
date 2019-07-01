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

Content.setWidth(600);
Content.setHeight(50);

const var velo = Engine.createMidiList(); //Note on velocities
const var ids = Engine.createMidiList(); //Note Ids
ids.fill(false);

reg lastLevel = 0; //Last breath level
reg lastTime = 0;

//GUI
const var btnBypass = Content.addButton("btnBypass", 10, 10);
btnBypass.set("text", "Bypass");

const var knbThreshold = Content.addKnob("knbThreshold", 160, 0);
knbThreshold.set("text", "Threshold");
knbThreshold.set("defaultValue", 10);
knbThreshold.setRange(0, 127, 1);

const var knbLevel = Content.addKnob("knbLevel", 310, 0);
knbLevel.set("text", "Level");
knbLevel.setRange(0, 127, 1);
knbLevel.setControlCallback(onknbLevelControl);

const var btnVelMode = Content.addButton("btnVelMode", 460, 10)
btnVelMode.set("text", "Speed = Velocity");

inline function onknbLevelControl(component, value)
{
    if (!btnBypass.getValue())
    {
        local threshold = knbThreshold.getValue();
        local velocity = 1;
        
        //If btnVelMode enabled calculate the velocity
        if (btnVelMode.getValue())
            velocity = getVelocity();
    
        //Going up but haven't reached threshold, update lastTime
        if (lastTime == 0 && value < threshold && value > lastLevel)
            lastTime = Engine.getUptime();
            
        for (i = 0; i < 127; i++)
        {
            if (Synth.isKeyDown(i))
            {
                if (value >= threshold && lastLevel < threshold)
                {
                    //Turn off existing note (if any)
                    if (ids.getValue(i) != false)
                        Synth.noteOffByEventId(ids.getValue(i));
            
                    //Get velocity for note on if btnVelMode disabled
                    if (!btnVelMode.getValue())
                        velocity = velo.getValue(i);
                        
                    //Play new note
                    ids.setValue(i, Synth.playNote(i, velocity));
                }
                else if (value < threshold && ids.getValue(i) != false)
                {
                    //Turn off note
                    Synth.noteOffByEventId(ids.getValue(i));
                    ids.setValue(i, false);
                    lastTime = 0;
                }
            }
        }

        //Update lastLevel value
        lastLevel = value;
    }
};

//Calculate the velocity based on the breath speed - up to 1 second window
inline function getVelocity()
{
    local timeDiff = Math.min(1, Engine.getUptime()-lastTime) / 1; //Limit timeDiff to 0-1 seconds
    local v = Math.pow(timeDiff, 0.3); //Skew value
    return parseInt(127-(v*117));
}function onNoteOn()
{        
    if (!btnBypass.getValue())
    {
        if (knbLevel.getValue() < knbThreshold.getValue())
            Message.ignoreEvent(true);
        else
        {
            if (ids.getValue(Message.getNoteNumber()) != false)
                Synth.noteOffByEventId(ids.getValue(Message.getNoteNumber()));
            
            ids.setValue(Message.getNoteNumber(), Message.makeArtificial());
        }
        
        velo.setValue(Message.getNoteNumber(), Message.getVelocity());
    }        
}
 function onNoteOff()
{
    if (ids.getValue(Message.getNoteNumber()) != false)
    {
        Synth.noteOffByEventId(ids.getValue(Message.getNoteNumber()));
        ids.setValue(Message.getNoteNumber(), false);
        lastTime = 0;
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