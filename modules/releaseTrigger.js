/*
    Copyright 2018 David Healey

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

//Init
Content.setWidth(650);
Content.setHeight(175);

Content.setName("Release Trigger With Legato");

reg delay = 0;
reg attenuation = 0;
reg legatoChord = false;
reg lastTime;

const var CHORD_THRESHOLD = 25; //For testing if chords were played in legato mode
const var noteIds = Engine.createMidiList();
const var velocityValues = Engine.createMidiList();
const var lengthValues = Engine.createMidiList();

const var btnMute = Content.addButton("btnMute", 0, 10);
btnMute.set("text", "Mute");

const var btnLegato = Content.addButton("btnLegato", 150, 10);
btnLegato.set("text", "Legato");
btnLegato.set("tooltip", "When enabled release samples will only be triggered when no other keys are held.");

const var btnAttenuate = Content.addButton("Attenuate", 300, 10);

const var knbTime = Content.addKnob("Time", 450, 0);
knbTime.setRange(0, 60, 0.1);

const var tblTime = Content.addTable("tblTime", 140, 0);
tblTime.setPosition(0, 60, 575, 100);
tblTime.set("saveInPreset", true);function onNoteOn()
{
	if (!btnMute.getValue())
	{
		Message.ignoreEvent(true);
		velocityValues.setValue(Message.getNoteNumber(), Message.getVelocity());
		lengthValues.setValue(Message.getNoteNumber(), Engine.getUptime());

		//If a legato chord was played, set the flag
		legatoChord = false;
		if (btnLegato.getValue() && ((Engine.getUptime() - lastTime) * 1000 < CHORD_THRESHOLD))
	    {
	        legatoChord = true;
	    }

	    lastTime = Engine.getUptime();
	}
}

function onNoteOff()
{
	//If not muted and a velocity was recorded in the note on callback - this prevents release triggering for the wrong articulation
	if (!btnMute.getValue() && velocityValues.getValue(Message.getNoteNumber()) > 0)
	{
		Message.ignoreEvent(true);

		//Only play release triggers if legato is disabled or legato is enabled and no keys are held
		if (btnLegato.getValue() == 0 || legatoChord == true || (btnLegato.getValue() && Synth.getNumPressedKeys() == 0))
		{
		    noteIds.setValue(Message.getNoteNumber(), Synth.playNote(Message.getNoteNumber(), velocityValues.getValue(Message.getNoteNumber())));
				Synth.addPitchFade(noteIds.getValue(Message.getNoteNumber()), 0, Message.getCoarseDetune(), Message.getFineDetune());

		    if (btnAttenuate.getValue()) //Attenuation is enabled
		    {
			    //Use delay between this note and last note to calculate the table value based on the user set time (knbTime)
			    delay = Math.min(((Engine.getUptime() - lengthValues.getValue(Message.getNoteNumber())) / knbTime.getValue()) * 127, 127);

			    //Use the normalized table value to determine the amount of attenuation
			    attenuation = tblTime.getTableValue(delay)*50;

			    //Attenuate the note
			    Synth.addVolumeFade(noteIds.getValue(Message.getNoteNumber()), 0, -attenuation);
		    }
		}
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
	switch (number)
	{
		case btnMute:
			velocityValues.clear();
			lengthValues.clear();
		break;

		case btnAttenuate:
			knbTime.set("visible", value);
			tblTime.set("visible", value);
		break;
	}
}
 
