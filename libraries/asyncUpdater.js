/**
* Title: asyncUpdater.js
* Original Author: Christoph Hart
* Modifications by David Healey
* License: Public Domain
*/

/*
This library is only of benefit in a script that does not have deferred callbacks enabled.

The purpose of this library is to trigger a function asynchronously from a MIDI callback.
You'll usually want to use this to update the GUI from with onNoteOn, onNoteOff or onController.;
Updating the GUI from one of these callbacks can cause audio dropouts because these callbacks run on the
real-time thread, this library solves that by providing a method to defer a function using a timer object.;

This library only supports the use of one deferred function at a time, to defer multiple functions you will need to
either combine those functions into one or modify this library to allow for multiple functions.
*/

namespace asyncUpdater
{
	const var updater = Engine.createTimerObject();
	reg func;
	reg param;
	
	updater.callback = function()
    {
        if (func)
        {
            param == null ? func() : func(param);
        }
        this.stopTimer();
    };

    //This is the only function you need to call. Pass in the name of the function you want to defer (f)
    // and if needed a parameter (p). If no parameter is required then set p to null.
	inline function deferFunction(f, p)
	{
		func = f;
		param = p;
		updater.startTimer(25);
	}
};
