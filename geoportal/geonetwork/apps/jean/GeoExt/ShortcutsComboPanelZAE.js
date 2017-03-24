/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExt
 *  class = ShortcutsComboPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */

Ext.namespace('GeoExt');

/** api: constructor
 *  .. class:: ShortcutsComboPanel(config)
 *
 *  A panel showing legends of all layers in a layer store.
 *  Depending on the layer type, a legend renderer will be chosen.
 */
GeoExt.ShortcutsComboPanelZAE = Ext.extend(GeoExt.ShortcutsComboPanel, {

  	map:null,
  	mapapp:null,
  	config:null,
  	cbWidth:150,
  	cbListWidth:145,
                      
    /** private: method[initComponent]
     *  Initializes the legend panel.
     */
    initComponent: function() {
        GeoExt.ShortcutsComboPanelZAE.superclass.initComponent.call(this);
    },
    
    createCombo: function(conf, i) {
    	var map_fields = [
		           // set up the fields mapping into the xml doc
		           {name: 'id', mapping:'@id'},
		           {name: 'nom'},
		           {name: 'lon'},
		           {name: 'lat'},
		           {name: 'yUL'},
		           {name: 'yLR'},
		           {name: 'xLR'},
		           {name: 'xUL'}
		       ];
		for (var k = 1 ; k <= i ; k++) {
			map_fields.push({name:'up'+k}); //adds fields for linking with upper levels (if there are..)
		}
		
    	var mystore = new Ext.data.Store({
    		storeidx	: i, //used to know where this store is placed within the whole stores set
		    remoteSort    : false,
         	autoLoad    : { params:
                               {start:0, limit:2}
                            },
			proxy : new Ext.data.HttpProxy ({
					url : conf.url
				}),

		    // the return will be XML, so lets set up a reader
		    reader: new Ext.data.XmlReader({
		           // records will have an "emprise" tag
		           record: 'emprise',
		           id: '@id'
		       }, map_fields),
		    sortInfo : {field: "nom", direction: "ASC"}
        });
    	mystore.load();
    
    	var mycombo = new Ext.form.ComboBox({
      					store: mystore,
					  	displayField:'nom',
					  	width:this.cbWidth,
					  	listWidth:this.cbListWidth,
						forceSelection: true,
						triggerAction: 'all',
						emptyText:conf.nom,
						selectOnFocus:true,
						mode:'local',//load store only once (manually, see mystore.load())
						lastQuery: '', //so that the first time dropdown will filter!!!!
						linkedLayers:conf.linkedLayers
				  	});
	  	return mycombo;
    },
    
    manageEvents: function(combos, i, map) {
    	var me=this;
    	combos[i].on('select', function(combo, record, index) {
    		var xUL = parseFloat(record.get('xUL'));
    		var yLR = parseFloat(record.get('yLR'));
    		var xLR = parseFloat(record.get('xLR'));
    		var yUL = parseFloat(record.get('yUL'));
    		var lon = parseFloat(record.get('lon'));
    		var lat = parseFloat(record.get('lat'));
		    var bbox = new OpenLayers.Bounds(xUL,yLR,xLR,yUL);
		    bbox.transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    me.map.getProjectionObject()
		      );
		    if (map!=null) {
		    	map.zoomToExtent(bbox);
		    	if (this.linkedLayers) {
		    		for (var i = 0 ; i < this.linkedLayers.length ; i++) {
		    			var layers = map.getLayersByName(this.linkedLayers[i]);
		    			if (layers.length > 0) {
		    				layers[0].setVisibility(true);
		    			}
		    		}
		    	}
		    }

		    if (me.mapapp!=null&& me.config.dashboard.openOnSelect) {
		    	me.mapapp.openDashBoardAt(new OpenLayers.LonLat(lon,lat), me.config.dashboard.options);
		    }

		    this.selectedRecord = record; 

		    for (var j=i+1 ; j < combos.length ; j++) {
		    	combos[j].clearValue();

		    }
	  	});
    },
    
    /** private: method[onRender]
     *  Private method called when the legend panel is being rendered.
     */
    onRender: function() {
        GeoExt.ShortcutsComboPanelZAE.superclass.onRender.apply(this, arguments);
    },

    /** private: method[onDestroy]
     *  Private method called during the destroy sequence.
     */
    onDestroy: function() {
        /*if(this.layerStore) {
            this.layerStore.un("add", this.onStoreAdd, this);
            this.layerStore.un("remove", this.onStoreRemove, this);
            this.layerStore.un("update", this.onStoreUpdate, this);
        }*/
        GeoExt.ShortcutsComboPanelZAE.superclass.onDestroy.apply(this, arguments);
    }
    
});

/** api: xtype = gx_shortcutscombopanel */
Ext.reg('gx_shortcutscombopanelzae', GeoExt.ShortcutsComboPanelZAE);
