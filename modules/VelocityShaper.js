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
    along with this file. If not, see <http://www.gnu.org/licenses/>.
*/

Content.setWidth(600);
Content.setHeight(100);

const var dynamicsCC = Synth.getModulator("dynamicsCC");

const var btnDynamics = Content.addButton("btnDynamics", 0, 10);
btnDynamics.set("text", "Vel = Dynamics");

const tblVel = Content.addTable("tblVel", 150, 0);
tblVel.set("height", 95);
tblVel.set("width", 200);
tblVel.connectToOtherTable("Velocity Modulator", 0);function onNoteOn()
{
	Message.setVelocity(Math.max(1, 127 * tblVel.getTableValue(Message.getVelocity()))); //Scale velocity using table
	
	//Send velocity to dynamics CC if button enabled
	if (btnDynamics.getValue())
    {
        dynamicsCC.setAttribute(dynamicsCC.DefaultValue, Message.getVelocity());
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
 