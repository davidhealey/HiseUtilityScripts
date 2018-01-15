/**
 * Author: David Healey
 * Date: 15/01/2018
 * License: Public Domain
*/

Content.setWidth(650);
Content.setHeight(50);

reg mod; //The selected modulator
reg v; //The scaled modulator value - used in onController

const var modIds = Synth.getIdList("Global Time Variant Modulator");

const var cmbMods = Content.addComboBox("Modulators", 10, 10);
cmbMods.set("items", modIds.join("\n")); //Populate with global time variant modulator names

const var knbMin = Content.addKnob("Min", 160, 0);
const var knbMax = Content.addKnob("Max", 310, 0);
const var cmbCC = Content.addComboBox("Controller", 460, 10);

function onNoteOn()
{

}
function onNoteOff()
{

}
function onController()
{
	if (Message.getControllerNumber() == cmbCC.getValue())
    {
        v = ((Message.getControllerValue() * (knbMax.getValue() - knbMin.getValue())) / 127) + knbMin.getValue();
        mod.setIntensity(v); //Apply scaled value to modulator
    }
}function onTimer()
{

}
function onControl(number, value)
{
    if (number == cmbMods && value-1 > -1)
    {
        mod = Synth.getModulator(modIds[value-1]); //Get selected modulator
    }
}
 
