/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
 
/**
 * @requires OpenLayers/Layer.js
 * @requires OpenLayers/Tile/Image.js
 */

/**
 * Class: OpenLayers.Layer.AnimImage
 * Instances of OpenLayers.Layer.AnimImage are used to display data from a web
 * accessible image as a map layer.  Create a new image layer with the
 * <OpenLayers.Layer.AnimImage> constructor.
 * OpenLayers.Layer.AnimImage are hacked from OpenLayers.Layer.Image, in order
 * to perform smooth transitions when one changes the image URL
 *
 * Inherits from:
 *  - <OpenLayers.Layer>
 */
OpenLayers.Layer.AnimImage = OpenLayers.Class(OpenLayers.Layer.Image, {

    /**
     * Property: isBaseLayer
     * {Boolean} The layer is a base layer.  Default is false.  Set this property
     * in the layer options
     */
    isBaseLayer: false,
    
    /**
     * Property: imageRemanence
     * {integer} in animations, when you change the image url, there is a small time 
     * when the previous image is removed and the new one doesn't show yet.
     * It results in some jerky animation. 
     * One solution is to use this imageRemanence parameter : it is the time (in 
     * milliseconds) between when we call the new image and when we remove the old
     * one.
     * A too large imageRemanence param will give something weird since the 2 images 
     * will superpose for some time. A too small one will just reduce the jerkiness.
     * Around 50 to 100 seems quite fine.
     */
    imageRemanence: 100,
    
    /**
     * Constructor: OpenLayers.Layer.Image
     * Create a new image layer
     *
     * Parameters:
     * name - {String} A name for the layer.
     * url - {String} Relative or absolute path to the image
     * extent - {<OpenLayers.Bounds>} The extent represented by the image
     * size - {<OpenLayers.Size>} The size (in pixels) of the image
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, extent, size, options) {
        this.url = url;
        this.extent = extent;
        this.maxExtent = extent;
        this.size = size;
        OpenLayers.Layer.prototype.initialize.apply(this, [name, options]);

        this.aspectRatio = (this.extent.getHeight() / this.size.h) /
                           (this.extent.getWidth() / this.size.w);
    },    

    
    /**
     * APIMethod: setUrl
     * 
     * Parameters:
     * newUrl - {String}
     */
    setUrl: function(newUrl) {
    	/*var ulPx = this.map.getLayerPxFromLonLat({
	        lon: this.extent.left,
	        lat: this.extent.top
	    });
    	var oldtile = new OpenLayers.Tile.Image(this, ulPx, this.extent, 
    			null, this.tileSize);
    	//this.addTileMonitoringHooks(oldtile);
    	oldtile.draw();
        */
    	var childNode = this.div.childNodes[0];
    	var oldNode = childNode.cloneNode(false);
    	this.div.appendChild(oldNode);
    	//console.log(this);
        this.url = newUrl;
        this.tile.draw();
        var me=this;
        setTimeout(function() {me.div.removeChild(oldNode)},this.imageRemanence);
        
    },

    CLASS_NAME: "OpenLayers.Layer.AnimImage"
});
