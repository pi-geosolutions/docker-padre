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
 *  class = LayertreeManagerPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: LayertreeManagerPanel(config)
 *
 *  Create a GeoNetwork layertree manager panel
 *  to view, order, edit or add nodes in the geoportal widget's layers tree
 *
 */
//Overrides
Ext.tree.TreePanel.nodeTypes.gx_layer = Ext.tree.TreeNode;
Ext.tree.TreePanel.nodeTypes.gx_baselayercontainer = Ext.tree.TreeNode;


GeoNetwork.admin.LayertreeManagerPanel = Ext.extend(Ext.Panel, {
    frame: false,
    defaultConfig: {
        title: OpenLayers.i18n('ltmanager.title'),
        defaultViewMode: 'simple',
        border: false,
        height: 800,
        layout:'border',
        autoWidth : true
    },
    catalogue:null,
    treeView:null,
    detailView:null,
    consoleView : null,
    //deals with Layertree IO features : load, save, export...
    layertreeio : null,
    tree:null, 
    tb:null,
    nodeForm:null,
    backupsListGrid:null,
    groups:null,
    useGroups:true,
/*    nodeFormFields : {
    	'chart':['gambia','id', 'type','text', 'uuid','legend','source', 'opacity', 'tablenames', 'changeScales', 'charting_fields', 'other_fields', 'format', 'cls', 'qtip', 'context', 'template', 'extensions'],    	
    	'wms':['gambia','id', 'type','text', 'uuid', 'legend', 'url', 'layers', 'opacity', 'format', 'TILED', 'cls', 'qtip', 'extensions'],
    	'folder':['gambia','id', 'type', 'text', 'cls', 'extensions']
    },
    fieldsOrder : ['id', 'type', 'uuid', 'text', 'url', 'source', 'layers', 'opacity', 'format', 'TILED','legend',
                   'tablenames', 'changeScales', 'charting_fields', 'other_fields','context', 'template',
                   //'expanded', //suppressed : will be managed in the tree panel
                   'cls', 'qtip', 'extensions'],    	
  */  
    /** private: method[initComponent] 
     *  Initializes the layertree manager panel.
     *  
     */
    initComponent: function(config){
    
        Ext.apply(this, config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.admin.LayertreeManagerPanel.superclass.initComponent.call(this);
                
        // Build the layout
        this.detailView = new Ext.Panel({
            region: 'east',
            split: true,
            collapsible: true,
            collapsed: false,
            hideCollapseTool: true,
            collapseMode: 'mini',
            autoScroll: true,
            minWidth: 250,
            width: '60%',
            items: []
        });
        this.tb = this.getToolbar();
        this.treeView = new Ext.Panel({
                region: 'center',
                split: true,
                autoScroll: true,
                minHeigth: 300,
                items: null,
                tbar:this.tb
            });
        this.consoleView = new Ext.Panel({
                region: 'south',
                split: true,
                collapsible: true,
                collapsed: false,
                hideCollapseTool: true,
                collapseMode: 'mini',
                autoScroll: true,
                minHeight: 50,
                height: 100,
                html: OpenLayers.i18n('ltmanager.console.html')
            });
        
        this.add(this.detailView);
        this.add(this.consoleView);
        this.add(this.treeView);

        
        this.tree = this.loadTree(null, false);
        if (this.tree!=null)
        	this.treeView.add(this.tree);
        

    	if (this.useGroups) 
    		this.getGroups();
        
        window.lm = this;
        window.lays=[];
    },
    /**
     * Load layertree data in an Ext.tree
     * 
     * TODO : 
     */
    loadTree: function(specificConfig,doOverwrite) { //default : specificConfig=null, overwrite=false
		var treepanel=this.getLayertreeIO().loadTree(specificConfig, false);
		if (treepanel==null) {
			var errmsg = "ERROR : couldn't load the layertree. Some of the changes you recently made must cause the problem. "+
			"Most likely you have used improper characters, like doublequotes, where you weren't expected to. " +
			"You are advised to restore a previous backup and try again. If you can't solve it, please contact your administrator.\n";
			//console.log(errmsg);
			treepanel = new Ext.Panel({
		        border: false,
		        layout:'fit',
                html: errmsg
            });
			//setTimeout(function() {GeoNetwork.admin.Utils.log(this.consoleView, errmsg);}, 3000);
		} else {
			treepanel.addListener('click', function(node, event){
								                this.editNode(node);
								            }, this);
		}
	    return treepanel;
    },
    
    /**
     * Builds the form dynamically using the nodeFormFields listed fields, 
     * in the order given by fieldsOrder array
     * 
     * TODO : 
     */
    loadForm: function(layer) {
    	//clear
    	this.detailView.remove(this.nodeForm);
    	if (this.nodeForm) this.nodeForm.destroy();
    	
    	//then replace
    	if (this.useGroups == false) this.groups=null;
    	this.nodeForm = layer.getForm({
    		groupStore : this.groups,
    	    logWindow:this.consoleView
    	});
    	//console.log(this.nodeForm);
    	this.detailView.add(this.nodeForm);
        this.detailView.doLayout();
    },
    /**
     * Gets the groups list, to use in the form, in order to define per-node group access rights
     * 
     * TODO : 
     */
    getGroups: function() {
        var lang = catalogue.lang;
        this.groups = GeoNetwork.data.GroupStore(catalogue.services.getGroups);
        this.groups.load({
        	callback 	: function(r, opts, success) {
				            	if (success) {
				            		GeoNetwork.admin.Utils.log(this.consoleView,OpenLayers.i18n('ltmanager.console.loadsuccessful'));
				            		this.useGroups = true;
				            	} else {
				            		GeoNetwork.admin.Utils.log(this.consoleView,OpenLayers.i18n('ltmanager.console.loadfailure'));
				            		this.useGroups = false;
				            		return ;
				            	}
				            },
        	scope		: this
        });

    	this.groups.sort("id");
    },
    
    
    /**
     * Displays the layertree as text, in a popup window
     */
    tree2json: function() {
    	this.getLayertreeIO().tree2json(this.tree);
    },
    /**
     * Prompts for the content of a layertree.js and loads as the layertree
     */
    json2tree: function() {    	
    	this.getLayertreeIO().json2tree(this.treeReload, this);
    },
    /**
     * Reloads the tree structure from DB
     */
    treeReload: function(specificConfig, overwrite) { //default : specificConfig=null, overwrite=false
    	var newtree = this.loadTree(specificConfig, overwrite);
    	if (newtree!=null) {
    		if (this.tree!=null) {
    	    	this.treeView.remove(this.tree);
    	    	this.tree.destroy();
    		}
	    	this.tree = newtree;
	    	this.treeView.add(newtree);
	    	this.treeView.doLayout();
	    	GeoNetwork.admin.Utils.log(this.consoleView,OpenLayers.i18n('ltmanager.console.reloadsuccessful'));
	    	if (this.nodeForm)
	    		this.nodeForm.hide();
    	} else {
    		GeoNetwork.admin.Utils.log(this.consoleView,OpenLayers.i18n('ltmanager.console.reloadfailure'));
    	}
    },
    /**
     * Restores the tree structure from DB backup table
     */
    createBackupsGrid: function() {
    	var backupsListGrid = new GeoNetwork.admin.BackupGridManager({
    		serviceBaseUrl:this.serviceBaseUrl,
    		hidden:true,
    		parent:this,
    		logWindow:this.consoleView
    	});
    	return backupsListGrid;
    },
    treeRestore: function() { 
    	if (this.nodeForm)
    		this.nodeForm.hide(); //we hide the panel without destroying it
    	if (!this.backupsListGrid)
    		this.backupsListGrid = this.createBackupsGrid();
    	
    	this.backupsListGrid.load();
    	if (!this.detailView.items.contains(this.backupsListGrid)) {
            this.detailView.add(this.backupsListGrid); //add only once. We had to wait for its store to be loaded, before appending to parent container
    	}
    	this.backupsListGrid.show();
    	this.detailView.doLayout()
        return true;
    },

    addFolder: function() {
    	var layer = new GeoNetwork.layers.GeoportalFolderLayer();
    	this.addNode(layer);
    },
    
    addWMS: function() {
    	var layer = new GeoNetwork.layers.GeoportalWMSLayer();
    	window.lays.push(layer);
    	this.addNode(layer);
    },
    
    addChart: function() {
    	var layer = new GeoNetwork.layers.GeoportalChartLayer();
    	this.addNode(layer);
    },
    addNode: function(lay) {
    	var node = this.tree.getSelectionModel().getSelectedNode();
    	if (node==null) {
    		Ext.Msg.alert(OpenLayers.i18n('ltmanager.actions.addnode'), OpenLayers.i18n('ltmanager.actions.addnode-warning'));
    		return false;
    	}
    	if (node.leaf) { //we can add a node only to a folder. We will thus use its parent node (the closest folder)
    		node = node.parentNode;
    	}
    	var child = lay.getTreeNode();
     	node.appendChild(child);
     	//selects and loads the node in the edit form
     	this.tree.getSelectionModel().select(child);
        this.editNode(lay);
    	return true;
    },
    editNode:function(source) {
    	var geoplayer=null;
    	if (this.backupsListGrid)
    		this.backupsListGrid.hide();
    	if (source instanceof Ext.tree.TreeNode) {
    		//console.log("this is a Treenode source that we edit. Getting its geoportalNode parent:");
    		geoplayer = source.geoportalLayer;
    		//console.log(geoplayer);
    	} else { //we assume source is already GeoportalAbstractLayer object
    		//console.log("editing a geoplayer directly:");
    		geoplayer = source;
    		//console.log(geoplayer);
    	}
    	if (geoplayer!=null) {
    		this.loadForm(geoplayer);
        	this.nodeForm.show();
            this.nodeForm.editNode(geoplayer);
    	}
    },
    
    removeNode: function() {
    	var node = this.tree.getSelectionModel().getSelectedNode();
    	if (node==null) {
    		Ext.Msg.alert(OpenLayers.i18n('ltmanager.actions.warning-select'));
    		return false;
    	}
    	var msg  =OpenLayers.i18n('ltmanager.actions.delnode-warningl1')+node.text;
    	if (node.hasChildNodes()) {
    		msg += OpenLayers.i18n('ltmanager.actions.delnode-warningl2');
    	}
    	Ext.MessageBox.show({
    		icon: Ext.MessageBox.WARNING,
            title: OpenLayers.i18n('ltmanager.actions.delnode'), 
            msg: OpenLayers.i18n(msg),
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function(btn) {
            	if (btn=='ok') {
            		node.remove(true);
            		GeoNetwork.admin.Utils.log(this.consoleView,OpenLayers.i18n('ltmanager.actions.delnode-removed')+node.text);
            	}
            },
            scope:this
        });
    	return true;
    },
    duplicateNode: function() {
    	var node = this.tree.getSelectionModel().getSelectedNode();
    	if (node==null) {
    		Ext.Msg.alert(OpenLayers.i18n('ltmanager.actions.warning-select'));
    		return false;
    	}
    	var parent = node.parentNode;
    	var geoplayer = node.geoportalLayer.cloneConfig();

    	if (geoplayer!=null) {
        	var newnode = geoplayer.getTreeNode();
        	parent.appendChild(newnode);
         	//selects and loads the node in the edit form
         	this.tree.getSelectionModel().select(newnode);
    		this.loadForm(geoplayer);
        	this.nodeForm.show();
            this.nodeForm.editNode(geoplayer);
    	}
    	/*var parent = node.parentNode;
    	var tpl = GeoNetwork.admin.Utils.clone(node.attributes);
    	delete tpl.id; //it needs a new id, generated by extjs will be fine (as for added nodes)
    	tpl.text = tpl.text+" (copy)";
    	var child = new Ext.tree.TreeNode(tpl);
    	parent.appendChild(child);
     	//selects and loads the node in the edit form
     	this.tree.getSelectionModel().select(child);
        this.editNode(child);*/
    	
    	return true;
    },
    
    getToolbar: function() {
    	//TREE actions
       	var action_2json = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.exportjson'),
    		iconCls:'export',
    		handler: this.tree2json,
    	    itemId: 'tree2json',
    	    scope:this
    	});
       	var action_import = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.importjson'),
    		iconCls:'import',
    		handler: this.json2tree,
    	    itemId: 'json2tree',
    	    scope:this
    	});
    	var action_save = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.savetodb'),
    		iconCls:'save',
    		handler: function() {
    			Ext.MessageBox.prompt(OpenLayers.i18n('ltmanager.actions.savetodb.givenamet'), 
    									OpenLayers.i18n('ltmanager.actions.savetodb.givename'), 
    									function(btn, text) {
    				this.getLayertreeIO().treeSave(this.tree, text, false, this.treeReload, this);
    			},this);
    		},
    	    itemId: 'treesave',
    	    scope:this
    	});
    	var action_reload = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.reload'),
    		iconCls:'reload',
    		handler: function() {
    			this.treeReload(null, false);
    		},
    	    itemId: 'treereload',
    	    scope:this
    	});
    	var action_restore = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.restore'),
    		iconCls:'restore',
    		handler: this.treeRestore,
    	    itemId: 'treerestore',
    	    scope:this
    	});
        var tree_menu = new Ext.menu.Menu({
            id: 'mainMenu',
            items: [
                    action_save,
                    action_reload,
                    action_2json,
                    action_import,
                    action_restore
            ]
        });
        //ADD actions
    	var action_addfolder = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.add.folder'),
    		iconCls:'folder',
    		handler: this.addFolder,
    	    itemId: 'addfolder',
    	    scope:this
    	});
    	var action_addwms = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.add.wms'),
    		iconCls:'wms',
    		handler: this.addWMS,
    	    itemId: 'addwms',
    	    scope:this
    	});
    	var action_addchart = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.add.chart'),
    		iconCls:'chart',
    		handler: this.addChart,
    	    itemId: 'addchart',
    	    scope:this
    	});
        var add_menu = new Ext.menu.Menu({
            id: 'addMenu',
            items: [
                    action_addfolder,
                    action_addwms,
                    action_addchart
            ]
        });
        //REMOVE actions
    	var action_remove = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.remove'),
    		iconCls:'remove',
    		handler: this.removeNode,
    	    itemId: 'removenode',
    	    scope:this
    	});
        //DUPLICATE actions
    	var action_duplicate = new Ext.Action({
    		text:OpenLayers.i18n('ltmanager.actions.duplicate'),
    		iconCls:'duplicate',
    		handler: this.duplicateNode,
    	    itemId: 'duplicatenode',
    	    scope:this
    	});



        var tb = new Ext.Toolbar();
        tb.add({
	            text:OpenLayers.i18n('ltmanager.menu.tree'),
	            iconCls: 'tree',  // <-- icon
	            menu: tree_menu  // assign menu by instance
	        },{
	            text:OpenLayers.i18n('ltmanager.menu.add'),
	            iconCls: 'add',  // <-- icon
	            menu: add_menu  // assign menu by instance
	        },
	        action_remove,
	        action_duplicate
        );
        return tb;
    },
    
    getLayertreeIO : function() {
    	if (!this.layertreeio) {
    		//deals with Layertree IO features : load, save, export...
            this.layertreeio = new GeoNetwork.admin.LayertreeIO({
            	serviceBaseUrl : this.serviceBaseUrl,
            	verbose:true,
            	logWindow:this.consoleView
            });
    	}
    	return this.layertreeio;
    },
    /**
     * Utils
     * */
    clone: function(obj) {
    	var newobj = {};
    	return Ext.apply(newobj, obj);
    }

});

/** api: xtype = gn_admin_LayertreeManagerPanel */
Ext.reg('gn_admin_layertreemanagerpanel', GeoNetwork.admin.LayertreeManagerPanel);