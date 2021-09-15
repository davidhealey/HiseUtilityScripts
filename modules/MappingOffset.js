// knbVelocity
const knbVelocity = Content.addKnob("Velocity", 0, 0);
knbVelocity.set("text", "Velocity");
knbVelocity.setRange(0, 127, 1);

// knbNoteOffset
const knbNoteOffset = Content.addKnob("NoteOffset", 150, 0);
knbNoteOffset.set("text", "Note Offset");
knbNoteOffset.setRange(-127, 127, 1);function onNoteOn()
{
    local n = Message.getNoteNumber();
    
	if (knbVelocity.getValue() > 0)
	    Message.setVelocity(knbVelocity.getValue());
	    
	if (knbNoteOffset.getValue() != 0)
	    Message.setNoteNumber(n + knbNoteOffset.getValue());
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
 