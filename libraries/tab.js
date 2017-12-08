/**
 * Title: tab.js
 * Author: David Healey
 * Date: 29/07/2017
 * Modified: 29/07/2017
 * License: LGPL - https://www.gnu.org/licenses/lgpl-3.0.en.html
*/

namespace tab
{
	/**
	 * Defines a panel that can be used as the parent component of other controls when creating a tabbed interface.
	 * @param {string} id        A name for this tab panel
	 * @param {number} x         The X position for the panel
	 * @param {number} y         The Y position for the panel
	 * @param {number} width     The width of the panel
	 * @param {number} height    The height of the panel
	 * @return {obj} New tab object
	 */
	inline function addTab(id, x, y, width, height)
	{
		var obj = {};

		obj._id = id;
		obj._isVisible = true;
		obj._width = width;
		obj._height = height;
		obj._panel = Content.addPanel("pnlTab"+id, x, y);
		obj._panel.set("width", width);
		obj._panel.set("height", height);
		obj._panel.set("itemColour", 0x00000000);
		obj._panel.set("itemColour2", 0x00000000);
		obj._panel.set("borderSize", 0);
		obj._controls = {};

		return obj;
	}

	/**
	 * Adds a background wallpaper image to the tab object's panel
	 * @param {tab} obj The tab object to assign the image to
	 * @param {string} imageName The name of an image (with extension) to be used as the panel wallpaper, must be located in project images folder
	 */
	inline function addImage(obj, imageName)
	{
		//Add image to panel
		if (typeof imageName == "string" && imageName != "")
		{
			obj._imageName = imageName;

			obj._image = Content.addImage("imgTabWallpaper"+obj._id, 0, 0);
			obj._image.set("width", obj._width);
			obj._image.set("height", obj._height);
			obj._image.set("fileName", "{PROJECT_FOLDER}" + imageName); //Use project folder
			obj._image.set("parentComponent", "pnlTab"+obj._id);
		}
	}

	/**
	 * Hides all tab panels except the one that is passed in obj
	 * @param  {tab} obj  The tab to display
	 * @param  {array} tabs Array containing all tab objects
	 */
	inline function solo(obj, tabs)
	{
		local t;

		for (t in tabs)
		{
			t._panel.set("visible", false);
			t._isVisible = false;
		}

		obj._panel.set("visible", true);
		obj._isVisible = true;
	}

	/**
	 * Shows the given tab
	 * @param {tab} obj The tab object to show
	 */
	inline function show(obj)
	{
		obj._panel.set("visible", true);
		obj._isVisible = true;
	}

	/**
	 * Hides the given tab
	 * @param {tab} obj The tab object to hide
	 */
	inline function hide(obj)
	{
		obj._panel.set("visible", false);
		obj._isVisible = false;
	};

	/**
	 * Makes the passed control a child of the tab object's panel and adds it to the tab object's controls object
	 * @param {tab} obj The tab object to hide
	*/
	inline function addControl(obj, control)
	{
		control.set("parentComponent", "pnlTab"+obj._id); //Set control's parent to tab's panel
		obj._controls.push(control); //Add control to tab's controls object
	}

	//GETTERS AND SETTERS
	/**
	* Set the background colour of the tab's panel to a solid colour
	* @param tab obj The tab object to show
	* @param c hex Colour code
	*/
	inline function setColour(obj, c)
	{
		obj._panel.set("itemColour", c);
		obj._panel.set("itemColour2", c);
	};

	inline function getId(obj) {return obj._id;}
	inline function getWidth(obj) {return obj._width;}
	inline function getHeight(obj) {return obj._height;}
	inline function getPanel(obj) {return obj._panel;}
	inline function getPanelId(obj) {return "pnlTab"+obj._id;}
	inline function getControl(obj, id) {return obj.controls[id];}
	inline function getIsVisible(obj) {return obj._isVisible;}
}
