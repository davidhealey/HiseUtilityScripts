//License - Public Domain
//David Healey 2021

Content.setHeight(100);

const ids = Synth.getIdList("AHDSR Envelope");
const mod = [];

for (id in ids)
    mod.push(Synth.getModulator(id));

const ahdsr = [];

// Attack
ahdsr[0] = Content.addKnob("Attack", 0, 0);
ahdsr[0].set("mode", "Time");
ahdsr[0].set("defaultValue", 20);

// Hold
ahdsr[1] = Content.addKnob("Hold", 150, 0);
ahdsr[1].set("mode", "Time");
ahdsr[1].set("defaultValue", 10);

// Decay
ahdsr[2] = Content.addKnob("Decay", 300, 0);
ahdsr[2].set("mode", "Time");
ahdsr[2].set("defaultValue", 300);

// Sustain
ahdsr[3] = Content.addKnob("Sustain", 450, 0);
ahdsr[3].set("mode", "Decibel");
ahdsr[3].set("defaultValue", 0);

// Release
ahdsr[4] = Content.addKnob("Release", 600, 0);
ahdsr[4].set("mode", "Time");
ahdsr[4].set("defaultValue", 20);

// Attack Curve
ahdsr[5] = Content.addKnob("AttackCurve", 0, 50);
ahdsr[5].set("mode", "NormalizedPercentage");
ahdsr[5].set("defaultValue", 100);

// Decay Curve
ahdsr[6] = Content.addKnob("DecayCurve", 150, 50);
ahdsr[6].set("mode", "NormalizedPercentage");
ahdsr[6].set("defaultValue", 100);

//Attack Level
ahdsr[7] = Content.addKnob("AttackLevel", 300, 50);
ahdsr[7].set("mode", "Decibel");
ahdsr[7].set("defaultValue", 0);

for (c in ahdsr)
    c.setControlCallback(onAHDSRControl);

// Functions
inline function onAHDSRControl(component, value)
{
    local index = ahdsr.indexOf(component);
    local attributes = [mod[0].Attack, mod[0].Hold, mod[0].Decay, mod[0].Sustain, mod[0].Release, mod[0].AttackCurve, mod[0].DecayCurve, mod[0].AttackLevel];
    
    for (x in mod)
        x.setAttribute(attributes[index], value);
    
}function onNoteOn()
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
 
