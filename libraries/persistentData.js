/**
* Author: Christoph Hart & David Healey
* License: Public Domain
*/

namespace PersistentData
{
    //The data object. This will be overwritten by the onControl callback of the restorer
    reg _persistentData = {};
 
    /*This panel will restore the storage object in its control callback. 
    If the value is not an object, it won't do anything but use the given
    storage variable as value*/
    const var pnlDataRestorer = Content.addPanel("pnlDataRestorer", 0, 0);
    pnlDataRestorer.set("saveInPreset", true);
    pnlDataRestorer.set("visible", false);
    
    pnlDataRestorer.setControlCallback(onpnlDataRestorerControl);    
    inline function onpnlDataRestorerControl(component, value)
    {
        // Check if the panel's value is an object
        // If not, set the value to the storage object
        
        if (typeof(value) == "object")
            _persistentData = value; //Copy the object from the panel to the storage object
        else    
            component.setValue(_persistentData); //Initialize the restorer
    };
    
    inline function set(id, value)
    {
        _persistentData[id] = value;
        pnlDataRestorer.setValue(_persistentData);
    }
    
    inline function get(id)
    {
        return _persistentData[id];
    }
}