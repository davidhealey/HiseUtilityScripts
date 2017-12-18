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

	inline function buttonPanel(id, x, y, obj)
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Clicks Only");
		control.set("saveInPreset", true);
		control.set("min", 0);
		control.set("max", 1);

		//Set control properties
		for (k in obj) //Each key in object
		{
			if (k == "paintRoutine" || obj[k] == void) continue
			control.set(k, obj[k]);
		}

		if (_keyExists(obj, "paintRoutine"))
		{
			control.setPaintRoutine(obj.paintRoutine);
		}
		else //Default paint routine - toggle switch
		{
			control.setPaintRoutine(function(g){

				g.setColour(0xFFAAA591); //Beige
				g.fillRoundedRectangle([0, 0, this.get("width"), this.get("height")], 2);

				g.setColour(0xff333333); //Dark grey

				if (this.getValue() == 0)
				{
					g.fillRoundedRectangle([0, 0, this.get("width")/2, this.get("height")], 2);
				}
				else
				{
					g.fillRoundedRectangle([this.get("width")/2, 0, this.get("width")/2, this.get("height")], 2);
				}
			});
		}

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

	inline function comboBoxPanel(id, x, y, obj) //Custom combo box
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Context Menu");
		control.set("popupOnRightClick", false);
		control.set("popupMenuAlign", true);
		control.set("saveInPreset", true);
		control.set("popupMenuItems", obj.items.join("\n")); //Menu items
		control.data.items = obj.items;
		obj.items = void;
		if (_keyExists(obj, "text")) {control.data.text = obj.text; obj.text = void;}

		//Set control properties
		for (k in obj) //Each key in object
		{
			if (k == "paintRoutine" || obj[k] == void) continue
			control.set(k, obj[k]);
		}

		if (_keyExists(obj, "paintRoutine"))
		{
			control.setPaintRoutine(obj.paintRoutine);
		}
		else //Default paint routine
		{
			control.setPaintRoutine(function(g){

				g.setColour(0xFFAAA591); //Beige
				g.fillRoundedRectangle([0, 0, this.get("width"), this.get("height")], 2);

				g.setColour(0xff333333); //Dark grey
				g.fillTriangle([this.get("width")-this.get("width")/3, this.get("height")/2, this.get("width")/4, this.get("height")/4], Math.toRadians(900));

				g.drawAlignedText(this.data.items[this.getValue()-1], [5, 0, this.get("width"), this.get("height")], "left");
			});
		}

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

	inline function getNormalizedValue(control)
	{
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

	inline function sliderPanel(id, x, y, obj)
	{
		local control = Content.getComponent(id);

		control.set("allowCallbacks", "Clicks, Hover & Dragging");
		control.set("saveInPreset", true);
		control.set("enableMidiLearn", true);
		control.set("borderSize", 0);
		if (_keyExists(obj, "defaultValue")) control.data.defaultValue = obj.defaultValue;
		if (_keyExists(obj, "sensitivity")) control.data.sensitivity = obj.sensitivity;

		//Set control properties
		for (k in obj) //Each key in object
		{
			if (k == "defaultValue" || k == "paintRoutine" || k == "sensitivity") continue;
			control.set(k, obj[k]);
		}

		//Paint routine
		if (_keyExists(obj, "paintRoutine"))
		{
			control.setPaintRoutine(obj.paintRoutine);
		}
		else //Default paint routine
		{
			control.setPaintRoutine(function(g){

				//Background
				g.setColour(0xFFAAA591); //Beige
				g.fillRoundedRectangle([0, 0, this.get("width"), this.get("height")], 2);

				//Get width of slider based on its current normalized value
				var width = this.get("width") * ui.getNormalizedValue(this);

				g.setColour(0xFF333333);  //Dark Grey
				g.fillRect([0, 0, width, this.get("height")]);

			});
		}

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
					var distance  = (event.dragX - event.dragY) / this.data.sensitivity;

					if (event.ctrlDown) //If ctrl/cmd key is held down
					{
						distance = (event.dragX - event.dragY) / (this.data.sensitivity * 4);
					}

					var newValue = Math.range(this.data.mouseDownValue + distance, this.get("min"), this.get("max"));

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
}
