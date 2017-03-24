/**
 * Copyright (c) 2008-2010 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/**
 * @include GeoExt/widgets/MapPanel.js
 */

Ext.namespace("GeoExt");

GeoExt.CurtainControl = Ext.extend(Ext.Window, {
	//should be defined on instanciation
	map: null,
	toctree: null,
	viewport:null,
	
	border:false,
	plain:true,
	closable: false,
	closeAction: 'hide',
	constrain:true,
	//draggable : false,
	height : 80,
	width : 200, 
	title : OpenLayers.i18n('Comparer des cartes'),
	layout: 'fit',
	
	// private vars
	sliderpanel:null,
	sliderlayernamepanel: null,
	horizSlider: null,
	vertSlider: null,
	activeLayer:null,
	isactive : false,
	

	initComponent: function() {
		if(this.map instanceof GeoExt.MapPanel) {
			this.map = this.map.map;
		}
		GeoExt.CurtainControl.superclass.initComponent.call(this);
		this.add(this.getSliderPanel());
	},
	
	popIt: function() {
		this.isactive = true;
//		if (!this.activeLayer) { //we try to get the layer, and attach a listener to toctree
			var node = this.toctree.getSelectionModel().getSelectedNode();
			if (node) {
				var layer = node.attributes.layer;
				if (layer && !layer.isBaseLayer) {
					if (layer !== this.activeLayer) {
						this.unclipLayer(this.activeLayer);
						this.activeLayer = layer;
						this.reset();
					}
				} else {
					this.activeLayer=null;
				}
			}
			this.toctree.on('click', function(node, event) {
				var layer = node.attributes.layer;
				if (layer && !layer.isBaseLayer  && this.isactive) {
					if (layer !== this.activeLayer) {
						this.unclipLayer(this.activeLayer);
						this.activeLayer = layer;
						this.reset();
					} 
				} else {
					this.activeLayer=null;
				}
			}, this);
//		}
		if (this.activeLayer) {
			//console.log('ok, will slice layer '+this.activeLayer.name);
			this.show();
			this.alignTo(Ext.get("mappanel"), "tr-tr");
		} else {
			this.isactive = false;
			//console.log('layer not set again');
		}
	},
	getSliderPanel: function() {
		if (this.sliderpanel) { // if sliderpanel exists, we just return it.
			return this.sliderpanel;
		}
		// else, we create it
		var slidercontrol = this;
		this.sliderlayernamepanel = new Ext.Panel({
			html : OpenLayers.i18n('overlay')+' : ',
			border:false
		});
		this.horizSlider = new Ext.Slider({
			minValue: 0, 
			maxValue: 100,
			value:50,
			listeners: {
				change: function(slider, value) {
					//console.log(this);
					this.clipLayer(value);
				},
				scope:slidercontrol
			}
		});
		this.sliderpanel = new Ext.Panel({
			items : [this.sliderlayernamepanel,this.horizSlider]
		});
		return this.sliderpanel;
	},
	reset: function() {
		//initialize the new layer's clipping
		this.horizSlider.setValue(50,true);
		this.vertSlider.setValue(50,true);
		if (this.activeLayer) {
			this.clipLayer(50, 50);
		}
		//console.log(this.sliderlayernamepanel);
		window.sliderlayernamepanel=this.sliderlayernamepanel;
		if (this.sliderlayernamepanel) {
			var me=this;
			setTimeout(function(){   
				 me.sliderlayernamepanel.update( OpenLayers.i18n('overlay:') +me.activeLayer.name);
			}, 100);
		}
		
	},
	unclipLayer: function(layer) {
		//unclips the old layer
		if (layer) {
			var ovl = layer.div;
			if (Ext.isIE) {
				var size = this.map.getSize();
				ovl.style.clip = "rect(0px,"+size.w+"px,"+size.h+"px,0px)";
			} else {
				ovl.style.clip="auto";
				//console.log('reset the old layer clip');
			}
		}
	},
	hideIt: function() {
		//TODO : remove all action on actual layers
		this.unclipLayer(this.activeLayer);
		this.activeLayer=null;
		this.hide();
		this.isactive=false;
	},
	clipLayer: function(percent) {
		this.activeLayer.setVisibility(true);
		//this.activeLayer.setOpacity(1);
		var bbox = this.activeLayer.getExtent();
		var bbox2 = bbox.toArray();
		var px = new OpenLayers.LonLat(bbox2[2],bbox2[1]);
		var bottomClip = this.activeLayer.getViewPortPxFromLonLat(px);

		//var moveClip = (percent * bottomClip.y) / 100; //vert.
		//moveClip = parseInt(bottomClip.y - moveClip);  //vert.
		var moveClip = ((100-percent) * bottomClip.x) / 100;
		moveClip = parseInt(bottomClip.x - moveClip);
		
		var ovl = this.activeLayer.div;
		//ovl.style.clip="rect(0px,"+bottomClip.x+"px,"+moveClip+"px,0px)"; //vert.
		ovl.style.clip="rect(0px,"+moveClip+"px,"+bottomClip.y+"px,0px)";
	}
});
