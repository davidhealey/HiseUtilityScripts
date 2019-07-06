/*
Author: David Healey
Modified: 2019
License: Public Domain Dedication (CC0)
Filename: limitPlayableRange.js

source: http://creativecommons.org/publicdomain/zero/1.0/
*/

Content.setWidth(500);

const var knbLow = Content.addKnob("Low Note", 0, 0);
knbLow.setRange(0, 127, 1);

const var knbHigh = Content.addKnob("High Note", 150, 0);
knbHigh.setRange(0, 127, 1);
knbHigh.set("defaultValue", 127);function onNoteOn()
{
    local n = Message.getNoteNumber();
    
	if (n < knbLow.getValue() || n > knbHigh.getValue())
        Message.ignoreEvent(true);
}
 function onNoteOff()
{
    local n = Message.getNoteNumber();
    
    if (n < knbLow.getValue() || n > knbHigh.getValue())
        Message.ignoreEvent(true);
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
 