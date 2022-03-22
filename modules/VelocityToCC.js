/**
 * Title: velocityToCC.js
 * Author: David Healey
 * Date: 15/03/2018
 * Modified: 15/03/2018
 * License: Public Domain
*/

Content.setWidth(650);
Content.setHeight(50);

const var btnBypass = Content.addButton("btnBypass", 0, 10);
btnBypass.set("text", "Bypass");

const var knbCC = Content.addKnob("KnbCC", 160, 0);
knbCC.set("text", "CC Number");
knbCC.setRange(1, 127, 1);function onNoteOn()
{
    if (btnBypass.getValue() == 0)
    {
        Synth.sendController(knbCC.getValue(), Message.getVelocity());   
    }
}

function onNoteOff()
{
	
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
