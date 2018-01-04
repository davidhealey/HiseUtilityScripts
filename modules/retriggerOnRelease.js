/**
 * Title: retriggerOnRelease
 * Author: David Healey
 * Date: 28/03/2017
 * License: Public Domain
*/

//INIT
Content.setWidth(650);
Content.setHeight(50);

const var velocities = Engine.createMidiList();

const var btnEnable = Content.addButton("Enable", 0, 10);
const var cmbCC = Content.addComboBox("CC Trigger", 150, 10);

for (i = 0; i < 128; i++)
{
	cmbCC.addItem(i);
}

//FUNCTIONS

//CALLBACKS
function onNoteOn()
{
	velocities.setValue(Message.getNoteNumber(), Message.getVelocity());
}

function onNoteOff()
{
	if (btnEnable.getValue())
	{
		Synth.playNote(Message.getNoteNumber(), velocities.getValue(Message.getNoteNumber()));
	}
}

function onController()
{
	if (Message.getControllerNumber() == cmbCC.getValue()-1)
	{
		Message.getControllerValue() > 64 ? btnEnable.setValue(1) : btnEnable.setValue(0);
	}
}

function onTimer()
{
}

function onControl(number, value)
{
}
