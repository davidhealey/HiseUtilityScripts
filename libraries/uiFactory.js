/**
 * Title: uiFactory.js
 * Author: David Healey
 * Date: 29/07/2017
 * Modified: 03/12/2017
 * License: LGPL
*/

namespace ui
{
	reg _counter = 0; //Counts the number of controls on the ui created by this library. The count is also used in the ID of such controls.

	// Helper function
	inline function _keyExists(obj, key)
	{
		return !(obj[key] == void); //Important: void, not undefined!
	};

	inline function button(x, y, obj)
	{
		local control = Content.addButton("uiControl" + _counter++, x, y);

		if (_keyExists(obj, "filmstripImage")) obj.filmstripImage = "{PROJECT_FOLDER}" + obj.filmstripImage; //Uses project folder

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function buttonPanel(x, y, obj)
	{
		local control = Content.addPanel("uiControl" + _counter++, x, y);

		control.set("allowCallbacks", "Clicks Only");
		control.set("saveInPreset", true);
		control.set("min", 0);
		control.set("max", 1);

		//Set control properties
		for (k in obj) //Each key in object
		{
			if (k == "paintRoutine" || k == void) continue
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

	inline function comboBox(x, y, obj)
	{
		local control = Content.addComboBox("uiControl" + _counter++, x, y);

		if (_keyExists(obj, "items")) obj.items = obj.items.join("\n"); //Make array of items into string

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function comboBoxPanel(x, y, obj) //Custom combo box
	{
		local id;
		_keyExists(obj, "id") ? id = obj.id : id = "uiControl" + _counter++;

		local control = Content.addPanel("uiControl" + _counter++, x, y);

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
			if (obj[k] == void || k == "paintRoutine") continue;
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

	inline function floatingTile(x, y, obj, data)
	{
		local control = Content.addFloatingTile("uiControl" + _counter++, x, y);

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		control.setContentData(data);
		control.set("updateAfterInit", false);

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

	inline function image(x, y, obj)
	{
		local control = Content.addImage("uiControl" + _counter++, x, y);

		if (_keyExists(obj, "fileName")) obj.fileName = "{PROJECT_FOLDER}" + obj.fileName; //Uses project folder

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function knob(x, y, obj)
	{
		local control = Content.addKnob("uiControl" + _counter++, x, y);

		if (_keyExists(obj, "filmstripImage")) obj.filmstripImage = "{PROJECT_FOLDER}" + obj.filmstripImage; //Uses project folder
		if (!_keyExists(obj, "mouseSensitivity")) obj.mouseSensitivity = 0.3;

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function label(x, y, obj)
	{
		local control = Content.addLabel("uiControl" + _counter++, x, y);
		if (!_keyExists(obj, "editable")) obj.editable = false; //Labels aren't editable by default
		if (!_keyExists(obj, "alignment")) obj.alignment = "left"; //Default alignment

		control.set("saveInPreset", false);

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function modulatorMeter(x, y, obj)
	{
		local control = Content.addModulatorMeter("uiControl" + _counter++, x, y);

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function panel(x, y, obj)
	{
		local id;
		_keyExists(obj, "id") ? id = obj.id : id = "uiControl" + _counter++;
		obj.id = void;

		local control = Content.addPanel(id, x, y);

		if (_keyExists(obj, "popupMenuItems"))
		{
			obj.popupMenuItems = obj.popupMenuItems.join("\n");
			control.data.popupMenuItems = obj.popupMenuItems;
		}

		if (_keyExists(obj, "paintRoutine"))
		{
			control.setPaintRoutine(obj.paintRoutine);
			obj.paintRoutine = void;
		}

		control.set("itemColour", 0x00000000);
		control.set("itemColour2", 0x00000000);
		control.set("borderSize", 0);
		control.set("borderRadius", 0);

		//Set control properties
		for (k in obj) //Each key in object
		{
			if (obj[k] == void) continue;
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function plotter(x, y, obj)
	{
		local control = Content.addPlotter("uiControl" + _counter++, x, y);

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function resetKeyColour(n)
	{
		Engine.setKeyColour(n, Colours.withAlpha(Colours.white, 0.0));
	}

	inline function sliderPack(x, y, obj)
	{
		local control = Content.addSliderPack("uiControl" + _counter++, x, y);

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};


	inline function sliderPanel(x, y, obj)
	{
		local control = Content.addPanel("uiControl" + _counter++, x, y);

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

	inline function table(x, y, obj)
	{
		local control = Content.addTable("uiControl" + _counter++, x, y);

		//Set control properties
		for (k in obj) //Each key in object
		{
			control.set(k, obj[k]);
		}

		return control;
	};

	inline function setWallpaper(width, height, fileName)
	{
		local control = Content.addImage("uiControl" + _counter++, 0, 0);

		//Set control properties
		control.set("width", width);
		control.set("height", height);
		control.set("fileName", "{PROJECT_FOLDER}" + fileName); //Uses project folder

		return control;
	};
}
