//License - Public Domain
//David Healey 2019, 2022

Content.setWidth(730);
Content.setHeight(50);

// knbFine
const var knbFine = Content.addKnob("Fine", 0, 0);
knbFine.set("text", "Fine");
knbFine.set("suffix", "ct");
knbFine.setRange(-100, 100, 1);
knbFine.set("middlePosition", 0);
knbFine.setControlCallback(onknbFineControl);

inline function onknbFineControl(component, value)
{
	updateTuning();
}

// knbCoarse
const var knbCoarse = Content.addKnob("Coarse", 150, 0);
knbCoarse.set("text", "Coarse");
knbCoarse.set("suffix", "st");
knbCoarse.setRange(-12, 12, 1);
knbCoarse.set("middlePosition", 0);
knbCoarse.setControlCallback(onknbCoarseControl);

inline function onknbCoarseControl(component, value)
{
	updateTuning();
}

// Functions
inline function updateTuning()
{
	local fine = knbFine.getValue();
	local coarse = knbCoarse.getValue();	
	local v = coarse + fine / 100;

	Engine.setGlobalPitchFactor(v);
}
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
	
}
 