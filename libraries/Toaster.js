/*
	MIT License

	Copyright (c) 2022 David Healey
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this file (Toaster.js), to deal in the Software without restriction,
	including without limitation the rights	to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell	copies of the Software, and to permit
	persons to whom the Software is	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
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