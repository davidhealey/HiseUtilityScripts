/*
Author: David Healey
Modified: 2020
License: Public Domain Dedication (CC0)
Filename: noteFilter.js

source: http://creativecommons.org/publicdomain/zero/1.0/
*/

Content.setWidth(500);

const var knbLowNote = Content.addKnob("LowNote", 0, 0);
knbLowNote.set("text", "Low Note");
knbLowNote.setRange(0, 127, 1);

const var knbHighNote = Content.addKnob("HighNote", 150, 0);
knbHighNote.set("text", "High Note");
knbHighNote.setRange(0, 127, 1);
knbHighNote.set("defaultValue", 127);function onNoteOn()
{
    local n = Message.getNoteNumber();
    local t = Message.getTransposeAmount();

	if (n < knbLowNote.getValue() + t || n > knbHighNote.getValue() + t)
        Message.ignoreEvent(true);
}
 function onNoteOff()
{
    local n = Message.getNoteNumber();
    local t = Message.getTransposeAmount();

    if (n < knbLowNote.getValue() + t || n > knbHighNote.getValue() + t)
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
 