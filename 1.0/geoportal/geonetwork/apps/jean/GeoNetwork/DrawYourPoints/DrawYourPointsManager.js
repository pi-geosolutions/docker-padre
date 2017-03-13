/*
 * Copyright (C) 2014 Jean Pommier, PI-geosolutions
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or (at
 * your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 * 
 * Contact: jean.pommier@pi-geosolutions.fr
 */
Ext.namespace('GeoNetwork.DrawYourPoints');


/** api: (define)
 *  module = GeoNetwork.DrawYourPoints
 *  class = DrawYourPointsManager
 */
/** api: constructor 
 *  .. class:: DrawYourPointsManager(config)
 *
 *  Main DrawYourPoints class
 *
 */
GeoNetwork.PolygonQuery.DrawYourPointsManager = Ext.extend(Object, {
	/*
	 * specific config
	 */
	button:null,
	fallbackButton:null, //button we go back to, if new node is node polygonQuery enabled
	
	/*
	 * Private vars. Don't use directly
	 */
	map:null,
	layer:null,
	control:null,
	window:null,
    
    constructor: function(config){
    	GeoNetwork.DrawYourPoints.DrawYourPointsManager.superclass.constructor.call(this, config);
        Ext.apply(this, config);
        
        /*this.styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({
                    symbolizer: {
                        "Polygon": {
                            strokeWidth: 2,
                            strokeOpacity: 1,
                            strokeColor: "#FF0000",
                            fillColor: "white",
                            fillOpacity: 0.5
                        }
                    }
                })]
            })
        });*/
        
    },
    
    
    /*
     * API
     */
    
    getLayer: function() {
    	if (this.layer==null && this.map!=null)
    	{
    		this.layer = new OpenLayers.Layer.Vector(OpenLayers.i18n('pqLayer'), {
    			visibility: true, 
    			styleMap: this.styleMap,
    			displayInLayerSwitcher:false,
    			eventListeners : {
    				beforefeatureadded : this.onFeatureAdded,
    				featureadded : this.afterFeatureAdded,
                    scope: this
    			}
			});

        	//this.map.setLayerIndex(this.layer,  this.map.layers.length-1);
    		this.map.addLayer(this.layer);
    	}
		return this.layer
    },
    getControl: function() {
    	var pqLayer = this.getLayer();
    	if (this.control==null && pqLayer!=null) {
    		this.control = new OpenLayers.Control.DrawFeature(pqLayer, OpenLayers.Handler.Polygon, {
    	        displayClass: 'olControlDrawFeaturePolygon',
    	        handlerOptions: {},
    	        eventListeners: {
    	        	//featureadded: this.onFeatureAdded, //we get this on the OpenLayers.Layer.Vector's side : gives more precise events 
    	            activate: this.onActivate,
    	            deactivate: this.onDeactivate,
    	            scope: this
    	        }
    	    });
    	}
		return this.control;
    },
    
    
    onActivate: function() {
    },
    
    onDeactivate: function() {
    },
    
    onFeatureAdded: function(event) {
    },
    
    afterFeatureAdded: function(event) {
    }

});