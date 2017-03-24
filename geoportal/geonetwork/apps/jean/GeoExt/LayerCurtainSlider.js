/* Copyright (c) 2008-2010 The Open Source Geospatial Foundation
 * Published under the BSD license.
 * See http://geoext.org/svn/geoext/core/trunk/license.txt for the full text
 * of the license.
 */

/**
 * @include GeoExt/widgets/tips/LayerCurtainSliderTip.js
 * @include GeoExt/data/LayerRecord.js
 */

/** api: (define)
 *  module = GeoExt
 *  class = LayerCurtainSlider
 *  base_link = `Ext.Slider <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Slider>`_
 */
Ext.namespace("GeoExt");

/** api: example
 *  Sample code to render a slider outside the map viewport:
 *
 *  .. code-block:: javascript
 *
 *      var slider = new GeoExt.LayerCurtainSlider({
 *          renderTo: document.body,
 *          width: 200,
 *          layer: layer
 *      });
 *
 *  Sample code to add a slider to a map panel:
 *
 *  .. code-block:: javascript
 *
 *      var layer = new OpenLayers.Layer.WMS(
 *          "Global Imagery",
 *          "http://maps.opengeo.org/geowebcache/service/wms",
 *          {layers: "bluemarble"}
 *      );
 *      var panel = new GeoExt.MapPanel({
 *          renderTo: document.body,
 *          height: 300,
 *          width: 400,
 *          map: {
 *              controls: [new OpenLayers.Control.Navigation()]
 *          },
 *          layers: [layer],
 *          extent: [-5, 35, 15, 55],
 *          items: [{
 *              xtype: "gx_opacityslider",
 *              layer: layer,
 *              aggressive: true,
 *              vertical: true,
 *              height: 100,
 *              x: 10,
 *              y: 20
 *          }]
 *      });
 */

/** api: constructor
 *  .. class:: LayerCurtainSlider(config)
 *
 *      Create a slider for controlling a layer's opacity.
 */
GeoExt.LayerCurtainSlider = Ext.extend(Ext.Slider, {

    /** api: config[layer]
     *  ``OpenLayers.Layer`` or :class:`GeoExt.data.LayerRecord`
     *  The layer this slider changes the view extent (%) of. (required)
     */
    /** private: property[layer]
     *  ``OpenLayers.Layer``
     */
    layer: null,


    /** api: config[delay]
     *  ``Number`` Time in milliseconds before setting the curtain limit to the
     *  layer. If the value change again within that time, the original value
     *  is not set. Only applicable if aggressive is true.
     */
    delay: 5,

    /** api: config[changeVisibilityDelay]
     *  ``Number`` Time in milliseconds before changing the layer's visibility.
     *  If the value changes again within that time, the layer's visibility
     *  change does not occur. Only applicable if changeVisibility is true.
     *  Defaults to 5.
     */
    changeVisibilityDelay: 5,

    /** api: config[aggressive]
     *  ``Boolean``
     *  If set to true, the curtain limit is changed as soon as the thumb is moved.
     *  Otherwise when the thumb is released (default).
     */
    aggressive: false,

    /** api: config[changeVisibility]
     *  ``Boolean``
     *  If set to true, the layer's visibility is handled by the
     *  slider, the slider makes the layer invisible when its
     *  value is changed to the min value, and makes the layer
     *  visible again when its value goes from the min value
     *  to some other value. The layer passed to the constructor
     *  must be visible, as its visibility is fully handled by
     *  the slider. Defaults to false.
     */
    changeVisibility: false,

    /** api: config[value]
     *  ``Number``
     *  The value to initialize the slider with. This value is
     *  taken into account only if the layer's curtain limit is null.
     *  If the layer's curtain limit is null and this value is not
     *  defined in the config object then the slider initializes
     *  it to the max value.
     */
    value: null,

    /** api: config[inverse]
     *  ``Boolean``
     *  If true, we will work left to right/ bottom to top instead of with right to left/top to bottom.
     *  Defaults to false.
     */
    /** private: property[inverse]
     *  ``Boolean``
     */
    inverse: false, //does not work for now, keep on false !
    
    /** api: config[direction]
     *  If "horizontal", it will work from right to left. If set to "vertical", from top to bottom
     *  Defaults to false.
     */
    direction:"horizontal",

    /** private: method[constructor]
     *  Construct the component.
     */
    constructor: function(config) {
        if (config.layer) {
            this.layer = this.getLayer(config.layer);
            if (!this.layer.hcurtain) {this.layer.hcurtain=1;}
            if (!this.layer.vcurtain) {this.layer.vcurtain=1;}
            this.bind();
            // before we call getCurtainValue inverse & direction should be set
            if (config.inverse !== undefined) {
                this.inverse = config.inverse;
            }
            if (config.direction !== undefined) {
                this.direction = config.direction;
            }
            config.value = (config.value !== undefined) ? 
                config.value : this.getCurtainValue(this.layer);
            delete config.layer;
        }
        GeoExt.LayerCurtainSlider.superclass.constructor.call(this, config);
    },

    /** private: method[bind]
     */
    bind: function() {
        if (this.layer && this.layer.map) {
            this.layer.map.events.on({
                changelayer: this.update,
                scope: this
            });
        }
    },

    /** private: method[unbind]
     */
    unbind: function() {
        if (this.layer && this.layer.map) {
            this.layer.map.events.un({
                changelayer: this.update,
                scope: this
            });
        }
    },

    /** private: method[update]
     *  Registered as a listener for curtain value change.  Updates the value of the slider.
     */
    update: function(evt) {
    	if (this.direction=="horizontal") {
	        if (evt.property === "hcurtain" && evt.layer == this.layer) {
	            this.setValue(this.getCurtainValue(this.layer));
	        }
    	} else {
	        if (evt.property === "vcurtain" && evt.layer == this.layer) {
	            this.setValue(this.getCurtainValue(this.layer));
	        }
    	}
    },

    /** api: method[setLayer]
     *  :param layer: ``OpenLayers.Layer`` or :class:`GeoExt.data.LayerRecord`
     *
     *  Bind a new layer to the opacity slider.
     */
    setLayer: function(layer) {
        this.unbind();
        this.layer = this.getLayer(layer);
        this.setValue(this.getCurtainValue(layer));
        this.bind();
    },

    /** private: method[getCurtainValue]
     *  :param layer: ``OpenLayers.Layer`` or :class:`GeoExt.data.LayerRecord`
     *  :return:  ``Integer`` The curtain for the layer.
     *
     *  Returns the curtain value for the layer.
     */
    getCurtainValue: function(layer) {
        var value;
        if (layer) {
        	if (this.direction=="horizontal" && layer.hcurtain !== null) {
			    value = parseInt(layer.hcurtain * (this.maxValue - this.minValue));
			} else if (this.direction=="vertical" && layer.vcurtain !== null) {
			    value = parseInt(layer.vcurtain * (this.maxValue - this.minValue));
			} else {
			    value = this.maxValue;
			}
        } 
        /*if (this.inverse === true) {
            value = (this.maxValue - this.minValue) - value;
        }*/
        return value;
    },

    /** private: method[getLayer]
     *  :param layer: ``OpenLayers.Layer`` or :class:`GeoExt.data.LayerRecord`
     *  :return:  ``OpenLayers.Layer`` The OpenLayers layer object
     *
     *  Returns the OpenLayers layer object for a layer record or a plain layer 
     *  object.
     */
    getLayer: function(layer) {
        if (layer instanceof OpenLayers.Layer) {
            return layer;
        } else if (layer instanceof GeoExt.data.LayerRecord) {
            return layer.getLayer();
        }
    },

    /** private: method[initComponent]
     *  Initialize the component.
     */
    initComponent: function() {

        GeoExt.LayerCurtainSlider.superclass.initComponent.call(this);

        if (this.direction == "horizontal") {
	        if (this.changeVisibility && this.layer &&
	            (this.layer.hcurtain == 0 || 
	            (this.inverse === false && this.value == this.minValue) || 
	            (this.inverse === true && this.value == this.maxValue))) {
	            this.layer.setVisibility(false);
	        }
        } else {
        	if (this.changeVisibility && this.layer &&
    	            (this.layer.vcurtain == 0 || 
    	            (this.inverse === false && this.value == this.minValue) || 
    	            (this.inverse === true && this.value == this.maxValue))) {
    	            this.layer.setVisibility(false);
    	        }
        }

        if (this.aggressive === true) {
            this.on('change', this.changeLayerCurtain, this, {
                buffer: this.delay
            });
        } else {
            this.on('changecomplete', this.changeLayerCurtain, this);
        }

        if (this.changeVisibility === true) {
            this.on('change', this.changeLayerVisibility, this, {
                buffer: this.changeVisibilityDelay
            });
        }

        this.on("beforedestroy", this.unbind, this);
    },

    /** private: method[changeLayerCurtain]
     *  :param slider: :class:`GeoExt.LayerCurtainSlider`
     *  :param value: ``Number`` The slider value
     *
     *  Updates the ``OpenLayers.Layer`` opacity value.
     */
    changeLayerCurtain: function(slider, value) {
        if (this.layer) {
            value = value / (this.maxValue - this.minValue);
            /*if (this.inverse === true) {
                value = 1 - value;
            }*/
            if (this.direction == "horizontal") {
            	this.layer.hcurtain=value;
                if (!this.layer.vcurtain) {this.layer.vcurtain=1;}
            } else {//vertical
                if (!this.layer.hcurtain) {this.layer.hcurtain=1;}
            	this.layer.vcurtain=value;
            }
            this.clipLayer(value);
        }
    },
    
    clipLayer: function(value) {
		this.layer.setVisibility(true);
		var bbox = this.layer.getExtent();
		var bbox2 = bbox.toArray();
		var px = new OpenLayers.LonLat(bbox2[2],bbox2[1]);
		var bottomClip = this.layer.getViewPortPxFromLonLat(px);

		var vcurtain = 1, hcurtain=1;
		if (this.direction == "horizontal" && this.layer.vcurtain) {
			vcurtain = this.layer.vcurtain;
			hcurtain = value;
		}
		if (this.direction == "vertical" && this.layer.hcurtain) {
			hcurtain = this.layer.hcurtain;
			vcurtain = value;
		}
		var xClip = ((1-hcurtain) * bottomClip.x) ;
		xClip = parseInt(bottomClip.x - xClip);
		var yClip = ((1-vcurtain) * bottomClip.y) ;
		yClip = parseInt(bottomClip.y - yClip);
		var ovl = this.layer.div;
		ovl.style.clip="rect(0px,"+xClip+"px,"+yClip+"px,0px)"; //vert.
		
	},

    /** private: method[changeLayerVisibility]
     *  :param slider: :class:`GeoExt.LayerCurtainSlider`
     *  :param value: ``Number`` The slider value
     *
     *  Updates the ``OpenLayers.Layer`` visibility.
     */
    changeLayerVisibility: function(slider, value) {
        var currentVisibility = this.layer.getVisibility();
        if ((this.inverse === false && value == this.minValue) ||
            (this.inverse === true && value == this.maxValue) &&
            currentVisibility === true) {
            this.layer.setVisibility(false);
        } else if ((this.inverse === false && value > this.minValue) ||
            (this.inverse === true && value < this.maxValue) &&
                   currentVisibility == false) {
            this.layer.setVisibility(true);
        }
    },

    /** private: method[addToMapPanel]
     *  :param panel: :class:`GeoExt.MapPanel`
     *
     *  Called by a MapPanel if this component is one of the items in the panel.
     */
    addToMapPanel: function(panel) {
        this.on({
            render: function() {
                var el = this.getEl();
                el.setStyle({
                    position: "absolute",
                    zIndex: panel.map.Z_INDEX_BASE.Control
                });
                el.on({
                    mousedown: this.stopMouseEvents,
                    click: this.stopMouseEvents
                });
            },
            scope: this
        });
    },

    /** private: method[removeFromMapPanel]
     *  :param panel: :class:`GeoExt.MapPanel`
     *
     *  Called by a MapPanel if this component is one of the items in the panel.
     */
    removeFromMapPanel: function(panel) {
        var el = this.getEl();
        el.un({
            mousedown: this.stopMouseEvents,
            click: this.stopMouseEvents,
            scope: this
        });
        this.unbind();
    },

    /** private: method[stopMouseEvents]
     *  :param e: ``Object``
     */
    stopMouseEvents: function(e) {
        e.stopEvent();
    }
});

/** api: xtype = gx_curtainslider */
Ext.reg('gx_curtainslider', GeoExt.LayerCurtainSlider);
