/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

 /**
  * @include GeoExt/widgets/tree/TreeNodeUIEventMixin.js
  */
Ext.namespace("GeoExt.plugins");

/** api: (define)
 *  module = GeoExt.plugins
 *  class = ShowOnlyVisibleLayersPlugin
 */



GeoExt.plugins.ShowOnlyVisibleLayersPlugin = Ext.extend(Ext.util.Observable, {
    
    /** private: method[constructor]
     *  :param config: ``Object``
     */
    constructor: function(config) {
        Ext.apply(this.initialConfig, Ext.apply({}, config));
        Ext.apply(this, config);

        GeoExt.plugins.ShowOnlyVisibleLayersPlugin.superclass.constructor.apply(this, arguments);
    },

    /** private: method[init]
     *  :param tree: ``Ext.tree.TreePanel`` The tree.
     */
    init: function(tree) {
        tree.on({
            "rendernode": this.onRenderNode,
            "beforedestroy": this.onBeforeDestroy,
            'afterlayout':this.onActivateLayertree,
            scope: this
        });
    },
    
    /** private: method[onRenderNode]
     *  :param node: ``Ext.tree.TreeNode``
     */
    onRenderNode: function(node) {
        var layer = node.layer instanceof OpenLayers.Layer && node.layer;
        /*var ui = node.getUI();
        console.log('ui',ui);
        console.log('layervis',layer.getVisibility());
        if (layer.getVisibility())
	        ui.addClass("visible");
        else
        	ui.addClass("hidden");*/
       if (!node.rendered || !layer) {
            var ui = node.getUI();
            //console.log('ui',ui);
           //console.log('layervis',layer.getVisibility());
            //console.log(layer);
		    if ((!layer.isBaseLayer) && (!layer.getVisibility()) &&(layer.hideFromLayertreeIfUnchecked==true)) {
		    	
           //console.log('hide');
				ui.hide();
			}
			else
				ui.show();
			
		}
    },
    
    /** private: method[onRenderNode]
     *  :param panel: ``Ext.tree.TreePanel``
     */
    onActivateLayertree:function (panel) {
		nds = panel.getRootNode().childNodes[1].childNodes;
		for (var i = 0 ; i<nds.length;i++) {
			if (!nds[i].layer) continue;
			if ((!nds[i].layer.isBaseLayer) && (!nds[i].layer.getVisibility()) &&(nds[i].layer.hideFromLayertreeIfUnchecked==true)) {
				nds[i].getUI().hide();
			}
			else
				nds[i].getUI().show();
		}	
	},
    
    
    /** private: method[onBeforeDestroy]
     */
    onBeforeDestroy: function(tree) {
        tree.un("rendernode", this.onRenderNode, this);
        tree.un("beforedestroy", this.onBeforeDestroy, this);
    }

});

/** api: ptype = gx_showonlyvisiblelayersplugin */
Ext.preg("gx_showonlyvisiblelayersplugin", GeoExt.plugins.ShowOnlyVisibleLayersPlugin);
