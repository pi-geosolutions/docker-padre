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
Ext.namespace('GeoNetwork.layers');


/** api: (define)
 *  module = GeoNetwork.layers
 *  class = GeoportalAbstractLayerForm
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
/** api: constructor 
 *  .. class:: GeoportalAbstractLayerForm(config)
 *
 *  Creates an specific form, for node attributes edition 
 *  (layer parameters' edition, actually)
 *
 */

GeoNetwork.layers.GeoportalAbstractLayerForm = Ext.extend(Ext.form.FormPanel, {
    labelWidth:100,
    frame:true,
    labelAlign: 'left',
    labelWidth: 150,
    title: OpenLayers.i18n('geoportal.layer.abstract.form.title'), 
    defaultType: 'textfield',
    defaults: {width: '90%', 'hidden':false},
    autoHeight: true,
    border: false,

    logWindow:null,
    nodeFormFields : [{
        xtype: 'fieldset',
        title: OpenLayers.i18n('geoportal.layer.abstract.form.generalfs'), 
        autoHeight: true,
        layout: 'form',
        //border:false,
        collapsible:false,
        defaults: {width: '90%', 'hidden':false,xtype : 'textfield'},
        //frame:true,
    	items	: 	[{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.id'), 
    		name : 'id',
            disabled:true
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.type'), 
    		name : 'type',
            disabled:true
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.text'), 
    		name : 'text'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.opacity'), 
    		xtype : 'numberfield',
    		name : 'opacity',
    		value : 1.0,
    		maxValue : 1.0,
    		minValue : 0
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.css'), 
    		name : 'cls'
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.comments'), 
    		xtype : 'textarea',
    		name : 'qcktip',
    		height:20,
    		grow:true,
    		growMin:20,
    		growMax:200
    	},{
    		fieldLabel : OpenLayers.i18n('geoportal.layer.abstract.form.generalfs.ext'), 
    		xtype : 'textarea',
    		name : 'extensions',
    		height:20,
    		grow:true,
    		growMin:20,
    		growMax:200
    	}]
    }],
    fieldsOrder : null, //idem
    groupStore : null,
    currentNode:null,
    groupsForm:null,

    /** private: method[initComponent] 
     *  Initializes the form panel
     *  
     *  TODO : 
     */
    initComponent: function(){
    	var me=this;
    	this.buttons = [{
            text: OpenLayers.i18n('apply'), 
            //iconCls:'icon-disk',
            handler:this.applyChanges,
            scope:this
        },{
            text: OpenLayers.i18n('geoportal.layer.abstract.form.btn.cancel'), 
            handler: function(button, event) {
            	this.editNode(this.currentNode);
            },
            scope:this
        }];
    	
    	
        Ext.apply(this, this.config);
        Ext.applyIf(this, this.defaultConfig);
        GeoNetwork.layers.GeoportalAbstractLayerForm.superclass.initComponent.call(this);
                
        if (this.nodeFormFields!=null) {
        	this.Build();
        }
    },
    
    /** private: method[Build] 
     *  Builds the form itself
     *  
     *  TODO : 
     */
    Build: function() {
    	Ext.each(this.nodeFormFields, function (set, index) {
        	var fset = new Ext.form.FieldSet(set);
        	this.add(fset);
    	}, this);
    	window.fm = this;
    },
    
    buildGroupsForm: function() {
    	if (this.groupStore==null) return null;
    	
    	var groups = [];
    	var checkGroup=null;
    	//this.groupStore.sort("id");
    	this.groupStore.each( function(rec) {
    		groups.push({
	        	boxLabel: rec.data.name,
	            //inputValue:true,
	            name: "groups_"+rec.id,
	            checked:true
	        });
    	}, this);
    	checkGroup = new Ext.form.FieldSet({
    	        xtype: 'fieldset',
    	        title: OpenLayers.i18n('geoportal.layer.abstract.form.groupsfs'), 
    	        autoHeight: true,
    	        collapsible:false,
    	        layout: 'form',
    	    	defaults: {width: '90%', 'hidden':false, xtype : 'textfield'},
    	        items: [{
    	            // Use the default, automatic layout to distribute the
					// controls evenly
    	            // across a single row
    	        	id:'groupscbg',
    	            xtype: 'checkboxgroup',
    	            fieldLabel: OpenLayers.i18n('geoportal.layer.abstract.form.groupsfs.groups'), 
    	            items: groups,
    	            name:'cbgroup'
    	        }]
    	    });
    	return checkGroup;
    },

    /**
     * Loads node attributes in the form
     * 
     * TODO : 
     */
    editNode: function(source) { //accepts a treenode or a geoportail*Layer object
    	var geoplayer=this.getGeoplayer(source);
    	var node = geoplayer.getTreeNode();
    	if (this.hidden) this.show();
    	//adds the groups visibility checkbox fieldset
    	if (this.groupStore!=null && this.groupsForm==null) {
    		this.groupsForm = this.buildGroupsForm();
    		this.add(this.groupsForm);
    		this.groupsForm.show();
    		this.doLayout();
    	}
		this.groupsForm.items.items[0].setValue(Ext.pluck(node.attributes.group, "show"));
    	
    	//loads the node values in the form
    	GeoNetwork.admin.Utils.log(this.logWindow,OpenLayers.i18n('geoportal.layer.abstract.form.log.loaded')+"<i>"+node.text+"</i>");
    	this.getForm().setValues(node.attributes);
    	//this.getForm().findField("gambia").setValue(node.attributes.group[3].show);
    	this.currentNode=node;
    },
    
    /**
     * accepts a treenode or a geoportail*Layer object and 
     * returns a geoportail*layer object
     * 
     * TODO : 
     */
    getGeoplayer: function(source) {
    	var geoplayer=null;
    	if (source instanceof Ext.tree.TreeNode) {
    		//console.log("this is a Treenode source that we edit. Getting its geoportalNode parent:");
    		geoplayer = source.geoportalLayer;
    		//console.log(geoplayer);
    	} else { //we assume source is already GeoportalAbstractLayer object
    		//console.log("editing a geoplayer directly:");
    		geoplayer = source;
    		//console.log(geoplayer);
    	}
    	return geoplayer;
    },

    /**
     * Resets the form : 
     * - resets the content
     * 
     * TODO : 
     */
    initForm: function(type) {
     	this.getForm().reset();
     },
    
    /**
     * Applies the changes in the form to the node attributes & display in the tree
     * 
     * TODO : 
     */
    applyChanges: function(button, event) {
    	var node = this.currentNode;
		if (node!=null) {
			var values = this.getForm().getFieldValues();
			//collect the relevant data
			var attr={};
			window.galf = this;
			Ext.apply(attr, this.getForm().getFieldValues());
			/*Ext.iterate(values, function(key, value) {
				if (this.nodeFormFields[node.attributes.type].indexOf(key)>=0) {
					attr[key]=value;
				}
			}, this)*/
			//specifics
			if (attr.format!=null) {
				attr.format = attr.format.inputValue;
			}
			if (attr.charttype!=null) {
				attr.charttype = attr.charttype.inputValue;
			}
			attr.layer=attr.text;

			//specifics to group visibility management : 
			var checkedGroups = Ext.pluck(lm.nodeForm.groupsForm.items.items[0].items.items, "checked");
			Ext.each(node.attributes.group, function(grp, index) {
				grp.show  = checkedGroups[index];
			});
			delete attr.cbgroup;
			
			attr.qtip = attr.qcktip;
			
			//apply on node
			Ext.apply(node.attributes,attr);
			
			node.setText(attr.text);

	    	GeoNetwork.admin.Utils.log(this.logWindow,"<i>"+attr.text+"</i>"+OpenLayers.i18n('geoportal.layer.abstract.form.log.updated'));
	    }
    }
});

/** api: xtype = gn_layers_geoportalabstractlayerform */
Ext.reg('gn_layers_geoportalabstractlayerform', GeoNetwork.layers.GeoportalAbstractLayerForm);