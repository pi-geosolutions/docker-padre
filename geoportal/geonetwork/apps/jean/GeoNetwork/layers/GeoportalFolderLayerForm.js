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
 *  class = GeoportalFolderLayerForm
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: GeoportalFolderLayerForm(config)
 *
 *  Creates an specific form, for node attributes edition 
 *  (layer parameters' edition, actually)
 *
 */

GeoNetwork.layers.GeoportalFolderLayerForm = Ext.extend(GeoNetwork.layers.GeoportalAbstractLayerForm, {
    title: OpenLayers.i18n('geoportal.layer.folder.form.title'), 
    nodeFormFields : [{
        xtype: 'fieldset',
        title: OpenLayers.i18n('geoportal.layer.abstract.form.generalfs'), 
        autoHeight: true,
        layout: 'form',
        //border:false,
        collapsible:false,
        defaults: {width: '90%', 'hidden':false,xtype : 'textfield'},
        //frame:true,
    	items	: 	[{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.id'), 
    		name : 'id',
            disabled:true
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.type'), 
    		name : 'type',
            disabled:true
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.text'), 
    		name : 'text'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.css'), 
    		name : 'cls'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.comments'), 
    		xtype : 'textarea',
    		name : 'qcktip',
    		height:20,
    		grow:true,
    		growMin:20,
    		growMax:200
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.ext'), 
    		xtype : 'textarea',
    		name : 'extensions',
    		height:20,
    		grow:true,
    		growMin:20,
    		growMax:200
    	}]
	}],
    
    /** private: method[initComponent] 
     *  Initializes the form panel
     *  
     *  TODO : 
     */
    initComponent: function(config){
        Ext.apply(this, config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.layers.GeoportalFolderLayerForm.superclass.initComponent.call(this);
    }
});

/** api: xtype = gn_layers_geoportalfolderlayerform */
Ext.reg('gn_layers_geoportalfolderlayerform', GeoNetwork.layers.GeoportalFolderLayerForm);