namespace Notification
{
	// pnlNotification
	const pnlNotification = Content.getComponent("pnlNotification");
	pnlNotification.set("x", 901);
	
	pnlNotification.setPaintRoutine(function(g)
	{
		var a = this.getLocalBounds(0);

		g.drawDropShadow([a[0] + 5, a[1], a[2], a[3] - 10], Colours.withAlpha(Colours.black, 1.0 - (this.data.counter - 20) / 100), 10);

		g.setColour(Colours.withAlpha(this.get("bgColour"), 1.0 - (this.data.counter - 20) / 100));
		g.fillRect([a[0] + 5, a[1], a[2], a[3] - 10]);

		g.setFont("medium", 18);
		g.setColour(Colours.withAlpha(this.get("textColour"), 1.0 - (this.data.counter - 20) / 100));
		g.drawMultiLineText(this.get("text"), [25, 30], a[2] - 60, "left", 2.0);
	});

	pnlNotification.setTimerCallback(function()
	{		
		if (this.get("x") <= 601)
			this.data.counter++;
		else
			this.set("x", this.get("x") - 20);

		if (this.data.counter >= 120)
		{
			this.showControl(false);
			this.stopTimer();
		}
		
		this.repaint();
	});

	pnlNotification.setMouseCallback(function(event)
	{
		if (event.clicked)
			pnlNotification.data.counter = 120;
	});

	// Functions
	inline function show(text)
	{
		pnlNotification.set("text", text);
		pnlNotification.showControl(true);

		pnlNotification.data.counter = 0;
		pnlNotification.set("x", 901);
		pnlNotification.startTimer(50);
	}
}