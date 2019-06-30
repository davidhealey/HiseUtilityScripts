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

const var ids = Engine.createMidiList();
ids.fill(false);

reg lastLevel = 0;

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

inline function onknbLevelControl(component, value)
{
    if (!btnBypass.getValue())
    {
        local threshold = knbThreshold.getValue();
    
        for (i = 0; i < 127; i++)
        {
            if (Synth.isKeyDown(i))
            {
                if (value >= threshold && lastLevel < threshold)
                {
                    if (ids.getValue(i) != false)
                        Synth.noteOffByEventId(ids.getValue(i));
            
                    ids.setValue(i, Synth.playNote(i, 64));  
                }
                else if (value < threshold && ids.getValue(i) != false)
                {
                    Synth.noteOffByEventId(ids.getValue(i));
                    ids.setValue(i, false);
                }
            }
        }
    
        lastLevel = value;   
    }
};function onNoteOn()
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
    }        
}
 function onNoteOff()
{
    if (ids.getValue(Message.getNoteNumber()) != false)
    {
        Synth.noteOffByEventId(ids.getValue(Message.getNoteNumber()));
        ids.setValue(Message.getNoteNumber(), false);
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