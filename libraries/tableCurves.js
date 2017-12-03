/**
* Author: David Healey
* License: Public Domain
*/

namespace tableCurves
{
	inline function equalPower2(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1, 0, 0.25);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.setTablePoint(0, 1, 1, 1, 0.75);
				break;
		}
	};

	inline function equalPower3(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/2, 0, 0.25);
				tableProcessor.setTablePoint(0, 2, 1, 0, 0);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/2, 1, 0.75);
				tableProcessor.setTablePoint(0, 2, 1, 0, 0.25);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/2, 0, 1);
				tableProcessor.setTablePoint(0, 2, 1, 1, 0.75);
				break;
		}
	};

	inline function equalPower4(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/3, 0, 0.25);
				tableProcessor.setTablePoint(0, 2, 1, 0, 0);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/3, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/3+1/3, 0, 0.25);
				tableProcessor.setTablePoint(0, 3, 1, 0, 0.25);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/3, 0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/3+1/3, 1, 0.75);
				tableProcessor.setTablePoint(0, 3, 1, 0, 0.25);
				break;

			case 3:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/3+1/3, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/3+1/3, 0, 0.25);
				tableProcessor.setTablePoint(0, 3, 1, 1, 0.75);
				break;
		}
	};

	inline function equalPower5(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/4, 0, 0.25);
				tableProcessor.setTablePoint(0, 2, 0, 0, 0.25);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/4, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/4+1/4, 0, 0.25);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.25);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/4, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/4+1/4, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, (1/4)*3, 0, 0.25);
				tableProcessor.setTablePoint(0, 4, 0, 0, 0.25);
				break;

			case 3:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/4*2, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/4+1/4*2, 1, 0.75);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.25);
				break;

			case 4:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/4*3, 0, 0.75);
				tableProcessor.setTablePoint(0, 2, 0, 1, 0.75);
				break;
		}
	};

	inline function equalPower6(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5, 0, 0.25);
				tableProcessor.setTablePoint(0, 2, 0, 0, 0.75);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5*2, 0, 0.25);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.75);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5*2, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1/5*3, 0, 0.25);
				tableProcessor.setTablePoint(0, 4, 0, 0, 0.75);
				break;

			case 3:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5*2, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5*3, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1/5*4, 0, 0.25);
				tableProcessor.setTablePoint(0, 4, 0, 0, 0.75);
				break;

			case 4:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5*3, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5*4, 1, 0.75);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.25);
				break;

			case 5:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5*4, 0, 0.75);
				tableProcessor.setTablePoint(0, 2, 0, 1, 0.75);
				break;
		}
	};

	inline function equalPower7(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/4, 0, 0.25);
				tableProcessor.setTablePoint(0, 2, 0, 0, 0.25);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4), 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4)*2, 0, 0.25);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.75);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4/2), 0.0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4+1/4/2), 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, ((1.0/4)*2)+1/8, 0, 0.25);
				tableProcessor.setTablePoint(0, 4, 0, 0, 0.75);
				break;

			case 3:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4), 0.0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4*2), 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, ((1.0/4)*2)+1/8*2, 0, 0.25);
				tableProcessor.setTablePoint(0, 4, 0, 0, 0.75);
				break;

			case 4:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4+1/4/2), 0.0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4*2)+1/8, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, ((1.0/4)*2)+1/8*3, 0, 0.25);
				tableProcessor.setTablePoint(0, 4, 0, 0, 0.75);
				break;

			case 5:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4*2), 0.0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4*2)+1/8*2, 1, 0.75);
				tableProcessor.setTablePoint(0, 3, ((1.0/4)*2)+1/8*4, 0, 0.25);
				break;

			case 6:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4*2)+1/8*2, 0, 0.75);
				tableProcessor.setTablePoint(0, 2, ((1.0/4)*2)+1/8*4, 1, 0.75);
				break;
		}
	};

	inline function sShape2(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/2, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 2, 0, 0, 0.75);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/2, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 2, 0, 1, 0.75);
				break;
		}
	};

	inline function sShape3(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/4, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/2, 0, 0.75);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.75);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/4, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/2, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1.0/4*3, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 4, 0, 0, 0.75);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/2, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/4*3, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 3, 0, 1, 0.75);
				break;
		}
	};

	inline function sShape4(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/3/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/3, 0, 0.75);
				tableProcessor.setTablePoint(0, 3, 1, 0, 0);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/3/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/3, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1/3+1/3/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1/3+1/3, 0, 0.75);
				tableProcessor.setTablePoint(0, 5, 1, 0, 0.25);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/3, 0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/3+1/3/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1/3+1/3, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1/3+1/3+1/6, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 5, 1, 0, 0.75);
				break;

			case 3:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/3+1/3, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/3+1/3+1/6, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 3, 1, 1, 0.75);
				break;
		}
	};

	inline function sShape5(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/3/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/3, 0, 0.75);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.75);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/3/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/3, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1.0/3+1/3/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1.0/3+1/3, 0, 0.75);
				tableProcessor.setTablePoint(0, 5, 0, 0, 0.75);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/3/2, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/3, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1.0/3+1/3/2, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1.0/3+1/3, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 5, 1.0/3+1/3+1/6, 0, 0.75);
				tableProcessor.setTablePoint(0, 6, 0, 0, 0.75);
				break;

			case 3:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/3, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/3+1/3/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1.0/3+1/3, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1.0/3+1/3+1/6, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 5, 0, 0, 0.75);
				break;

			case 4:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/3+1/3, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/3+1/3+1/6, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 3, 0, 1, 0.75);
				break;
		}
	};

	inline function sShape6(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5, 0, 0.75);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.75);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1/5+1/5/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1/5*2, 0, 0.75);
				tableProcessor.setTablePoint(0, 5, 0, 0, 0.75);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5+1/5/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1/5*2, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1/5+1/5+1/10, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 5, 1/5*3, 0, 0.75);
				tableProcessor.setTablePoint(0, 6, 0, 0, 0.75);
				break;

			case 3:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5+1/5, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5+1/5+1/5/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1/5*3, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1/5*3+1/5/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 5, 1/5*4, 0, 0.75);
				tableProcessor.setTablePoint(0, 6, 0, 0, 0.75);
				break;

			case 4:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5+1/5+1/5, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5+1/5+1/5+1/5/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, 1/5*4, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, 1/5*4+1/5/2, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 5, 0, 0, 0.75);
				break;

			case 5:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1/5*4, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1/5*4+1/5/2, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 3, 0, 1, 0.75);
				break;
		}
	};

	inline function sShape7(tableProcessor, stage)
	{
		tableProcessor.reset(0);

		switch (stage)
		{
			case 0:
				tableProcessor.setTablePoint(0, 0, 0, 1, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/4/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, 1.0/4, 0, 0.75);
				tableProcessor.setTablePoint(0, 3, 0, 0, 0.75);
				break;

			case 1:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, 1.0/4/2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4), 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, (1/4+1/4/2), 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, (1.0/4)*2, 0, 0.75);
				tableProcessor.setTablePoint(0, 5, 0, 0, 0.75);
				break;

			case 2:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4/2), 0.0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4), 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, (1.0/4+1/4/2), 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, ((1.0/4)*2), 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 5, ((1.0/4)*2)+1/8, 0, 0.75);
				tableProcessor.setTablePoint(0, 6, 0, 0, 0.75);
				break;

			case 3:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4), 0.0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4+1/4/2), 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, (1.0/4*2), 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, ((1.0/4)*2)+1/8, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 5, ((1.0/4)*2)+1/8*2, 0, 0.75);
				tableProcessor.setTablePoint(0, 6, 0, 0, 0.75);
				break;

			case 4:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4+1/4/2), 0.0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4*2), 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, (1.0/4*2)+1/8, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, (1.0/4*2)+1/8*2, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 5, ((1.0/4)*2)+1/8*3, 0, 0.75);
				tableProcessor.setTablePoint(0, 6, 0, 0, 0.75);
				break;

			case 5:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4*2), 0.0, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4*2)+1/8, 0.5, 0.25);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 3, (1.0/4*2)+1/8*2, 1, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 4, (1.0/4*2)+1/8*3, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 5, ((1.0/4)*2)+1/8*4, 0, 0.75);
				break;

			case 6:
				tableProcessor.setTablePoint(0, 0, 0, 0, 1);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 1, (1.0/4*2)+1/8*2, 0, 0.75);
				tableProcessor.addTablePoint(0, 1, 1);
				tableProcessor.setTablePoint(0, 2, (1.0/4*2)+1/8*3, 0.5, 0.25);
				tableProcessor.setTablePoint(0, 3, ((1.0/4)*2)+1/8*4, 1, 0.75);
				break;
		}
	};
}
