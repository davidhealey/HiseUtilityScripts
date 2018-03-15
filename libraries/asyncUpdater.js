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
	/** set a function that will be executed asynchronously. */
	inline function setUpdateFunction(f, p)
	{
		handleAsyncUpdate_ = f;
		param_ = p;
	}

	inline function setParameter(p)
	{
		param_ = p;
	}

	/** Call this to update your UI asynchronously. */
	inline function triggerUpdate()
	{
		internalUpdater_.startTimer(25);
		timerState_ = true;		
	}

	inline function setFunctionAndUpdate(f, p)
	{
		handleAsyncUpdate_ = f;
		param_ = p;
		internalUpdater_.startTimer(25);
		timerState_ = true;
	}
	
	inline function isTimerRunning()
	{
		return timerState_;
	}
	
	/** Internal stuff. */
	const var internalUpdater_ = Engine.createTimerObject();
	reg handleAsyncUpdate_;
	reg param_; //Parameter to be passed to function
	reg timerState_;

	internalUpdater_.callback = function()
	{
		if (handleAsyncUpdate_)
		{
			param_ == null ? handleAsyncUpdate_() : handleAsyncUpdate_(param_);
		}
		else
		{
			Console.print("No UI update function defined");
		}

		this.stopTimer();
		timerState_ = false;
	};
};
