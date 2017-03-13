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

Ext.namespace('GeoNetwork');

/**
 * Class: DashBoardWindow
 *      Window to display all the advanced information board on a punctual site (derives from a getFeatureInfo)
 *
 * Inherits from:
 *  - {GeoNetwork.BaseWindow}
 */

/**
 * Constructor: GeoNetwork.DashBoardWindow
 * Create an instance of GeoNetwork.DashBoardWindow
 *
 * Parameters:
 * config - {Object} A config object used to set the dashboardwindow
 *     window's properties.
 */
GeoNetwork.DashBoardWindow = function(config) {
    Ext.apply(this, config);
    GeoNetwork.DashBoardWindow.superclass.constructor.call(this);
};

Ext.extend(GeoNetwork.DashBoardWindow, GeoNetwork.BaseWindow, {

	control: null,
	maximizable:true,
	
	config:null,
	tabpanel:null,
	tabs:[], //will contain the list of the panels
	activeTab:null,
	lat:null,
	lon:null,
	closeAction: 'hide', 

    /**
     * Method: init
     *     Initialize this component.
     */ 
    initComponent: function() {
        GeoNetwork.DashBoardWindow.superclass.initComponent.call(this);

        window.dashboard = this;
        this.title = this.title || OpenLayers.i18n("dash_DashBoardWindow.windowTitle");

        this.width = 600;
        this.height = 400;
        
        this.config = window.Geoportal.DashBoard.infosConfig;
        this.layout ='fit';
    },

    loadPanel: function(config, idx) {
    	var panel=null;
    	switch (config.type) {
			case "ndvipanel":
				panel = new GeoNetwork.NDVIPanel({
							title 			: config.text, 
							text_intro 		: config.text_intro,
							years 			: this.arrayify(config.annees), 
							months 			: config.mois, 
							days 			: this.arrayify(config.jours), 
							actionsConfig 	: config.children,
							lat				: this.lat,
							lon				: this.lon,
							tabindex		: idx
						});
				break;
			case "pratiquesgdtpanel":
				panel = new GeoNetwork.PratiquesGDTPanel({
							title 			: config.text,
							text_intro 		: config.text_intro,
							zae_url 		: config.zae_url,
							actionsConfig 	: config.children,
							lat				: this.lat,
							lon				: this.lon,
							tabindex		: idx,
							cls				: "pratiquesGDT"
						});
				break;
			case "layerpanel":
				if (window.showlayerinfos ==true) {
					panel = new GeoNetwork.LayerInfoPanel({
								title 			: config.text,
								text_intro 		: config.text_intro,
								layername		: config.layername,
								wmsinfourl		: config.wmsInfoURL,
								dataurl			: config.dataurl,
								actionsConfig 	: config.children,
								lat				: this.lat,
								lon				: this.lon,
								tabindex		: idx,
								map				: this.control.map,
								parent			: this,
								cls				: "layerInfoPanel"
							});
				}
				break;
			default: 
		    	
		    	break;
    	}

    	return panel;
    },
    
    loadTabs: function() {
    	this.tabs=[];
    	
        this.config = window.Geoportal.DashBoard.infosConfig;
    	for (var i=0 ; i < this.config.length ; i++) {
    		var panel = this.loadPanel(this.config[i], i);
    		if (panel) {
    			this.tabs.push(panel);
    		}
    	}
    	this.tabpanel = new Ext.TabPanel({
    	    activeTab: 0,
    	    cls : 'infoTabPanel',
    	    items: this.tabs,
    	    deferredRender:false,
    	    listeners: {
    	    	'tabchange': function(tabpanel, tab){
    	    		this.activeTab = tab;
                },
        	    scope : this
    	    }
    	});
    	this.add(this.tabpanel);
    	this.doLayout();
    	
    	this.activeTab = this.tabpanel.getActiveTab(); // initialize the var
    },

    setLonLat: function(lon,lat) {
    	this.lon = lon;
    	this.lat = lat;
    	if (this.tabs.length==0) { //initialize the window's content
    		this.loadTabs();
    	} 
    		for (var i = 0 ; i < this.tabs.length ; i++) {
    			//console.log("setting lonlat for tab "+this.tabs[i].title);
    			this.tabs[i].setLonLat(lon, lat);
    		}
    	
    },
    setxy: function(xy) {
    	this.xy = xy;
    },
    arrayify: function(src) {
    	var array = [];
    	for (var i=0 ; i < src.length ; i++) {
    		array.push([src[i]]);
    	}
    	return array;
    },
    openTab: function(tabNb) {
    	if (tabNb < this.tabpanel.items.getCount()) {
    		this.tabpanel.setActiveTab(tabNb);
    	}
    }


});
