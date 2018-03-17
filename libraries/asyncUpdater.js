/**
* Title: asyncUpdater.js
* Original Author: Christoph Hart
* Modifications by David Healey
* License: Public Domain
*/

/** The AsyncUpdater can be used to trigger a deferred UI update
*	from a MIDI callback. Just give it a (inline) function using setUpdateFunction()
*	and call triggerUpdate() to asynchronously launch the update function.
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
    
	inline function deferFunction(f, p)
	{
		func = f;
		param = p;
		updater.startTimer(25);
	}
};
