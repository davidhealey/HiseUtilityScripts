//License: Public Domain
//Author: Christoph Hart + David Healey

namespace PreloadBar
{
    var _component;

    inline function init(panelId, props)
    {
        _component = Content.getComponent(panelId);

        if (typeof props == "object")
        {
            for (p in props)
            {
                _component.set(p, props[p]);
            }
        }
        
        _component.setPaintRoutine(function(g)
        {
	        g.fillAll(this.get("bgColour"));
	        g.setColour(this.get("itemColour"));
	        g.fillRect([0, 0, this.getWidth() * this.data.progress, this.getHeight()]);
        });
        
        _component.setTimerCallback(function()
        {
            this.data.progress = Engine.getPreloadProgress();
            this.repaint();	
        });
        
        _component.setLoadingCallback(function(isPreloading)
        {
            this.data.progress = 0.0;
            this.set("visible", isPreloading);
            isPreloading ? this.startTimer(30) : this.stopTimer();
        });
    }
    
    inline function setPosition(x, y, w, h)
    {
        _component.setPosition(x, y, w, h);
    }
}