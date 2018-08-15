/**
 * Title: uiFactory.js
 * Author: David Healey
 * License: LGPL - https://www.gnu.org/licenses/lgpl-3.0.en.html
 *          Some of the functions in this file are in the public domain and may be used independently of this library and its license.
 *          Such functions are preceded by a comment indicating their public domain status.
*/

namespace ui
{
	inline function buttonPanel(id, paintRoutine)
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Clicks Only");
		control.set("min", 0);
		control.setPaintRoutine(paintRoutine);

		// Define a callback behaviour when you select a popup menu...
		control.setMouseCallback(function(event)
		{
			if (event.clicked)
			{
				this.setValue(parseInt((this.getValue() + 1)) % parseInt(this.get("max") + 1));
				this.changed(); // tells the script to execute the onControl callback with the new value
				this.repaint(); //Call the paint routine
			}
		});

		return control;
	};

	inline function momentaryButtonPanel(id, paintRoutine)
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Clicks Only");
		control.setPaintRoutine(paintRoutine);

		// Define a callback behaviour when you select a popup menu...
		control.setMouseCallback(function(event)
		{
           if (event.clicked)
            {
                this.setValue(1);
            }
            else if (event.mouseUp)
            {
                this.setValue(0);
            }

            this.changed();
            this.repaint();
		});

		return control;
	};

	inline function comboBoxPanel(id, paintRoutine, fontSize, items) //Custom combo box
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Context Menu");
		control.set("popupOnRightClick", false);
		control.set("popupMenuAlign", true);
		control.set("popupMenuItems", items.join("\n")); //Menu items
		control.data.fontSize = fontSize;
		control.data.items = items;

		control.setPaintRoutine(paintRoutine);

		// Define a callback behaviour when you select a popup menu...
		control.setMouseCallback(function(event)
		{
			if(event.result != 0)
			{
				this.setValue(event.result); // stores the value
				this.changed(); // tells the script to execute the onControl callback with the new value
				this.repaint();
			}
		});

		return control;
	};

	//Public Domain
	inline function getNormalizedValue(id)
	{
		local control = Content.getComponent(id);
		return (control.getValue() - parseInt(control.get("min"))) / (parseInt(control.get("max")) - parseInt(control.get("min")));
	};

	//Public Domain
	inline function getPresetNames()
    {
        local presetList = Engine.getUserPresetList(); //Get list of all user presets
        local presetNames = [];
        local l;

        for (p in presetList)
        {
            l = p.split("/");
            if (l.length == 3) presetNames.push(l[2]);
        }

        return presetNames;
    };

	inline function resetKeyColour(n)
	{
		Engine.setKeyColour(n, Colours.withAlpha(Colours.white, 0.0));
	};

	inline function sliderPanel(id, paintRoutine, middleValue, sensitivity)
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Clicks, Hover & Dragging");
		control.setPaintRoutine(paintRoutine);
		control.data.middleValue = middleValue;
		control.data.sensitivity = sensitivity;

		// Define callback behaviour
		control.setMouseCallback(function(event)
		{
			if (event.clicked)
			{
				//Save the value from the mouse click
				this.data.mouseDownValue = this.getValue();
			}
			else
			{
				if (event.doubleClick)
				{
                    this.setValue(parseInt(this.get("defaultValue")));
                    this.repaint();
                    this.changed();
				}
				else if (event.drag)
				{
					// Calculate the sensitivity value
					var distance  = (event.dragX - event.dragY) / this.data.sensitivity;

					if (event.ctrlDown) //If ctrl/cmd key is held down
					{
						distance = (event.dragX - event.dragY) / (this.data.sensitivity * 4);
					}

					var newValue = Math.range(this.data.mouseDownValue + distance, this.get("min"), this.get("max"));

					if (newValue != this.getValue())
					{
						this.get("stepSize") == 1 ? this.setValue(Math.round(newValue)) : this.setValue(newValue);
						this.repaint();
						this.changed();
					}
				}
			}
		});

		return control;
	};

    //License - Public Domain
    inline function modWheel(id, sensitivity)
    {
        local control = Content.getComponent(id);

        control.set("allowCallbacks", "Clicks, Hover & Dragging");
		control.setPaintRoutine(paintRoutine);
		control.data.sensitivity = sensitivity;
		control.setValue(0);

		control.setPaintRoutine(function(g){

            g.fillAll(this.get("bgColour"));

            var lineSize = this.get("borderSize");
            var linePos = Math.range(this.get("height")-((this.get("height")/this.get("max")) * this.getValue()), lineSize/2, this.get("height")-lineSize/2);

            //Draw value
            g.setColour(this.get("itemColour"));
            g.fillRect([0, linePos, this.get("width"), this.get("height")]);

            //Draw line
            g.setColour(this.get("itemColour2"));
            g.drawLine(0, this.get("width"), linePos, linePos, lineSize);
		});

        control.setMouseCallback(function(event)
        {
            if (event.clicked)
            {
                this.data.mouseDownValue = this.getValue(); // save the value from the mouse click
            }
            else
            {
                var newValue = this.getValue();

                if (event.drag)
                {
                    var distance  = (event.dragX - event.dragY) / this.data.sensitivity; // Calculate the sensitivity value
                    newValue = Math.range(this.data.mouseDownValue + distance, this.get("min"), this.get("max"));
                }

                if (newValue != this.getValue()) //The value has changed
                {
                    this.setValue(newValue);
                    this.repaint();
                    this.changed();
                    Synth.sendController(1, newValue);
                }
            }
        });

        return control;
    };

    //License - Public Domain
    inline function pitchWheel(id, sensitivity)
    {
        local control = Content.getComponent(id);

        control.set("allowCallbacks", "Clicks, Hover & Dragging");
		control.setPaintRoutine(paintRoutine);
		control.data.sensitivity = sensitivity;
		control.setValue(8192);

		control.setPaintRoutine(function(g){
            var lineSize = this.get("borderSize");

            //Calcluate the position to draw the line based on the panel's value (pitch wheel value)
            //use Math.range to account for the height of the line (lineSize)
            var linePos = Math.range(this.get("height")-((this.get("height")/this.get("max")) * this.getValue()), lineSize/2, this.get("height")-lineSize/2);

            g.fillAll(this.get("bgColour"));

            //Draw value display
            g.setColour(this.get("itemColour"));

            if (this.getValue() > 8192) //Bend up
            {
                g.fillRect([0, linePos, this.get("width"), this.get("height")/2 - linePos]);
            }
            else if (this.getValue() < 8192) //Bend down
            {
                g.fillRect([0, this.get("height")/2, this.get("width"), linePos-this.get("height")/2]);
            }

            //Draw line
            g.setColour(this.get("itemColour2"));
            g.drawLine(0, this.get("width"), linePos, linePos, lineSize);
		});

        control.setMouseCallback(function(event)
        {
            if (event.clicked)
            {
                this.data.mouseDownValue = this.getValue(); // save the value from the mouse click
            }
            else
            {
                var newValue = this.getValue();

                if (event.drag)
                {
                    var distance  = ((event.dragX - event.dragY) * 150) / this.data.sensitivity; // Calculate the sensitivity value
                    newValue = Math.range(this.data.mouseDownValue + distance, this.get("min"), this.get("max"));
                }

                if (event.mouseUp)
                {
                    newValue = 8192;
                }

                if (newValue != this.getValue()) //The value has changed
                {
                    this.setValue(newValue);
                    this.repaint();
                    this.changed();
                    Synth.sendController(129, newValue);
                }
            }
        });

        return control;
    };

	inline function showControlFromArray(a, idx)
	{
		for (i = 0; i < a.length; i++)
		{
			a[i].set("visible", false);
		}
		idx < a.length ? a[idx].set("visible", true) : Console.print("showControlFromArray: index out of range");
	};

	inline function setupControl(id, json)
    {
        local control = Content.getComponent(id);
        Content.setPropertiesFromJSON(id, json);
        return control;
    };

    inline function setComboPanelItems(id, items)
    {
        local control = Content.getComponent(id);
        control.data.items = items;
        control.set("popupMenuItems", items.join("\n"));
    };
}
