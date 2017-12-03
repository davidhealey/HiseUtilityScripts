/**
 * Title: dynamicXFadeTables.js
 * Author: David Healey
 * Date: 07/09/2017
 * Modified: 07/09/2017
 * License: Public Domain
*/

Content.setHeight(50);

const var tableEnvelopes = Synth.getIdList("Midi Controller");
const var modulators = [];

for (env in tableEnvelopes)
{
	modulators.push(Synth.getTableProcessor(env));
}

//---GUI
const var cmbType = Content.addComboBox("Type", 0, 0);
cmbType.set("items", ["Equal Power", "S-Shaped"].join("\n"));

const var cmbCount = Content.addComboBox("Count", 150, 0);
cmbCount.set("items", ["2", "3", "4", "5", "6", "7"].join("\n"));

const var btnApply = Content.addButton("Apply", 300, 0);

//FUNCTIONS
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

function onNoteOn()
{

}
function onNoteOff()
{

}
function onController()
{

}
function onTimer()
{

}
function onControl(number, value)
{
	switch (number)
	{
		case btnApply:

			btnApply.setValue(0);

			for (i = 0; i < modulators.length; i++)
			{
				if (cmbType.getValue() == 1) //Equal power
				{
					switch (cmbCount.getValue())
					{
						case 1: equalPower2(modulators[i], i); break;
						case 2: equalPower3(modulators[i], i); break;
						case 3: equalPower4(modulators[i], i); break;
						case 4: equalPower5(modulators[i], i); break;
						case 5: equalPower6(modulators[i], i); break;
						case 6: equalPower7(modulators[i], i); break;
					}
				}
				else
				{
					switch (cmbCount.getValue())
					{
						case 1: sShape2(modulators[i], i); break;
						case 2: sShape3(modulators[i], i); break;
						case 3: sShape4(modulators[i], i); break;
						case 4: sShape5(modulators[i], i); break;
						case 5: sShape6(modulators[i], i); break;
						case 6: sShape7(modulators[i], i); break;
					}
				}
			}

		break;
	}
}
