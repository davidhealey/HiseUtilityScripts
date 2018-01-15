/**
 * Author: David Healey
 * Date: 15/01/2018
 * License: Public Domain
*/

Content.setWidth(650);
Content.setHeight(50);

reg mod; //The selected modulator

const var modIds = Synth.getIdList("Global Time Variant Modulator");

const var cmbMods = Content.getComponent("Modulators");
cmbMods.set("items", modIds.join("\n")); //Populate with global time variant modulator names

const var knbMin = Content.getComponent("Min");
const var knbMax = Content.getComponent("Max");
const var cmbCC = Content.getComponent("Controller");

function onNoteOn()
{

}
function onNoteOff()
{

}
function onController()
{
    local v;

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
