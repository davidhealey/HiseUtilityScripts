//License - Public Domain
//David Healey 2019

Content.setWidth(730);
Content.setHeight(50);

const var knbFine = Content.addKnob("Fine", 0, 0);
knbFine.set("text", "Fine");
knbFine.set("suffix", "ct");
knbFine.setRange(-100, 100, 1);
knbFine.set("middlePosition", 0);

const var knbCoarse = Content.addKnob("Coarse", 150, 0);
knbCoarse.set("text", "Coarse");
knbCoarse.set("suffix", "st");
knbCoarse.setRange(-12, 12, 1);
knbCoarse.set("middlePosition", 0);
function onNoteOn()
{
	Message.setFineDetune(knbFine.getValue());
	Message.setCoarseDetune(knbCoarse.getValue());
}
function onNoteOff()
{
    Message.setFineDetune(knbFine.getValue());
	Message.setCoarseDetune(knbCoarse.getValue());
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
