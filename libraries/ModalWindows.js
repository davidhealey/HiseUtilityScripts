namespace ModalWindows
{
	reg modals = {};

	// pnlModalBackground
	const pnlModalBackground = Content.getComponent("pnlModalBackground");
	
	pnlModalBackground.setMouseCallback(function(event)
	{
		if (event.clicked)
			hideAllModals();
	});
	
	// Functions
	inline function hideAllModals()
	{
		for (id in modals)
			modals[id].showControl(false);
			
		pnlModalBackground.showControl(false);
	}
	
	inline function add(component)
	{
		modals[component.get("id")] = component;
	}
	
	inline function show(id)
	{
		pnlModalBackground.showControl(true);
		modals[id].showControl(true);
	}
	
	// Calls
	hideAllModals();
}