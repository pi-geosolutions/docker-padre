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
 *  class = TreeNodeIconsPlugin
 */



GeoExt.plugins.TreeNodeIconsPlugin = Ext.extend(Ext.util.Observable, {
    
    /** private: method[constructor]
     *  :param config: ``Object``
     */
    constructor: function(config) {
        Ext.apply(this.initialConfig, Ext.apply({}, config));
        Ext.apply(this, config);

        GeoExt.plugins.TreeNodeIconsPlugin.superclass.constructor.apply(this, arguments);
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

      /*  if (a.layer.uuid!=null && a.layer.uuid!="") {
        	console.log(a.layer.uuid + "  " +a.layer.name);
        }
        */
        //console.log(node);
        /*if (node.attributes.checked) 
    	{
        	console.log(node);
    	}*/
		var emplacement = node.ui.iconNode;

		//Layer type icon
		node.ui.iconNode.className += " x-tree-node-icon-"+a.layer.type;
		//node.iconCls = "x-tree-node-icon-chart";
		//this.insertIcon(emplacement, a.layer.uuid, "hasMtd");
		
		emplacement = node.ui.indentNode;
		//Metadata icon
		this.insertIcon(emplacement, a.layer.uuid, "hasMtd");
		
		//Polygon query icon
		if (a.layer.pq!=null) {
			this.insertIcon(emplacement, a.layer.pq.pq_layer, "isPQueryable");
		}
		
		//Queryable icon
		this.insertIcon(emplacement, a.layer.queryable, "isQueryable");
    },
    
    insertIcon: function(where, variable, label) {
		var icon_cls = "none";
		if (variable!=null && variable!="") {
			icon_cls = label;
        }
		//console.log(where);
		Ext.DomHelper.insertBefore(where, '<img src="'+Ext.BLANK_IMAGE_URL+'" class="treenodeIconsPlugin_'+icon_cls+'" alt="'+OpenLayers.i18n(label)+'" title="'+OpenLayers.i18n(label)+'">');

    },
    
    /** private: method[onBeforeDestroy]
     */
    onBeforeDestroy: function(tree) {
        tree.un("rendernode", this.onRenderNode, this);
        tree.un("beforedestroy", this.onBeforeDestroy, this);
    }

});

/** api: ptype = gx_foldablelegendplugin */
Ext.preg("gx_treenodeiconsplugin", GeoExt.plugins.TreeNodeIconsPlugin);
