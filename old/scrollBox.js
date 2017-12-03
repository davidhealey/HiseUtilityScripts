namespace scrollBox
{	
	function addContainer(id, width, height, x, y, numColumns, hPadding, numRows, vPadding)
	{
		var obj = {};
		reg containerWidth;
		reg containerHeight;

		obj.viewport = Content.addPanel(id + "ScrollBoxViewport", x, y);
		obj.viewport.set("width", width);
		obj.viewport.set("height", height);
		obj.viewport.set("borderSize", 0);
		obj.viewport.set("borderRadius", 0);
		obj.viewport.set("itemColour", 0);
		obj.viewport.set("itemColour2", 0);

		numColumns < 0 ? containerWidth = width : containerWidth = numColumns * hPadding;
		numRows < 0 ? containerHeight = height : containerHeight = numRows * vPadding;

		obj.container = Content.addPanel(id + "ScrollBoxContainer", 0, 0);
		obj.container.set("width", containerWidth);
		obj.container.set("height", containerHeight);
		obj.container.set("parentComponent", id + "ScrollBoxViewport");
		obj.container.set("borderSize", 0);
		obj.container.set("borderRadius", 0);
		obj.container.set("itemColour", 0);
		obj.container.set("itemColour2", 0);
		
		obj.id = id;
		obj.numRows = numRows;
		obj.rowsToShow = Math.ceil(height / vPadding); //Calculate the number of rows to display
		obj.vOffset = 0;
		obj.hOffset = 0;

		return obj;
	}

	/**
	 * Colours the viewport so that it can be seen for debugging purposes
	 * @param  {scrollBox}
	 */
	inline function showViewport(obj)
	{
		obj.viewport.set("itemColour", 4294901760);
		obj.viewport.set("itemColour2", 4294901760);
	}

	/**
	 * Colours the container so that it can be seen for debugging purposes
	 * @param  {scrollBox}
	 */
	inline function showContainer(obj)
	{
		obj.container.set("itemColour", 4278226482);
		obj.container.set("itemColour2", 4278226482);
	}

	inline function addVerticalScrollbar(obj, x, y, width, height)
	{
		obj.vScroll = Content.addKnob(obj.id+"vScroll", x, y);
		obj.vScroll.set("width", width);
		obj.vScroll.set("height", height);
		obj.vScroll.set("style", "Vertical");
	}

	inline function addHorizontalScrollbar(obj, x, y, width, height)
	{
		obj.hScroll = Content.addKnob(obj.id+"hScroll", x, y);
		obj.hScroll.set("width", width);
		obj.hScroll.set("height", height);
		obj.hScroll.set("style", "Horizontal");
	}

	//Vertical scroling - setVOffset() should be called before this function
	inline function vScroll(obj, scrollAmount)
	{
		obj.container.set("y", obj.vOffset * -scrollAmount);
	}

	//GETTERS AND SETTERS
	inline function getId(obj) {return obj.id;}
	inline function getNumRows(obj) {return obj.numRows;}
	inline function getVerticalScrollbar(obj) {return obj.vScroll;}
	inline function getHorizontalScrollbar(obj) {return obj.hScroll;}
	inline function getViewport(obj) {return obj.viewport;}
	inline function getContainer(obj) {return obj.container;}
	inline function getContainerName(obj) {return obj.id + "ScrollBoxContainer";}
	inline function getVOffset(obj) {return obj.vOffset;}

	inline function setVOffset(obj, value)
	{
		obj.vOffset = value;

		//Offset can't be greater than the number of rows to show or less than 0
		if (obj.vOffset > obj.numRows - obj.rowsToShow)
		{
			obj.vOffset = 0; //Loop back to 0
		}
		else if (obj.vOffset < 0)
		{
			obj.vOffset = obj.numRows - obj.rowsToShow; //Loop to number of rows
		}
	}
}