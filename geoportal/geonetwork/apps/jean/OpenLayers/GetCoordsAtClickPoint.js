/* Copyright (c) 2006-2010 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Click.js
 * @requires OpenLayers/Handler/Hover.js
 * @requires OpenLayers/Request.js
 */

/**
 * Class: OpenLayers.Control.GetCoordsAtClickPoint
 * The GetCoordsAtClickPoint control just triggers some events after clicking on the map
 * It is used, typically, to implement some sort of very customized WMSGetFeatureInfo 
 * (see ILWAC's WB geoportal ilwac.ige.fr/ml-ilwac-geocat)
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.GetCoordsAtClickPoint = OpenLayers.Class(OpenLayers.Control, {

    /** APIProperty: clickCallback
     *  {String} The click callback to register in the
     *      {<OpenLayers.Handler.Click>} object. Default is "click".
     */
    clickCallback: "click",

    /**
     * Property: handler
     * {Object} Reference to the <OpenLayers.Handler> for this control
     */
    handler: null,
    
    /**
     * Constant: EVENT_TYPES
     *
     * Supported event types (in addition to those from <OpenLayers.Control>):
     * gotcoordinates - Triggered when the coords are available
     */
    EVENT_TYPES: ["gotcoordinates"],

    /**
     * Constructor: <OpenLayers.Control.GetCoordsAtClickPoint>
     *
     * Parameters:
     * options - {Object} 
     */
    initialize: function(options) {
        // concatenate events specific to vector with those from the base
        this.EVENT_TYPES =
            OpenLayers.Control.GetCoordsAtClickPoint.prototype.EVENT_TYPES.concat(
            OpenLayers.Control.prototype.EVENT_TYPES
        );

        options = options || {};
        
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        
        
        var callbacks = {};
        callbacks[this.clickCallback] = this.getInfoForClick;
        this.handler = new OpenLayers.Handler.Click(
            this, callbacks,  {});
    },

    /**
     * Method: activate
     * Activates the control.
     * 
     * Returns:
     * {Boolean} The control was effectively activated.
     */
    activate: function () {
        if (!this.active) {
            this.handler.activate();
        }
        return OpenLayers.Control.prototype.activate.apply(
            this, arguments
        );
    },

    /**
     * Method: deactivate
     * Deactivates the control.
     * 
     * Returns:
     * {Boolean} The control was effectively deactivated.
     */
    deactivate: function () {
        return OpenLayers.Control.prototype.deactivate.apply(
            this, arguments
        );
    },
    
    /**
     * Method: getInfoForClick 
     * Called on click
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    getInfoForClick: function(evt) {
        this.events.triggerEvent("gotcoordinates", {xy: evt.xy});
        // Set the cursor to "wait" to tell the user we're working on their
        // click.
        //OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
    },

    CLASS_NAME: "OpenLayers.Control.GetCoordsAtClickPoint"
});
