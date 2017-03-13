/*
 * Copyright (C) 2013 Jean Pommier
 * jean.pommier@ige.fr
 */
/**
 * @include GeoExt/widgets/tree/TreeNodeUIEventMixin.js
 */
Ext.namespace('GeoNetwork.Geoportal');
//var activeIndex = 0;


//create application
GeoNetwork.Geoportal.LayerTree = function() {
	// private vars:
	var layertree, jsontree, map;

	// private functions

	/*
	 * Parses the tree config JSON data and creates the OL corresponding layers 
	 * for further load in a map
	 */
	function readLayers(mod) {
		var layers = new Array();

		//console.log(mod.length);
		for (var j=0 ; j < mod.length ; j++)
		{
			//console.log(mod[j]);
			if (mod[j].children!=null)
			{
				//console.log(mod[j].layer);
				var children = readLayers(mod[j].children);
				for (var i = 0 ; i < children.length ; i++)
					layers.push(children[i]);
			}
			else
			{
				var child = mod[j];
				var layer;
				//console.log(child.text);

				if (child.type==null || child.disabled)
					continue;

				var checked = false;
				if (child.checked===true)
					checked =true;	
				switch (child.type) {
				case "wms":
					//console.log("wms layer : "+child.layer);
					layer = new OpenLayers.Layer.WMS(child.layer, //sans s, c'est le nom, lisible, de la couche. Layers est le nom geoserver
							child.url, 
							{ 
						layers: child.layers, 
						format: child.format,
						TRANSPARENT:(child.format=="image/png"),
						TILED:(child.TILED==false?false:true) //if TILED is defined to false: false, else (to true or undefined): true.
						//,BGCOLOR: (child.bgcolor==null?'0x0033FF':child.bgcolor)
							},
							{
								isBaseLayer: false
								, transitionEffect: 'resize'
								, buffer: 0
								, visibility:checked
								, opacity : (child.opacity===null?'1.0':child.opacity)
								, type:"wms"
								, queryable:child.queryable
								, isGeoportalNativeLayer : true
								, uuid : child.uuid //if set, links the layer with its metadata
								, legend : child.legend //if set, links the layer with an image legend
								, pq: {
									pq_layer: child.pq_layer,
									pq_header: child.pq_header,
									pq_multiplyByArea: child.pq_multiplyByArea,
									pq_multiplyRatio : child.pq_multiplyRatio,
									pq_bandnb : child.pq_bandnb,
									pq_round : child.pq_round,
									pq_rastertype_fields : child.pq_rastertype_fields
								}
								, hideFromLayertreeIfUnchecked:true
							}
					);
					layers.push(layer);
					break;
				case "chart":
					var chart = new GeoNetwork.layers.GeoportalChartLayer();
					chart.setMap(map);
					var overlay = chart.getOverlay(child);
					/*var overlay = new OpenLayers.Layer.Vector(child.text, {
						visibility:false
						, gpconfig:child
						, visibility:checked
						, opacity : (child.opacity===null?'1.0':child.opacity)
						, isGeoportalNativeLayer : true
						, uuid : child.uuid //if set, links the layer with its metadata
						, legend : child.legend //if set, links the layer with an image legend
						, eventListeners: {
							'visibilitychanged': function(evt) {
								if ((this.visibility) && (!this.gpconfig.loaded))
									loadChart(this);

							}
						}
					});*/
					layers.push(overlay);
					break;
				default: 
					OpenLayers.Console.log("omitting invalid (non-wms, non-chart) layer : "+child.layer + ", "+child.type);
				break;
				}
			}
		}
		return layers;
	}

	/*
	 * Loads layers from JSON config data
	 * and then loads the layers in the map
	 */
	function loadLayersFromConfigTree (treeconf) {
		//console.log("using treeconf");
		//console.log(treeconf);
		var layers = readLayers(treeconf);
		//console.log("read layers. Adding them to the map");
		//console.log(map);
		for (var i = 0 ; i < layers.length ; i++)
			map.addLayer(layers[i]);
	}


	// public space:
	return {
		init: function(treeconf, maptolink) {
			map = maptolink;
			jsontree = new OpenLayers.Format.JSON().write(treeconf);
			if (map===null || jsontree===null) {
				console.warn("unable to load the json tree (geoportal tree)");
			} else {
				// We need to load the layers in the map before making the tree (nodes are defined 
				// as gx_nodes, and thus have to be linked to an already existing map layer
				loadLayersFromConfigTree(treeconf);
				this.setTree();
			}

			/*setTimeout(function () {
	        	setTree(treeconf);
            }, 2000);*/
		},

		setTree: function() {

			var LayerNodeUI = Ext.extend(
					GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin() 
			);

			var mytreeloader = new Ext.tree.TreeLoader({//KEEP IN SYNC WITH THE ONE IN lAYERTREEMANAGERPANEL.JS
				// applyLoader has to be set to false to not interfer with loaders
				// of nodes further down the tree hierarchy
				applyLoader: false,
				uiProviders: {
					"layernodeui": LayerNodeUI //Ca n'a pas l'air d'être pris en compte : on n'a pas de TreeNodeUIEventMixin (pas d'evt onRenderNode)
				},
				// this below is using the config attributes of the node to do
				// some testing. The attr.has_events is coming from the loader in PHP
				createNode: function(attr) {
					//console.log(attr);
					if (attr.layer && attr.text==null) { //deals with importing old-style layertree.js file
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

					if (attr.type=="wms" || attr.type=="chart") {
						attr.nodeType="gx_layer";
					}
					attr.iconCls="x-tree-node-icon-"+attr.type;
					return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
				}
			});

			layertree = new Ext.tree.TreePanel({
				title:'layerTree',
				header:false,
				id: "geoportalLayerTree",
				enableDD: false,
				autoScroll:true,
				loader: mytreeloader,

		        plugins: [
		                  new GeoExt.plugins.TreeNodeIconsPlugin({})
		                  ],
				/* plugins don't work because UIEventMixin won't work properly for this tree (probably it is a matter of timing:
				 * layernodeui seems OK, UIEventMixin looks loaded, when performing a console.log(mytreeloader.uiProviders["layernodeui"])
				 * but nothing happens. Maybe th nodes are rendered too early or them to be caught by UIEventMixin
				 */
				/*
		        plugins: [
		            		new GeoExt.plugins.FoldableLegendPlugin({}),
		            		new GeoExt.plugins.FixLegendURLPlugin({})
            	],*/
				root: {
					nodeType: "async",
					// the children property of an Ext.tree.AsyncTreeNode is used to
					// provide an initial set of layer nodes. We use the treeConfig
					// from above, that we created with OpenLayers.Format.JSON.write.
					children: Ext.decode(jsontree)
				},     
				rootVisible: false,
				border: false,
				region: 'center'			
			});
			
			
		},

		getTree: function() {
			return layertree;
		}
	};
}; // end of app
