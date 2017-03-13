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
Ext.namespace('GeoNetwork.layers');


/** api: (define)
 *  module = GeoNetwork.layers
 *  class = GeoportalWMSLayer
 */
/** api: constructor 
 *  .. class:: GeoportalWMSLayer(config)
 *
 *  Create a WMS layer helper class for the Geoportal
 *  to manage everything around the layer : edit, load, etc
 *
 */


GeoNetwork.layers.GeoportalWMSLayer = Ext.extend(GeoNetwork.layers.GeoportalAbstractLayer, {
    template : {
		type:"wms",
		text:"new wms layer",
		opacity:1,
		cls:'',
		qcktip : 'here come your comments about the layer',
		url: "http://gm-risk.pigeo.fr/geoserver-prod/gm/wms?",
		format:"image/png",
		TILED:true,
		queryable:true,
		checked:false,
		leaf:true
    },
    form:null,
    treeNode:null,
    gpid:1,
    type: 'wms',
      
	
	/** private: method[constructor] 
     */
    constructor: function(config) {
    	GeoNetwork.layers.GeoportalWMSLayer.superclass.constructor.call(this, config);
        Ext.apply(this, config);
        this.gpid = Math.round(Math.random() * 100000);
    },
    
    //Unused because it's no graphic component !
   /* initComponent: function(){
        Ext.apply(this, this.config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.layers.GeoportalWMSLayer.superclass.initComponent.call(this);
    },*/

    
    getForm: function(conf) {
    	if (this.form) this.form.destroy();
    	this.form = new GeoNetwork.layers.GeoportalWMSLayerForm(conf);
    	return this.form;
    },

    fixNodeConfig: function(attr) {
    	//hack due to indrocution of new qureyable parameter : it is better if initialized to true.
    	if (attr.queryable==undefined) attr.queryable=true;
    	var att = GeoNetwork.layers.GeoportalWMSLayer.superclass.fixNodeConfig.call(this, attr);
    	return att;
    }
});

/** api: xtype = gn_layers_geoportalwmslayer */
Ext.reg('gn_layers_geoportalwmslayer', GeoNetwork.layers.GeoportalWMSLayer);