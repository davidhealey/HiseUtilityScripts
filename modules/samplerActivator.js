/*
Copyright 2019 David Healey

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/
Content.setHeight(100);

const var UACC = 32;

const var btnActive = Content.addButton("btnActive", 10, 10);
btnActive.set("text", "Active");

const var knbKs = Content.addKnob("knbKs", 160, 0);
knbKs.setRange(0, 127, 1);
knbKs.set("text", "KS");

const var knbProgram = Content.addKnob("knbProgram", 310, 0);
knbProgram.setRange(0, 127, 1);
knbProgram.set("text", "Program");

const var btnToggle = Content.addButton("btnToggle", 460, 10);
btnToggle.set("text", "Toggle");

const var knbLoKs = Content.addKnob("knbLoKs", 0, 45);
knbLoKs.setRange(0, 127, 1);
knbLoKs.set("text", "Lowest Ks");

const var knbHiKs = Content.addKnob("knbHiKs", 160, 45);
knbHiKs.setRange(0, 127, 1);
knbHiKs.set("text", "Highest Ks");function onNoteOn()
{
    if (!btnActive.getValue())
        Message.ignoreEvent(true);

    if (Message.getNoteNumber() == knbKs.getValue())
    {
        if (!btnToggle.getValue() || Message.getVelocity() > 64)
            btnActive.setValue(1);
        else
            btnActive.setValue(0);
    }
    else if (Message.getNoteNumber() >= knbLoKs.getValue() && Message.getNoteNumber() <= knbHiKs.getValue())
        btnActive.setValue(0);
}
 function onNoteOff()
{

}
 function onController()
{
    if (Message.getControllerNumber() == UACC || Message.isProgramChange())
    {
        local v;

        Message.getControllerNumber() == UACC ? v = Message.getControllerValue() : v = Message.getProgramChangeNumber();

        if (v == knbProgram.getValue())
            btnActive.setValue(1);
        else
            btnActive.setValue(0);
    }
}
 function onTimer()
{

}
 function onControl(number, value)
{

}
