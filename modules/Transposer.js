/*
MIT License

Copyright 2021 David Healey

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const knbOctave = Content.addKnob("Octave", 0, 0);
knbOctave.setRange(-2, 2, 1);
knbOctave.set("middlePosition", 0);

const knbSemi = Content.addKnob("SemiTone", 150, 0);
knbSemi.set("text", "Semi Tone");
knbSemi.setRange(-12, 12, 1);
knbSemi.set("middlePosition", 0);function onNoteOn()
{
	if (knbOctave.getValue() || knbSemi.getValue())
    {
        local value = 12 * knbOctave.getValue() + knbSemi.getValue();
        Message.setTransposeAmount(value);
    }
}
 function onNoteOff()
{
	if (knbOctave.getValue() || knbSemi.getValue())
    {
        local value = 12 * knbOctave.getValue() + knbSemi.getValue();
        Message.setTransposeAmount(value);
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
 