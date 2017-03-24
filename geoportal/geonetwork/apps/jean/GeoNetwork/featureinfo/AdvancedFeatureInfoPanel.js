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

Ext.namespace('GeoNetwork.FeatureInfo');

/**
 * Class: GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel
 * AdvancedFeatureInfoPanel is an Ext.Panel that displays a listview for all
 * the results returned by the FeatureInfo control. When the user clicks
 * on an item the attributes and values will be shown.
 *
 * Inherits from:
 *  - {Ext.Panel}
 */

/**
 * Constructor: GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel
 * Create an instance of GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel
 *
 * Parameters:
 * config - {Object} A config object used to set the featureinfo
 *     panel's properties.
 */
GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel = function(config){
    Ext.apply(this, config);
    GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel.superclass.constructor.call(this);
};

Ext.extend(GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel, Ext.Panel, {

    /**
     * APIProperty: features
     * Array({<OpenLayers.Feature.Vector>}) the features
     *         returned from a GetFeatureInfo response.
     */
    features: null,

    /**
     * APIProperty: treePanel
     * {<Ext.tree.TreePanel>} shows a list of layers
     */
    treePanel: null,

    /**
     * APIProperty: infoPanel
     * {<Ext.Panel>} the panel used from showing the attributes of a feature
     */
    infoPanel: null,
    
    /**
     * APIProperty: toolBar
     * {<Ext.Toolbar>} the toolbar containing the admin buttons like "rename fields"
     */
    toolBar: null,

    /**
     * APIProperty: current
     * {<Object>} contains contextual info : the currently selected feature, the corresponding layerid
     */
    current: {
    	layerid:null,
    	feature:null
    },
    
    /**
     * APIProperty: hideValue
     * {String} value of a field label saying we don't want to display its information
     */
	hideValue : "#hide#",
	

    /**
     * Method: initComponent
     * Initialize this component.
     */
    initComponent: function() {

        GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel.superclass.initComponent.call(this);

        this.layout = 'border';

        this.treePanel = new Ext.tree.TreePanel({rootVisible: true,
            autoScroll: true});

        var root = new Ext.tree.TreeNode({text: OpenLayers.i18n("featureInfoTitle"),
            draggable:false, expanded: true, cls: 'folder'});
        this.treePanel.setRootNode(root);

        var center = {region: 'center', items: [this.treePanel], layout:'fit',split: true,
            minWidth: 100};

        this.infoPanel = new Ext.Panel({frame:false});
        this.infoPanel.on('render', function() {
            if (this.features) {
                this.showFeatures(this.features);
            }
        }, this);

        this.toolBar = new Ext.Toolbar({
        	hidden:true,
        	items:[
        	       '->',
        	       {
        	    	   text : OpenLayers.i18n('fi_manageFields'),
        	    	   handler : this.manageFields,
        	    	   scope:this
        	       }
	       ]
        });
        
        var east = {region: 'east', layout:'fit', items: [this.infoPanel], tbar:this.toolBar, split: true,
            plain: true, cls: 'popup-variant1', width: 400,
            autoScroll: true};
     
/*        if (catalogue.identifiedUser.role == "Administrator") {
        	
        }
*/
        this.add(center);
        this.add(east);
        
        this.doLayout();
                
        GeoNetwork.WindowManager.registerWindow("featureinfomanager", GeoNetwork.FeatureInfo.FeatureInfoManager, {id:"featureinfomanager",current : this.current, fieldRename:this.getTranslated});

    },

    /**
     * APIMethod: setMap
     * Set a reference to the {<OpenLayers.Map>} object
     */
    setMap: function(map) {
        this.map = map;
    },

    /**
     * Method: featureToHTML
     * Create the HTML structure for 1 feature and show this in the infoPanel
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>}
     */
    featureToHTML: function(feature) {
        var layerid = feature.gml.featureNSPrefix + ":"+feature.gml.featureType;
        this.current.layerid = layerid;
        this.current.feature = feature;
        
        var tplstring = '<table class="olFeatureInfoTable" cellspacing="1" ' +
            'cellpadding="1"><tbody>';
        for (var attr in feature.attributes) {
            if (attr) {
            	var transl = this.getTranslated(attr, feature,layerid);
            	if (transl == this.hideValue )
            		continue;
            	
                tplstring += '<tr class="olFeatureInfoRow">' +
                    '<td width="50%" class="olFeatureInfoColumn">' + this.getTranslated(attr, feature,layerid) +
                    '</td><td width="50%" class="olFeatureInfoValue">' +
                    feature.attributes[attr] + '</td></tr>';
            }
        }
        tplstring += '</tbody></table>';
        var tpl = new Ext.XTemplate(tplstring);
        tpl.overwrite(this.infoPanel.body, feature);
        if (catalogue.identifiedUser) {
        	var role = catalogue.identifiedUser.role;
        	if (role=="Administrator") {
        		this.toolBar.show();
        	} else {
        		this.toolBar.hide();
        	}
        }
    },
    
    /**
     * Method getTranslated
     * Custom function, added by Jean Pommier for the Gambian Geoportal
     * for pretty printing of the feature infos
     * 
     * Checks if some translation is available for the feature names, and 
     * if there are, replaces the attr name by its translation
     */
    getTranslated: function(attr, feature, layerid, lang) {
    	if (lang==null)
    		lang=window.catalogue.LANG;
    	if (window.Geoportal.featureinfos.translations[layerid] && window.Geoportal.featureinfos.translations[layerid][lang]) {
    		var translations = window.Geoportal.featureinfos.translations[layerid][lang];
    		if (translations[attr])
    			return translations[attr];
    	}
    	//else
    	return attr;
    },
    
    
    manageFields: function() {
    	GeoNetwork.WindowManager.getWindow("featureinfomanager").manage(this.current);
        GeoNetwork.WindowManager.showWindow("featureinfomanager");
    },

    /**
     * Method: click
     * When a tree node is clicked, show the attributes of the associated
     * feature.
     *
     * Parameters:
     * node - {<Ext.tree.TreeNode>} the node which was clicked
     */
    click: function(node) {
        if (node.attributes.features.length === 0) {
            var html = '<table class="olFeatureInfoTable" cellpadding="1" ' +
                'cellspacing="1"><tbody>';
            html += '<tr class="olFeatureInfoRow"><td colspan="2" ' +
                'class="olFeatureInfoValue">' +
                OpenLayers.i18n("FeatureInfoNoInfo") +
                '</td></tr>';
            html += '</tbody></table>';
            Ext.DomHelper.overwrite(this.infoPanel.body, html);
        }
        for (var i=0, len = node.attributes.features.length; i<len; i++) {
            var feature = node.attributes.features[i];
            this.featureToHTML(feature);
        }
    },

    /**
     * Method: clearInfoPanel
     * Clear the contents of the info panel
     */
    clearInfoPanel: function() {
        if (this.infoPanel.body) {
            Ext.DomHelper.overwrite(this.infoPanel.body, '');
        }
    },

    /**
     * Function: getLayerTitle
     * Search for the layer title to which a certain featureinfo result belongs
     *
     * Parameters:
     * featureType - {String} The name of the layer / featuretype
     *
     * Returns:
     * {String} The title of the layer if found, otherwise a blank space in HTML
     */
    getLayerTitle: function(featureType) {
        if (featureType == null) return '&nbsp';
        var layers = this.map.getLayersByClass('OpenLayers.Layer.WMS');
        for (var i=0, len=layers.length; i<len; i++) {
            if (layers[i].params.LAYERS instanceof Array) {
                if (OpenLayers.Util.indexOf(layers[i].params.LAYERS, featureType) !== -1) {
                    return layers[i].name;
                }
            } else {
                if (layers[i].params.LAYERS.indexOf(featureType) !== -1) {
                    return layers[i].name;
                }
            }
        }
    },

    /**
     * APIMethod: showFeatures
     * Show the features in the feature info panel, clears any previous
     *     features.
     *
     * Parameters:
     *     features - Array({<OpenLayers.Feature.Vector>} the features
     *         returned from a GetFeatureInfo response.
     */
    showFeatures: function(features) {
        this.clearInfoPanel();
        var root = this.treePanel.getRootNode();
        while(root.firstChild){
            root.removeChild(root.firstChild);
        }
        // group based on feature.type
        var i, len, featureList = [];
        for (i=0, len=features.length; i<len; i++) {
            var found = false;

            var featureType = "";
            if (features[i].type) {
                featureType = features[i].type;
            } else if (features[i].gml && features[i].gml.featureType) {
                featureType = features[i].gml.featureType;
            }

            for (var j=0; j<featureList.length; j++) {
                if (featureList[j].title === featureType) {
                    featureList[j].features.push(features[i]);
                    found = true;
                }
            }
            if (found === false) {
                featureList.push({title: this.getLayerTitle(featureType), features: [features[i]]});
            }
        }
        for (i=0, len = featureList.length; i<len; i++) {
            // get title based on feature.type
            var node = new Ext.tree.TreeNode({text: featureList[i].title,
                features: featureList[i].features});
            node.addListener("click", this.click, this);
            root.appendChild(node);
            if (i === 0) {
                root.expand();
                this.click(node);
                this.treePanel.getSelectionModel().select(node);
            }
        }
        root.expand();
    }

});

Ext.reg('gn_advfeatureinfo', GeoNetwork.FeatureInfo.AdvancedFeatureInfoPanel);