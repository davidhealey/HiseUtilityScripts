/*
    Original Author: Christoph Hart
    Modifications: David Healey
    License: Public Domain
*/
namespace VuMeter
{
	/** Creates a peak meter.
	*
	*	Usage: Give it a reference to a module (either synth or effect).
	*
	*	It looks best using a width and height with multiple of 4.
	*	Customize the colours using the scriptPanel colour Ids
	*/
	inline function createVuMeter(name)
	{
		local widget = Content.getComponent(name);
    
		Content.setPropertiesFromJSON(name, {"saveInPreset": false, "opaque": 1});
    	
		widget.setPaintRoutine(function(g)
		{
			g.fillAll(this.get("bgColour"));
			
			g.setColour(this.get("itemColour"));
    	
			var lsize = parseInt(this.data.lvalue * (this.getHeight()-4));
			var rsize = parseInt(this.data.rvalue * (this.getHeight()-4));
    	
			g.fillRect([2, this.getHeight() - lsize - 2, (this.getWidth()-4)/2-1, lsize]);
			g.fillRect([2 + this.getWidth() / 2 - 1, this.getHeight() - rsize - 2, (this.getWidth()-4)/2-1, rsize]);
    	
			g.setColour(this.get("itemColour2"));
    	
			for(i = 1; i < this.getHeight()-1; i = i + 3)
				g.fillRect([1, i, this.getWidth()-2, 1]);
		});
    
		widget.setTimerCallback(function()
		{
			var lvalue;
			var rvalue;
			
			if(this.data.fx)
			{
				lvalue = getNormalizedPeakValue(this.data.fx.getCurrentLevel(0));
				rvalue = getNormalizedPeakValue(this.data.fx.getCurrentLevel(1));
			}
			else
			{
				lvalue = getNormalizedPeakValue(Engine.getMasterPeakLevel(0));
				rvalue = getNormalizedPeakValue(Engine.getMasterPeakLevel(1));
			}
			    	
			this.data.lvalue = Math.max(lvalue, this.data.lvalue - 0.04);
			this.data.rvalue = Math.max(rvalue, this.data.rvalue - 0.04);
    	
			this.repaintImmediately();
		});
    
		widget.startTimer(30);

		return widget;
	};

	inline function setModule(vuMeter, module)
	{
		vuMeter.data.fx = module;
	}
	
	inline function getNormalizedPeakValue(gain)
	{
		return 0.01 * (100.0 + Engine.getDecibelsForGainFactor(gain));
	}
}