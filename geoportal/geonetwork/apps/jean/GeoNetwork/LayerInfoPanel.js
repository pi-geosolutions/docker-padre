/**
 * Copyright (c) 2012 jean Pommier, jean.pommier@ige.fr
 * 
 * Published under the GPL license
 */

Ext.namespace("GeoNetwork");

GeoNetwork.LayerInfoPanel = Ext.extend(Ext.Panel, {
	/*paramaters set automatically
	lon,
	lat,
	map,
	wmsinfourl,
	*/
	
	panels_center:null,
	panels_west:null,
	panels_north: null,
	
	layerinfo_AppState	: {
			zae_id			: null,
			buttons			: [],
			lat				: null,
			lon				: null,
			current_index	: null,
			current_button	: null,
			current_config	: null
	},
	
	forceLayout:true,
	
    initComponent: function(){
    	window.Geoportal.DashBoard.layerinfo_app = this;
        GeoNetwork.LayerInfoPanel.superclass.initComponent.call(this);
        this.layout = 'border';
    	this.border = false;
    	
    	this.setLonLat(this.lon, this.lat);
    	
    	this.panels_center = new Ext.Panel({
			region: 'center', 
			layout: 'fit', 
            padding:'5',
			html		: '<div id="chartid"></div>',
            border : false,
            minWidth: 300,
            autoScroll:true,
            forceLayout : true
        });

 
    	this.panels_north = new Ext.Panel({
    		region: 'north',     		
    		layout:'fit',
            border : false,
            height : 50,
            padding:'5',
            html: this.text_intro + "&nbsp;"
		});

        this.add(this.panels_center);
  //      this.add(this.panels_west);
        this.add(this.panels_north);
        

        this.doLayout();
        
        this.addEvents(
            /** private: event[aftermapmove]
             *  Fires after the map is moved.
             */
           // "aftermapmove"
        );
    },
    
    updateContent: function() {
    	
    	this.getFeatureInfo(this.lon, this.lat);
    },

    loadActions: function() {
    },
    
    setLonLat: function(lon, lat) {
    	this.lat = lat;
    	this.lon = lon;
    	this.layerinfo_AppState.lat = lat;
    	this.layerinfo_AppState.lon = lon;
    	
    	this.updateContent();
    },
    
    getFeatureInfo: function(lon, lat) {
    	var layers = [];
    	layers = this.map.getLayersByName(new RegExp(this.layername, "i"));
    	var clickPosition = this.parent.xy;
    	var wmsOptions = this.buildWMSOptions(this.wmsinfourl, layers,
                clickPosition, layers[0].params.FORMAT); 
        var request = OpenLayers.Request.GET(wmsOptions);
    },
    
    /** taken from OL.Control.WMSGetFeatureInfo.js
     * Method: buildWMSOptions
     * Build an object with the relevant WMS options for the GetFeatureInfo request
     *
     * Parameters:
     * url - {String} The url to be used for sending the request
     * layers - {Array(<OpenLayers.Layer.WMS)} An array of layers
     * clickPosition - {<OpenLayers.Pixel>} The position on the map where the mouse
     *     event occurred.
     * format - {String} The format from the corresponding GetMap request
     */
    buildWMSOptions: function(url, layers, clickPosition, format) {
        var layerNames = [], styleNames = [];
        for (var i = 0, len = layers.length; i < len; i++) { 
            layerNames = layerNames.concat(layers[i].params.LAYERS);
            styleNames = styleNames.concat(this.getStyleNames(layers[i]));
        }
        var params = OpenLayers.Util.extend({
            service: "WMS",
            version: layers[0].params.VERSION,
            request: "GetFeatureInfo",
            layers: layerNames,
            query_layers: layerNames,
            styles: styleNames,
            bbox: this.map.getExtent().toBBOX(null,
                layers[0].reverseAxisOrder()),
            feature_count: 1,
            height: this.map.getSize().h,
            width: this.map.getSize().w,
            format: format,
            info_format: 'application/vnd.ogc.gml'
        }, (parseFloat(layers[0].params.VERSION) >= 1.3) ?
            {
                crs: this.map.getProjection(),
                i: clickPosition.x,
                j: clickPosition.y
            } :
            {
                srs: this.map.getProjection(),
                x: clickPosition.x,
                y: clickPosition.y
            }
        );
        OpenLayers.Util.applyDefaults(params, this.vendorParams);
        return {
            url: url,
            params: OpenLayers.Util.upperCaseObject(params),
            callback: function(request) {
                this.handleResponse(clickPosition, request);
            },
            scope: this
        };
    },
    /**
     * Method: getStyleNames
     * Gets the STYLES parameter for the layer. Make sure the STYLES parameter
     * matches the LAYERS parameter
     * 
     * Parameters:
     * layer - {<OpenLayers.Layer.WMS>}
     *
     * Returns:
     * {Array(String)} The STYLES parameter
     */
    getStyleNames: function(layer) {
        // in the event of a WMS layer bundling multiple layers but not
        // specifying styles,we need the same number of commas to specify
        // the default style for each of the layers.  We can't just leave it
        // blank as we may be including other layers that do specify styles.
        var styleNames;
        if (layer.params.STYLES) {
            styleNames = layer.params.STYLES;
        } else {
            if (layer.params.LAYERS instanceof Array) {
                styleNames = new Array(layer.params.LAYERS.length);
            } else { // Assume it's a String
                styleNames = layer.params.LAYERS.replace(/[^,]/g, "");
            }
        }
        return styleNames;
    },	
    
     /**
     * Method: handleResponse
     * Handler for the GetFeatureInfo response.
     * 
     * Parameters:
     * xy - {<OpenLayers.Pixel>} The position on the map where the
     *     mouse event occurred.
     * request - {XMLHttpRequest} The request object.
     */
    handleResponse: function(xy, request) {
        
        var doc = request.responseXML;
        if(!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        this.format = new OpenLayers.Format.WMSGetFeatureInfo();
        var features = this.format.read(doc);
        
    	if (features.length == 0) {
    		return false; // no data returned
		} else {
	        var id = features[0].data.Id;
	        var riviere = features[0].data.riviere;
	        var station = features[0].data.Station;
	        var type = features[0].data.type;
	        this.panels_north.update(this.actionsConfig[type].text_intro + "Rivière "+riviere+", Station "+station);
	    	this.doLayout();
	    	window.mx5 = this;
	    	
	    	if (type!=0) {
	        	//console.log(features);
		    	var dataurl = this.dataurl+'id='+id+'&type='+type;
				var chart_store = Ext4.create('Ext4.data.JsonStore', {
				    proxy: {
				        type: 'jsonp',
				        url : dataurl,
				        reader: {
				            type: 'json',
				            root: 'data',
			           		idProperty: 'date'
				        }
				    },
				    autoLoad:true,
					fields: [{name:'date', type: 'string', dateFormat: 'Y-m-d' }, {name:'value', type:'int'}, {name:'label'}]
				});
				var axes = [
						        {
						            type: 'Numeric',
						            position: 'left',
						            fields: ['value'],
						            label: {
						                renderer: Ext.util.Format.numberRenderer('0.0')
						            },
						            title: false,
						            grid: true,
						            minimum: 0
						        },
						        {
						            type: 'Category',
						            position: 'bottom',
						            fields: ['label'],
								    constrain: true
						            ,title: false
						            ,label: {
								        rotate: {
								            degrees: 315
								        }
								    }
								    ,dashSize:0
						        }
					    ];
				var	series = [
							        {
							            type: 'line',
							            /*highlight: {
							                size: 7,
							                radius: 7
							            },*/
							            axis: 'left',
							            xField: 'date',
							            yField: ['value'],
							            showMarkers:false,
							            markerConfig: {
							                size: 0,
							                radius: 1,
							                'stroke-width': 1
							            },
							            style : {
							            	stroke : '#0000FF',
							            	'stroke-width' : 1,
							            	fill: '#0000FF',
							            	opacity : 1
							            }
							            ,fill:true
							        }
					    ];
			    Ext.get("chartid").dom.innerHTML = ""; // clears the div before adding the chart
				Ext4.create('Ext4.chart.Chart', {
				    renderTo: "chartid",
				    width: 500,
				    height: 250,
//				    animate: true,
				    store: chart_store,
				    axes: axes,
				    series: series
				});
				window.mx6 = chart_store;
			} else {
				Ext.get("chartid").dom.innerHTML = ""; // clears the div before adding the chart
			}
			
	    	
    	}	
        
    },
    
    setMainPanel: function() {
    	var config = this.layerinfo_AppState.current_config;
    },
    
    reset: function() {
    	this.panels_north.update(this.text_intro);
    	this.doLayout();
    }
});

