OpenLayers.DOTS_PER_INCH = 90.71;
//OpenLayers.ImgPath = '../js/OpenLayers/theme/default/img/';
OpenLayers.ImgPath = '../js/OpenLayers/img/';

OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

// Define a constant with the base url to the MapFish web service.
//mapfish.SERVER_BASE_URL = '../../../../../'; // '../../';

// Remove pink background when a tile fails to load
OpenLayers.Util.onImageLoadErrorColor = "transparent";

// Lang
OpenLayers.Lang.setCode(GeoNetwork.defaultLocale);

OpenLayers.Util.onImageLoadError = function () {
	this._attempts = (this._attempts) ? (this._attempts + 1) : 1;
	if (this._attempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
		this.src = this.src;
	} else {
		this.style.backgroundColor = OpenLayers.Util.onImageLoadErrorColor;
		this.style.display = "none";
	}
};

// add Proj4js.defs here
// Proj4js.defs["EPSG:27572"] = "+proj=lcc +lat_1=46.8 +lat_0=46.8 +lon_0=0 +k_0=0.99987742 +x_0=600000 +y_0=2200000 +a=6378249.2 +b=6356515 +towgs84=-168,-60,320,0,0,0,0 +pm=paris +units=m +no_defs";
Proj4js.defs["EPSG:2154"] = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
//new OpenLayers.Projection("EPSG:900913")


GeoNetwork.map.printCapabilities = "../../pdf";

// Config for WGS84 based maps
//GeoNetwork.map.PROJECTION = "EPSG:4326";
//GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-180, -90, 180, 90);
//GeoNetwork.map.MAXEXTENT = GeoNetwork.Geoportal.MAXEXTENT?GeoNetwork.Geoportal.MAXEXTENT:new OpenLayers.Bounds(-180, -90, 180, 90);
//GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-5.1,41,9.7,51);
var ovmapWmsURL = window.Geoportal.overviewWmsUrl?window.Geoportal.overviewWmsUrl:'http://gm-risk.ige.fr/geoserver-prod/wms';
var ovmapWmsLayers = window.Geoportal.overviewWmsLayers?window.Geoportal.overviewWmsLayers:'gm_fond_carto';
var ovmapWmsFormat = window.Geoportal.overviewWmsFormat?window.Geoportal.overviewWmsFormat:'image/jpeg';

var plainMapTitle = window.Geoportal.plainMapTitle?window.Geoportal.plainMapTitle:'Low resolution base map';
var plainMapWmsUrl = window.Geoportal.plainMapWmsUrl?window.Geoportal.plainMapWmsUrl:'http://gm-risk.ige.fr/geoserver-prod/wms';
var plainMapWmsLayers = window.Geoportal.plainMapWmsLayers?window.Geoportal.plainMapWmsLayers:'gm_fond_carto';
var plainMapWmsFormat = window.Geoportal.plainMapWmsFormat?window.Geoportal.plainMapWmsFormat:'image/jpeg';

GeoNetwork.map.ovmapLayers = [new OpenLayers.Layer.WMS('ovmap', ovmapWmsURL, {layers: ovmapWmsLayers, format: ovmapWmsFormat, TILED:'true'})];
GeoNetwork.map.BACKGROUND_LAYERS = [
	/*<jp>*//*jp : commented*/
    //new OpenLayers.Layer.WMS("Background layer", "localhost:8081/geoserver/wms", {layers: 'ige:Cntry00', format: 'image/jpeg'}, {isBaseLayer: true})
	/*jp: added*/
	new OpenLayers.Layer.WMS(plainMapTitle, plainMapWmsUrl, {layers: plainMapWmsLayers, format: plainMapWmsFormat, TILED:'true'}, {isBaseLayer: true})
	];
if (window.Geoportal.online) {
	if (window.Geoportal.withGoogleLayers) {
		GeoNetwork.map.BACKGROUND_LAYERS.push(new OpenLayers.Layer.Google(
		 	      "Google Satellite",
		 	      {type: google.maps.MapTypeId.SATELLITE, 'sphericalMercator': true, numZoomLevels: 22}
			));
	}
	if (window.Geoportal.withBingLayers) {
        // API key for http://openlayers.org. Please get your own at
        // http://bingmapsportal.com/ and use that instead.
        var apiKey = "AtHrMshzkRHEOelkVaRq0f7QvQ5efNeplV4rNKhTGZgO7J5lkDsz3hE5xOW39jR3";
        var aerial = new OpenLayers.Layer.Bing({
            name: "Bing Aerial",
            key: apiKey,
            type: "Aerial"
        });
        GeoNetwork.map.BACKGROUND_LAYERS.splice(0,1,aerial); //puts it in first place to make it the default one 
        //added specific triggers, since roads and hybrid suck : almost sure I'll be asked to remove them
        if (window.Geoportal.withBingRoads) {
	        var road = new OpenLayers.Layer.Bing({
	            name: "Bing Road",
	            key: apiKey,
	            type: "Road"
	        });
	        GeoNetwork.map.BACKGROUND_LAYERS.push(road);
        }
        if (window.Geoportal.withBingHybrid) {
	        var hybrid = new OpenLayers.Layer.Bing({
	            name: "Bing Hybrid",
	            key: apiKey,
	            type: "AerialWithLabels"
	        });
	        GeoNetwork.map.BACKGROUND_LAYERS.push(hybrid);
        }
	}
	
	GeoNetwork.map.BACKGROUND_LAYERS.push(new OpenLayers.Layer.OSM());
	GeoNetwork.map.BACKGROUND_LAYERS.push(new OpenLayers.Layer.OSM("OpenStreetMap Humanitarian",
			["http://a.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png",
			   "http://b.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png",
			   "http://c.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png"]
			));
}

//// Config for OSM based maps
GeoNetwork.map.PROJECTION = "EPSG:900913";
////GeoNetwork.map.EXTENT = new OpenLayers.Bounds(-550000, 5000000, 1200000, 7000000);
GeoNetwork.map.EXTENT = window.Geoportal.EXTENT?new OpenLayers.Bounds(window.Geoportal.EXTENT):new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.0037508345578495E7,2.0037508345578495E7);
GeoNetwork.map.RESTRICTEDEXTENT = window.Geoportal.RESTRICTEDEXTENT?new OpenLayers.Bounds(window.Geoportal.RESTRICTEDEXTENT):new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.0037508345578495E7,2.0037508345578495E7);
GeoNetwork.map.MAXEXTENT = new OpenLayers.Bounds(-2.003750834E7,-2.003750834E7,2.0037508345578495E7,2.0037508345578495E7);
//GeoNetwork.map.BACKGROUND_LAYERS = [
//    new OpenLayers.Layer.OSM()
//    //new OpenLayers.Layer.Google("Google Streets");
//];

GeoNetwork.map.RESOLUTIONS = [156543.033928041, 78271.51696402048, 39135.75848201023, 19567.87924100512, 9783.93962050256, 4891.96981025128, 2445.98490512564, 1222.99245256282, 611.49622628141, 305.7481131407048, 152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395];

// Define background map layer from an OGC Context. 
// If a context is defined then GeoNetwork.map.BACKGROUND_LAYERS is ignored.
//* DEMIS country layer
//GeoNetwork.map.OWS = "../../maps/demis.xml";
//* Default GeoServer layers
//GeoNetwork.map.OWS = "../../maps/geoserver_localhost.xml";
/*<jp>commented*///GeoNetwork.map.CONTEXT = "../../maps/geoserver_localhost.wmc";

GeoNetwork.map.CONTEXT_MAP_OPTIONS = {
 controls: [],
 theme:null
};

GeoNetwork.map.CONTEXT_MAIN_MAP_OPTIONS = {
 controls: [],
 theme:null
};

//unused in geoportal config
GeoNetwork.map.MAP_OPTIONS = {
 projection: GeoNetwork.map.PROJECTION,
 maxExtent: GeoNetwork.map.MAXEXTENT,
 restrictedExtent: GeoNetwork.map.RESTRICTEDEXTENT,
 resolutions: GeoNetwork.map.RESOLUTIONS,
 controls: [],
 theme:null
};

GeoNetwork.map.MAIN_MAP_OPTIONS = {
 projection: GeoNetwork.map.PROJECTION,
 extent: GeoNetwork.map.EXTENT,
 maxExtent: GeoNetwork.map.MAXEXTENT,
 restrictedExtent: GeoNetwork.map.RESTRICTEDEXTENT,
 resolutions: GeoNetwork.map.RESOLUTIONS,
 //controls: [],
 controls: [
	           new OpenLayers.Control.MousePosition( {'prefix': 'Lon ', 'separator':'°, Lat ', 'suffix':'°','numDigits':3, displayProjection:new OpenLayers.Projection("WGS84")})
	           //,new OpenLayers.Control.OverviewMap({layers: GeoNetwork.map.ovmapLayers,maximized:true, minRatio:16,maxRatio:128,size : new OpenLayers.Size(130,100)})
	           ],
 theme:null
};
