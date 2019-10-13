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
reg id;

const var btnMode = Content.addButton("btnMode", 10, 10);
btnMode.set("text", "Fade Out");
btnMode.set("tooltip", "When enabled notes will fade out rather than fade in. Velocity filter and legato will be disabled.");

const var knbLength = Content.addKnob("knbLength", 150, 0);
knbLength.set("text", "Length");
knbLength.set("mode", "Time");
knbLength.setRange(5, 1000, 1);

const var knbVelo = Content.addKnob("knbVelo", 300, 0);
knbVelo.set("text", "Velocity Filter");
knbVelo.setRange(0, 127, 1);

const var btnLegato = Content.addButton("btnLegato", 450, 10);
btnLegato.set("text", "Legato");


inline function onbtnModeControl(component, value)
{
	knbVelo.set("enabled", 1-value);
	btnLegato.set("enabled", 1-value);
};

Content.getComponent("btnMode").setControlCallback(onbtnModeControl);
function onNoteOn()
{
    if (btnMode.getValue()) //Fade out
    {
        id = Message.makeArtificial();
        Synth.addVolumeFade(id, knbLength.getValue(), -100);
    }
    else //Fade in
    {
        if ((!btnLegato.getValue() || g_keys <= 1) && g_realVelocity >= knbVelo.getValue())
        {
            Synth.addVolumeFade(Message.getEventId(), 0, -99);
            Synth.addVolumeFade(Message.getEventId(), knbLength.getValue(), 0);
        }
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
