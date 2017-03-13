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

Ext.namespace('GeoNetwork');

/**
 * Class: AnimationsWindow
 *      This window gives the necessary controls to run animations, like weather animation
 *
 * Inherits from:
 *  - {GeoNetwork.BaseWindow}
 */

/**
 * Constructor: GeoNetwork.AnimationsWindow
 * Create an instance of GeoNetwork.AnimationsWindow
 *
 * Parameters:
 * config - {Object} A config object used to set the 
 *     window's properties.
 */
GeoNetwork.AnimationsWindow = function(config) {
    Ext.apply(this, config);
    GeoNetwork.AnimationsWindow.superclass.constructor.call(this);
};

Ext.extend(GeoNetwork.AnimationsWindow, GeoNetwork.BaseWindow, {
	map:null,
	config:null,
	width:500,
	height:270,
	
	maximizable:false,
	closeAction: 'hide', 
	content:null,
	loader: {
		panel:null
	},
	progress: {
		panel:null,
		bar:null,
		emptyText: '',
		steps:0,
		step:0
	},
	animator: {
		panel:null,
		imgs:null,
		files:null,
		path:'',
		layer:null,
		layerindex:0,
		buttons:{
			fb : null,
			b: null,
			p:null,
			l:null,
			f:null,
			ff:null
		},
		playforward:false,
		playbackward:false,
		timeslider:null,
		timetext:null,
		loop:false
	},
	selectedDataset:null, //will be affected an extjs record, issued from the combobox
	

    /**
     * Method: init
     *     Initialize this component.
     */ 
    initComponent: function() {
        GeoNetwork.AnimationsWindow.superclass.initComponent.call(this);

        
        window.dashboard = this;
        this.title = this.title || OpenLayers.i18n("animations.title");
        this.progress.emptyText = OpenLayers.i18n('animations.progress.empty');

        this.layout ='fit';
        this.content = new Ext.Panel({
        	id:'Anim_contentPanel',
        	layout:'vbox',
        	layoutConfig: {
        	    align : 'stretch',
        	    pack  : 'start',
        	},
        	items: [/*
        	    {id:'AnimPanel1',html:'panel 2', height:50},
        	    {id:'AnimPanel2',html:'panel 3', flex:1}*/
        	]
        });
    	this.add(this.content);
    	this.on('show', function() {
    		if (this.loader.panel==null) {//then it's the first time we show the window : we must create the components
	    		this.loader.panel=this.buildLoader({height:80});
	    		this.content.add(this.loader.panel);
	
	        	this.progress.bar = new Ext.ProgressBar({
	            	text:this.progress.emptyText
	    	    });
	        	this.progress.panel=new Ext.Panel({
	    		    		height:50,
	    		    		border:false,
	    			        bodyStyle:'padding:10px 10px',
	    			        items : this.progress.bar
	        			});
	        	this.content.add(this.progress.panel);
	        	this.animator.panel = this.buildAnimator({flex:1});
	        	this.content.add(this.animator.panel);
    		}
        	this.doLayout();
		},this);
    },
    
    //allows to change the targeted webapp :
    getBaseURL: function() {
    	var baseURL = window.catalogue.URL;
    	
		if (window.Geoportal.animations!=null) {
			if (window.Geoportal.animations.baseUrl!=null) {
				if (window.Geoportal.animations.baseUrl.startsWith("http")) {
					baseURL = window.Geoportal.animations.baseUrl;
				} 
			}
		}
		return baseURL;
    },
    /*
     * TODO : 
     * 	- defer store loading at the moment we first open the window, not at page load
     */
	buildLoader: function(config) {
		var URL = this.getBaseURL()+"/srv/eng/pigeo.animations.list";
		var map_fields = [
				           // set up the fields mapping into the xml doc
				           {name: 'id'},
				           {name: 'label'},
				           {name: 'SRS'},
				           {name: 'minlon', mapping: 'geographicbounds > minlon'},
				           {name: 'minlat', mapping: 'geographicbounds > minlat'},
				           {name: 'maxlon', mapping: 'geographicbounds > maxlon'},
				           {name: 'maxlat', mapping: 'geographicbounds > maxlat'},
				           {name: 'imagewidth', mapping: 'imagesize > width'},
				           {name: 'imageheight', mapping: 'imagesize > height'},
				           {name: 'timestampformatter'},
				           {name: 'info'},
				           {name: 'timeextent'},
				           {name: 'timeunit'}
				       ];
		var mystore = new Ext.data.Store({
		    remoteSort    : false,
         	autoLoad    : { params:
                               {start:0, limit:2}
                            },
			proxy : new Ext.data.HttpProxy ({
					url : URL
				}),

		    // the return will be XML, so lets set up a reader
		    reader: new Ext.data.XmlReader({
		           // records will have an "emprise" tag
		           record: 'dataset',
		           id: 'id'
		       }, map_fields),
		    sortInfo : {field: "label", direction: "ASC"}
        });
    	mystore.load();
    	//console.log(mystore);
    	
    	var me=this;
		var loader = new Ext.FormPanel({
	        labelWidth: 75, // label settings here cascade unless overridden
	        autoScroll:true,
	        border:false,
	        bodyStyle:'padding:10px 5px 0',
	        items: [{
	        		xtype:'combo',
	        		id:'anim_cb_selector',
					store: mystore,
				  	displayField:'label',
				    valueField: 'id',
				  	width:300,
				  	listWidth:300,
				  	allowBlank:false,
					forceSelection: true,
					autoSelect:true,
					triggerAction: 'all',
					emptyText:OpenLayers.i18n("animations.combo.empty"),
					selectOnFocus:true,
					mode:'local',//load store only once (manually, see mystore.load())
					lastQuery: '', //so that the first time dropdown will filter!!!!
					listeners : {
						'select' : function(combo, record, index) {
							me.selectedDataset = record;
						}
					},
					scope:this
			  	}
	        ],

	        buttons: [{
	            text: OpenLayers.i18n("animations.load"),
	            handler : this.loadAnimation.bind(me)
	        }/*,{
	            text: 'Cancel'
	        }*/]
	    });
		Ext.apply(loader,config);
		return loader;
	},
	buildAnimator: function(config) {
		var btnwidth = 60;
		this.animator.timeslider = new Ext.Slider({
	        width: '95%',
	        minValue: 0,
	        maxValue: 100,
	        listeners: {
	        	'change': function(slider,newval,oldval) {
	        		//console.log(newval);
	        		this.animator.layerindex = newval;
	        		this.setTimeText(this.animator.files[this.animator.layerindex].name);
	        		this.setImage( this.animator.layerindex);
	            	//this.animator.timetext.setValue(this.animator.files[this.animator.layerindex].name);
	        	},
	        	scope:this
	        }
	    });
		this.animator.timetext  =new Ext.form.TextField({
            name      : 'Date',
            fieldLabel: 'Date',
            anchor    : '-20'
        });
		this.animator.buttons.fb = new Ext.Button({
			width:btnwidth,
            text   : '|<',
            tooltip: OpenLayers.i18n('animations.btn_first'),
            handler: function(btn) {
            	this.setImage( 0 );
            },
            scope:this
        });
		this.animator.buttons.b = new Ext.Button({
			width:btnwidth,
            text   : '<',
            tooltip: OpenLayers.i18n('animations.btn_previous'),
            handler: function(btn) {
            	this.setImage( this.animator.layerindex-1 );
            },
            scope:this
        });
		this.animator.buttons.p = new Ext.Button({
			width:btnwidth,
            text   : '| |',
            tooltip: OpenLayers.i18n('animations.btn_pause'),
            handler: function(btn) {
            	this.animator.playforward=false;
            	this.animator.playbackward=false;
            },
            scope:this
        });
		this.animator.buttons.l = new Ext.Button({
			width:btnwidth,
            text   : ' ',
            iconCls: 'anim_loopforward',
            tooltip: OpenLayers.i18n('animations.btn_loopforward'),
            handler: function(btn) {
            	var me = this;
            	this.animator.playforward=true;
            	this.animator.playbackward=false;
            	var next = function(scope) {
            		if (scope.animator.playforward) {
            			scope.animator.layerindex +=1;
	            		if (scope.animator.layerindex==scope.animator.imgs.length) scope.animator.layerindex=0;
	            		scope.setImage( scope.animator.layerindex );
                    	
            			setTimeout(function() {next(scope)}, 1000);
            		}
            	}
            	next(me);
            },
            scope:this
        });

		this.animator.buttons.lb = new Ext.Button({
			width:btnwidth,
            text   : ' ',
            iconCls: 'anim_loopbackward',
            tooltip: OpenLayers.i18n('animations.btn_loopbackward'),
            handler: function(btn) {
            	var me = this;
            	this.animator.playforward=false;
            	this.animator.playbackward=true;
            	var next = function(scope) {
            		if (scope.animator.playbackward) {
	            		if (scope.animator.layerindex==0) scope.animator.layerindex=scope.animator.imgs.length;
            			scope.animator.layerindex -=1;
	            		scope.setImage( scope.animator.layerindex );
                    	
            			setTimeout(function() {next(scope)}, 1000);
            		}
            	}
            	next(me);
            },
            scope:this
        });
		this.animator.buttons.f = new Ext.Button({
			width:btnwidth,
            text   : '>',
            tooltip: OpenLayers.i18n('animations.btn_next'),
            disabled:true,
            handler: function(btn) {
            	this.setImage( this.animator.layerindex+1);
            },
            scope:this
        });
		this.animator.buttons.ff = new Ext.Button({
			width:btnwidth,
            text   : '>|',
            tooltip: OpenLayers.i18n('animations.btn_last'),
            disabled:true,
            handler: function(btn) {
            	this.setImage( this.animator.imgs.length-1);
            },
            scope:this
        });
		var form = new Ext.form.FormPanel({
	        autoScroll:true,
	        //title   : 'Composite Fields',
	        autoHeight: true,
	        disabled:true,
	        border:false,
	        bodyStyle:'padding:20px 5px 0',
	        items   : [
	   	            this.animator.timeslider,
	   	            this.animator.timetext
	        ],
	        buttons: [
	                  this.animator.buttons.fb,
	                  this.animator.buttons.b,
	                  this.animator.buttons.lb,
	                  this.animator.buttons.p,
	                  this.animator.buttons.l,
	                  this.animator.buttons.f,
	                  this.animator.buttons.ff
	        ]
		});
		Ext.apply(form,config);
		return form;
	},
	setTimeText: function(filename) {
		var stamp = "";
		try {
			stamp = eval(this.selectedDataset.data.timestampformatter);
		} catch (err) {
			stamp=filename;
			console.log("error calculating 'timestamp' expression (animation window) : "+this.selectedDataset.data.timestampformatter+"\nError msg: "+err);
		}
		
		this.animator.timetext.setValue(stamp);
	},
	
	setImage: function(index) {
		this.animator.layerindex = index;
		if (!this.animator.layer.map) //could happen if someone removed the layer from the Organize tab
			this.map.addLayer(this.animator.layer);
    	this.animator.layer.setUrl(this.animator.imgs[this.animator.layerindex]);
    	//this.animator.layer.redraw();

    	this.animator.buttons.f.setDisabled(this.animator.layerindex ==this.animator.imgs.length-1);
    	this.animator.buttons.ff.setDisabled(this.animator.layerindex ==this.animator.imgs.length-1);
    	this.animator.buttons.b.setDisabled(this.animator.layerindex ==0);
    	this.animator.buttons.fb.setDisabled(this.animator.layerindex ==0);
    	
    	this.setTimeText(this.animator.files[this.animator.layerindex].name);
    	this.animator.timeslider.setValue(this.animator.layerindex);
	},
	
	loadAnimation: function(btn) {	
		//console.log(this.selectedDataset);	
		var URL = this.getBaseURL()+"/srv/eng/pigeo.animations.listfiles.json?dataName="+this.selectedDataset.data.id;
		var request = OpenLayers.Request.GET({
            url: URL,
            async: false
        });
		if (request.responseText) {
			var fileslist = new OpenLayers.Format.JSON().read( request.responseText );
			this.animator.files = fileslist.record;
			this.animator.path = fileslist.path;
			this.animator.imgs = new Array();
			//console.log(fileslist);
			for (var i = 0 ; i < fileslist.record.length ; i++) {
				this.animator.imgs.push(this.getBaseURL()+"/srv/eng/pigeo.animations.getimage?path="+fileslist.path+"&name="+fileslist.record[i].name); //imgs will be an array of absolute paths to the images
			};
			//console.log(imgs);
			
			//initialize the progress bar if necessary
			this.progress.steps = fileslist.record.length;
			this.progress.step = 0;
			this.progress.bar.updateProgress(0,this.progress.emptyText);
			
			imageCache.pushArray(this.animator.imgs, this.loadImageEvent.bind(this), this.loadAllEvent.bind(this));
        } 
		
	},
	loadImageEvent: function(e) {
		this.progress.step += 1/this.progress.steps;
		this.progress.bar.updateProgress(this.progress.step,Math.floor(this.progress.step *100)+"%");
	},
	loadAllEvent: function() {
		var params  =this.selectedDataset.data;
		//console.log(this);
		this.progress.bar.updateProgress(1,OpenLayers.i18n('animations.ready'));
		this.animator.panel.enable();
		//console.log('done');
		//console.log(this);
		
		var bounds = new OpenLayers.Bounds(params.minlon,params.minlat,params.maxlon,params.maxlat);
		//var bounds = new OpenLayers.Bounds(-1900000,1460000,-1530000,1560000);
		var size = new OpenLayers.Size(params.width,params.height);
		this.animator.layerindex = this.animator.imgs.length-1;
		this.animator.layer = new OpenLayers.Layer.AnimImage(params.label +" (animation)",this.animator.imgs[this.animator.layerindex] , 
				bounds.transform(new OpenLayers.Projection(params.SRS), this.map.getProjectionObject()), 
				size, 
				{
					isBaseLayer:false,
		            maxResolution: "auto",
		            resolutions: this.map.resolutions,
		            projection: new OpenLayers.Projection(params.SRS),
		            strategies: [new OpenLayers.Strategy.Fixed()],
		            displayInLayerSwitcher: true,
		            transitionEffect: 'resize',
		            imageRemanence:100
	            });
		window.animatorlayer = this.animator.layer;
		//console.log(this.animator.layer);
		this.map.addLayer(this.animator.layer);

		this.animator.timeslider.setMaxValue(this.animator.imgs.length-1);
		this.animator.timeslider.setValue(this.animator.imgs.length-1);
		this.setTimeText(this.animator.files[this.animator.imgs.length-1].name);
	}

});


/**
 * imageCache.js - image caching framework.
 * Zoltan Hawryluk - http://www.useragentman.com/
 * MIT License.
 */
var imageCache = new function () {
	var me = this;
	var cache = [];
	var root = document.location.href.split('/');
	root.pop();
	root = root.join('/') + '/';
	me.push = function (src, loadEvent) {
		if (!src.match(/^http/)) {
			src = root + src;
		}
		var item = new Image();
		if (cache[src] && loadEvent) {
			loadEvent(src);
		} else {
			if (loadEvent) {
				item.onload = loadEvent;
				item.onerror = loadEvent;
			}
			cache[src]=item;
		}
		item.src = src;
	}
	me.pushArray = function (array, imageLoadEvent, imagesLoadEvent) {
		var numLoaded = 0;
		var arrayLength = array.length;
		for (var i=0; i<arrayLength; i++) {
			me.push(array[i], function (e) {
				if (imageLoadEvent) {
					imageLoadEvent(e);
				}
				numLoaded++;
				if (numLoaded == arrayLength) {
					setTimeout(function () {
						imagesLoadEvent(e);
					}, 1)
				}
			})
		}
	}
}
