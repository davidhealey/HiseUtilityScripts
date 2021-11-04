reg lastNote;

const knbTrigger = Content.addKnob("Trigger", 0, 0);
knbTrigger.set("text", "Trigger");
knbTrigger.setRange(0, 127, 1);function onNoteOn()
{
	local n = Message.getNoteNumber();
		
	if (n == knbTrigger.getValue())
	    Message.setNoteNumber(lastNote);
	
	if (n != knbTrigger.getValue())
	    lastNote = n;
}
 function onNoteOff()
{
	local n = Message.getNoteNumber();
		
	if (n == knbTrigger.getValue())
	    Message.setNoteNumber(lastNote);
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
 