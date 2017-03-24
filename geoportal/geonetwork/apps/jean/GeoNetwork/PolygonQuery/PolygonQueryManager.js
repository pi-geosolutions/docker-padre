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
Ext.namespace('GeoNetwork.PolygonQuery');


/** api: (define)
 *  module = GeoNetwork.PolygonQuery
 *  class = PolygonQueryManager
 */
/** api: constructor 
 *  .. class:: PolygonQueryManager(config)
 *
 *  Main Polygon Query class
 *
 */
GeoNetwork.PolygonQuery.PolygonQueryManager = Ext.extend(Object, {
	/*
	 * specific config
	 */
	button:null,
	fallbackButton:null, //button we go back to, if new node is node polygonQuery enabled
	
	/*
	 * Private vars. Don't use directly
	 */
	map:null,
	layer:null,
	control:null,
	window:null,
	targetNode:null,
	query_tpl:null,
	rasterResult_tpl:null,
	styleMap: null,
	queryParams: {
		llcorner : '-16.825306042689 13.064180511176',
		urcorner : '-13.797093842689 13.826650011176',
		name:"",
		polygon : ""
	},
    
    constructor: function(config){
    	GeoNetwork.PolygonQuery.PolygonQueryManager.superclass.constructor.call(this, config);
        Ext.apply(this, config);
        
        this.styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({
                    symbolizer: {
                        "Polygon": {
                            strokeWidth: 2,
                            strokeOpacity: 1,
                            strokeColor: "#FF0000",
                            fillColor: "white",
                            fillOpacity: 0.5
                        }
                    }
                })]
            })
        });
        window.pqm = this;
    },
    
    queryRaster: function() {
    	var node = this.targetNode;
    	if (((node) && (node.attributes.layer) && (node.attributes.layer.pq) 
    			&& (node.attributes.layer.pq.pq_layer) && (node.attributes.layer.pq.pq_rastertype_fields))) {
    		var pq = node.attributes.layer.pq;
    		
    		//console.log("let's query the raster for stats !");
    		var geojson = new OpenLayers.Format.GeoJSON();
    		var poly_geojsontxt = geojson.write(this.layer.features,false);
    		//hack to add the crs definition... found no clean way to do it
    		poly_geojsontxt = poly_geojsontxt.replace(/"type":"FeatureCollection"/g, "$&, \"crs\":{\"type\":\"EPSG\",\"properties\":{\"code\":\"3857\"}}");
    		Ext.apply(this.queryParams, { polygon : poly_geojsontxt, name : pq.pq_layer});
    		var data = this.getQueryTpl().apply(this.queryParams);
    		//builds the URL from the wms one
    		var url = node.attributes.layer.url.slice(0,node.attributes.layer.url.lastIndexOf("wms"))+"wps";
    		
    		OpenLayers.Request.POST({
    		    url: url,
    		    header:{"Content-Type":"text/xml"},
    		    data: data,
                success: function(response){
                	if (response.status==200 && response.responseXML==null) {
                		this.onQuerySuccess(response, pq);
                	} else {
                		this.onQueryFailure(response);
                	}
                },
                failure: this.onQueryFailure,
                scope : this
            });
    		
    		/*
    		 * TODO :
    		 *   - set the layer name as a parameter (see query tpl)
    		 *   - process result
    		 *   - cleaner declaration for crs : get the epsg value from the vector layer ? Beware 900913 seems not to be handled by WPS
    		 */
    	
    	} else {
    		return null;
    	}
    },
    
    
    /*
     * API
     */
    
    getLayer: function() {
    	if (this.layer==null && this.map!=null)
    	{
    		this.layer = new OpenLayers.Layer.Vector(OpenLayers.i18n('pqLayer'), {
    			visibility: true, 
    			styleMap: this.styleMap,
    			displayInLayerSwitcher:false,
    			eventListeners : {
    				beforefeatureadded : this.onFeatureAdded,
    				featureadded : this.afterFeatureAdded,
                    scope: this
    			}
			});

        	//this.map.setLayerIndex(this.layer,  this.map.layers.length-1);
    		this.map.addLayer(this.layer);
    	}
		return this.layer
    },
    getControl: function() {
    	var pqLayer = this.getLayer();
    	if (this.control==null && pqLayer!=null) {
    		this.control = new OpenLayers.Control.DrawFeature(pqLayer, OpenLayers.Handler.Polygon, {
    	        displayClass: 'olControlDrawFeaturePolygon',
    	        handlerOptions: {},
    	        eventListeners: {
    	        	//featureadded: this.onFeatureAdded, //we get this on the OpenLayers.Layer.Vector's side : gives more precise events 
    	            activate: this.onActivate,
    	            deactivate: this.onDeactivate,
    	            scope: this
    	        }
    	    });
    	}
		return this.control;
    },
    
    /*
     * Sets the target node (ie the node corresponding to the layer that will be queried against.
     */
    setTarget: function(node) {
    	this.targetNode = node;
    },
    
    onActivate: function() {
    	if (this.window==null) {
    		this.window = new GeoNetwork.PolygonQuery.PolygonQueryWindow();
    	}
    	this.window.show(this.button);
    	this.layer.setVisibility(true);
    },
    
    onDeactivate: function() {
    	this.window.hide();
    	this.layer.setVisibility(false);
    },
    
    onFeatureAdded: function(event) {
		window.feat=event.feature;
		event.object.removeAllFeatures();

    	if (this.targetNode!=null)
    		this.window.setTargetName(this.targetNode.text);

    	this.window.show(this.button);
    	this.window.setResults('<div class="loading-indicator">'+OpenLayers.i18n('polygonQuery.loading')+'</div>');
    	
    	this.map.setLayerIndex(this.layer,  this.map.layers.length-3);
    },
    
    afterFeatureAdded: function(event) {
    	this.queryRaster();
    },
    
    onNodeChange: function(node) {
    	var btn = Ext.getCmp(this.button);
    	if (((node) && (node.attributes.layer) && (node.attributes.layer.pq) && (node.attributes.layer.pq.pq_layer))) {
    		btn.enable();
    		this.setTarget(node);
    	} else {
    		btn.disable();
    		Ext.getCmp(this.fallbackButton).toggle(true);
    	}
    	this.resetTemplates();
    },
    onQueryFailure: function(response) {
    	this.window.setResults('<div class="errorMsg">'+OpenLayers.i18n('polygonQuery.queryFailure')+'</div>');
    	//console.error('[PolygonQueryManager.js] Error trying to get stats for layer ' + this.targetNode.text);
    },
    onQuerySuccess: function(response, pq) {
    	var tpl = this.getRasterResultsTpl(pq.pq_rastertype_fields);
    	var json = Ext.util.JSON.decode(response.responseText);
    	//apply multiplication factors, in density-like cases (pq_multiplyByArea is set to true)
		var multiplyFactor = 1;
		//Remove this multiply thing !!
		/*if (pq.pq_multiplyByArea) {
			var area = this.layer.features[0].geometry.getGeodesicArea(this.layer.projection)/1e6; //in km²
			var ratio = 1;
			if (pq.pq_multiplyRatio)
				ratio = pq.pq_multiplyRatio;
			
			multiplyFactor = ratio * area;
		}*/
		Ext.iterate(json.features[0].properties, function(key, value, props) {
			props[key] = this.roundVal(value * multiplyFactor, pq.pq_round);
		}, this);


    	this.window.setResults(tpl.apply(json.features[0].properties));
    },

    getQueryTpl: function() {
    	if (this.query_tpl==null) {
	        this.query_tpl = new Ext.Template(
	        		'<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">'+ 
	        		'  <ows:Identifier>ras:RasterZonalStatistics</ows:Identifier>'+ 
	        		'  <wps:DataInputs>'+ 
	        		'    <wps:Input>'+ 
	        		'      <ows:Identifier>data</ows:Identifier>'+ 
	        		'      <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">'+ 
	        		'        <wps:Body>'+ 
	        		'          <wcs:GetCoverage service="WCS" version="1.1.1">'+ 
	        		'            <ows:Identifier>{name}</ows:Identifier>'+ 
	        		'            <wcs:DomainSubset>'+ 
	        		'              <gml:BoundingBox crs="http://www.opengis.net/gml/srs/epsg.xml#4326">'+ 
	        		'                <ows:LowerCorner>{llcorner}</ows:LowerCorner>'+ 
	        		'                <ows:UpperCorner>{urcorner}</ows:UpperCorner>'+ 
	        		'              </gml:BoundingBox>'+ 
	        		'            </wcs:DomainSubset>'+ 
	        		'            <wcs:Output format="image/tiff"/>'+ 
	        		'          </wcs:GetCoverage>'+ 
	        		'        </wps:Body>'+ 
	        		'      </wps:Reference>'+ 
	        		'    </wps:Input>'+ 
	        		'    <wps:Input>'+ 
	        		'      <ows:Identifier>zones</ows:Identifier>'+ 
	        		'      <wps:Data>'+ 
	        		'        <wps:ComplexData mimeType="application/json">'+
	        		'			<![CDATA[{polygon}]]>' +
	        		'		 </wps:ComplexData>'+ 
	        		'      </wps:Data>'+ 
	        		'    </wps:Input>'+ 
	        		'  </wps:DataInputs>'+ 
	        		'  <wps:ResponseForm>'+ 
	        		'    <wps:RawDataOutput mimeType="application/json">'+ 
	        		'      <ows:Identifier>statistics</ows:Identifier>'+ 
	        		'    </wps:RawDataOutput>'+ 
	        		'  </wps:ResponseForm>'+ 
	        		'</wps:Execute>'
	        );
    	}
    	return this.query_tpl;
    },
    getRasterResultsTpl: function(fields) {
    	if (this.rasterResults_tpl==null) {
    		var header = OpenLayers.i18n('polygonQuery.resultsHeader');
    		var pq = this.targetNode.attributes.layer.pq;
    		if (pq.pq_header) {
    			header = pq.pq_header;
    		}
    		var tpl_string = '<div class="statsResults"> <h3>'+header+'</h3><div class="stats">';
    		// count and uniqueValue vars will be used to detect if only one field is checked. In that case, 
    		// we don't display the label, assuming the header will replace it
    		var count = 0;
    		var uniquevalue = "";
    		var tpl_content="";
    		Ext.iterate(fields, function (key, value , fields) {
    			if (value) {
    				count++;
    				uniquevalue = key;
    				tpl_content += "<p><b>"+OpenLayers.i18n('polygonQuery.'+key)+":</b> {"+key+"} </p>";
    			}
        	}, this);
    		if (count == 1) {
    			tpl_content = "<p>{"+uniquevalue+"} </p>";
    		}
    			
    		tpl_string += tpl_content + '</div></div>';
    		this.rasterResults_tpl = new Ext.Template(tpl_string);
    	}
    	return this.rasterResults_tpl;
    },
    
    resetTemplates: function() {
    	this.rasterResults_tpl=null;
    	this.query_tpl=null;
    },
    
    roundVal: function(val, decimals) {
    	if (decimals==0) {
    		return Math.round(val);
    	} else if (decimals > 0 ) {
    		return val.toFixed(decimals);
    	} else {
    		return val;
    	}
    }
});