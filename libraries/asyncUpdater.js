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
	inline function deferFunction(f, p)
	{
		functions[0] = f;
		parameters[0] = p;
		timer0.startTimer(25);
	}
	
	inline function deferFunction2(f, p)
	{
		functions[1] = f;
		parameters[1] = p;
		timer1.startTimer(25);
	}
	
	/** Internal stuff. */
	const var timer0 = Engine.createTimerObject();
	const var timer1 = Engine.createTimerObject();
	const var functions = [];
	const var parameters = [];
	
	timer0.callback = function()
    {
        if (functions[0])
        {
            parameters[0] = null ? functions[0]() : functions[0](parameters[0]);
        }
        this.stopTimer();
    };
    
    timer1.callback = function()
    {
        if (functions[0])
        {
            parameters[0] = null ? functions[0]() : functions[0](parameters[0]);
        }
        this.stopTimer();
    };
};
