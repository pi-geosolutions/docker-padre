/**
 * Copyright (c) 2012 jean Pommier, jean.pommier@ige.fr
 * 
 * Published under the GPL license
 */

Ext.namespace("GeoNetwork");

GeoNetwork.PratiquesGDTPanel = Ext.extend(Ext.Panel, {
	panels_center:null,
	panels_west:null,
	panels_north: null,
	
	zae_url 			: null,
	pratiquesAppState	: {
			zae_id			: null,
			url				: null,
			buttons			: [],
			lat				: null,
			lon				: null,
			current_index	: null,
			current_button	: null,
			current_config	: null
	},
	
    initComponent: function(){
    	window.Geoportal.DashBoard.pratiquesapp = this;
        GeoNetwork.PratiquesGDTPanel.superclass.initComponent.call(this);
        this.layout = 'border';
    	this.border = false;
    	
    	this.pratiquesAppState.lat = this.lat;
    	this.pratiquesAppState.lon = this.lon;
    	
    	this.panels_center = new Ext.Panel({
			region: 'center', 
			layout: 'fit', 
            padding:'5',
			html		: this.text_intro,
            border : false,
            minWidth: 300,
            autoScroll:true
        });

    	this.panels_west = new Ext.Panel({
    		region: 'west',     		
    		layout:'vbox',
            border : false,
            padding:'5',
            align:'stretch',
    		defaults: {margins : '0 0 5 0'},
    		items: this.loadActions(), 
    		plain:true,
    		width:100
		});
    	
    	this.panels_north = new Ext.Panel({
    		region: 'north',     		
    		layout:'fit',
            border : false,
            padding:'5',
            html: 'Ecosystème ',
            cls: 'greyed',
    		plain:true,
    		width:100
		});

        this.add(this.panels_center);
        this.add(this.panels_west);
        this.add(this.panels_north);

        this.doLayout();
        
        this.addEvents(
            /** private: event[aftermapmove]
             *  Fires after the map is moved.
             */
           // "aftermapmove"
        );
        if (this.pratiquesAppState.lat && this.pratiquesAppState.lon) {
        	this.updateContent();
        }
    },
    
    updateContent: function() {
    	var url = this.zae_url+"lat="+this.pratiquesAppState.lat+"&lon="+this.pratiquesAppState.lon;
    	this.pratiquesAppState.url=url;
        var zae_store = new Ext.data.JsonStore({ //JsonP isn't instanciated in ext3.4 core (exists in ux...)
		    /*proxy: {
		        type: 'json',
		        url : url,
		        reader: {
		            type: 'json',
		            root: 'data',
	           		idProperty: 'id'
		        }
		    },*/
	        url : url,
		    root: 'data',
       		idProperty: 'id',
			fields: [{name:'id', type: 'string'}, {name:'name', type:'string'}]
		});

        zae_store.load({
        	scope:this,
        	callback: function(records, operation, success) {
        		if (success && records.length>0) {
        			var data = records[0].data;
                    var tpl = new Ext.Template( // We update he north' elements info
                        '<p>Ecosystème : {name}</p>'
                    );
                    tpl.overwrite(this.panels_north.body, data);
                    
        			this.pratiquesAppState.zae_id = data.id; //we update the zae_id for the panel
         			this.setMainPanel(); //we update the main content, because of the zae_id change
        		}
        	}
        });
    },

    loadActions: function() {
    	var pratiquespanel = this;
    	var actionCollection = [];
    	Ext.each(this.actionsConfig, function(action, idx, config) {
    		var button = new Ext.Button({
    			text 			: action.text,
    			iconCls 		: action.icon,
    			scale			: 'large',
    			width			:"100%",
    			margins			: '5',
    			flex			: 1,
    			toggleGroup		: 'pratiquesgdt',
    			enableToggle 	: true,
    			pressed			: false,
    			buttonIdx		: idx, //custom var
    			handler: function(button, event){
    				if (button.pressed) {
    					this.pratiquesAppState.current_button = button;
        				this.pratiquesAppState.current_index = idx;
        				this.pratiquesAppState.current_config = action;
                        this.setMainPanel();
    				} else {
    					this.pratiquesAppState.current_button = null;
        				this.pratiquesAppState.current_index = null;
        				this.pratiquesAppState.current_config = null;
    					this.reset();
    				}
    				
                },
                scope:pratiquespanel
    		});
    		this.pratiquesAppState.buttons.push(button);
    	}, this);
    	return this.pratiquesAppState.buttons;
    },
    
    /*
     * Called by mother app, Dashboard's setLonLat function
     */
    setLonLat: function(lon, lat) {
    	this.lat = lat;
    	this.lon = lon;
    	this.pratiquesAppState.lat = lat;
    	this.pratiquesAppState.lon = lon;
    	this.updateContent();
    },
    
    setMainPanel: function() {
    	var button = this.pratiquesAppState.current_button;
    	var config = this.pratiquesAppState.current_config;
    	if (!button || !config) {
    		return false; //ie we are on the intro content. No button activated.
    	}
    	var idx = button.buttonIdx;
    	if (!button.pressed) {
    		this.reset();
    	} else {
    		this.reset();
    		this.panels_center.load({
    			url: config.url+'id='+this.pratiquesAppState.zae_id,
			    /*method: 'GET',
			    params: {
			        id: this.pratiquesAppState.zae_id
			    },*/
			    text : 'Chargement en cours...'
    		});
			/*var tpl = new Ext.XTemplate(
		            '<h1>{text}</h1>',
		            '<div id="pratGdtContent">&nbsp;</div>'
		        );
			tpl.overwrite(this.panels_center.body, config);*/
			/*Ext4.Ajax.request({
				cors:true, //allows cross domain request
			    url: config.url,
			    method: 'GET',
			    params: {
			        id: this.pratiquesAppState.zae_id
			    },
			    success: function(response){
			        var text = response.responseText;
			        console.log(response);
			        // process server response here
			    },
			    failure: function() {
			    	console.log("et merde");
			    }
			});*/
			
	       /* var panel_store = new Ext4.data.JsonStore({ //JsonP isn't instanciated in ext3.4 core (exists in ux...)
			    proxy: {
			        type: 'jsonp',
			        url : config.url+"id="+this.pratiquesAppState.zae_id,		
			        reader: {
			            type: 'json',
			            root: 'data',
		           		idProperty: 'title'
			        }
			    },
				fields: [{name:'title', type: 'string'}, {name:'text', type:'string'}]
			});
	        panel_store.load({
	        	scope:this,
	        	callback: function(records, operation, success) {
	        		if (success && records.length>0) {
	        			var data = [];
	        			Ext.each(records, function(record, idx, records) {
	        				data.push(record.data);
	        			});
	        			var tpl = new Ext.XTemplate(
	        		            '<h1>'+config.text+'</h1>',
	        		            '<table>',
	        		            '<tpl for=".">',      
	        		            	'<tr><td class="title">{title}</td><td class="text">{text}</td></tr>',  
	        		            '</tpl>',
	        		            '</table>'
	        		        );
	        			tpl.overwrite(this.panels_center.body, data);
	        	        
	        		}
	        	}
	        });*/
			//Ext.get("pratGdtContent").dom.innerHTML = "coucoucocu";
			this.panels_center.doLayout();
			
    	}
    },
    
    reset: function() {
    	if (this.panels_west.findById('optionsPanel')!==null) {
        	this.panels_west.remove('optionsPanel');
    	}
    	this.panels_center.update(this.text_intro);
    	this.doLayout();
    }
});


/** api: xtype = gx_PratiquesGDTPanel */
Ext.reg('gn_gdtpanel', GeoNetwork.PratiquesGDTPanel); 


GeoNetwork.PratiquesGDTPanel.openFichePratique = function(idpratique, modal) {
	var pratiqueww = new Ext.Window({
		title: "Fiche de pratique GDT",
		width:600,
		height:400,
		modal:modal?modal:true,
		layout:'border',
		maximizable:true,
		autoScroll:true
	});
	var panel = new Ext.Panel({
		html:"Erreur : impossible de charger la fiche...",
		autoScroll:true,
		border:false,
		region:'center'
	});
	var panel_north = new Ext.Panel({
		html:"<h1>Fiche de pratique GDT</h1>",
		border:false,
		padding : 5,
		height : 35,
		region:'north'
	});
	pratiqueww.add(panel);
	pratiqueww.add(panel_north);
	pratiqueww.show();

	window.Geoportal.DashBoard.fichepanel = panel;
	panel.load({
		url: window.Geoportal.DashBoard.fichesPratiquesURL,
	    method: 'GET',
	    params: {
	        id: idpratique
	    },
	    text : 'Chargement en cours...',
	    callback: function() {
	    	var tabs = new Ext.TabPanel({
	    	    activeTab: 0,
	    	    renderTo: 'tabs',
	    	    cls: "fichePratiquesTabs",
	    		border:false,
	    	    items:[
	    	        {contentEl:'tabFiche1', title:'Description'},
	    	        {contentEl:'tabFiche2', title:'Bénéfices'},
	    	        {contentEl:'tabFiche3', title:'Contraintes'},
	    	        {contentEl:'tabFiche4', title:'Diffusion'},
	    	        {contentEl:'tabFiche5', title:'Coût'},
	    	        {contentEl:'tabFiche6', title:'Photos'}
	    	    ]
	    	});
	    	panel.add(tabs);
	    	panel.doLayout();
	    }
	});panel.doLayout();
}