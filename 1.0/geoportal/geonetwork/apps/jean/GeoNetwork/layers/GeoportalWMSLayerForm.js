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
 *  class = GeoportalWMSLayerForm
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: GeoportalWMSLayerForm(config)
 *
 *  Creates an specific form, for node attributes edition 
 *  (layer parameters' edition, actually)
 *
 */

GeoNetwork.layers.GeoportalWMSLayerForm = Ext.extend(GeoNetwork.layers.GeoportalAbstractLayerForm, {
    title: OpenLayers.i18n('geoportal.layer.wms.form.title'), 
    nodeFormFields : [{
        xtype: 'fieldset',
        title: OpenLayers.i18n('geoportal.layer.abstract.form.generalfs'), 
        autoHeight: true,
        layout: 'form',
        //border:false,
        collapsible:true,
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
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.opacity'), 
    		xtype : 'spinnerfield',
    		name : 'opacity',
    		maxValue : 1.0,
    		minValue : 0,
        	allowDecimals: true,
        	decimalPrecision: 1,
        	incrementValue: 0.1,
        	alternateIncrementValue: 2.1,
        	accelerate: true
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
    },{
        xtype: 'fieldset',
        title: OpenLayers.i18n('geoportal.layer.wms.form.wmsfs'),
        autoHeight: true,
        layout: 'form',
        //border:false,
        collapsible:true,
        defaults: {width: '90%', 'hidden':false, xtype : 'textfield'},
        //frame:true,
    	items	: 	[{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.url'),
    		name : 'url'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.layers'),
    		name : 'layers'
    	},{
            xtype: 'radiogroup',
            columns: [100, 100],
            fieldLabel: OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.format'),
            name:'format', //necessary for hide/show procedures
            items: [{
                name: 'format',
                inputValue: 'image/png',
                boxLabel: OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.formatpng')
            }, {
                name: 'format',
                inputValue: 'image/jpg',
                boxLabel: OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.formatjpg')
            }]
        },{
        	xtype: 'checkbox',
            fieldLabel: OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.tiled'),
            //inputValue:false,
            name: 'TILED',
            value:true
    	},{
        	xtype: 'checkbox',
            fieldLabel: OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.queryable'),
            //inputValue:false,
            name: 'queryable',
            value:true
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.legend'),
    		name : 'legend'
    	}]
	},{
        xtype: 'fieldset',
        title: OpenLayers.i18n('geoportal.layer.wms.form.mtdfs'),
        autoHeight: true,
        layout: 'form',
        //border:false,
        collapsible:true,
        defaults: {width: '90%', 'hidden':false, xtype : 'textfield'},
        //frame:true,
    	items	: 	[{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.mtdfs.uuid'),
    		name : 'uuid'
    	}]
	},{
        xtype: 'fieldset',
    	id:'pq_form',
        title: OpenLayers.i18n('geoportal.layer.wms.form.pqfs'),
        checkboxToggle:true,
        checkboxName:'pq_enable',
        autoHeight: true,
        layout: 'form',
        //border:false,
        //collapsible:false,
        collapsed: true,
        defaults: {width: '90%', hidden:false, xtype : 'textfield'},
        //frame:true,
        listeners: {
            collapse: function(p) {
            	//console.log("collapsed");
                p.items.each(function(i) {
                    i.disable();
                },
                this);
            },
            expand: function(p) {
            	//console.log("expand");
                p.items.each(function(i) {
                    i.enable();
                },
                this);
            }
        },
    	items	: 	[{/*
        	xtype: 'checkbox',
        	id:'pq.form.enable',
    		fieldLabel : 'Enable Polygon Query ?',
    		name : 'pq.enable',
            value:false
    	},{
            xtype: 'fieldset',
        	id:'pq.form.settings',
            hidden:true,
            title: 'Polygon Query settings',
            autoHeight: true,
            layout: 'form',
            //border:false,
            collapsible:false,
            defaults: {width: '90%', hidden:false, xtype : 'textfield'},
            //frame:true,
        	items	: 	[{*/
    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.pqfs.layer'),
    		name : 'pq_layer'
    	},{
    		xtype: 'numberfield',
    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.pqfs.band'),
    		value:0,
    		name : 'pq_bandnb'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.pqfs.header'),
    		name : 'pq_header'
    	}/*,{
        	xtype: 'checkbox',
    		fieldLabel : 'Multiply values by polygon area (density cases) ?',
    		id : 'pq_multiplyByArea',
    		name : 'pq_multiplyByArea',
            value:false,
            listeners: {
                check: function(event, checked) {
                	Ext.getCmp('pq_multiplyRatio').setVisible(checked);
                }
            }
    	},{
    		xtype: 'numberfield',
    		fieldLabel : 'Ratio (base unit is /km²)',
    		hidden:true,
    		id : 'pq_multiplyRatio',
    		name : 'pq_multiplyRatio'
    	}*//*,{
                xtype: 'radiogroup',
                columns: [300],
                fieldLabel: 'Layer type',
                name:'pq.layertype', //necessary for hide/show procedures
                items: [{
                    name: 'pq.layertype',
                    inputValue: 'raster',
                    boxLabel: 'Raster'
                }, {
                    name: 'pq.layertype',
                    inputValue: 'polygons',
                    boxLabel: 'Vector (polygons)',
                    disabled:true
                }, {
                    name: 'pq.layertype',
                    inputValue: 'points',
                    boxLabel: 'Vector (points)',
                    disabled:true
                }]
            }*/,{
                xtype: 'checkboxgroup',
                columns: 3,
                fieldLabel: OpenLayers.i18n('geoportal.layer.wms.form.pqfs.stats'),
                id:'pq_rastertype_fields', 
                name:'pq_rastertype_fields', //necessary for hide/show procedures
                items: [{
                    name: 'count',
                    boxLabel: OpenLayers.i18n('geoportal.layer.wms.form.pqfs.stats.count')
                }, {
                    name: 'min',
                    boxLabel: OpenLayers.i18n('geoportal.layer.wms.form.pqfs.stats.min'),
                    checked: true
                }, {
                    name: 'max',
                    boxLabel: OpenLayers.i18n('geoportal.layer.wms.form.pqfs.stats.max'),
                    checked: true
                }, {
                    name: 'sum',
                    boxLabel: OpenLayers.i18n('geoportal.layer.wms.form.pqfs.stats.sum'),
                    checked: true
                }, {
                    name: 'avg',
                    boxLabel: OpenLayers.i18n('geoportal.layer.wms.form.pqfs.stats.avg'),
                    checked: true
                }, {
                    name: 'stddev',
                    boxLabel: OpenLayers.i18n('geoportal.layer.wms.form.pqfs.stats.stddev'),
                    checked: true
                }]
            },{
	    		xtype: 'numberfield',
	    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.pqfs.round'),
	    		name : 'pq_round'
    	},]
	}],
    
    /** private: method[initComponent] 
     *  Initializes the form panel
     *  
     *  TODO : 
     */
    initComponent: function(){
        Ext.apply(this, this.config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.layers.GeoportalWMSLayerForm.superclass.initComponent.call(this);
        
        /*
        Ext.getCmp("pq.form.enable").on("change", this.togglePolygonqueryForm, this);
        console.log(Ext.getCmp("pq.form.enable"));*/
    }/*,
    
    togglePolygonqueryForm: function(scope, newval, oldval) {
    	console.log(newval);
    	var fieldset = Ext.getCmp("pq.form.settings");
    	console.log(fieldset);
    	fieldset.setVisible(newval);
    	this.doLayout();
    }*/,
    
	/**
	 * Loads node attributes in the form
	 * 
	 * TODO : 
	 */
	editNode: function(source) { 
        GeoNetwork.layers.GeoportalWMSLayerForm.superclass.editNode.call(this, source);
        this.loadPQData(source);
	},
	/**
     * Applies the changes in the form to the node attributes & display in the tree
     * 
     * TODO : 
     */
    applyChanges: function(button, event) {
        GeoNetwork.layers.GeoportalWMSLayerForm.superclass.applyChanges.call(this, button, event);
        
        
    	var node = this.currentNode;
    	var values= this.getForm().getFieldValues();
    	
		delete node.attributes.pq_rastertype_fields; //we'll set them by hand
		if (node!=null && values['pq_layer']!=null && values['pq_layer']!="") {
			//apply values for Polygon Query checkboxes, if it is set: 
			node.attributes.pq_rastertype_fields = {};
			
			Ext.each(Ext.getCmp("pq_rastertype_fields").items.items, function(item, index) {
				node.attributes.pq_rastertype_fields[item.name]=item.checked;
			});
		}
    },
    
	loadPQData: function(source) {
		var geoplayer = this.getGeoplayer(source);
		if (geoplayer==null) return;
		
		var node = geoplayer.getTreeNode();
		if (node==null) return;
		if (node.attributes.pq_layer==null || node.attributes.pq_layer=="") return;
		else  {
			//console.log("here goes the real stuff");
			//check the fieldset 
			window.pqfs = Ext.getCmp("pq_form");
			try {
				Ext.getCmp("pq_form").expand();
			} catch (err) {
				//The expand command will throw an error: probably a bug in the checkbox-fieldset thing
				//Doesn't seem to matter much
			}
			//console.log(node.attributes);
			var cbGroup = Ext.getCmp("pq_rastertype_fields").setValue(node.attributes.pq_rastertype_fields);
		}
	}
});

/** api: xtype = gn_layers_geoportalwmslayerform */
Ext.reg('gn_layers_geoportalwmslayerform', GeoNetwork.layers.GeoportalWMSLayerForm);