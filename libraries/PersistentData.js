/**
* Author: Christoph Hart & David Healey
* License: Public Domain
*/

namespace PersistentData
{
    //The data object. This will be overwritten by the onControl callback of the restorer
    reg persistentData = {};
 
    /*This panel will restore the storage object in its control callback. 
    If the value is not an object, it won't do anything but use the given
    storage variable as value*/
    const pnlDataRestorer = Content.addPanel("pnlDataRestorer", 0, 0);
    pnlDataRestorer.set("saveInPreset", true);
    pnlDataRestorer.set("visible", false);
    pnlDataRestorer.setControlCallback(onpnlDataRestorerControl);    
    
    inline function onpnlDataRestorerControl(component, value)
    {
        // Check if the panel's value is an object
        // If not, set the value to the storage object
        
        if (typeof(value) == "object")
            persistentData = value; //Copy the object from the panel to the storage object
        else    
            component.setValue(persistentData); //Initialize the restorer
    };
    
    inline function set(id, value)
    {
        persistentData[id] = value;
        pnlDataRestorer.setValue(persistentData);
    }
    
    inline function get(id)
    {
        return persistentData[id];
    }
}