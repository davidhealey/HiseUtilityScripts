//License: Public Domain
//Author: Christoph Hart + David Healey

namespace PreloadBar
{
    reg component;

    inline function init(panelId, properties)
    {
        component = Content.getComponent(panelId);

        if (typeof properties == "object")
        {
            for (p in properties)
                component.set(p, properties[p]);
        }
        
        component.setPaintRoutine(function(g)
        {
	        g.fillAll(this.get("bgColour"));
	        g.setColour(this.get("itemColour"));
	        g.fillRect([0, 0, this.getWidth() * this.data.progress, this.getHeight()]);
        });
        
        component.setTimerCallback(function()
        {
            this.data.progress = Engine.getPreloadProgress();
            this.repaint();	
        });
        
        component.setLoadingCallback(function(isPreloading)
        {
            this.data.progress = 0.0;
            this.set("visible", isPreloading);
            isPreloading ? this.startTimer(30) : this.stopTimer();
        });
    }
    
    inline function setPosition(x, y, w, h)
    {
        component.setPosition(x, y, w, h);
    }
}