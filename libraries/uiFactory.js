/**
 * Title: uiFactory.js
 * Author: David Healey
 * Date: 29/07/2017
 * License: LGPL - https://www.gnu.org/licenses/lgpl-3.0.en.html
*/

namespace ui
{
	// Helper function
	inline function _keyExists(obj, key)
	{
		return !(obj[key] == void); //Important: void, not undefined!
	};

	inline function buttonPanel(id, paintRoutine)
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Clicks Only");
		control.set("min", 0);
		control.set("max", 1);
		control.setPaintRoutine(paintRoutine);

		// Define a callback behaviour when you select a popup menu...
		control.setMouseCallback(function(event)
		{
			if (event.clicked)
			{
				this.setValue(Math.round(1-this.getValue())); //Set the value
				this.changed(); // tells the script to execute the onControl callback with the new value
				this.repaintImmediately();
			}
		});

		return control;
	}

	inline function comboBoxPanel(id, paintRoutine, items) //Custom combo box
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Context Menu");
		control.set("popupOnRightClick", false);
		control.set("popupMenuAlign", true);
		control.set("popupMenuItems", items.join("\n")); //Menu items
		control.data.items = items;

		control.setPaintRoutine(paintRoutine);

		// Define a callback behaviour when you select a popup menu...
		control.setMouseCallback(function(event)
		{
			if(event.result != 0)
			{
				this.setValue(event.result); // stores the value
				this.changed(); // tells the script to execute the onControl callback with the new value
				this.repaintImmediately();
			}
		});

		return control;
	};

	inline function getNormalizedValue(id)
	{
		local control = Content.getComponent(id);

		if (typeof control.getValue() == "number" && typeof control.get("min") == "number" && typeof control.get("max") == "number")
		{
			return (control.getValue() - control.get("min")) / (control.get("max") - control.get("min"));
		}
		return false;
	}

	inline function resetKeyColour(n)
	{
		Engine.setKeyColour(n, Colours.withAlpha(Colours.white, 0.0));
	}

	inline function sliderPanel(id, paintRoutine, defaultValue, sensitivity)
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Clicks, Hover & Dragging");
		control.setPaintRoutine(paintRoutine);
		control.data.defaultValue = defaultValue;
		control.data.sensitivity = sensitivity;

		// Define callback behaviour
		control.setMouseCallback(function(event)
		{
			if (event.clicked)
			{
				// save the value from the mouse click
				this.data.mouseDownValue = this.getValue();
			}
			else
			{
				if (event.doubleClick)
				{
					if (this.data.defaultValue !== void)
					{
						this.setValue(this.data.defaultValue);
						this.repaintImmediately();
						this.changed();
					}
				}
				else if (event.drag)
				{
					// Calculate the sensitivity value
					reg distance  = (event.dragX - event.dragY) / this.data.sensitivity;

					if (event.ctrlDown) //If ctrl/cmd key is held down
					{
						distance = (event.dragX - event.dragY) / (this.data.sensitivity * 4);
					}

					reg newValue = Math.range(this.data.mouseDownValue + distance, this.get("min"), this.get("max"));

					if (newValue != this.getValue())
					{
						this.get("stepSize") == 1 ? this.setValue(Math.round(newValue)) : this.setValue(newValue);
						this.repaintImmediately();
						this.changed();
					}
				}
			}
		});

		return control;
	}

	inline function showControlFromArray(a, idx)
	{
		for (i = 0; i < a.length; i++)
		{
			a[i].set("visible", false);
		}

		a[idx].set("visible", true);
	}
}
