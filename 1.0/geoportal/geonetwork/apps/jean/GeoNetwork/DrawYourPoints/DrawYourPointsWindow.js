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

Ext.namespace('GeoNetwork.DrawYourPoints');

/**
 * Class: GeoNetwork.DrawYourPoints.DrawYourPointsWindow
 *      DrawYourPoints main Window
 *
 * Inherits from:
 *  - {GeoNetwork.BaseWindow}
 */

/**
 * Constructor: GeoNetwork.DrawYourPoints.DrawYourPointsWindow
 * Create an instance of GeoNetwork.DrawYourPoints.DrawYourPointsWindow
 *
 * Parameters:
 * config - {Object} 
 */
GeoNetwork.DrawYourPoints.DrawYourPointsWindow = function(config) {
    Ext.apply(this, config);
    GeoNetwork.DrawYourPoints.DrawYourPointsWindow.superclass.constructor.call(this);
};

Ext.extend(GeoNetwork.DrawYourPoints.DrawYourPointsWindow, GeoNetwork.BaseWindow, {
	
	headerPanel:null,
	resultsPanel:null,
	
	closeAction:'hide',
	/*
	 * Internal vars. Don't use directly
	 */
	targetName:null,
	resultsText:null,

    /**
     * Method: init
     *     Initialize this component.
     */
    initComponent: function() {
        GeoNetwork.DrawYourPoints.DrawYourPointsWindow.superclass.initComponent.call(this);

        this.title = this.title || OpenLayers.i18n("polygonQueryWindow.windowTitle");

        this.x=10;
        this.y = 10;
        this.width = 300;
        this.height = 600;

        this.cls = 'pqwindow';

       	this.mainPanel = new Ext.Panel({
       		autoScroll:true,
			html: this.getContent()
       	});
        this.add(this.mainPanel);
        
        this.doLayout();
    },
    
    getContent: function() {
    	var content = this.getHeaderText();
    	content += this.getTargetNameText();
    	content += this.getResultsText();
    	return content;
    },

    getHeaderText: function() {
    	return OpenLayers.i18n('polygonQueryWindow.header.text');
    },
    
    getTargetNameText: function()  {
    	var text="";
    	if (this.targetName) {
    		text =  '<br /><div class="pqTarget"> <h3>'+
						OpenLayers.i18n('polygonQueryWindow.target')+
						"</h3><p class='pqTargetName'>"+
							this.targetName+
						"</p></div>";
        
    	}
    	return text;
	},

    getResultsText: function() {
    	var text=OpenLayers.i18n('polygonQueryWindow.resText.empty');
    	if (this.resultsText) {
    		text = this.resultsText;
    	}
    	return text;
    },
    
    setTargetName: function(name) {
    	this.targetName = name;
    	this.updateContent();
    },
    
    setResults: function(content) {
    	this.resultsText = content;
    	this.updateContent();
    },
    
    updateContent: function() {
    	this.mainPanel.update(this.getContent());
    }
});
