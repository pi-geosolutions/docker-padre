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
 *  class = FoldableLegendPlugin
 */



GeoExt.plugins.FoldableLegendPlugin = Ext.extend(Ext.util.Observable, {
    
    /** private: method[constructor]
     *  :param config: ``Object``
     */
    constructor: function(config) {
        Ext.apply(this.initialConfig, Ext.apply({}, config));
        Ext.apply(this, config);

        GeoExt.plugins.FoldableLegendPlugin.superclass.constructor.apply(this, arguments);
    },

    /** private: method[init]
     *  :param tree: ``Ext.tree.TreePanel`` The tree.
     */
    init: function(tree) {
        tree.on({
            "rendernode": this.onRenderNode,
            "beforedestroy": this.onBeforeDestroy,
            //'afterlayout':function(a,b) { console.log('done');},
            scope: this
        });
    },
    
    /** private: method[onRenderNode]
     *  :param node: ``Ext.tree.TreeNode``
     */
    onRenderNode: function(node) {
        var a = node.attributes;
        if (node.layer) {a.layer=node.layer;}
	    if (a.layer && ((a.layer.params && a.layer.params.LAYERS) || a.layer.legend)) {
	    	//console.log(node.ui);
			var emplacement = node.ui.iconNode;
			/**************Ajoute interactivité sur le clic / icone de la couche : si l'uuid geonetwork est connu, on ouvre la fiche de mtd en guise d'infos sur la donnée *******/
			/*Ext.fly(node.ui.iconNode).on({
			    "click": function() {
			    	//console.log('oups, pas de mtd');
					var uuid = node.attributes.uuid||node.layer.metadata_uuid;
					if (uuid) {
						gn_showSingleMetadataUUID(uuid);
					}
			    },
			    scope: this
			});*/
			/**************Et on insère la fenêtre (fold/unfold) de la légende déroulable ***************************************************/
			Ext.DomHelper.insertAfter(emplacement, '<img src="'+Ext.BLANK_IMAGE_URL+'" class="gx_legend_trigger" alt="'+OpenLayers.i18n("showLegend")+'" title="'+OpenLayers.i18n("showLegend")+'">');
			node.addListener('click', function(target, event) {
				if (event.getTarget('.gx_legend_trigger', 1)) {
					this.toggleLegend(target);
				}
			}, this);
		} 
        
    },
    
    
    toggleLegend: function (node) {
    	var layer;
    	//console.log("node",node);
        if (node) {
            layer = node.attributes.layer;
            if (layer) {
            	if (typeof(node.legendVisible)=='undefined') { // the legend has not yet been loaded
            		var url="";
            		if (layer.legend) { //if legend url is defined in layertree config
            			url = layer.legend;
            		} else { //else, we load it from geoserver
            			try {
    				    	var url= layer.getFullRequestString({
    				           REQUEST: "GetLegendGraphic",
    				           WIDTH: null,
    				           HEIGHT: null,
    				           EXCEPTIONS: "application/vnd.ogc.se_xml",
    				           LAYER: layer.params.LAYERS,
    				           LAYERS: null,
    				           STYLE: null,
    				           STYLES: null,
    				           SRS: null,
    				           FORMAT: "image/png",
    				           LEGEND_OPTIONS:"fontName:Times%20New%20Roman;dpi:90;fontAntiAliasing:true"
    						});

            				//console.log(url);
            			} catch (err) {
    						OpenLayers.Console.log("no legend available for this data");
    					}
            		}
            		if (url!=='') {
            			var emplacement = node.ui.textNode;
    			    	Ext.DomHelper.insertAfter(emplacement, ['<div class="ext-ux-treenode-legend"><p>'+OpenLayers.i18n("legend:")+' </p><img src="'+url+'" /></div>'].join(""));
    					node.legendVisible=true;
    					window.currentNode=node;
    					var elt = Ext.DomQuery.selectNode("div.ext-ux-treenode-legend", node.ui.elNode);
    					Ext.fly(elt).alignTo(node.ui.checkbox, "tl-tl", [0, 18]);
            		}
            	} else if (node.legendVisible===true) {
            		var elt = Ext.DomQuery.selectNode("div.ext-ux-treenode-legend", node.ui.elNode);
            		if (elt!==null) { 
            							Ext.DomHelper.applyStyles(elt, {display:'none'});
            							node.legendVisible=false;
        							}
            	} else if (node.legendVisible===false) {
            		var elt = Ext.DomQuery.selectNode("div.ext-ux-treenode-legend", node.ui.elNode);
            		if (elt!==null) { 
            							Ext.DomHelper.applyStyles(elt, {display:'block'});
            							node.legendVisible=true;
        							}
            	}
            	Ext.fly(Ext.DomQuery.selectNode('img[class*=gx_legend_trigger]', node.ui.elNode)).toggleClass("legendVisible");
            	
            } else {
                Ext.MessageBox.alert(OpenLayers.i18n("Pb"),
                    OpenLayers.i18n("Problem with function toggleLegend... (2)"));
            }
        } else {
             Ext.MessageBox.alert(OpenLayers.i18n("Pb"),
                    OpenLayers.i18n("Problem with function toggleLegend..."));
        }
    	
    },
    
    /** private: method[onBeforeDestroy]
     */
    onBeforeDestroy: function(tree) {
        tree.un("rendernode", this.onRenderNode, this);
        tree.un("beforedestroy", this.onBeforeDestroy, this);
    }

});

/** api: ptype = gx_foldablelegendplugin */
Ext.preg("gx_foldablelegendplugin", GeoExt.plugins.FoldableLegendPlugin);
