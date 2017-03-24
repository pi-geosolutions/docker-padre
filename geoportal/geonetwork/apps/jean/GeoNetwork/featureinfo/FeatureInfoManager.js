/*
 * Copyright (C) 2009 GeoNetwork
 *
 * This file is part of GeoNetwork
 *
 * GeoNetwork is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * GeoNetwork is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GeoNetwork.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @requires GeoNetwork/windows/BaseWindow.js
 */ 

Ext.namespace('GeoNetwork.FeatureInfo');

/**
 * Class: GeoNetwork.FeatureInfo.FeatureInfoManager
 *      Window to manage a layer's fields (rename, show/hide them).
 *
 * Inherits from:
 *  - {GeoNetwork.BaseWindow}
 */

/**
 * Constructor: GeoNetwork.FeatureInfo.FeatureInfoManager
 * Create an instance of GeoNetwork.FeatureInfo.FeatureInfoManager
 *
 * Parameters:
 * config - {Object} 
 */
GeoNetwork.FeatureInfo.FeatureInfoManager = function(config) {
    Ext.apply(this, config);
    GeoNetwork.FeatureInfo.FeatureInfoManager.superclass.constructor.call(this);
};

Ext.extend(GeoNetwork.FeatureInfo.FeatureInfoManager, GeoNetwork.BaseWindow, {

		current: null,
		
		//value of a field label saying we don't want to display its information
		hideValue : "#hide#",
		
		//lists the layers for which fields have been renamed since last saving
		changedLayers : [],
		
		//IO class for interactions with DB
		featureInfoManagerIO : null,

    /**
     * Method: init
     *     Initialize this component.
     */
    initComponent: function() {
        GeoNetwork.FeatureInfo.FeatureInfoManager.superclass.initComponent.call(this);

        this.title = this.title || OpenLayers.i18n("featureInfoManager.windowTitle");

        this.width = 600;
        this.height = 400;

        this.cls = 'popup-variant1';

        this.layout='border';
        this.fieldsPanel = new Ext.Panel({
        	region:'center',
        	layout:'fit'
        });
        this.langPanel = new Ext.Panel({
        	region:'north',
        	height:100,
        	collapsible:false,
        	layout:'fit'
        });
        this.add(this.fieldsPanel);
        this.add(this.langPanel);
        
        this.loadLanguages(this.langPanel);

        this.doLayout();
        
    },
    
    loadLanguages: function(destination) {
    	if (GeoNetwork.Util.locales.length >0 && destination!=null) {
        	// simple array store
        	var store = new Ext.data.ArrayStore({
        	    fields: ['iso2', 'name', 'iso3'],
        	    data : GeoNetwork.Util.locales
        	});
        	var list = new Ext.grid.GridPanel({
		        layout:'fit',
	        	autoScroll:true,
	            store: store,
	            columns: [
	                {
	                    id       :'iso3',
	                    header   : OpenLayers.i18n("featureInfoManager.langGrid.code"), 
	                    dataIndex: 'iso3',
	                    width :40
	                },
	                {
	                    id: 'name',
	                    header   : OpenLayers.i18n("featureInfoManager.langGrid.name"), 
	                    sortable : true, 
	                    dataIndex: 'name',
	                    width : 500
	                }
	            ],
	            stripeRows: false,
	            autoExpandColumn: 'name',
	            title: OpenLayers.i18n("featureInfoManager.langGrid.title"), 
	            height : 160,
	            selModel: new Ext.grid.RowSelectionModel({
	            					singleSelect:true,
	            					listeners : {
	            						'rowselect' : function(me, i, r) {
	            							//console.log(r);
	            							//console.log(this);
	            							langCode = r.get("iso3");
	            							this.loadFields(langCode);
	            							this.current.langCode = langCode;
	            						}, scope:this
	            					}
	            			}),
	            listeners : {
	            	'afterrender': function(me) {
	            		//needs timeout : if not, it is indeed selected, but not visibly (no outlined)
	            		setTimeout(function(){
	            			me.getSelectionModel().selectFirstRow();
	        			}, 100)
	            	}
	            }
	        });
        	destination.add(list);
        	destination.doLayout();
    	}
    },
    
    loadFields: function(langCode) {
    	//we call the service to recover the translated texts
    	//if nothing comes, then we load it from the getFeatureInfos
    	var layerid = this.current.layerid;
    	var feature = this.current.feature;
    	var fields = {};
    	for (var attr in feature.attributes) {
    		fields[attr]=this.fieldRename(attr, feature,layerid,langCode);
        }
    	//console.log(fields);
    	
     // create the editor grid
        var grid = new Ext.grid.PropertyGrid({
        	source:fields,
            height:300,
            width:400,
            title: OpenLayers.i18n("featureInfoManager.fieldsGrid.title"), 
            clicksToEdit: 1,
            bbar: [
             	       '->',
            	       {
            	    	   text : OpenLayers.i18n('featureInfoManager.fieldsGrid.save'),
            	    	   handler : this.saveChangesForThisLayer,
            	    	   scope:this
            	       },
            	       {
            	    	   text : OpenLayers.i18n('featureInfoManager.fieldsGrid.saveall'),
            	    	   handler : this.saveChangesForAll,
            	    	   scope:this
            	       }
    	       ],
	       listeners: {
	    	   'propertychange':this.onFieldChange,
	    	   scope:this
	       }
        });
        delete grid.getStore().sortInfo; // Remove default sorting

        this.fieldsPanel.removeAll();
        this.fieldsPanel.add(grid);
        this.fieldsPanel.doLayout();
    },
    
    //normally, it is overriden from AdvancedFeatureinfoPanel, and overrides this
    fieldRename: function(attr, feature,layerid,langCode) {
    	return attr;
    },
    
    manage: function(data) {
        this.current = data;
    },
    
    onFieldChange: function(source, recordId, value, oldvalue) {
    	var lang = this.current.langCode;
    	if (window.Geoportal.featureinfos.translations[this.current.layerid]==null)
    		window.Geoportal.featureinfos.translations[this.current.layerid]={};
        if (window.Geoportal.featureinfos.translations[this.current.layerid][lang]==null) {
        	window.Geoportal.featureinfos.translations[this.current.layerid][lang] = source;
    	} else { //we already have an entry for this layer : we will just update the value content
    		window.Geoportal.featureinfos.translations[this.current.layerid][lang][recordId]=value;
    	}
        if (this.changedLayers.indexOf(this.current.layerid)<0) { //not yet in the changed list, we add it
        	this.changedLayers.push(this.current.layerid);
        }
    },
    
    //
    //		I/O
    //
    
    saveChangesForThisLayer : function() {
    	var xml = "<layers>"
    				+"<layer>"
			    		+"<name>"+this.current.layerid+"</name>"
			    		+ "<fields><![CDATA["+Ext.util.JSON.encode(window.Geoportal.featureinfos.translations[this.current.layerid])+"]]></fields>"
			    	+"</layer>"
			     +"</layers>";
    	this.pushToDB(xml);
    },
    
    saveChangesForAll : function() {
    	var xml = "<layers>";
    	this.changedLayers.forEach(function(layername) {
    		xml += "<layer>"
	    		+"<name>"+layername+"</name>"
	    		+ "<fields><![CDATA["+Ext.util.JSON.encode(window.Geoportal.featureinfos.translations[layername])+"]]></fields>"
	    	+"</layer>"
    	});
	    xml += "</layers>";
	    this.pushToDB(xml);
    },
    
    pushToDB: function(data) {
    	if (!this.featureInfoManagerIO) {
    		this.featureInfoManagerIO = new GeoNetwork.FeatureInfo.FeatureInfoManagerIO({'serviceBaseUrl':catalogue.services.rootUrl});
    	}
        this.featureInfoManagerIO.push(data);
    },
});
