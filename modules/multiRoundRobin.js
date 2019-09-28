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
function onNoteOn()
{
    local n = Message.getNoteNumber();
    local t = Message.getTransposeAmount();
    local s = lastStep.getValue(n);

    //RR Reset
    if (knbReset.getValue() > 0 && (Engine.getUptime() - lastTime.getValue(n)) >= knbReset.getValue())
    {
        lastStep.setValue(n, 0);
        s = 0;
    }

    if (knbLock.getValue() > 0)
        s = knbLock.getValue();

    switch (cmbType.getValue())
    {
        case 1: case 2: //Group
        Console.print(s+1);
            sampler.setActiveGroup(s+1);
        break;

        case 3: case 4: //Velocity
            Message.setVelocity(s);
        break;

        case 5: case 6: //Borrowed
            Message.setTransposeAmount(s-1 + t);
            Message.setCoarseDetune(-(s-1) + Message.getCoarseDetune());
        break;
    }

    //Get next step
    if (knbLock.getValue() == 0)
    {
        //Borrowed
        if ([5, 6].indexOf(cmbType.getValue()) != -1)
        {
            if (cmbType.getValue() == 5) //Cycle
                s = (s + 1) % 3;
            else //Random
                s = Math.randInt(0, 3);

            //Non-repeating
            if (s == lastStep.getValue(n))
                s = (s + 1) % 3;

            //Range limit (handles non-repeating too)
            if (n == knbLoNote.getValue() - t && s < 1)
                s = 1 + (1 == lastStep.getValue(n));
            else if (n == knbHiNote.getValue() - t && s)
                s = 1 + -(1 == lastStep.getValue(n));

        }
        else if (knbCount.getValue() > 1) //Group and velocity
        {
            if ([1, 3].indexOf(cmbType.getValue()) != -1) //Cycle
                s = (s + 1) % knbCount.getValue();
            else //Random
                s = Math.randInt(1, knbCount.getValue() + 1);

            //Non-repeating
            if (s == lastStep.getValue(n))
                s = (s + 1) % knbCount.getValue();
        }
        else
            s = 0;
    }

    lastTime.setValue(n, Engine.getUptime());
    lastStep.setValue(n, s);
}
