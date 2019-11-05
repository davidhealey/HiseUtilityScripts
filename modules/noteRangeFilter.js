/*
Author: David Healey
Modified: 2019
License: Public Domain Dedication (CC0)
Filename: noteFilter.js

source: http://creativecommons.org/publicdomain/zero/1.0/
*/

Content.setWidth(500);

const var knbLow = Content.addKnob("knbLow", 0, 0);
knbLow.set("text", "Low Note");
knbLow.setRange(0, 127, 1);

const var knbHigh = Content.addKnob("knbHigh", 150, 0);
knbHigh.set("text", "High Note");
knbHigh.setRange(0, 127, 1);
knbHigh.set("defaultValue", 127);function onNoteOn()
{
    local n = Message.getNoteNumber();
    local t = Message.getTransposeAmount();

	if (n < knbLow.getValue() + t || n > knbHigh.getValue() + t)
        Message.ignoreEvent(true);
}
 function onNoteOff()
{
    local n = Message.getNoteNumber();
    local t = Message.getTransposeAmount();

    if (n < knbLow.getValue() + t || n > knbHigh.getValue() + t)
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
