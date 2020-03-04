/*
    Copyright 2020 David Healey

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

Content.setWidth(750);
Content.setHeight(100);

const var whiteKeys = [0, 2, 4, 5, 7, 9, 11]; //White keys

reg eventIds = Engine.createMidiList();
reg origin;
reg target;
reg velocity;
reg rate = 50;

function gliss()
{
    var oldId = eventIds.getValue(origin);
    var newId;

    //Turn off last gliss note
    if (oldId > 0)
    {
        Synth.noteOffByEventId(oldId);
        eventIds.setValue(origin, 0);
    }

    //Inc/Dec origin based on interval direction
    target > origin ? origin++ : origin--;
    
    //Snap origin to nearest white note
    if (whiteKeys.indexOf(origin % 12) == -1)
        target > origin ? origin++ : origin--;

    //Adjust for pedalling
    var note = origin + slpPedals.getSliderValueAt(whiteKeys.indexOf(origin % 12));
    
    //Play new note
    newId = Synth.playNote(note, velocity);
    eventIds.setValue(note, newId);

    //Stop timer when gliss completed
    if (Synth.getNumPressedKeys() < 1 || origin == target)
        this.stopTimer();
}

//Two timers - only one used but potential to add polyphonic gliss
const var timers = [];
for (i = 0; i < 2; i++)
{
    timers[i] = Engine.createTimerObject();
    timers[i].setTimerCallback(gliss);
}

/*GUI*/

//btnMute
const var btnMute = Content.addButton("btnMute", 10, 10);
btnMute.set("text", "Mute");

//knbRate
const var knbRate = Content.addKnob("knbRate", 160, 0);
knbRate.set("mode", "TempoSync");

inline function onknbRateControl(component, value)
{
    rate = Engine.getMilliSecondsForTempo(value);
};

Content.getComponent("knbRate").setControlCallback(onknbRateControl);

//slpPedals
const var slpPedals = Content.addSliderPack("slpPedals", 310, 10);
slpPedals.set("height", 50);
slpPedals.set("sliderAmount", 7);
slpPedals.set("min", -1);
slpPedals.set("max", 1);
slpPedals.set("stepSize", 1);
slpPedals.referToData(g_harpPedals);

function onNoteOn()
{   
    if (!btnMute.getValue())
    {
        local n = Message.getNoteNumber();
        local velocity = Message.getVelocity();    
        if (velocity == 0) velocity = 1;

        local idx = whiteKeys.indexOf(n % 12);
    
        if (idx != -1) //White key triggered callback
        {
            if (origin && Synth.isLegatoInterval() && Math.abs(origin - n) > 2)
            {
                Message.ignoreEvent(true);
                
                target = n;
                timers[0].startTimer(rate);
            }
            else //First note of gliss
            {
                local v = slpPedals.getSliderValueAt(idx);
                eventIds.setValue(n + v, Message.makeArtificial());
                Message.setNoteNumber(n + v);
                origin = n + v;
            }
        }
        else
            Message.ignoreEvent(true);
    }
} function onNoteOff()
{
    if (!btnMute.getValue())
    {   
        local idx = whiteKeys.indexOf(Message.getNoteNumber() % 12);

        if (idx != -1)
        {
            local n = Message.getNoteNumber() + slpPedals.getSliderValueAt(idx);

            if (eventIds.getValue(n) > 0)
            {
                Synth.noteOffByEventId(eventIds.getValue(n));
                eventIds.setValue(n, 0);
            }
        }
        
        if (!Synth.getNumPressedKeys())
            origin = undefined;
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
 