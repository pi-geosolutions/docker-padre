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
 *  class = GeoportalChartLayerForm
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: GeoportalChartLayerForm(config)
 *
 *  Creates an specific form, for node attributes edition 
 *  (layer parameters' edition, actually)
 *
 */

GeoNetwork.layers.GeoportalChartLayerForm = Ext.extend(GeoNetwork.layers.GeoportalAbstractLayerForm, {
    title: OpenLayers.i18n('geoportal.layer.chart.form.title'), 
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
    		fieldLabel :OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.opacity'), 
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
    		fieldLabel :OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.css'), 
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
        title: OpenLayers.i18n('geoportal.layer.chart.form.geofs'), 
        autoHeight: true,
        layout: 'form',
        //border:false,
        collapsible:true,
        defaults: {width: '90%', 'hidden':false, xtype : 'textfield'},
        //frame:true,
    	items	: 	[{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.geofs.url'),
    		name : 'url'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.wms.form.wmsfs.layers'), 
    		name : 'layers'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.geofs.chsc'),
    		name : 'changescales'
    	},{
            xtype: 'radiogroup',
            columns: [100, 100],
            fieldLabel: OpenLayers.i18n('geoportal.layer.chart.form.geofs.format'), 
            name:'format', //necessary for hide/show procedures
            items: [{
                name: 'format',
                inputValue: 'geojson',
                boxLabel: OpenLayers.i18n('geoportal.layer.chart.form.geofs.formatgeojson'),
            }]
        },{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.geofs.legend'),
    		name : 'legend'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.geofs.join'),
    		name : 'join_geofield'
    	}]
	},{
        xtype: 'fieldset',
        title: OpenLayers.i18n('geoportal.layer.chart.form.dbfs'),
        autoHeight: true,
        layout: 'form',
        //border:false,
        collapsible:true,
        defaults: {width: '90%', 'hidden':false, xtype : 'textfield'},
        //frame:true,
    	items	: 	[{
    		xtype:'combo',
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.dbfs.db'),
    		name : 'dbname',
            //forceSelection: true,
            editable:       false,
            displayField:   'label',
            valueField:     'id',
            store: new Ext.data.XmlStore({
                // store configs
                //autoDestroy: true,
                //autoLoad: true,
                storeId: 'chartDbsStore',
                url: 'pigeo.layers.listchartingdbs', // automatically configures a HttpProxy
                // reader configs
                record: 'db', // records will have an "Item" tag
                idProperty: 'id',
                fields: [{name: 'id'},
      		           {name: 'label'}]
            })
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.dbfs.tables'),
    		name : 'dbtables'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.geofs.join'),
    		name : 'join_dbfield'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.dbfs.values'),
    		name : 'values_dbfield'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.dbfs.labels'),
    		name : 'labels_dbfield'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.dbfs.where'),
    		name : 'dbwhere'
    	}]
	},{
        xtype: 'fieldset',
        title: OpenLayers.i18n('geoportal.layer.chart.form.repfs'),
        autoHeight: true,
        layout: 'form',
        //border:false,
        collapsible:true,
        defaults: {width: '90%', 'hidden':false, xtype : 'textfield'},
        //frame:true,
    	items	: 	[{
            xtype: 'radiogroup',
            fieldLabel: OpenLayers.i18n('geoportal.layer.chart.form.repfs.charttype'),
            name:'charttype', //necessary for hide/show procedures
            items: [{
                name: 'charttype',
                inputValue: 'pie',
                boxLabel: OpenLayers.i18n('geoportal.layer.chart.form.repfs.piechart'),
            },{
                name: 'charttype',
                inputValue: 'bar',
                boxLabel: OpenLayers.i18n('geoportal.layer.chart.form.repfs.barchart'),
            }]
        },{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.repfs.colors'),
    		name : 'colorcodes'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.chart.form.repfs.size'),
    		name : 'chartsize'
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
	}],
    
    /** private: method[initComponent] 
     *  Initializes the form panel
     *  
     *  TODO : 
     */
    initComponent: function(config){
        Ext.apply(this, config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.layers.GeoportalChartLayerForm.superclass.initComponent.call(this);
    }
    
});

/** api: xtype = gn_layers_geoportalchartlayerform */
Ext.reg('gn_layers_geoportalchartlayerform', GeoNetwork.layers.GeoportalChartLayerForm);