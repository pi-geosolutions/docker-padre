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
 *  class = BackupGridManager
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: BackupGridManager(config)
 *
 *  Creates a grid dedicated to manager Backups, in the layertree Manager module
 *
 */

GeoNetwork.admin.BackupGridManager = Ext.extend(Ext.grid.GridPanel, {
    //class-specific configs
	serviceBaseUrl:"",
    logWindow:null, //the place where to write logging (console)

	//Extjs grid-related configs
    columns: [
              {header: "date", width: 120, dataIndex: 'date', sortable: true},
              {id:'namecol', header: "name", width: 200, dataIndex: 'name', sortable: true}
          ],
    autoExpandColumn : "namecol",
    width: '100%',
    autoHeight:true,
    hidden:true,
    frame: true,
    title: OpenLayers.i18n('backupmanager.title'),
    iconCls: 'icon-grid',
    
	//private vars
	backupsListStore:null,
	
    /** private: method[initComponent] 
     *  Initializes the grid panel
     *  
     *  TODO : 
     */
	initComponent: function(config){
		Ext.apply(this, config);
		Ext.applyIf(this, this.defaultConfig);
		this.tbar = new Ext.Toolbar({
			items: [
			        // stick any markup in a menu
			        //'<b class="menu-title">Choose a Theme</b>',
			        {
			        	text: OpenLayers.i18n('backupmanager.tb.restore'),
			        	iconCls:'restore',
                		handler:this.restoreBackup,
                		scope : this
			        }, {
			        	text: OpenLayers.i18n('backupmanager.tb.view'),
			        	iconCls:'view',
                		handler:this.viewBackup,
                		scope : this
			        }, {
                        text: OpenLayers.i18n('backupmanager.tb.remove'),
                		iconCls:'remove',
                		handler:this.removeBackup,
                		scope : this
                    }
			        ]
		});

		this.store = new Ext.data.XmlStore({
			// store configs
			autoDestroy: true,
			storeId: 'backupsList',
			url: this.serviceBaseUrl + "/pigeo.layertree.admin.backups.list", // automatically configures a HttpProxy
			// reader configs
			record: 'record', // records will have an "record" tag
			idPath: 'id',
			//totalRecords: '@TotalResults'
			fields: [
			         'date', 'name'
			         ]
		});//not loaded on creation. Need to call backupsListGrid.getStore().load(); for that, when needed

		GeoNetwork.admin.BackupGridManager.superclass.initComponent.call(this);
	},
	load: function () {
		this.store.load();
	},
	restoreBackup: function() {
		var tree_text = this.getBackup();
		var jsonTree = Ext.decode( tree_text );
    	if (jsonTree.children!=null) {
    		treeConfig = jsonTree.children; //structure we get from DB (new version)
    	} else {
        	treeConfig = jsonTree.treeConfig;//structure we get from old layertree files
    	}
    	this.alterIDs(treeConfig);
    	var newtree = this.parent.treeReload(treeConfig, true);
    	this.log(OpenLayers.i18n('backupmanager.log.restored'));

	},
	viewBackup: function() {
		var tree_text = this.getBackup();
		var win = new Ext.Window({
        	title:OpenLayers.i18n('backupmanager.view.title'),
        	layout:'border',
            width:'70%',
            height:400,
            modal:true,
            closeAction:'close',
            maximizable:true,
            plain: true,
            items : new Ext.Panel({
            	region:'center',
            	autoScroll:true,
                html:tree_text
            })
        });
	    win.show(this);
	},
	getBackup: function() {
		var record = this.getSelectionModel().getSelected();
    	if (record==null)   return false; 
    	
    	var id = record.id;
    	var name = record.data.name;
    	var serviceurl = this.serviceBaseUrl + "/pigeo.layertree.admin.backups.get?id="+id;
    	var xml = "<id>"+id+"</id>";
    	var output={};
    	
    	var request = OpenLayers.Request.GET({
            url: serviceurl,
            async: false
        });

        var treeConfig = null;
        treeConfig = "";
        if (request.responseText) {
        	treeConfig= request.responseText ;
        } 
        return treeConfig;
	},
    removeBackup: function() {
    	var record = this.getSelectionModel().getSelected();
    	if (record==null)   return false; 
    	
    	var id = record.id;
    	var name = record.data.name;
    	var serviceurl = this.serviceBaseUrl + "/pigeo.layertree.admin.backups.remove";
    	var xml = "<id>"+id+"</id>";
    	OpenLayers.Request.POST({
		    url: serviceurl,
		    header:{"Content-Type":"text/xml"},
		    data: xml,
            success: function(response){
            	var xml = response.responseXML;
            	if (Ext.isIE) {//IE sucks with getElementsByTagsName : we skip the checkings, and it will be nice
                	this.log(OpenLayers.i18n('backupmanager.log.removed')+id+ " ("+name+")");
                    this.store.remove(record);	
            	} else {
	            	var status = xml.getElementsByTagName("removed")[0].textContent;
	            	if (status=="true") {
	                	this.log(OpenLayers.i18n('backupmanager.log.removed')+id+ " ("+name+")");
	                    this.store.remove(record);	
	            	} else {
	            		this.log(OpenLayers.i18n('backupmanager.log.removeerror')+id+ " ("+name+")");
	            	}
            	}
            },
            failure: function(response){
            	Ext.MessageBox.show({icon: Ext.MessageBox.ERROR,
                    title: OpenLayers.i18n('backupmanager.remove.errortitle'), msg:
                    OpenLayers.i18n('backupmanager.remove.errormsg'),
                    buttons: Ext.MessageBox.OK});
            },
            scope : this
    	});

    },
    /*
     * Function alterIDs : alters the ids of all the nodes of the tree, in order for the node to be considered as plain new nodes 
     * and properly saved in the DB (will not try to make an update, of a node that may not exist)
     */
    alterIDs: function(treeconf) {
    	Ext.each(treeconf, function(node, index) {
    		node.id = "x-backup-"+node.id;
    		if (node.children)	this.alterIDs(node.children);
    	}, this);
    },
    log: function(msg) {
    	if (this.parent!=null) {
    		GeoNetwork.admin.Utils.log(this.logWindow,msg);
    	}
    } 
});

/** api: xtype = gn_admin_LayerForm */
Ext.reg('gn_admin_backupgridmanager', GeoNetwork.admin.BackupGridManager);