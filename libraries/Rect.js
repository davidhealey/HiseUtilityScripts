/*
    License: Public Domain
    Author: Christoph Hart, David Healey
*/

namespace Rect
{
	inline function verticalCentre(h1, h2)
	{
		return h1 / 2 - h2 / 2;
	}

	inline function reduced(area, amount)
	{
		return [area[0] + amount, area[1] + amount, area[2] - 2 * amount, area[3] - 2 * amount];
	}
	
	inline function withSizeKeepingCentre(area, width, height)
	{
		return [area[0] + (area[2] - width) / 2, area[1] + (area[3] - height) / 2, width, height];
	}
	
	inline function removeFromLeft(area, amount)
	{
		area[0] += amount;
		area[2] -= amount;
		return [area[0] - amount, area[1], amount, area[3]];
	}
	
	inline function removeFromRight(area, amount)
	{
		area[2] -= amount;
		return [area[0] + area[2], area[1], amount, area[3]];
	}
	
	inline function removeFromTop(area, amount)
	{
		area[1] += amount;
		area[3] -= amount;
		return [area[0], area[1] - amount, area[2], amount];
	}
	
	inline function removeFromBottom(area, amount)
	{
		area[3] -= amount;
		return [area[0], area[1] + area[3], area[2], amount];
	}
		
	inline function translated(area, xDelta, yDelta)
	{
		return [area[0] + xDelta, area[1] + yDelta, area[2], area[3]];
	}
}