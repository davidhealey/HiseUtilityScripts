/*
    Copyright 2022 David Healey

    This file is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with This file. If not, see <http://www.gnu.org/licenses/>.
*/

namespace Toaster
{
	const MODES = {Top: 0, Left: 1, Centre: 2};
	
	reg count = 0;
	
	// pnlToaster
	const pnlToaster = Content.getComponent("pnlToaster");
	pnlToaster.showControl(false);
		
	pnlToaster.setPaintRoutine(function(g)
	{
		var a = this.getLocalBounds(0);

		g.setColour(Colours.withAlpha(this.get("bgColour"), 0.6));

		switch (this.data.mode)
		{
			case MODES.Top:
				a = [0, 0, a[2], 50 * this.getValue()];
				g.fillRect(a);
				break;
				
			case MODES.Bottom:
				a = [0, a[3] - 50 * this.getValue(), a[2], 55];
				g.fillRect(a);
				break;	

			case MODES.Centre:
				a = this.getLocalBounds(a[2] / 3.0);
				g.setColour(Colours.withAlpha(this.get("bgColour"), this.getValue() / 2));
				g.fillRoundedRectangle(a, 10);
				break;
			
			default:
		}

		g.setFont("bold", 20);
		g.setColour(Colours.withAlpha(this.get("textColour"), this.getValue()));
		g.drawFittedText(this.data.message, a, "centred", 2, 1);
	});
	
	pnlToaster.setTimerCallback(function()
	{
		if (count < 35 && this.getValue() < 1.0)
			this.setValue(this.getValue() + 0.1);
		else if (count > 35)
			this.setValue(this.getValue() - 0.1);
			
		count++;

		if (this.getValue() < 0)
			this.stopTimer();

		this.showControl(this.getValue() > 0);
			
		this.repaint();
	});

	// Functions
	inline function show(mode, msg)
	{
		pnlToaster.data.mode = mode;
		pnlToaster.data.message = msg;
		count = 0;
		pnlToaster.startTimer(80);
	}
	
	inline function top(msg)
	{
		show(MODES.Top, msg);
	}
	
	inline function bottom(msg)
	{
		show(MODES.Bottom, msg);
	}
	
	inline function centre(msg)
	{
		show(MODES.Centre, msg);
	}
	
	inline function hide()
	{
		pnlToaster.showControl(false);
	}
}