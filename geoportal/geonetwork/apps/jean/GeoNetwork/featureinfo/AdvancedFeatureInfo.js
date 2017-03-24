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
 * Class: GeoNetwork.AdvancedFeatureInfoWindow
 *      Window to show featureinfo results
 *
 * Inherits from:
 *  - {GeoNetwork.BaseWindow}
 */

/**
 * Constructor: GeoNetwork.FeatureInfo.AdvancedFeatureInfoWindow
 * Create an instance of GeoNetwork.FeatureInfo.AdvancedFeatureInfoWindow
 *
 * Parameters:
 * config - {Object} 
 */
GeoNetwork.FeatureInfo.AdvancedFeatureInfoWindow = function(config) {
    Ext.apply(this, config);
    GeoNetwork.FeatureInfo.AdvancedFeatureInfoWindow.superclass.constructor.call(this);
};

Ext.extend(GeoNetwork.FeatureInfo.AdvancedFeatureInfoWindow, GeoNetwork.BaseWindow, {

		control: null,    


    /**
     * Method: init
     *     Initialize this component.
     */
    initComponent: function() {
        GeoNetwork.FeatureInfo.AdvancedFeatureInfoWindow.superclass.initComponent.call(this);

        this.title = this.title || OpenLayers.i18n("featureInfoWindow.windowTitle");

        this.width = 600;
        this.height = 250;

        this.cls = 'popup-variant1';

       	var fp = new GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel();

        this.add(fp);

        this.doLayout();
    },

    setFeatures: function(featureList) {
        this.loadTranslations();
        this.items.items[0].showFeatures(featureList);
    },
    
    loadTranslations: function() {
    	if (window.Geoportal.featureinfos==null)
        	window.Geoportal.featureinfos={};
    	
		if (window.Geoportal.featureinfos.translations!=null)
			return; //already loaded
    	
    	var fieldsIO = new GeoNetwork.FeatureInfo.FeatureInfoManagerIO({'serviceBaseUrl':catalogue.services.rootUrl});
    	window.Geoportal.featureinfos.translations = fieldsIO.pull();
    },

    setMap: function(map) {
        this.items.items[0].setMap(map);
    }

});
