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
Ext.namespace('GeoNetwork.admin');


/** api: (define)
 *  module = GeoNetwork.admin
 *  class = GeoportalTreeLoader
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: GeoportalTreeLoader(config)
 *
 *  Custom tree loader
 *
 */

GeoNetwork.admin.GeoportalTreeLoader = Ext.extend(Ext.tree.TreeLoader, {
	//used to deal with concurrent writes : overwrite is false by default
	overwrite:false,
    
    initComponent: function(config){
        GeoNetwork.admin.GeoportalTreeLoader.superclass.initComponent.call(this);
    },
    
    // this below is using the config attributes of the node to do
	// some testing. The attr.has_events is coming from the loader in PHP
	createNode: function(attr) {
		var geoplayer=null;
		switch(attr.type) {
			case 'folder':
				geoplayer = new GeoNetwork.layers.GeoportalFolderLayer();
				break;
			case 'wms': 
				geoplayer = new GeoNetwork.layers.GeoportalWMSLayer();
				break;
			case 'chart':
				geoplayer = new GeoNetwork.layers.GeoportalChartLayer();
				break;
			default:
				geoplayer = new GeoNetwork.layers.GeoportalAbstractLayer();
		}
		var config = geoplayer.fixNodeConfig(attr);
		
/*		if (attr.layer && attr.text==null) { //deals with importing old-style layertree.js file
			attr.text = attr.layer;
			attr.leaf=true;
			if (attr.TILED==null && attr.type=="wms") attr.TILED=true;
		}
		if (attr.checked==null && attr.leaf==true) {
			attr.checked = false;
		}
		if (attr.type!='folder' && attr.type!=null) {
			attr.leaf=true;
		} else {
			attr.leaf=false;
			if (attr.children==null) { //empty folder
				//console.log(attr.text);
				attr.loaded=true;
				attr.expanded=true;
				//attr.cls='grey x-tree-node-collapsed';
				attr.iconCls='emptyFolder';
			}
		}
		if (attr.leaf!=true && attr.type==null) {
			//console.log(attr);
			attr.type='folder';
		}    	//fixes some node values
		
		attr.draggable=true;
		if (this.overwrite==true) {
			attr.id = null;
		}
*/		
		var node = Ext.tree.TreeLoader.prototype.createNode.call(this, config);
		//we set a bidirectional link
		geoplayer.treeNode = node;
		node.geoportalLayer=geoplayer;
		/*if (attr.type=='folder' && attr.children==null) //this works too
			node.setCls('grey x-tree-node-collapsed');*/
		return node;
	}
});

/** api: xtype = gn_admin_geoportaltreeloader */
Ext.reg('gn_admin_geoportaltreeloader', GeoNetwork.admin.GeoportalTreeLoader);