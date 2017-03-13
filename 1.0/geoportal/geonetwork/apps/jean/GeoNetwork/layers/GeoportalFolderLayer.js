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
 *  class = GeoportalFolderLayer
 */
/** api: constructor 
 *  .. class:: GeoportalFolderLayer(config)
 *
 *  Create a WMS layer helper class for the Geoportal
 *  to manage everything around the layer : edit, load, etc
 *
 */


GeoNetwork.layers.GeoportalFolderLayer = Ext.extend(GeoNetwork.layers.GeoportalAbstractLayer, {
    template : {
		type:"folder",
		text:"new folder",
		iconCls:'folder',
		qcktip : '',
		leaf:false
    },

    gpid:2,
    type: 'folder',
      
	
	/** private: method[constructor] 
     */
    constructor: function(config) {
    	GeoNetwork.layers.GeoportalFolderLayer.superclass.constructor.call(this, config);
        Ext.apply(this, config);
        this.gpid = Math.round(Math.random() * 1000000);
    },
	
	/** private: method[initComponent] 
     */
   /* initComponent: function(config){
        Ext.apply(this, config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.layers.GeoportalFolderLayer.superclass.initComponent.call(this);
    },*/
    
    getForm: function(conf) {
    	if (this.form) this.form.destroy();
    	this.form = new GeoNetwork.layers.GeoportalFolderLayerForm(conf);
    	return this.form;
    }
});

/** api: xtype = gn_layers_geoportalfolderlayer */
Ext.reg('gn_layers_geoportalfolderlayer', GeoNetwork.layers.GeoportalFolderLayer);