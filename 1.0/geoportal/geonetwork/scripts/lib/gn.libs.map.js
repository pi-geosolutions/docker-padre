Ext.namespace("GeoNetwork","GeoNetwork.OGCUtil");
GeoNetwork.OGCUtil.getProtocolVersion=function(){return"1.3.0"
};
GeoNetwork.OGCUtil.getLanguage=function(){return Env.lang
};
GeoNetwork.OGCUtil.ensureProperUrlEnd=function(a){if(a.indexOf("?")==-1){a+="?"
}else{var b=a.substring(a.length-1);
if(b!="&"&&b!="?"){a+="&"
}}return a
};
GeoNetwork.OGCUtil.reprojectMap=function(b,c,f){if(b.projection!=c.projCode){b.baseLayer.options.scales=b.scales;
var k=b.getProjectionObject();
b.projection=c.projCode;
if(c.getUnits()===null){b.units="degrees"
}else{b.units=c.getUnits()
}var e=null;
if(b.getControlsByClass("GeoNetwork.Control.CursorPos").length>0){e=b.getControlsByClass("GeoNetwork.Control.CursorPos")[0]
}if(b.units=="m"&&e!==null){e.numdigits=0
}else{if(b.units=="degrees"&&e!==null){e.numdigits=4
}}b.maxExtent=b.maxExtent.transform(k,c);
b.baseLayer.extent=b.maxExtent;
var a=b.getExtent().transform(k,c);
for(var g=0;
g<b.layers.length;
g++){var h=b.layers[g];
h.units=b.units;
h.projection=c;
h.maxExtent=b.maxExtent;
if(h.isBaseLayer){h.initResolutions()
}else{h.resolutions=b.baseLayer.resolutions;
h.minResolution=b.baseLayer.minResolution;
h.maxResolution=b.baseLayer.maxResolution
}if(h instanceof OpenLayers.Layer.Vector){for(var d=0;
d<h.features.length;
d++){var l=h.features[d];
if(l.geometry.projection!=b.projection){l.geometry.transform(new OpenLayers.Projection(l.geometry.projection),b.getProjectionObject());
l.geometry.projection=b.projection
}}}}if(!f){b.zoomToExtent(a)
}}};
GeoNetwork.OGCUtil.layerExistsInMap=function(d,j){var f=false;
for(var c=0,a=j.layers.length;
c<a;
c++){if(j.layers){var b=j.layers[c];
if(b.params){try{var h=b.params.LAYERS.split(",");
if(((h.indexOf(d.params.LAYERS)!=-1)||(b.params.LAYERS==d.params.LAYERS))&&b.params.SERVICE==d.params.SERVICE&&b.url==d.url){f=b;
break
}}catch(g){}}}}return f
};Ext.namespace("GeoNetwork","GeoNetwork.MapStateManager");
GeoNetwork.MapStateManager=function(){var b="@";
var g="|";
var h="maplayers";
var c="mapextent";
var a="";
var e="";
var i=function(k){var m="";
var j=document.cookie.indexOf(k+"=");
if(j!=-1){j+=k.length+1;
var l=document.cookie.indexOf(";",j);
if(l==-1){l=document.cookie.length
}m=document.cookie.substring(j,l)
}return m
};
var d=function(j,k){var m=j+"="+k;
var l=new Date();
l.setDate(l.getDate()+1);
m+=";expires="+l.toGMTString();
document.cookie=m
};
var f=function(k,j){if(typeof(k)!="undefined"){return k
}else{if(typeof(j)!="undefined"){return j
}else{return""
}}};
return{storeMapLayersState:function(p){var o=p.layers;
var n="";
for(var m=0;
m<o.length;
m++){if((!o[m].isBaseLayer)&&(o[m].displayInLayerSwitcher)){var q=Object.toJSON(o[m].params);
var l=Object.toJSON(o[m].options);
var k=f(o[m].opacity,1);
var j=o[m].name+g+o[m].url+g+q+g+l+g+k;
if(n.length>0){n=n+b
}n=n+j
}}d(h,n)
},stoteMapExtextState:function(l){var j=l.getExtent();
var k=j.left+g+j.bottom+g+j.right+g+j.top;
d(c,k)
},loadMapState:function(){var j=i(h);
if(j!=""){a=j
}j=i(c);
if(j!=""){e=j
}},applyMapState:function(j){if(a!=""){var s=a.split(b);
for(var o=0;
o<s.length;
o++){var r=s[o].split(g);
if(r.length==5){var k=r[0];
var l=r[1];
var m=r[2].evalJSON(true);
var u=r[3].evalJSON(true);
var p=r[4];
var n=new OpenLayers.Layer.WMS(k,l,m,u);
if(!GeoNetwork.OGCUtil.layerExistsInMap(n,j)){if(p){n.setOpacity(parseFloat(p))
}j.addLayer(n)
}}}}if(e){var q=e.split(g);
if(q.length==4){var t=new OpenLayers.Bounds(q[0],q[1],q[2],q[3]);
j.zoomToExtent(t)
}}}}
};
GeoNetwork.MapStateManager=new GeoNetwork.MapStateManager();Ext.namespace("GeoNetwork","GeoNetwork.CatalogueInterface");
GeoNetwork.CatalogueInterface=function(){var f;
var a;
var e;
var d=function(h){f=h
};
var g=function(h,p,l){var q=null;
for(var j=0,n=p.length;
j<n;
++j){var k=p[j];
try{var m=k.name.split(",");
if(m.indexOf(l.params.LAYERS)!=-1){q=k;
break
}}catch(o){}if(typeof(k.nestedLayers)!="undefined"){q=g(h,k.nestedLayers,l);
if(q!==null){break
}}}return q
};
var b=function(p){a.hide();
var j=new OpenLayers.Format.WMSCapabilities();
var o=j.read(p.responseXML||p.responseText);
if(o.capability){var n=o.service.accessContraints;
if((n)&&(n.toLowerCase()!="none")&&(n!="-")){var k=new GeoNetwork.DisclaimerWindow({disclaimer:n});
k.show();
k=null
}if(f){for(var r=0,t=e.length;
r<t;
r++){var l=e[r][0];
var h=e[r][1];
var s=e[r][2];
var m=e[r][3];
var q=new OpenLayers.Layer.WMS(l,h,{layers:s,format:"image/png",transparent:"TRUE",version:o.version,language:GeoNetwork.OGCUtil.getLanguage()},{queryable:true,singleTile:true,ratio:1,buffer:0,transitionEffect:"resize",metadata_id:m});
if(!GeoNetwork.OGCUtil.layerExistsInMap(q,f)){q.events.on({loadstart:function(){this.isLoading=true
}});
q.events.on({loadend:function(){this.isLoading=false
}});
var u=g(o,o.capability.layers,q);
if(u){q.queryable=u.queryable;
q.name=u.title||q.name;
q.llbbox=u.llbbox;
q.styles=u.styles;
q.dimensions=u.dimensions
}f.addLayer(q)
}}}}};
var c=function(h){a.hide();
Ext.MessageBox.alert(OpenLayers.i18n("loadLayer.error.title"),OpenLayers.i18n("loadLayer.error.message"))
};
return{init:function(h){d(h)
},addLayers:function(j){if(j.length===0){return
}a=new Ext.LoadMask(f.div,{msg:OpenLayers.Lang.translate("loadLayer.loadingMessage")});
a.show();
var h=j[0][1];
e=j;
var n=(h.indexOf("version=")>-1);
var m={service:"WMS",request:"GetCapabilities",language:GeoNetwork.OGCUtil.getLanguage()};
if(!n){m.version=GeoNetwork.OGCUtil.getProtocolVersion()
}var l=OpenLayers.Util.getParameterString(m);
var k=(h.indexOf("?")>-1)?"&":"?";
h+=k+l;
var i=Ext.Ajax.request({url:OpenLayers.Util.removeTail(OpenLayers.ProxyHost),method:"GET",params:{url:h},success:b,failure:c,timeout:10000})
}}
};
GeoNetwork.CatalogueInterface=new GeoNetwork.CatalogueInterface();Ext.namespace("GeoNetwork","GeoNetwork.WMC");
GeoNetwork.WMC=function(){return{loadWmc:function(f,a){try{var e=f.layers;
for(var b=e.length-1;
b>0;
b--){if(!e[b].isBaseLayer){f.removeLayer(e[b])
}}Ext.getCmp("toctree").getSelectionModel().clearSelections();
var d=new OpenLayers.Format.WMC({layerOptions:{buffer:0}});
f=d.read(a,{map:f})
}catch(c){Ext.MessageBox.alert(OpenLayers.i18n("selectWMCFile.errorLoadingWMC"))
}},mergeWmc:function(d,a){try{var c=new OpenLayers.Format.WMC({layerOptions:{buffer:0}});
d=c.read(a,{map:d})
}catch(b){Ext.MessageBox.alert(OpenLayers.i18n("selectWMCFile.errorLoadingWMC"))
}},saveContext:function(b){var a=new OpenLayers.Format.WMC();
OpenLayers.Request.POST({url:"../../wmc/create.wmc",data:a.write(b),success:this.onSaveContextSuccess,failure:this.onSaveContextFailure})
},onSaveContextSuccess:function(a){var b=a.responseText;
var c=Ext.decode(b);
if(c.success){window.location=c.url
}else{this.onSaveContextFailure()
}},onSaveContextFailure:function(a,b){Ext.MessageBox.show({icon:Ext.MessageBox.ERROR,title:OpenLayers.i18n("saveWMCFile.windowTitle"),msg:OpenLayers.i18n("saveWMCFile.errorSaveWMC"),buttons:Ext.MessageBox.OK})
}}
};
GeoNetwork.WMCManager=new GeoNetwork.WMC();if(!window.GeoNetwork){window.GeoNetwork={}
}if(!GeoNetwork.Control){GeoNetwork.Control={}
}GeoNetwork.Control.ExtentBox=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,minxelement:null,minyelement:null,maxxelement:null,maxyelement:null,EVENT_TYPES:["finishBox"],initialize:function(a){this.EVENT_TYPES=GeoNetwork.Control.ExtentBox.prototype.EVENT_TYPES.concat(OpenLayers.Control.prototype.EVENT_TYPES);
OpenLayers.Control.prototype.initialize.apply(this,arguments);
this.handler=new OpenLayers.Handler.RegularPolygon(this,{create:this.startBox,done:this.endBox},{irregular:true})
},setMap:function(a){OpenLayers.Control.prototype.setMap.apply(this,arguments)
},startBox:function(){this.getOrCreateLayer();
this.vectorLayer.destroyFeatures()
},endBox:function(){var d=this.handler.feature.geometry.getBounds();
var f=new OpenLayers.Feature.Vector(d.toGeometry(),null,this.vectorLayerStyle);
this.vectorLayer.addFeatures([f]);
this.vectorLayer.refresh();
var e=this.map.getProjectionObject();
var b=new OpenLayers.Projection("WGS84");
var c=new OpenLayers.LonLat(d.left,d.bottom).transform(e,b);
var a=new OpenLayers.LonLat(d.right,d.top).transform(e,b);
if(this.minxelement){this.minxelement.dom.value=c.lon.toFixed(4)
}if(this.maxxelement){this.maxxelement.dom.value=a.lon.toFixed(4)
}if(this.minyelement){this.minyelement.dom.value=c.lat.toFixed(4)
}if(this.maxyelement){this.maxyelement.dom.value=a.lat.toFixed(4)
}this.events.triggerEvent("finishBox",null)
},updateMap:function(){if((!this.minxelement)||(!this.maxxelement)||(!this.minyelement)||(!this.maxyelement)){return
}this.getOrCreateLayer();
var i=this.map.getProjectionObject();
var c=new OpenLayers.Projection("WGS84");
var h=new OpenLayers.LonLat(this.map.getExtent().left,this.map.getExtent().bottom).transform(i,c);
var e=new OpenLayers.LonLat(this.map.getExtent().right,this.map.getExtent().top).transform(i,c);
var d=parseFloat(this.minxelement.dom.value);
if(isNaN(d)){this.minxelement.dom.value=h.lon
}d=parseFloat(this.maxxelement.dom.value);
if(isNaN(d)){this.maxxelement.dom.value=e.lon
}d=parseFloat(this.minyelement.dom.value);
if(isNaN(d)){this.minyelement.dom.value=h.lat
}d=parseFloat(this.maxyelement.dom.value);
if(isNaN(d)){this.maxyelement.dom.value=e.lat
}this.minxelement.dom.value=parseFloat(this.minxelement.dom.value).toFixed(4);
this.maxxelement.dom.value=parseFloat(this.maxxelement.dom.value).toFixed(4);
this.minyelement.dom.value=parseFloat(this.minyelement.dom.value).toFixed(4);
this.maxyelement.dom.value=parseFloat(this.maxyelement.dom.value).toFixed(4);
this.vectorLayer.destroyFeatures();
var a=new OpenLayers.LonLat(this.minxelement.dom.value,this.minyelement.dom.value).transform(c,i);
var f=new OpenLayers.LonLat(this.maxxelement.dom.value,this.maxyelement.dom.value).transform(c,i);
var b=new OpenLayers.Bounds();
b.extend(a);
b.extend(f);
var g=new OpenLayers.Feature.Vector(b.toGeometry(),null,this.vectorLayerStyle);
this.vectorLayer.addFeatures([g]);
this.vectorLayer.refresh()
},getOrCreateLayer:function(){if(!this.vectorLayer){this.vectorLayer=this.vectorLayer||new OpenLayers.Layer.Vector("ExtentBox",{style:this.vectorLayerStyle});
this.map.addLayer(this.vectorLayer)
}return this.vectorLayer
},clear:function(){if(this.vectorLayer){this.vectorLayer.destroyFeatures()
}},zoomTo:function(){var e=this.map.getProjectionObject();
var b=new OpenLayers.Projection("WGS84");
var d=new OpenLayers.LonLat(this.minxelement.dom.value,this.minyelement.dom.value).transform(b,e);
var a=new OpenLayers.LonLat(this.maxxelement.dom.value,this.maxyelement.dom.value).transform(b,e);
var c=new OpenLayers.Bounds();
c.extend(d);
c.extend(a);
this.map.zoomToExtent(c)
},CLASS_NAME:"GeoNetwork.Control.ExtentBox"});if(!window.GeoNetwork){window.GeoNetwork={}
}if(!GeoNetwork.Control){GeoNetwork.Control={}
}GeoNetwork.Control.ZoomWheel=OpenLayers.Class(OpenLayers.Control,{wheelChange:OpenLayers.Control.Navigation.prototype.wheelChange,draw:function(){this.handler=new OpenLayers.Handler.MouseWheel(this,{up:OpenLayers.Control.Navigation.prototype.wheelUp,down:OpenLayers.Control.Navigation.prototype.wheelDown});
this.activate()
},CLASS_NAME:"GeoNetwork.Control.ZoomWheel"});Ext.namespace("GeoNetwork","GeoNetwork.lang");
GeoNetwork.lang.en={featureInfoTooltipTitle:"Feature info",featureInfoTooltipText:"Click in the map to get feature info from all visible layers.",zoomToMaxExtentTooltipTitle:"Full extent",zoomToMaxExtentTooltipText:"Use this button to go to the full extent of the map.",zoominTooltipTitle:"Zoom in",zoominTooltipText:"Draw a box in the map to zoom in. You can also click in the map and map will zoom in by a factor of 2.",zoomoutTooltipTitle:"Zoom out",zoomoutTooltipText:"Click in the map or draw a box to zoom out.",dragTooltipTitle:"Pan map",dragTooltipText:"Press the left mouse button to drag the map.",previousTooltipTitle:"Previous map extent",previosTooltipText:"Click this button to go back to the previous map extent",nextTooltipTitle:"Next map extent",nextTooltipText:"Click this button to go to the next map extent",featureInfoTitle:"Feature info",layerManagerTabTitle:"Layer management",legendTabTitle:"Legend",scaleTitle:"Scale",xTitle:"X",yTitle:"Y",projectionTitle:"Projection",FeatureInfoNotQueryable:"There is no queryable map layer",WMSBrowserTab1:"Select",WMSBrowserTab3:"External",WMSBrowserPreviewTitle:"Preview layer",WMSBrowserAddButton:"Add",WMSBrowserDuplicateMsg:"Layer is already in the map",WMSBrowserPreviewWaitMsg:"Retrieving preview image",WMSBrowserConnectButton:"Connect",WMSBrowserConnectError:"There was an error connecting to the Web Map Service, please check the URL.",infoTitle:"Information","mf.print.mapTitle":"Title","mf.print.comment":"Comment","mf.print.dpi":"Resolution","mf.print.scale":"Scale","mf.print.rotation":"Angle","mf.print.resetPos":"Reset","mf.print.print":"Print","mf.print.generatingPDF":"Generating PDF","mf.print.unableToPrint":"It was not possible to print, try later","mf.error":"Error",selectExtentTooltipTitle:"Select extent",selectExtentTooltipText:"Select extent for catalog searches",printTooltipTitle:"Print",printTooltipText:"Print the current map",savewmcTooltipTitle:"Save web map context",savewmcTooltipText:"Saves web map context for current map","saveWMCFile.windowTitle":"Save Web Map Context","saveWMCFile.errorSaveWMC":"Could not save Web Map Context",loadwmcTooltipTitle:"Load web map context",loadwmcTooltipText:"Loads web map context in current map","selectWMCFile.windowTitle":"Load Web Map Context",selectWMCFile:"Select Web Map Context file","selectWMCFile.waitLoadingWMC":"Loading Web Map Context","selectWMCFile.loadButtonText":"Load","selectWMCFile.mergeButtonText":"Merge","selectWMCFile.errorLoadingWMC":"Could not load Web Map Context",opacityButtonText:"Opacity",opacityWindowTitle:"Opacity",metadataButtonText:"Metadata",removeButtonText:"Remove",addWMSButtonText:"Add WMS",addWMSWindowTitle:"Add WMS","layerInfoPanel.windowTitle":"Layer metadata","layerInfoPanel.titleField":"Title","layerInfoPanel.descriptionField":"Description","layerInfoPanel.queryableField":"Queryable",layerList:"Layer list",baseLayerList:"Base layers","metadataResults.buttonText":"Metadata results","metadataResults.tooltipTitle":"Metadata results","metadataResults.tooltipText":"Go to metadata results page","metadataResults.alertTitle":"Metadata results","metadataResults.alertText":"No metadata results to show","featureInfoWindow.windowTitle":"Feature info","mf.information":"Print","mf.print.pdfReady":"PDF ready","loadLayer.loadingMessage":"Loading layer","loadLayer.error.title":"Load layer","loadLayer.error.message":"The layer could not be loaded","disclaimer.windowTitle":"Disclaimer","disclaimer.loading":"Loading...","disclaimer.buttonClose":"Close",gazetteerAddressField1Label:"Postcode",gazetteerAddressField2Label:"Street",gazetteerAddressField3Label:"Place",gazetteerAddressField4Label:"Municipality",gazetteerAddressField5Label:"House number",searchOptionButton:"Search",GazetteerWindowTitle:"Search for address",searchResults:"Search results",errorTitle:"Error",SearchOptionLoadFailureMsg:"No results available. \n The service may be unavailable. \n",gazetteerTooltipTitle:"Search based on an address",gazetteerTooltipText:"Search for a location, based on postcode, street name, municipality or place.",SearchOptionNoResults:"No results found",zoomlayerTooltipTitle:"Zoom to layer",zoomlayerTooltipText:"Use this button to go to the full extent of the selected layer.","zoomlayer.selectLayerTitle":"Zoom to layer","zoomlayer.selectLayerText":"No layer selected",layerStylesWindowTitle:"Layer styles",layerStylesPreviewTitle:"Preview legend",selectStyleButton:"Select style",WMSTimeWindowTitle:"WMS Time",WMSTimePositionTitle:"Pick a time position",WMSTimeMovieTitle:"Play animation",wmsTimeUpdateButtonText:"Apply",WMSTimeAnimationCheckbox:"Play a movie loop spanning the last ${steps} time positions"};
OpenLayers.Util.extend(OpenLayers.Lang.en,GeoNetwork.lang.en);Ext.namespace("GeoNetwork","GeoNetwork.lang");
GeoNetwork.lang.de={featureInfoTooltipTitle:"Objekteigenschaften anzeigen",featureInfoTooltipText:"Klicken Sie in die Karte um Informationen von allen aktuell sichtbaren Datenschichten abzufragen.",zoomToMaxExtentTooltipTitle:"Gesamte Ausdehnung",zoomToMaxExtentTooltipText:"Verwenden Sie diese Taste, um auf die gesamte Ausdehnung der Karte zu zoomen.",zoominTooltipTitle:"Vergrš§ern",zoominTooltipText:"Ziehen Sie in der Karte ein Rechteck auf, um die Karte auf diesen Bereich zu vergrš§ern. Ein einfacher Click vergrš§ert die Karte um Faktor 2.",zoomoutTooltipTitle:"Verkleinern",zoomoutTooltipText:"Ziehen Sie in der Karte ein Rechteck auf, um die Karte auf diesen Bereich zu verkleinern.",dragTooltipTitle:"Karte verschieben",dragTooltipText:"Verschieben Sie die Karte mit der linke Maustaste.",previousTooltipTitle:"Ansicht zurueck",previosTooltipText:"Klicken Sie auf diese Taste, um zur vorherigen Ausdehnung der Karte zurueckzukehren.",nextTooltipTitle:"Ansicht vor",nextTooltipText:"Klicken Sie diese Taste, um zur nŠchsten Ausdehnung der Karte zur gelangen.",featureInfoTitle:"Objekteigenschaften anzeigen",layerManagerTabTitle:"Datenschichten verwalten",legendTabTitle:"Legende",scaleTitle:"Skalieren",xTitle:"X",yTitle:"Y",projectionTitle:"Projektion",FeatureInfoNotQueryable:"Keine abfragbare Datenschicht vorhanden",WMSBrowserTab1:"Selektieren",WMSBrowserTab3:"Extern",WMSBrowserPreviewTitle:"Datenschicht Vorschau",WMSBrowserAddButton:"Hinzufuegen",WMSBrowserDuplicateMsg:"Datenschicht existiert bereits in der Karte",WMSBrowserPreviewWaitMsg:"Vorheriges Bild wiedererwerben",WMSBrowserConnectButton:"Verbinden",WMSBrowserConnectError:"Fehler wŠhrend dem Verbindungsaufbau zum Web Map Service, bitte URL ueberpruefen.",infoTitle:"Information","mf.print.mapTitle":"Titel","mf.print.comment":"Kommentar","mf.print.dpi":"Auflšsung","mf.print.scale":"Skalierung","mf.print.rotation":"Winkel","mf.print.resetPos":"Zueruecksetzen","mf.print.print":"Drucken","mf.print.generatingPDF":"PDF wird erzeugt","mf.print.unableToPrint":"Druckvorgang fehlgeschlagen, bitte spŠter nochmals probieren","mf.error":"Fehler",selectExtentTooltipTitle:"Ausdehnung wŠhlen",selectExtentTooltipText:"Ausdehnung wŠhlen fuer Katalogsuche",printTooltipTitle:"Drucken",printTooltipText:"Aktuelle Karte drucken",savewmcTooltipTitle:"Web map context speichern",savewmcTooltipText:"Web map context der aktuellen Karten in eine Datei abspeichern.","saveWMCFile.windowTitle":"Web map context speichern","saveWMCFile.errorSaveWMC":"Web Map Context konnte nicht gespeichert werden",loadwmcTooltipTitle:"Web map context laden",loadwmcTooltipText:"Web map context von einer Datei in die aktuelle Karte laden.","selectWMCFile.windowTitle":"Web map context laden",selectWMCFile:"Web Map Context Datei auswŠhlen","selectWMCFile.waitLoadingWMC":"Laden Web Map Context","selectWMCFile.loadButtonText":"Laden","selectWMCFile.mergeButtonText":"Zusammenfassen","selectWMCFile.errorLoadingWMC":"Web Map Context konnte nicht geladen werden",opacityButtonText:"Deckkraft",opacityWindowTitle:"Deckkraft",metadataButtonText:"Metadaten",removeButtonText:"Entfernen",addWMSButtonText:"WMS hinzufuegen",addWMSWindowTitle:"WMS hinzufuegen","layerInfoPanel.windowTitle":"Datenschicht Metadaten","layerInfoPanel.titleField":"Titel","layerInfoPanel.descriptionField":"Beschreibung","layerInfoPanel.queryableField":"Abfragbar",layerList:"Datenschicht Liste",baseLayerList:"Basis Datenschichten","metadataResults.buttonText":"Metadaten Ergebnisse","metadataResults.tooltipTitle":"Metadaten Ergebnisse","metadataResults.tooltipText":"Gehe zur Metadaten Ergebnis Seite","metadataResults.alertTitle":"Metadaten Ergebnisse","metadataResults.alertText":"Keine Metadaten Ergebnisse vorhanden","featureInfoWindow.windowTitle":"Objekteigenschaften anzeigen","mf.information":"Drucken","mf.print.pdfReady":"PDF bereit","loadLayer.loadingMessage":"Datenschicht Ladevorgang","loadLayer.error.title":"Datenschicht Ladevorgang Fehlermeldung","loadLayer.error.message":"Datenschicht konnte nicht geladen werden","disclaimer.windowTitle":"Verweigerung","disclaimer.loading":"Verweigerung Ladevorgang...","disclaimer.buttonClose":"Schlie§en",gazetteerAddressField1Label:"Postleitzahl",gazetteerAddressField2Label:"Stra§e",gazetteerAddressField3Label:"Platz",gazetteerAddressField4Label:"Gemeinde",gazetteerAddressField5Label:"Hausnummer",searchOptionButton:"Suche",GazetteerWindowTitle:"Suche Adresse",searchResults:"Suche Ergebnis",errorTitle:"Fehler",SearchOptionLoadFailureMsg:"Kein Ergebnis vorhanden.\n Service mšglicherweise nicht erreichbar.\n",gazetteerTooltipTitle:"Adressensuche",gazetteerTooltipText:"Ort-, Postleitzahl-, Stra§enname-, Gemeinde- oder Platzsuche.",SearchOptionNoResults:"Keine Ergebnisse gefunden",zoomlayerTooltipTitle:"Datenschicht vergrš§ern",zoomlayerTooltipText:"Verwenden Sie diese Taste, um das ganze Ausma§ der ausgewŠhlten Datenschicht.","zoomlayer.selectLayerTitle":"Selektiere Datenschichtvergrš§erung","zoomlayer.selectLayerText":"Kein Layer ausgewŠhlt",layerStylesWindowTitle:"Datenschicht Stil",layerStylesPreviewTitle:"Vorschau Legende",selectStyleButton:"WŠhle Stil",WMSTimeWindowTitle:"WMS Time",WMSTimePositionTitle:"WŠhle einen Zeitpunkt",WMSTimeMovieTitle:"Animation abspielen",wmsTimeUpdateButtonText:"Anwenden",WMSTimeAnimationCheckbox:"Film abspielen mit den letzten ${steps} Zeitpunkten"};
OpenLayers.Util.extend(OpenLayers.Lang.de,GeoNetwork.lang.de);Ext.namespace("GeoNetwork","GeoNetwork.lang");
GeoNetwork.lang.nl={featureInfoTooltipTitle:"Attribuut-informatie",featureInfoTooltipText:"Klik in de kaart om attribuut-informatie op te vragen van alle zichtbare lagen.",zoomToMaxExtentTooltipTitle:"Volledig kaartbeeld",zoomToMaxExtentTooltipText:"Klik op deze button om naar het volledig kaartbeeld te zoomen.",zoominTooltipTitle:"Zoom in",zoominTooltipText:"Trek een kader in kaart om in te zoomen. Ook kan er geklikt worden in de kaart waarna er met een factor 2 ingezoomd wordt.",zoomoutTooltipTitle:"Zoom uit",zoomoutTooltipText:"Klik in de kaart om gecentreerd op dit punt met een factor 2 uit te zoomen. Ook kan er een kader in de kaart getrokken worden, hoe kleiner dit kader hoe verder er uitgezoomd zal worden.",dragTooltipTitle:"Verschuif kaart",dragTooltipText:"Houd de linker muisknop ingedrukt en versleep de kaart.",previousTooltipTitle:"Vorige kaart extent",previosTooltipText:"Klik op deze button om terug te gaan naar de vorige kaart extent",nextTooltipTitle:"Volgende kaart extent",nextTooltipText:"Klik op deze button om verder te gaan naar de volgende kaart extent",featureInfoTitle:"Attribuut-informatie",layerManagerTabTitle:"Kaartlagenbeheer",legendTabTitle:"Legenda",scaleTitle:"Schaal",xTitle:"X",yTitle:"Y",projectionTitle:"Projectie",FeatureInfoNotQueryable:"Er is geen bevraagbare kaartlaag",WMSBrowserTab1:"Selecteren",WMSBrowserTab3:"Extern",WMSBrowserPreviewTitle:"Preview kaartlaag",WMSBrowserAddButton:"Voeg toe",WMSBrowserDuplicateMsg:"Kaartlaag is reeds aanwezig.",WMSBrowserPreviewWaitMsg:"Preview image ophalen",WMSBrowserConnectButton:"Maak verbinding",WMSBrowserConnectError:"Er is een fout opgetreden bij het maken van de verbinding, controleer de URL.",infoTitle:"Informatie","mf.print.mapTitle":"Titel","mf.print.comment":"Opmerkingen","mf.print.dpi":"Resolutie","mf.print.scale":"Schaal","mf.print.rotation":"Rotatie","mf.print.resetPos":"Terug naar begininstellingen","mf.print.print":"Print","mf.print.generatingPDF":"Aanmaken PDF","mf.print.unableToPrint":"Het was helaas niet mogelijk om te printen, probeert u het svp later nogmaals","mf.error":"Fout",selectExtentTooltipTitle:"Begrens zoekgebied",selectExtentTooltipText:"Begrens het zoekgebied door in de kaart een kader te trekken.",printTooltipTitle:"Print",printTooltipText:"Print de huidige kaart",savewmcTooltipTitle:"Opslaan WMC",savewmcTooltipText:"Sla een Web Map Context document op.","saveWMCFile.windowTitle":"Opslaan Web Map Context","saveWMCFile.errorSaveWMC":"Kon het WMC bestand niet opslaan",loadwmcTooltipTitle:"Open WMC",loadwmcTooltipText:"Opent een bestaand Web Map Context document in de kaart viewer","selectWMCFile.windowTitle":"Openen Web Map Context",selectWMCFile:"Select WMC bestand","selectWMCFile.waitLoadingWMC":"Laden Web Map Context","selectWMCFile.loadButtonText":"Openen","selectWMCFile.mergeButtonText":"Samenvoegen","selectWMCFile.errorLoadingWMC":"Kon het Web Map Context bestand niet openen",opacityButtonText:"Opaciteit",opacityWindowTitle:"Opaciteit",metadataButtonText:"Metadata",removeButtonText:"Verwijderen",addWMSButtonText:"Voeg WMS toe",addWMSWindowTitle:"Voeg WMS toe","layerInfoPanel.windowTitle":"Metadata van de kaartlaag","layerInfoPanel.titleField":"Titel","layerInfoPanel.descriptionField":"Samenvatting","layerInfoPanel.queryableField":"Bevraagbaar",layerList:"Kaartlagen",baseLayerList:"Ondergrond","metadataResults.buttonText":"Metadata resultaten","metadataResults.tooltipTitle":"Metadata resultaten","metadataResults.tooltipText":"Ga naar de metadata resultaatpagina","metadataResults.alertTitle":"Metadata resultaten","metadataResults.alertText":"Geen metadata resultaten om te tonen","featureInfoWindow.windowTitle":"Attribuut-informatie","mf.information":"Print","mf.print.pdfReady":"PDF gereed","loadLayer.loadingMessage":"Ophalen kaartlaag","loadLayer.error.title":"Ophalen kaartlaag","loadLayer.error.message":"De kaartlaag kon niet worden geladen","disclaimer.windowTitle":"Disclaimer","disclaimer.loading":"Laden...","disclaimer.buttonClose":"Sluiten",gazetteerAddressField1Label:"Postcode",gazetteerAddressField2Label:"Straat",gazetteerAddressField3Label:"Plaats",gazetteerAddressField4Label:"Gemeente",gazetteerAddressField5Label:"Huisnummer",searchOptionButton:"Zoek",GazetteerWindowTitle:"Zoek adres",searchResults:"Zoekresultaten",errorTitle:"Fout",SearchOptionLoadFailureMsg:"Het is niet gelukt resultaten op te halen.\nMogelijk is de service tijdelijk niet beschikbaar. \n",gazetteerTooltipTitle:"Zoek op basis van een adres",gazetteerTooltipText:"Zoek een locatie op basis van een postcode, straatnaam, gemeente en/of plaats.",SearchOptionNoResults:"Geen resultaten gevonden",zoomlayerTooltipTitle:"Zoom naar laag",zoomlayerTooltipText:"Gebruik deze knop om naar de volledige omvang van de geselecteerde laag.","zoomlayer.selectLayerTitle":"Zoom naar laag","zoomlayer.selectLayerText":"Geen laag geselecteerd",layerStylesWindowTitle:"Kaartlaag stijlen",layerStylesPreviewTitle:"Maak een voorvertoning van de legenda",selectStyleButton:"Selecteer kaartstijl",WMSTimeWindowTitle:"WMS Time",WMSTimePositionTitle:"Kies een tijdstip",WMSTimeMovieTitle:"Speel een animatie af",wmsTimeUpdateButtonText:"Doorvoeren",WMSTimeAnimationCheckbox:"Speel laatste ${steps} tijdstippen af"};
OpenLayers.Util.extend(OpenLayers.Lang.nl,GeoNetwork.lang.nl);Ext.namespace("GeoNetwork","GeoNetwork.lang");
GeoNetwork.lang.fr={featureInfoTooltipTitle:"caractéristique",featureInfoTooltipText:"Cliquer sur la carte pour obtenir des informations sur les données affichees.",zoomToMaxExtentTooltipTitle:"Zoom optimal",zoomToMaxExtentTooltipText:"Utiliser ce bouton pour tout afficher.",zoominTooltipTitle:"Zoomer",zoominTooltipText:"Dessiner un rectangle sur la carte pour zoomer. En cliquant sur la carte, le facteur de zoom est 2.",zoomoutTooltipTitle:"Dézoomer",zoomoutTooltipText:"Cliquer sur la carte ou dessiner un rectangle pour dézoomer.",dragTooltipTitle:"Main",dragTooltipText:"Appuyer sur le bouton gauche de la souris pour déplacer la carte.",previousTooltipTitle:"Revenir au zoom précédant",previosTooltipText:"Cliquer ici pour revenir au zoom précédant",nextTooltipTitle:"Zoom suivant",nextTooltipText:"Cliquer ici pour avancer au zoom suivant",featureInfoTitle:"Caractéristique",layerManagerTabTitle:"Gérer les couches",legendTabTitle:"Légende",scaleTitle:"Echelle",xTitle:"X",yTitle:"Y",projectionTitle:"Projection",FeatureInfoNotQueryable:"Il n'existe pas de carte correspondant à la requête",WMSBrowserTab1:"Sélectionner",WMSBrowserTab3:"Externe",WMSBrowserPreviewTitle:"Aperçu de la couche",WMSBrowserAddButton:"Ajouter",WMSBrowserDuplicateMsg:"La couche est déjà affichée",WMSBrowserPreviewWaitMsg:"Récupérer l'image precedente",WMSBrowserConnectButton:"Connexion",WMSBrowserConnectError:"Erreur de connexion au service Web, merci de vérifier l'URL.",infoTitle:"Information","mf.print.mapTitle":"Titre","mf.print.comment":"Commentaire","mf.print.dpi":"Résolution","mf.print.scale":"Echelle","mf.print.rotation":"Angle","mf.print.resetPos":"Reset","mf.print.print":"Imprimer","mf.print.generatingPDF":"Générer PDF","mf.print.unableToPrint":"Impression impossible, essayer plus tard","mf.error":"Erreur",selectExtentTooltipTitle:"Sélectionner aire",selectExtentTooltipText:"Sélectionner aire pour recherches annexes",printTooltipTitle:"Imprimer",printTooltipText:"Imprimer la carte actuelle",savewmcTooltipTitle:"Sauvegarder environnement (vue, paramètres,etc.)",savewmcTooltipText:"Sauvegarder environnement pour la carte actuelle","saveWMCFile.windowTitle":"Sauvegarder l'environnement","saveWMCFile.errorSaveWMC":"Sauvegarde de l'environnement impossible",loadwmcTooltipTitle:"Restaurer l'environnement",loadwmcTooltipText:"Restaurer l'environnement dans la carte actuelle","selectWMCFile.windowTitle":"Restaurer l'environnement",selectWMCFile:"Ouvrir un environnement","selectWMCFile.waitLoadingWMC":"Restauration de l'environnement en cours...","selectWMCFile.loadButtonText":"Charger","selectWMCFile.mergeButtonText":"Fusionner","selectWMCFile.errorLoadingWMC":"Chargement de l'environnement impossible",opacityButtonText:"Transparence",opacityWindowTitle:"Transparence",metadataButtonText:"Metadata",removeButtonText:"Supprimer",addWMSButtonText:"Ajouter WMS",addWMSWindowTitle:"Ajouter WMS","layerInfoPanel.windowTitle":"Couche metadata","layerInfoPanel.titleField":"Titre","layerInfoPanel.descriptionField":"Description","layerInfoPanel.queryableField":"Requête",layerList:"Liste des couches","metadataResults.buttonText":"Résultats Metadata","metadataResults.tooltipTitle":"résultats Metadata","metadataResults.tooltipText":"Aller a la page des résultats Metadata","metadataResults.alertTitle":"Résultats Metadata","metadataResults.alertText":"Pas de résultats Metadata","mf.information":"Imprimer","mf.print.pdfReady":"PDF prêt","loadLayer.loadingMessage":"Chargement de la couche","loadLayer.error.title":"Charger la couche","loadLayer.error.message":"La couche ne peut être chargée","disclaimer.windowTitle":"Disclaimer","disclaimer.loading":"Chargement...","disclaimer.buttonClose":"Fermer",gazetteerAddressField1Label:"Code postal",gazetteerAddressField2Label:"Street",gazetteerAddressField3Label:"Place",gazetteerAddressField4Label:"Municipalité",gazetteerAddressField5Label:"Numéro",searchOptionButton:"Recherche",GazetteerWindowTitle:"Résultat pour l'adresse",searchResults:"Recherche les résultats",errorTitle:"Erreur",SearchOptionLoadFailureMsg:"Pas de résultats trouvés. \n Le serveur peut être indisponible. \n",gazetteerTooltipTitle:"Recherche basée sur l'adresse",gazetteerTooltipText:"Recherche du lieu, basé sur le code postal, la rue, la municipalité ou place.",SearchOptionNoResults:"Pas de résultats trouvés.",zoomlayerTooltipTitle:"Zoom sur une couche",zoomlayerTooltipText:"Utilisez ce bouton pour accéder à la pleine mesure de le calque sélectionné.","zoomlayer.selectLayerTitle":"Zoom sur une couche","zoomlayer.selectLayerText":"No de calque sélectionné",layerStylesWindowTitle:"Layer styles",layerStylesPreviewTitle:"Preview legend",selectStyleButton:"Select style",WMSTimeWindowTitle:"WMS Time",WMSTimePositionTitle:"Time position",WMSTimeMovieTitle:"Animation",wmsTimeUpdateButtonText:"Apply",WMSTimeAnimationCheckbox:"Play a movie loop spanning the last ${steps} time positions"};
OpenLayers.Util.extend(OpenLayers.Lang.fr,GeoNetwork.lang.fr);Ext.namespace("GeoNetwork","GeoNetwork.lang");
GeoNetwork.lang.no={featureInfoTooltipTitle:"Featureinfo",featureInfoTooltipText:"Klikk i kartet for å få info om alle synlige lag.",zoomToMaxExtentTooltipTitle:"Fullt utsnitt",zoomToMaxExtentTooltipText:"Bruk knappen for å gå til fullt kartutsnitt.",zoominTooltipTitle:"Zoom inn",zoominTooltipText:"Tegn en boks i kartet for å zoome inn. Du kan goså klikke i kartet og zoome inn med 2x.",zoomoutTooltipTitle:"Zoom ut",zoomoutTooltipText:"Klikk i kartet eller tegn en boks for å zoome ut.",dragTooltipTitle:"Panorér kartet",dragTooltipText:"Klikk med venstre museknapp for å dra kartet.",previousTooltipTitle:"Forrige kartutsnitt",previosTooltipText:"Klikk denne knappen for å gå tilbake til forrige kartutsnitt",nextTooltipTitle:"Neste kartutnitt",nextTooltipText:"Klikk denne kanppen for å gå til neste kartutsnitt",featureInfoTitle:"Feature info",layerManagerTabTitle:"Laghåndtering",legendTabTitle:"Tegnforklaring",scaleTitle:"Skala",xTitle:"X",yTitle:"Y",projectionTitle:"Projeksjon",FeatureInfoNotQueryable:"Det er ikke noe spørrbart kartlag",WMSBrowserTab1:"Velg",WMSBrowserTab3:"Ekstern",WMSBrowserPreviewTitle:"Forhåndsvisning av lag",WMSBrowserAddButton:"Legg til",WMSBrowserDuplicateMsg:"Laget er allerede i kartet",WMSBrowserPreviewWaitMsg:"Henter forhåndsvisning",WMSBrowserConnectButton:"Koble til",WMSBrowserConnectError:"Det oppsto en feil ved tilkobling til tjenesten, kotrollér at URL'en er korrekt.",infoTitle:"Informasjon","mf.print.mapTitle":"Tittel","mf.print.comment":"Kommentar","mf.print.dpi":"Oppløsning","mf.print.scale":"Skala","mf.print.rotation":"Vinkel","mf.print.resetPos":"Reset","mf.print.print":"Skriv ut","mf.print.generatingPDF":"Genererer PDF","mf.print.unableToPrint":"Utskrift var ikke mulig, forsøk senere","mf.error":"Feil",selectExtentTooltipTitle:"Velg utsnitt",selectExtentTooltipText:"Velg utsnitt for katalogsøk",printTooltipTitle:"Skriv ut",printTooltipText:"Skriv ut nåværende kart",savewmcTooltipTitle:"Lagre kartoppsett",savewmcTooltipText:"Lagrer kartoppsettet for nåværende kart","saveWMCFile.windowTitle":"Lagre kartoppsettet (Web Map Context)","saveWMCFile.errorSaveWMC":"Kunne ikke lagre kartoppsettet",loadwmcTooltipTitle:"Last inn kartoppsett",loadwmcTooltipText:"Laster kartoppsett (WMC) i nåværende kart","selectWMCFile.windowTitle":"Last inn kartoppsett (Web Map Context)",selectWMCFile:"Velg fil for kartoppsett (Web Map Context)","selectWMCFile.waitLoadingWMC":"Laster kartoppsett","selectWMCFile.loadButtonText":"Last opp","selectWMCFile.mergeButtonText":"Slå sammen","selectWMCFile.errorLoadingWMC":"Kunne ikke laste kartoppsett",opacityButtonText:"Gjennomskinnlighet",opacityWindowTitle:"Gjennomskinnlighet",metadataButtonText:"Metadata",removeButtonText:"Fjern",addWMSButtonText:"Legg til WMS",addWMSWindowTitle:"Legg til WMS","layerInfoPanel.windowTitle":"Metadata for lag","layerInfoPanel.titleField":"Tittel","layerInfoPanel.descriptionField":"Beskrivelse","layerInfoPanel.queryableField":"Spørrbart",layerList:"Lagliste",baseLayerList:"Grunnkart-lag","metadataResults.buttonText":"Metadata resultater","metadataResults.tooltipTitle":"Metadata resultater","metadataResults.tooltipText":"Gå til metadata resultatside","metadataResults.alertTitle":"Metadata resultater","metadataResults.alertText":"Ingen metadata resultater å vise","featureInfoWindow.windowTitle":"Egenskapsinfo","mf.information":"Skriv ut","mf.print.pdfReady":"PDF klar","loadLayer.loadingMessage":"Laster kartlag","loadLayer.error.title":"Last kartlag","loadLayer.error.message":"Kunne ikke laste kartlaget","disclaimer.windowTitle":"Rettigheter","disclaimer.loading":"Laster...","disclaimer.buttonClose":"Lukk",gazetteerAddressField1Label:"Postnummer",gazetteerAddressField2Label:"Gatenavn",gazetteerAddressField3Label:"Sted",gazetteerAddressField4Label:"'Gemeente'",gazetteerAddressField5Label:"Nummer",searchOptionButton:"Søk",GazetteerWindowTitle:"Søk etter adresse",searchResults:"Søkeresultater",errorTitle:"Feil",SearchOptionLoadFailureMsg:"Ingen resultater tilgjengelige. \n Tjensten kan være utilgjenglig. \n",gazetteerTooltipTitle:"Søk basert på adresse",gazetteerTooltipText:"Søk etter et sted, basert på postnummer, gatenavn, eller sted.",SearchOptionNoResults:"Ingen resultateter funnet",zoomlayerTooltipTitle:"Zoom til kartlag",zoomlayerTooltipText:"Bruk denne knappen for å vise hele det valgte kartlaget.","zoomlayer.selectLayerTitle":"Zoom til kartlaget","zoomlayer.selectLayerText":"Ikke noe valgt kartlag",layerStylesWindowTitle:"Lagstiler",layerStylesPreviewTitle:"Forhåndsvis tegnforklaring",selectStyleButton:"Velg stil",WMSTimeWindowTitle:"WMS Tid",WMSTimePositionTitle:"Velg et tidspunkt",WMSTimeMovieTitle:"Spill av animasjon",wmsTimeUpdateButtonText:"Sett",WMSTimeAnimationCheckbox:"Spill en animasjonsløkke med de siste ${steps} tidspunktene"};
OpenLayers.Util.extend(OpenLayers.Lang.no,GeoNetwork.lang.no);Ext.namespace("GeoNetwork","GeoNetwork.lang");
GeoNetwork.lang.fi={featureInfoTooltipTitle:"Kohteen tiedot",featureInfoTooltipText:"Klikkaa karttaa saadaksesi kohteen tiedot kaikilta näkyvissä olevilta karttatasoilta.",zoomToMaxExtentTooltipTitle:"Näytä koko karttataso",zoomToMaxExtentTooltipText:"Paina tätä nappulaa nähdäksesi kartan koko laajuudeltaan.",zoominTooltipTitle:"Lähennä",zoominTooltipText:"Piirrä suorakaide lähentääksesi karttaa. Voit myös klikata karttaa, jolloin kartta näyttää kyseisen kohteen lähempää.",zoomoutTooltipTitle:"Loitonna",zoomoutTooltipText:"Klikkaa karttaa tai piirrä suorakaide loitontaaksesi karttaa.",dragTooltipTitle:"Siirrä karttaa",dragTooltipText:"Paina hiiren vasenta painiketta siirtääksesi karttaa.",previousTooltipTitle:"Edelliseen karttanäkymään",previosTooltipText:"Paina tätä nappulaa siirtyäksesi takaisin edelliseen karttanäkymään.",nextTooltipTitle:"Seuraavaan karttanäkymään",nextTooltipText:"Paina tätä nappulaa siirtyäksesi takaisin seuraavaan karttanäkymään.",featureInfoTitle:"Kohteen tiedot",layerManagerTabTitle:"Karttatasojen hallinta",legendTabTitle:"Selite",scaleTitle:"Mittakaava",xTitle:"X",yTitle:"Y",projectionTitle:"Projektio",FeatureInfoNotQueryable:"Karttatasolla ei voi hakea kohdetietoja.",WMSBrowserTab1:"Valitse",WMSBrowserTab3:"Ulkoinen",WMSBrowserPreviewTitle:"Esikatsele karttatasoa",WMSBrowserAddButton:"Lisää",WMSBrowserDuplicateMsg:"Karttataso on jo näkyvissä",WMSBrowserPreviewWaitMsg:"Luodaan esikatselukuvaa",WMSBrowserConnectButton:"Yhdistä",WMSBrowserConnectError:"WMS-palveluun ei saatu yhteyttä, tarkista palvelun url-osoite.",infoTitle:"Lisätietoa","mf.print.mapTitle":"Otsikko","mf.print.comment":"Kommentti","mf.print.dpi":"Resoluutio","mf.print.scale":"Mittakaava","mf.print.rotation":"Kulma","mf.print.resetPos":"Palauta oletusarvot","mf.print.print":"Tulosta","mf.print.generatingPDF":"Luodaan PDF-tiedosto","mf.print.unableToPrint":"Tulostus ei onnistunut, yritä myöhemmin uudelleen.","mf.error":"Virhe",selectExtentTooltipTitle:"Valitse kattavuus",selectExtentTooltipText:"Valitse kattavuus luettelohakuja varten.",printTooltipTitle:"Tulosta",printTooltipText:"Tulosta nykyinen kartta",savewmcTooltipTitle:"Tallenna nykyinen karttanäkymä",savewmcTooltipText:"Tallentaa nykyisen karttanäkymän.","saveWMCFile.windowTitle":"Tallenna nykyinen karttanäkymä","saveWMCFile.errorSaveWMC":"Karttanäkymää ei voitu tallentaa.",loadwmcTooltipTitle:"Lataa karttanäkymä",loadwmcTooltipText:"Lataa karttanäkymään nykyisen karttanäkymän päälle.","selectWMCFile.windowTitle":"Lataa karttanäkymä",selectWMCFile:"Valitse karttanäkymä","selectWMCFile.waitLoadingWMC":"Karttanäkymä latautuu","selectWMCFile.loadButtonText":"Lataa","selectWMCFile.mergeButtonText":"Yhdistä","selectWMCFile.errorLoadingWMC":"Karttanäkymää ei voitu ladata.",opacityButtonText:"Läpinäkyvyys",opacityWindowTitle:"Läpinäkyvyys",metadataButtonText:"Metatiedot",removeButtonText:"Poista",addWMSButtonText:"Lisää WMS-taso",addWMSWindowTitle:"Lisää WMS-taso","layerInfoPanel.windowTitle":"Karttatason metatiedot","layerInfoPanel.titleField":"Otsikko","layerInfoPanel.descriptionField":"Kuvaus","layerInfoPanel.queryableField":"Haettavissa",layerList:"Lista karttatasoista",baseLayerList:"Peruskarttatasot","metadataResults.buttonText":"Metatietohaun tulokset","metadataResults.tooltipTitle":"Metatietohaun tulokset","metadataResults.tooltipText":"Katso metatietohaun tulokset","metadataResults.alertTitle":"Metatietohaun tulokset","metadataResults.alertText":"Metatietohaulle ei tuloksia tarjolla.","featureInfoWindow.windowTitle":"Kohteen tiedot","mf.information":"Tulosta","mf.print.pdfReady":"PDF-tiedosto on valmis","loadLayer.loadingMessage":"Karttataso latautuu","loadLayer.error.title":"Lataa karttataso","loadLayer.error.message":"Karttatasoa ei voitu ladata","disclaimer.windowTitle":"Käyttöehdot","disclaimer.loading":"Latautuu...","disclaimer.buttonClose":"Sulje",gazetteerAddressField1Label:"Postinumero",gazetteerAddressField2Label:"Katu",gazetteerAddressField3Label:"Postitoimipaikka",gazetteerAddressField4Label:"'Kunta'",gazetteerAddressField5Label:"Talon numero",searchOptionButton:"Hae",GazetteerWindowTitle:"Hae osoitteen perusteella",searchResults:"Hakutulokset",errorTitle:"Virhe",SearchOptionLoadFailureMsg:"Tuloksia ei saatavilla. \n Palvelu ei mahdollisesti ole saatavilla. \n",gazetteerTooltipTitle:"Hae osoitteen perusteella",gazetteerTooltipText:"Hae sijainita postinumeron, kadun, kunnan tai postitoimipaikan perusteella.",SearchOptionNoResults:"Tuloksia ei löytynyt",zoomlayerTooltipTitle:"Zoomaa karttatason laajuuteen",zoomlayerTooltipText:"Paina tätä nappulaa näyttääksesi nykyisen karttatason koko laajuudeltaan.","zoomlayer.selectLayerTitle":"Zoomaa karttatason laajuuteen","zoomlayer.selectLayerText":"Karttatasoa ei ole valittuna",layerStylesWindowTitle:"Karttatason tyylit",layerStylesPreviewTitle:"Esikatsele karttatason tyylejä",selectStyleButton:"Valitse tyyli",WMSTimeWindowTitle:"WMS-aika",WMSTimePositionTitle:"Valitse aika",WMSTimeMovieTitle:"Nytä animaatio",wmsTimeUpdateButtonText:"Päivitä",WMSTimeAnimationCheckbox:"Toista animaatio ${steps} ajan välein."};
OpenLayers.Util.extend(OpenLayers.Lang.fi,GeoNetwork.lang.fi);Ext.namespace("GeoNetwork","GeoNetwork.lang");
GeoNetwork.lang.it={featureInfoTooltipTitle:"Feature info",featureInfoTooltipText:"Click sulla mappa per ottenere le informazioni da tutti i layer visibili.",zoomToMaxExtentTooltipTitle:"Estensione massima",zoomToMaxExtentTooltipText:"Rimpicciolisce la mappa per visualizzare l'estensione massima.",zoominTooltipTitle:"Ingrandisci",zoominTooltipText:"Disegna un rettangolo sulla mappa per ingrandire. Puoi anche cliccare sulla mappa per ingrandire di un fattore 2.",zoomoutTooltipTitle:"Rimpicciolisci",zoomoutTooltipText:"Clicca sulla mappa o disegna un rettangolo per rimpicciolire.",dragTooltipTitle:"Trascina la mappa",dragTooltipText:"Premi il bottone di sinistra per trascinare la mappa.",previousTooltipTitle:"Vista precedente",previosTooltipText:"Clicca questo bottone per tornare all'estensione precedente",nextTooltipTitle:"Vista successiva",nextTooltipText:"Clicca questo bottone per andare all'estensione successiva",featureInfoTitle:"Informazione sulle geometrie",layerManagerTabTitle:"Gestione dei layer",legendTabTitle:"Legenda",scaleTitle:"Scala",xTitle:"X",yTitle:"Y",projectionTitle:"Proiezione",FeatureInfoNotQueryable:"Non ci sono layer interrogabili",WMSBrowserTab1:"Seleziona",WMSBrowserTab3:"Esterno",WMSBrowserPreviewTitle:"Anteprima layer",WMSBrowserAddButton:"Aggiungi",WMSBrowserDuplicateMsg:"Il layer è già sulla mappa",WMSBrowserPreviewWaitMsg:"Recupero anteprima",WMSBrowserConnectButton:"Connessione",WMSBrowserConnectError:"Errore nella connessione al Web Map Service, controllare la URL.",infoTitle:"Informazioni","mf.print.mapTitle":"Titolo","mf.print.comment":"Commento","mf.print.dpi":"Risolutione","mf.print.scale":"Scala","mf.print.rotation":"Angolo","mf.print.resetPos":"Reimposta","mf.print.print":"Stampa","mf.print.generatingPDF":"Creazione PDF","mf.print.unableToPrint":"Impossibile stampare, riprovare pi� tardi","mf.error":"Errore",selectExtentTooltipTitle:"Selezionare l'estensione",selectExtentTooltipText:"Selezionare l'estensione per la ricerca nel catalogo",printTooltipTitle:"Stampa",printTooltipText:"Stampa la mappa corrente",savewmcTooltipTitle:"Salva il contesto della mappa",savewmcTooltipText:"Salva il contesto della mappa (WMC) per la mappa corrente","saveWMCFile.windowTitle":"Salva il contesto (Web Map Context)","saveWMCFile.errorSaveWMC":"Impossibile salvare il contesto",loadwmcTooltipTitle:"Carica contesto",loadwmcTooltipText:"Ricarica un contesto nella mappa corrente","selectWMCFile.windowTitle":"Carica contesto (Web Map Context)",selectWMCFile:"Seleziona il file di contesto","selectWMCFile.waitLoadingWMC":"Caricamento contesto di mappa (Web Map Context)","selectWMCFile.loadButtonText":"Carica","selectWMCFile.mergeButtonText":"Fondi","selectWMCFile.errorLoadingWMC":"Impossibile caricare il contesto di mappa",opacityButtonText:"Opacità",opacityWindowTitle:"Opacità",metadataButtonText:"Metadati",removeButtonText:"Elimina",addWMSButtonText:"Aggiungi WMS",addWMSWindowTitle:"Aggiungi WMS","layerInfoPanel.windowTitle":"Metadati del layer","layerInfoPanel.titleField":"Titolo","layerInfoPanel.descriptionField":"Descrizione","layerInfoPanel.queryableField":"Interrogabile",layerList:"Lista layer",baseLayerList:"Layers di fondo","metadataResults.buttonText":"Metadati risultanti","metadataResults.tooltipTitle":"Metadati risultanti","metadataResults.tooltipText":"Vai alla pagina dei metadati","metadataResults.alertTitle":"Metadati risultanti","metadataResults.alertText":"Nessun metadato risultante da mostrare","featureInfoWindow.windowTitle":"Feature info","mf.information":"Stampa","mf.print.pdfReady":"PDF pronto","loadLayer.loadingMessage":"Caricamento layer","loadLayer.error.title":"Carica layer","loadLayer.error.message":"Impossibile caricare il layer","disclaimer.windowTitle":"Disclaimer","disclaimer.loading":"Caricamento in corso...","disclaimer.buttonClose":"Chiudi",gazetteerAddressField1Label:"CAP",gazetteerAddressField2Label:"Via",gazetteerAddressField3Label:"Indirizzo",gazetteerAddressField4Label:"'Località",gazetteerAddressField5Label:"Numero",searchOptionButton:"Cerca",GazetteerWindowTitle:"Cerca per indirizzo",searchResults:"Risultati della ricerca",errorTitle:"Errore",SearchOptionLoadFailureMsg:"Nessun risultato. \n Il servizio potrebbe essere non disponibile. \n",gazetteerTooltipTitle:"Ricerca basata su un indirizzo",gazetteerTooltipText:"Ricerca un luogo, basandosi sul CAP, nome della strada, comune o località.",SearchOptionNoResults:"Nessun risultato",zoomlayerTooltipTitle:"Zoom sul layer",zoomlayerTooltipText:"Usa questo bottone per fare uno zoom sull'estensione del layer selezionato.","zoomlayer.selectLayerTitle":"Ingrandisci layer","zoomlayer.selectLayerText":"Nessun layer selezionato",layerStylesWindowTitle:"Stile del layer",layerStylesPreviewTitle:"Anteprima legenda",selectStyleButton:"Seleziona stile",WMSTimeWindowTitle:"Tempo WMS",WMSTimePositionTitle:"Seleziona un punto temporale",WMSTimeMovieTitle:"Lancia l'animazione",wmsTimeUpdateButtonText:"Applica",WMSTimeAnimationCheckbox:"Lancia una animazione sulle ultime ${steps} posizioni temporali"};
OpenLayers.Util.extend(OpenLayers.Lang.it,GeoNetwork.lang.it);Ext.namespace("GeoNetwork","GeoNetwork.lang");
GeoNetwork.lang.tr={featureInfoTooltipTitle:"Özellik Bilgisi",featureInfoTooltipText:"Bütün görünen katmanlardan özellik bilgisi almak için haritaya tıklayınız.",zoomToMaxExtentTooltipTitle:"Tam Sınır",zoomToMaxExtentTooltipText:"Haritanın tam sınırına gitmek için bu butonu kullanınız.",zoominTooltipTitle:"Büyült",zoominTooltipText:"Büyültmek için harita içine bir kutu çiziniz. Aynı zamanda harita içine tıklarsanız haritayı 2 kat büyütürsünüz.",zoomoutTooltipTitle:"Küçült",zoomoutTooltipText:"Küçültmek için harita içine tıklayınız ya da bir kutu çiziniz.",dragTooltipTitle:"Haritayı kaydır",dragTooltipText:"Haritayı sürüklemek için sol fare tuşuna basınız .",previousTooltipTitle:"Önceki harita boyutuna",previosTooltipText:"Önceki harita boyutuna gitmek için bu butona tıklayınız",nextTooltipTitle:"Sonraki harita boyutu",nextTooltipText:"Sonraki harita boyutuna gitmek için bu butona tıklayınız",featureInfoTitle:"Özellik Bilgisi",layerManagerTabTitle:"Katman idaresi",legendTabTitle:"Gösterge",scaleTitle:"Ölçek",xTitle:"X",yTitle:"Y",projectionTitle:"Projeksiyon",FeatureInfoNotQueryable:"Sorgulanabilir harita katmanı bulunmuyor",WMSBrowserTab1:"Seçiniz",WMSBrowserTab3:"Harici",WMSBrowserPreviewTitle:"Katman Öngörünümü",WMSBrowserAddButton:"Ekle",WMSBrowserDuplicateMsg:"Katman zaten harita içinde",WMSBrowserPreviewWaitMsg:"Öngörünüm resmi çekiliyor",WMSBrowserConnectButton:"Bağlan",WMSBrowserConnectError:"WMS servisine bağlanırken hata oluştu, lütfen URL kontrol ediniz.",infoTitle:"Bilgi","mf.print.mapTitle":"Başlık","mf.print.comment":"Yorum","mf.print.dpi":"Çözünürlük","mf.print.scale":"Ölçek","mf.print.rotation":"Açı","mf.print.resetPos":"Sıfırla","mf.print.print":"Yazdır","mf.print.generatingPDF":"PDF Üretiliyor","mf.print.unableToPrint":"Yazdırılamadı, daha sonra tekrar deneyiniz","mf.error":"Hata",selectExtentTooltipTitle:"Boyutu seçiniz",selectExtentTooltipText:"Katalog aramaları için boyutu seçiniz",printTooltipTitle:"Yazdır",printTooltipText:"Mevcut haritayı Yazdır",savewmcTooltipTitle:"Web Harita bağlamını kaydet",savewmcTooltipText:"Web Harita bağlamını mevcut harita için kaydeder","saveWMCFile.windowTitle":"Web Harita bağlamını kaydet","saveWMCFile.errorSaveWMC":"Web Harita bağlamını kaydedemedi",loadwmcTooltipTitle:"Web Harita bağlamını yükle",loadwmcTooltipText:"Web Harita bağlamını güncel haritaya yükle","selectWMCFile.windowTitle":"Web Harita bağlamını yükle",selectWMCFile:"Web harita bağlamını seç","selectWMCFile.waitLoadingWMC":"Web harita bağlamı yükleniyor","selectWMCFile.loadButtonText":"Yükle","selectWMCFile.mergeButtonText":"Birleştir","selectWMCFile.errorLoadingWMC":"Web Harita Bağlamı Yüklenemedi",opacityButtonText:"Şeffaflık",opacityWindowTitle:"Opacity",metadataButtonText:"Metaveri",removeButtonText:"Kaldır",addWMSButtonText:"WMS Ekle",addWMSWindowTitle:"WMS Ekle","layerInfoPanel.windowTitle":"Katman Metaverisi","layerInfoPanel.titleField":"Başlık","layerInfoPanel.descriptionField":"Açıklama","layerInfoPanel.queryableField":"Sorgulanabilir",layerList:"Katman listesi",baseLayerList:"Ana katmanlar","metadataResults.buttonText":"Metaveri sonuçları","metadataResults.tooltipTitle":"Metaveri sonuçları","metadataResults.tooltipText":"Metaveri sonuçları sayfasına git","metadataResults.alertTitle":"Metaveri sonuçları","metadataResults.alertText":"Gösterilebilecek Metaveri sonuçları bulunmuyor","featureInfoWindow.windowTitle":"Özellik bilgisi","mf.information":"Yazdır","mf.print.pdfReady":"PDF hazır","loadLayer.loadingMessage":"Katman yükleniyor","loadLayer.error.title":"Katman yükle","loadLayer.error.message":"Katman yüklenemedi","disclaimer.windowTitle":"Feragatname","disclaimer.loading":"Yükleniyor...","disclaimer.buttonClose":"Kapat",gazetteerAddressField1Label:"Posta kodu",gazetteerAddressField2Label:"Cadde",gazetteerAddressField3Label:"Yer",gazetteerAddressField4Label:"'Gemeente'",gazetteerAddressField5Label:"Ev numarası",searchOptionButton:"Arama",GazetteerWindowTitle:"Adres arama",searchResults:"Sonuçları arama",errorTitle:"Hata",SearchOptionLoadFailureMsg:"Sonuç bulunamadı. \n Servis hazır olmayabilir. \n",gazetteerTooltipTitle:"Adres tabanlı arama",gazetteerTooltipText:"Bir posta kodu, cadde adı veya yer için lokasyon aranması.",SearchOptionNoResults:"Sonuç ",zoomlayerTooltipTitle:"Katmana kadar büyült",zoomlayerTooltipText:"Bu butonu kullanarak seçilen katmanın tam sınırına gidebilirsiniz.","zoomlayer.selectLayerTitle":"Katmana büyült","zoomlayer.selectLayerText":"Katman seçilmedi",layerStylesWindowTitle:"Katman sembolleri",layerStylesPreviewTitle:"Gösterge Önizlemesi",selectStyleButton:"Stil Seç",WMSTimeWindowTitle:"WMS Zamanuı",WMSTimePositionTitle:"Bir zaman pozisyonu seçiniz",WMSTimeMovieTitle:"Animasyonu Oynat",wmsTimeUpdateButtonText:"Uygula",WMSTimeAnimationCheckbox:"Son ${steps} zaman pozisyonlarını içeren bir film oynat",layerTree:"Katman yapısı",legendPanel:"Kenar Bilgisi",addButtonText:"Katman Ekle",measureTooltipTitle:"Ölçüm",measureLengthTooltipTitle:"Uzunluk",measureAreaTooltipTitle:"Alan",WMSInformationWindowTitle:"WMS Bilgisi",layerStylesButtonText:"Katman sembolleri",drawExtentTooltipTitle:"Çiz",drawBBOXExtentTooltipTitle:"Kutu çiz",drawPolygonExtentTooltipTitle:"Alan çiz",drawLineExtentTooltipTitle:"Çizgi çiz",drawPointExtentTooltipTitle:"Nokta çiz"};
OpenLayers.Util.extend(OpenLayers.Lang.tr,GeoNetwork.lang.tr);Ext.ns("Ext.ux.form");
Ext.ux.form.DateTime=Ext.extend(Ext.form.Field,{dateValidator:null,defaultAutoCreate:{tag:"input",type:"hidden"},dtSeparator:" ",hiddenFormat:"Y-m-d H:i:s",otherToNow:true,timePosition:"right",timeValidator:null,timeWidth:100,dateFormat:"m/d/y",dateAltFormats:Ext.form.DateField.prototype.altFormats,timeFormat:"g:i A",timeAltFormats:Ext.form.TimeField.prototype.altFormats,initComponent:function(){Ext.ux.form.DateTime.superclass.initComponent.call(this);
var b=Ext.apply({},{id:this.id+"-date",format:this.dateFormat||Ext.form.DateField.prototype.format,altFormats:this.dateAltFormats||Ext.form.DateField.prototype.altFormats,width:this.timeWidth,selectOnFocus:this.selectOnFocus,validator:this.dateValidator,beforeBlur:function(){},listeners:{blur:{scope:this,fn:this.onBlur},focus:{scope:this,fn:this.onFocus}}},this.dateConfig);
this.df=new Ext.form.DateField(b);
this.df.ownerCt=this;
delete (this.dateFormat);
delete (this.dateAltFormats);
var a=Ext.apply({},{id:this.id+"-time",format:this.timeFormat||Ext.form.TimeField.prototype.format,altFormats:this.timeAltFormats||Ext.form.TimeField.prototype.altFormats,width:this.timeWidth,selectOnFocus:this.selectOnFocus,validator:this.timeValidator,listeners:{blur:{scope:this,fn:this.onBlur},focus:{scope:this,fn:this.onFocus}}},this.timeConfig);
this.tf=new Ext.form.TimeField(a);
this.tf.ownerCt=this;
delete (this.timeFormat);
delete (this.timeAltFormats);
this.relayEvents(this.df,["focus","specialkey","invalid","valid"]);
this.relayEvents(this.tf,["focus","specialkey","invalid","valid"]);
this.on("specialkey",this.onSpecialKey,this)
},onRender:function(c,a){if(this.isRendered){return
}Ext.ux.form.DateTime.superclass.onRender.call(this,c,a);
var b;
if("below"===this.timePosition||"bellow"===this.timePosition){b=Ext.DomHelper.append(c,{tag:"table",style:"border-collapse:collapse",children:[{tag:"tr",children:[{tag:"td",style:"padding-bottom:1px",cls:"ux-datetime-date"}]},{tag:"tr",children:[{tag:"td",cls:"ux-datetime-time"}]}]},true)
}else{b=Ext.DomHelper.append(c,{tag:"table",style:"border-collapse:collapse",children:[{tag:"tr",children:[{tag:"td",style:"padding-right:4px",cls:"ux-datetime-date"},{tag:"td",cls:"ux-datetime-time"}]}]},true)
}this.tableEl=b;
this.wrap=b.wrap({cls:"x-form-field-wrap"});
this.wrap.on("mousedown",this.onMouseDown,this,{delay:10});
this.df.render(b.child("td.ux-datetime-date"));
this.tf.render(b.child("td.ux-datetime-time"));
this.df.el.swallowEvent(["keydown","keypress"]);
this.tf.el.swallowEvent(["keydown","keypress"]);
if("side"===this.msgTarget){var d=this.el.findParent(".x-form-element",10,true);
if(d){this.errorIcon=d.createChild({cls:"x-form-invalid-icon"})
}var e={errorIcon:this.errorIcon,msgTarget:"side",alignErrorIcon:this.alignErrorIcon.createDelegate(this)};
Ext.apply(this.df,e);
Ext.apply(this.tf,e)
}this.el.dom.name=this.hiddenName||this.name||this.id;
this.df.el.dom.removeAttribute("name");
this.tf.el.dom.removeAttribute("name");
this.isRendered=true;
this.updateHidden()
},adjustSize:Ext.BoxComponent.prototype.adjustSize,alignErrorIcon:function(){this.errorIcon.alignTo(this.tableEl,"tl-tr",[2,0])
},initDateValue:function(){this.dateValue=this.otherToNow?new Date():new Date(1970,0,1,0,0,0)
},clearInvalid:function(){this.df.clearInvalid();
this.tf.clearInvalid()
},markInvalid:function(a){this.df.markInvalid(a);
this.tf.markInvalid(a)
},beforeDestroy:function(){if(this.isRendered){this.wrap.removeAllListeners();
this.wrap.remove();
this.tableEl.remove();
this.df.destroy();
this.tf.destroy()
}},disable:function(){if(this.isRendered){this.df.disabled=this.disabled;
this.df.onDisable();
this.tf.onDisable()
}this.disabled=true;
this.df.disabled=true;
this.tf.disabled=true;
this.fireEvent("disable",this);
return this
},enable:function(){if(this.rendered){this.df.onEnable();
this.tf.onEnable()
}this.disabled=false;
this.df.disabled=false;
this.tf.disabled=false;
this.fireEvent("enable",this);
return this
},focus:function(){this.df.focus()
},getPositionEl:function(){return this.wrap
},getResizeEl:function(){return this.wrap
},getValue:function(){return this.dateValue?new Date(this.dateValue):""
},isValid:function(){return this.df.isValid()&&this.tf.isValid()
},isVisible:function(){return this.df.rendered&&this.df.getActionEl().isVisible()
},onBlur:function(a){if(this.wrapClick){a.focus();
this.wrapClick=false
}if(a===this.df){this.updateDate()
}else{this.updateTime()
}this.updateHidden();
this.validate();
(function(){if(!this.df.hasFocus&&!this.tf.hasFocus){var b=this.getValue();
if(String(b)!==String(this.startValue)){this.fireEvent("change",this,b,this.startValue)
}this.hasFocus=false;
this.fireEvent("blur",this)
}}).defer(100,this)
},onFocus:function(){if(!this.hasFocus){this.hasFocus=true;
this.startValue=this.getValue();
this.fireEvent("focus",this)
}},onMouseDown:function(a){if(!this.disabled){this.wrapClick="td"===a.target.nodeName.toLowerCase()
}},onSpecialKey:function(b,c){var a=c.getKey();
if(a===c.TAB){if(b===this.df&&!c.shiftKey){c.stopEvent();
this.tf.focus()
}if(b===this.tf&&c.shiftKey){c.stopEvent();
this.df.focus()
}this.updateValue()
}if(a===c.ENTER){this.updateValue()
}},reset:function(){this.df.setValue(this.originalValue);
this.tf.setValue(this.originalValue)
},setDate:function(a){this.df.setValue(a)
},setTime:function(a){this.tf.setValue(a)
},setSize:function(a,b){if(!a){return
}if("below"===this.timePosition){this.df.setSize(a,b);
this.tf.setSize(a,b);
if(Ext.isIE){this.df.el.up("td").setWidth(a);
this.tf.el.up("td").setWidth(a)
}}else{this.df.setSize(a-this.timeWidth-4,b);
this.tf.setSize(this.timeWidth,b);
if(Ext.isIE){this.df.el.up("td").setWidth(a-this.timeWidth-4);
this.tf.el.up("td").setWidth(this.timeWidth)
}}},setValue:function(a){var h=a;
if(!a&&true===this.emptyToNow){this.setValue(new Date());
return
}else{if(!a){this.setDate("");
this.setTime("");
this.updateValue();
return
}}if("number"===typeof a){h=new Date(h)
}else{if("string"===typeof a&&this.hiddenFormat){h=Date.parseDate(h,this.hiddenFormat)
}}a=a?a:new Date(1970,0,1,0,0,0);
var k;
if(h&&h instanceof Date){this.setDate(h);
this.setTime(h);
this.dateValue=new Date(Ext.isIE?a.getTime():a)
}else{k=a.split(this.dtSeparator);
var f=Date.parseDate(k[0],this.df.format),g=this.df.altFormats,b=this.df.altFormatsArray;
if(!f&&g){b=b||g.split("|");
for(var c=0,e=b.length;
c<e&&!f;
c++){f=Date.parseDate(k[0],b[c])
}}var j;
if(f&&k[1]){if(k[2]){k[1]+=k[2]
}k[1]=k[1];
j=Date.parseDate(k[1],this.tf.format);
var g=this.tf.altFormats,b=this.tf.altFormatsArray;
if(!j&&g){b=b||g.split("|");
for(var c=0,e=b.length;
c<e&&!j;
c++){j=Date.parseDate(k[1],b[c])
}}}if(f&&j){this.setDate(k[0]);
this.setTime(k[1])
}else{this.setDate("");
Ext.form.DateField.superclass.setValue.call(this.df,a)
}}this.updateValue()
},setVisible:function(a){if(a){this.df.show();
this.tf.show()
}else{this.df.hide();
this.tf.hide()
}return this
},show:function(){return this.setVisible(true)
},hide:function(){return this.setVisible(false)
},updateDate:function(){var b=this.df.getValue();
if(b){var a=this.tf.getValue();
if(this.df.formatDate(this.df.parseDate(b))!==this.df.getRawValue()){this.dateValue=this.df.getRawValue()
}if(!(this.dateValue instanceof Date)&&a){if(b instanceof Date){this.dateValue=b
}else{this.initDateValue()
}if(!(a instanceof Date)){a=Date.parseDate(a,this.tf.format)
}this.dateValue.setHours(a.getHours());
this.dateValue.setMinutes(a.getMinutes());
this.dateValue.setSeconds(a.getSeconds());
this.setDate(this.dateValue);
this.setTime(this.dateValue)
}if((this.dateValue instanceof Date)){this.dateValue.setMonth(0);
this.dateValue.setFullYear(b.getFullYear());
this.dateValue.setMonth(b.getMonth(),b.getDate())
}}else{this.dateValue="";
this.setTime("")
}},updateTime:function(){var a=this.tf.getValue();
if(a&&a!==null&&a.trim()!=""&&!(this.dateValue instanceof Date)&&a){this.updateDate()
}if(a&&!(a instanceof Date)){a=Date.parseDate(a,this.tf.format)
}if(a&&!this.df.getValue()){this.initDateValue();
this.setDate(this.dateValue)
}if(this.dateValue instanceof Date){if(a){this.dateValue.setHours(a.getHours());
this.dateValue.setMinutes(a.getMinutes());
this.dateValue.setSeconds(a.getSeconds())
}else{this.dateValue.setHours(0);
this.dateValue.setMinutes(0);
this.dateValue.setSeconds(0)
}}},updateHidden:function(){if(this.isRendered){var a=this.dateValue instanceof Date?this.dateValue.format(this.hiddenFormat):"";
if((this.dateValue instanceof Date)&&this.df.getRawValue()!==null&&this.tf.getRawValue()!==null&&this.df.getRawValue().trim()!==""&&this.tf.getRawValue().trim()!==""){var a=this.dateValue instanceof Date?this.dateValue.format(this.hiddenFormat):"";
this.el.dom.value=a
}else{this.el.dom.value=this.df.getRawValue().trim();
if(this.el.dom.value!==null&&this.el.dom.value!==""&&this.tf.getValue()!==null&&this.tf.getValue().trim()!==""){this.el.dom.value+=this.dtSeparator+this.tf.getValue().trim()
}}}},updateValue:function(){this.updateDate();
this.updateTime();
this.updateHidden();
return
},validate:function(){return this.df.validate()&&this.tf.validate()
},renderer:function(c){var b=c.editor.dateFormat||Ext.ux.form.DateTime.prototype.dateFormat;
b+=" "+(c.editor.timeFormat||Ext.ux.form.DateTime.prototype.timeFormat);
var a=function(e){var d=Ext.util.Format.date(e,b);
return d
};
return a
}});
Ext.reg("xdatetime",Ext.ux.form.DateTime);Ext.namespace("GeoNetwork","GeoNetwork.tree");
GeoNetwork.tree.WMSListGenerator=function(a){Ext.apply(this,a);
if(this.node&&this.wmsStore){this.createWMSList()
}};
GeoNetwork.tree.WMSListGenerator.prototype={node:null,wmsStore:null,click:null,scope:null,createWMSList:function(){this.wmsStore.each(this.appendRecord,this)
},appendRecord:function(a){var b=new Ext.tree.TreeNode({url:a.get("url"),text:a.get("title"),cls:"folder",leaf:false});
b.appendChild(new Ext.tree.TreeNode({text:"",dummy:true}));
b.addListener("beforeexpand",this.addNodesFromWMS,this);
this.node.appendChild(b)
},replaceNode:function(a){this.currentNode.parentNode.replaceChild(a,this.currentNode);
a.ui.afterLoad();
a.expand()
},addNodesFromWMS:function(b){if(b.firstChild&&b.firstChild.attributes.dummy){b.removeChild(b.firstChild);
b.ui.beforeLoad();
this.scope.currentNode=b;
var a=new GeoNetwork.tree.WMSTreeGenerator({click:this.click,callback:this.replaceNode,scope:this.scope});
a.loadWMS(b.attributes.url)
}}};Ext.namespace("GeoNetwork","GeoNetwork.tree");
GeoNetwork.tree.WMSTreeGenerator=function(a){Ext.apply(this,a)
};
GeoNetwork.tree.WMSTreeGenerator.prototype={layerParams:{format:"image/png",transparent:"TRUE"},layerOptions:{ratio:1,singleTile:true,isBaseLayer:false},click:null,callback:null,scope:null,loadWMS:function(i){var g=(i.indexOf("version=")>-1);
var j=i.toLowerCase();
var g=(j.indexOf("version=")>-1);
var f=(j.indexOf("service=wms")>-1);
var d=(j.indexOf("request=getcapabilities")>-1);
var e=(j.indexOf("language=")>-1);
var b={};
if(!g){b.version=GeoNetwork.OGCUtil.getProtocolVersion()
}if(!f){b.service="WMS"
}if(!d){b.request="GetCapabilities"
}if(!e){b.language=GeoNetwork.OGCUtil.getLanguage()
}var a=OpenLayers.Util.getParameterString(b);
var c=(i.indexOf("?")>-1)?"&":"?";
i+=c+a;
var h=Ext.Ajax.request({url:OpenLayers.Util.removeTail(OpenLayers.ProxyHost),method:"GET",params:{url:i},failure:this.processFailure,success:this.processSuccess,disableCaching:false,scope:this})
},processSuccess:function(b){if(!this.parser){this.parser=new OpenLayers.Format.WMSCapabilities()
}var f=this.parser.read(b.responseXML||b.responseText);
this.layerParams.VERSION=f.version;
var e;
if(f.capability){for(var d=0,a=f.capability.nestedLayers.length;
d<a;
++d){var c=f.capability.nestedLayers[d];
e=this.addLayer(c,f.capability.request.getmap.href,null);
this.processLayer(c,f.capability.request.getmap.href,e)
}}Ext.callback(this.callback,this.scope,[e,f])
},processFailure:function(a){Ext.callback(this.callback,this.scope,null)
},createWMSLayer:function(b,a){return new OpenLayers.Layer.WMS(b.title,a,OpenLayers.Util.extend({layers:b.name,language:GeoNetwork.OGCUtil.getLanguage()},this.layerParams),OpenLayers.Util.extend({minScale:b.minScale,queryable:b.queryable,maxScale:b.maxScale,metadataURL:b.metadataURL,dimensions:b.dimensions,styles:b.styles,llbbox:b.llbbox},this.layerOptions))
},addLayer:function(c,b,a){var f=null;
if(c.name){f=this.createWMSLayer(c,b);
if(c.styles&&c.styles.length>0){var d=c.styles[0];
if(d.legend&&d.legend.href){f.legendURL=d.legend.href
}}}var e=new Ext.tree.TreeNode({wmsLayer:f,text:c.title});
e.addListener("click",this.click,this.scope);
if(a){a.appendChild(e)
}return e
},processLayer:function(b,a,c){Ext.each(b.nestedLayers,function(e){var d=this.addLayer(e,a,c);
if(e.nestedLayers){this.processLayer(e,a,d)
}},this)
}};Ext.namespace("GeoNetwork","GeoNetwork.wms");
GeoNetwork.wms.BrowserPanel=function(a){Ext.apply(this,a);
GeoNetwork.wms.BrowserPanel.superclass.constructor.call(this)
};
GeoNetwork.wms.BrowserPanel.ADDWMS=0;
GeoNetwork.wms.BrowserPanel.WMSLIST=1;
Ext.extend(GeoNetwork.wms.BrowserPanel,Ext.Panel,{previewPanel:null,treePanel:null,map:null,previewCenterPoint:null,mode:GeoNetwork.wms.BrowserPanel.WMSLIST,wmsStore:null,url:"",initComponent:function(){GeoNetwork.wms.BrowserPanel.superclass.initComponent.call(this);
this.layout="border";
this.previewPanel=new GeoNetwork.wms.PreviewPanel({map:this.map,previewCenterPoint:this.previewCenterPoint});
var c;
this.treePanel=new Ext.tree.TreePanel({rootVisible:false,autoScroll:true});
c=new Ext.tree.TreeNode({text:"",draggable:false,cls:"folder"});
this.treePanel.setRootNode(c);
var b;
if(this.mode==GeoNetwork.wms.BrowserPanel.ADDWMS){this.form=new Ext.form.FormPanel({labelWidth:25});
var d=new Ext.form.TextField({fieldLabel:"URL",name:"wmsurl",value:this.url,width:250,autoHeight:true});
this.form.add(d);
this.form.add(new Ext.Button({id:"parse",text:OpenLayers.i18n("WMSBrowserConnectButton"),scope:this,handler:this.getWMSCaps}));
this.form.add(this.treePanel);
b=[this.form]
}else{b=[this.treePanel]
}var a={autoScroll:true,region:"center",items:b,split:true,width:300,minWidth:300,border:false};
var e={region:"east",border:false,items:[this.previewPanel],split:true,plain:true,cls:"popup-variant1",width:250,maxSize:250,minSize:250};
this.add(a);
this.add(e);
if(this.mode==GeoNetwork.wms.BrowserPanel.WMSLIST){this.treeGen=new GeoNetwork.tree.WMSListGenerator({click:this.nodeClick,scope:this,node:this.treePanel.getRootNode(),wmsStore:this.wmsStore})
}else{if(this.mode==GeoNetwork.wms.BrowserPanel.ADDWMS){new GeoNetwork.tree.WMSListGenerator({click:this.nodeClick,scope:this,node:this.treePanel.getRootNode(),wmsStore:this.wmsStore});
this.treeGen=new GeoNetwork.tree.WMSTreeGenerator({click:this.nodeClick,callback:this.showTree,scope:this})
}}this.addButton(OpenLayers.i18n("WMSBrowserAddButton"),this.addLayerToMap,this);
this.doLayout();
if(this.url!=""){this.getWMSCaps()
}},showTree:function(c,b){if(!c){Ext.MessageBox.alert(OpenLayers.i18n("errorTitle"),OpenLayers.i18n("WMSBrowserConnectError"));
this.body.dom.style.cursor="default"
}var d=b.service.accessContraints;
if((d)&&(d.toLowerCase()!="none")&&(d!="-")){var e=new GeoNetwork.DisclaimerWindow({disclaimer:d});
e.show();
e=null
}var a=this.treePanel.getRootNode();
if(c){this.treePanel.getRootNode().appendChild(c);
c.expand(true)
}this.treePanel.show();
this.body.dom.style.cursor="default"
},loadUrl:function(a){this.form.getForm().findField("wmsurl").setValue(a);
this.getWMSCaps()
},getWMSCaps:function(b){var a=this.form.getForm().findField("wmsurl").getValue();
a=a.replace(/^\s+|\s+$/g,"");
if(a!=""){this.body.dom.style.cursor="wait";
this.treeGen.loadWMS(a)
}},nodeClick:function(a){this.previewPanel.showPreview(a.attributes.wmsLayer)
},addLayerToMap:function(){if(this.previewPanel.currentLayer){var a=GeoNetwork.OGCUtil.layerExistsInMap(this.previewPanel.currentLayer,this.map);
if(!a){this.previewPanel.currentLayer.events.on({loadstart:function(){this.isLoading=true
}});
this.previewPanel.currentLayer.events.on({loadend:function(){this.isLoading=false
}});
this.map.addLayers([this.previewPanel.currentLayer])
}else{Ext.MessageBox.alert(OpenLayers.i18n("infoTitle"),OpenLayers.i18n("WMSBrowserDuplicateMsg"))
}}}});
Ext.reg("gn_wmsbrowserpanel",GeoNetwork.wms.BrowserPanel);Ext.namespace("GeoNetwork","GeoNetwork.wms");
GeoNetwork.wms.LayerInfoPanel=function(a){Ext.apply(this,a);
GeoNetwork.wms.LayerInfoPanel.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.wms.LayerInfoPanel,Ext.Panel,{previewPanel:null,map:null,previewCenterPoint:null,onlineresource:null,layer:null,initComponent:function(){GeoNetwork.wms.LayerInfoPanel.superclass.initComponent.call(this);
this.layout="border";
this.border=false;
this.previewPanel=new GeoNetwork.wms.PreviewPanel({map:this.map,previewCenterPoint:this.previewCenterPoint});
this.store=new Ext.data.SimpleStore({reader:new Ext.data.ArrayReader({},[{name:"title",type:"string"},{name:"field",type:"string"}]),fields:["title","field"]});
this.gridPanel=new Ext.grid.GridPanel({title:"",store:this.store,autoScroll:true,hideHeaders:false,columns:[]});
this.layerInfo=new GeoNetwork.wms.WMSLayerInfo({callback:this._showLayerInfo,scope:this});
var a={region:"center",layout:"fit",items:[this.gridPanel],split:true,width:300,minWidth:300};
var b={region:"east",items:[this.previewPanel],split:true,plain:true,cls:"popup-variant1",width:250,maxSize:250,minSize:250};
this.add(a);
this.add(b);
this.doLayout()
},showLayerInfo:function(){this.previewPanel.showPreview(this.layer);
this.layerInfo.loadWMS(this.onlineresource,this.layer)
},_showLayerInfo:function(a){if(!a){Ext.MessageBox.alert(OpenLayers.i18n("errorTitle"),OpenLayers.i18n("WMSBrowserConnectError"));
this.body.dom.style.cursor="default"
}else{var b=[[OpenLayers.i18n("layerInfoPanel.titleField"),a.title||a.name],[OpenLayers.i18n("layerInfoPanel.descriptionField"),a.description],[OpenLayers.i18n("layerInfoPanel.queryableField"),a.queryable]];
this.gridPanel.reconfigure(this.store,new Ext.grid.ColumnModel([{header:"Field",dataIndex:"title",sortable:true},{id:"value",header:"Value",dataIndex:"field",sortable:true}]));
this.gridPanel.autoExpandColumn="value";
this.gridPanel.getStore().loadData(b)
}this.body.dom.style.cursor="default"
}});
Ext.reg("gn_infolayerpanel",GeoNetwork.wms.LayerInfoPanel);Ext.namespace("GeoNetwork","GeoNetwork.wms");
GeoNetwork.wms.LayerStylesPanel=function(a){Ext.apply(this,a);
GeoNetwork.wms.LayerStylesPanel.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.wms.LayerStylesPanel,Ext.Panel,{previewPanel:null,map:null,layer:null,selectedStyle:null,initComponent:function(){GeoNetwork.wms.LayerStylesPanel.superclass.initComponent.call(this);
this.layout="border";
this.border=false;
this.previewPanel=new GeoNetwork.wms.PreviewPanel({map:this.map,title:OpenLayers.i18n("layerStylesPreviewTitle")});
this.store=new Ext.data.SimpleStore({reader:new Ext.data.ArrayReader({},[{name:"name",type:"string"},{name:"title",type:"string"},{name:"legendUrl",type:"string"}]),fields:["name","title","legendUrl"]});
this.gridPanel=new Ext.grid.GridPanel({title:"",border:false,autoScroll:true,store:this.store,hideHeaders:false,columns:[{header:"Style",width:120,dataIndex:"name",sortable:false},{id:"description",header:"Description",width:180,dataIndex:"title",sortable:false}],autoExpandColumn:"description"});
this.gridPanel.on("rowclick",this._selectStyle,this);
var a={region:"center",layout:"fit",items:[this.gridPanel],split:true,width:300,minWidth:300};
var b={region:"east",items:[this.previewPanel],split:true,plain:true,cls:"popup-variant1",width:250,maxSize:250,minSize:250};
this.add(a);
this.add(b);
this.doLayout()
},showLayerStyles:function(c){var e=[];
for(var b=0;
b<c.styles.length;
b++){var a="";
if(c.styles[b].legend){a=c.styles[b].legend.href
}var d=[c.styles[b].name,c.styles[b].title,a];
e.push(d)
}this.gridPanel.getStore().loadData(e)
},_selectStyle:function(b,g,c){var d=b.store.getAt(g);
this.selectedStyle=d.get("name");
b.getView().focusEl.focus();
var a=d.get("legendUrl");
if(a==""){return
}a=unescape(a);
this.selectedStyleLegendUrl=a;
var f=d.get("legendUrl")+"&style="+this.selectedStyle;
this.previewPanel.showPreviewLegend(unescape(f))
}});
Ext.reg("gn_layerstylespanel",GeoNetwork.wms.LayerStylesPanel);Ext.namespace("GeoNetwork","GeoNetwork.wms");
GeoNetwork.wms.PreviewPanel=function(a){Ext.apply(this,a);
GeoNetwork.wms.PreviewPanel.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.wms.PreviewPanel,Ext.Panel,{title:OpenLayers.i18n("WMSBrowserPreviewTitle"),baseCls:"x-plain",cls:"x-panel-title-variant1",imgCls:"preview-image",width:250,height:250,currentLayer:null,initComponent:function(){GeoNetwork.wms.PreviewPanel.superclass.initComponent.call(this);
this.image=new Ext.BoxComponent({autoEl:{tag:"img","class":this.imgCls,src:Ext.BLANK_IMAGE_URL,width:this.width,height:this.height}});
this.add(this.image)
},hideMask:function(){if(this.mask){this.mask.hide()
}},showMask:function(){if(!this.mask){this.mask=new Ext.LoadMask(this.getEl(),{msg:OpenLayers.i18n("WMSBrowserPreviewWaitMsg")});
Ext.EventManager.addListener(this.image.getEl(),"load",this.hideMask,this);
Ext.EventManager.addListener(this.image.getEl(),"error",this.hideMask,this)
}this.mask.show()
},calculateBBOX:function(f){var j;
var k=(parseFloat(f.params.VERSION)>=1.3);
if(f.llbbox){if(this.map.getProjection()!=="EPSG:4326"){var b=OpenLayers.Bounds.fromArray(f.llbbox);
b=b.transform(new OpenLayers.Projection("EPSG:4326"),this.map.getProjectionObject());
j=b.toArray(k)
}else{var b=OpenLayers.Bounds.fromArray(f.llbbox);
j=b.toArray(k)
}}else{j=this.map.maxExtent.toArray(k)
}var a=OpenLayers.Bounds.fromArray(j).getCenterLonLat();
if(f.minScale>0){var c;
if(f.maxScale>0){c=(parseFloat(f.maxScale)+parseFloat(f.minScale))/2
}else{c=0.9*parseFloat(f.minScale)
}var g=OpenLayers.Util.getResolutionFromScale(c,this.map.units);
var e=Math.round(g*this.width);
var d=Math.round(g*this.height);
var i=a.lon;
var h=a.lat;
if(e!==0&&d!==0){if(k){j=[h-0.5*d,i-0.5*e,h+0.5*d,i+0.5*e]
}else{j=[i-0.5*e,h-0.5*d,i+0.5*e,h+0.5*d]
}}}return j.join(",")
},showPreview:function(b){if(!b){return
}this.showMask();
var c=b.map;
if(c===null){b.map=this.map
}var a=b.getFullRequestString({BBOX:this.calculateBBOX(b),WIDTH:this.width,HEIGHT:this.height});
if(c===null){b.map=c
}this.currentLayer=b;
this.image.getEl().dom.src=a
},showPreviewLegend:function(a){this.remove(this.image);
this.image=null;
this.image=new Ext.BoxComponent({autoEl:{tag:"img","class":this.imgCls,src:a}});
this.add(this.image);
this.doLayout()
}});
Ext.reg("gn_wmspreview",GeoNetwork.wms.PreviewPanel);Ext.namespace("GeoNetwork","GeoNetwork.wms");
GeoNetwork.wms.WMSLayerInfo=function(a){Ext.apply(this,a)
};
GeoNetwork.wms.WMSLayerInfo.prototype={layerParams:{format:"image/png",transparent:"TRUE"},layerOptions:{ratio:1,singleTile:true,isBaseLayer:false},callback:null,scope:null,layer:null,loadWMS:function(j,e){this.layer=e;
var k=j.toLowerCase();
var h=(k.indexOf("version=")>-1);
var g=(k.indexOf("service=wms")>-1);
var d=(k.indexOf("request=getcapabilities")>-1);
var f=(k.indexOf("language=")>-1);
var b={};
if(!h){b.version=GeoNetwork.OGCUtil.getProtocolVersion()
}if(!g){b.service="WMS"
}if(!d){b.request="GetCapabilities"
}if(!f){b.language=GeoNetwork.OGCUtil.getLanguage()
}var a=OpenLayers.Util.getParameterString(b);
var c=(j.indexOf("?")>-1)?"&":"?";
j+=c+a;
var i=Ext.Ajax.request({url:OpenLayers.Util.removeTail(OpenLayers.ProxyHost),method:"GET",params:{url:j},failure:this.processFailure,success:this.processSuccess,timeout:10000,scope:this})
},processSuccess:function(a){if(!this.parser){this.parser=new OpenLayers.Format.WMSCapabilities()
}var c=this.parser.read(a.responseXML||a.responseText);
var b;
if(c.capability){b=this.processLayers(c,c.capability.nestedLayers)
}Ext.callback(this.callback,this.scope,[b,this.layer])
},processFailure:function(a){Ext.callback(this.callback,this.scope,[null,this.layer])
},createWMSLayer:function(b,a){return new OpenLayers.Layer.WMS(b.title,a,OpenLayers.Util.extend({layers:b.name},this.layerParams),OpenLayers.Util.extend({minScale:b.minScale,queryable:b.queryable,maxScale:b.maxScale,description:b.abstrack,metadataURL:b.metadataURL,llbbox:b.llbbox},this.layerOptions))
},processLayers:function(g,j){var d=null;
for(var f=0,a=j.length;
f<a;
++f){var b=j[f];
try{var c=b.name.split(",");
if(c.indexOf(this.layer.params.LAYERS)!=-1){d=this.createWMSLayer(b,g.service.href);
break
}}catch(h){}if(typeof(b.nestedLayers)!="undefined"){d=this.processLayers(g,b.nestedLayers);
if(d!=null){break
}}}return d
}};Ext.namespace("GeoNetwork");
GeoNetwork.FeatureInfoPanel=function(a){Ext.apply(this,a);
GeoNetwork.FeatureInfoPanel.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.FeatureInfoPanel,Ext.Panel,{features:null,treePanel:null,infoPanel:null,initComponent:function(){GeoNetwork.FeatureInfoPanel.superclass.initComponent.call(this);
this.layout="border";
this.treePanel=new Ext.tree.TreePanel({rootVisible:true,autoScroll:true});
var b=new Ext.tree.TreeNode({text:OpenLayers.i18n("featureInfoTitle"),draggable:false,expanded:true,cls:"folder"});
this.treePanel.setRootNode(b);
var a={region:"center",items:[this.treePanel],split:true,minWidth:100};
this.infoPanel=new Ext.Panel();
this.infoPanel.on("render",function(){if(this.features){this.showFeatures(this.features)
}},this);
var c={region:"east",items:[this.infoPanel],split:true,plain:true,cls:"popup-variant1",width:400,autoScroll:true};
this.add(a);
this.add(c);
this.doLayout()
},setMap:function(a){this.map=a
},featureToHTML:function(d){var b='<table class="olFeatureInfoTable" cellspacing="1" cellpadding="1"><tbody>';
for(var a in d.attributes){if(a){b+='<tr class="olFeatureInfoRow"><td width="50%" class="olFeatureInfoColumn">'+a+'</td><td width="50%" class="olFeatureInfoValue">'+d.attributes[a]+"</td></tr>"
}}b+="</tbody></table>";
var c=new Ext.XTemplate(b);
c.overwrite(this.infoPanel.body,d)
},click:function(e){if(e.attributes.features.length===0){var d='<table class="olFeatureInfoTable" cellpadding="1" cellspacing="1"><tbody>';
d+='<tr class="olFeatureInfoRow"><td colspan="2" class="olFeatureInfoValue">'+OpenLayers.i18n("FeatureInfoNoInfo")+"</td></tr>";
d+="</tbody></table>";
Ext.DomHelper.overwrite(this.infoPanel.body,d)
}for(var c=0,a=e.attributes.features.length;
c<a;
c++){var b=e.attributes.features[c];
this.featureToHTML(b)
}},clearInfoPanel:function(){if(this.infoPanel.body){Ext.DomHelper.overwrite(this.infoPanel.body,"")
}},getLayerTitle:function(c){if(c==null){return"&nbsp"
}var d=this.map.getLayersByClass("OpenLayers.Layer.WMS");
for(var b=0,a=d.length;
b<a;
b++){if(d[b].params.LAYERS instanceof Array){if(OpenLayers.Util.indexOf(d[b].params.LAYERS,c)!==-1){return d[b].name
}}else{if(d[b].params.LAYERS.indexOf(c)!==-1){return d[b].name
}}}},showFeatures:function(a){this.clearInfoPanel();
var h=this.treePanel.getRootNode();
while(h.firstChild){h.removeChild(h.firstChild)
}var d,g,e=[];
for(d=0,g=a.length;
d<g;
d++){var k=false;
var f="";
if(a[d].type){f=a[d].type
}else{if(a[d].gml&&a[d].gml.featureType){f=a[d].gml.featureType
}}for(var c=0;
c<e.length;
c++){if(e[c].title===f){e[c].features.push(a[d]);
k=true
}}if(k===false){e.push({title:this.getLayerTitle(f),features:[a[d]]})
}}for(d=0,g=e.length;
d<g;
d++){var b=new Ext.tree.TreeNode({text:e[d].title,features:e[d].features});
b.addListener("click",this.click,this);
h.appendChild(b);
if(d===0){h.expand();
this.click(b);
this.treePanel.getSelectionModel().select(b)
}}h.expand()
}});
Ext.reg("gn_featureinfo",GeoNetwork.FeatureInfoPanel);Ext.namespace("GeoNetwork");
GeoNetwork.LegendPanel=Ext.extend(GeoExt.LegendPanel,{initComponent:function(){GeoNetwork.LegendPanel.superclass.initComponent.call(this)
},onStoreAdd:function(d,c,e){GeoNetwork.LegendPanel.superclass.onStoreAdd.apply(this,arguments);
for(var f=0,a=c.length;
f<a;
f++){var b=c[f];
if(b.get("layer").legendURL!==undefined){b.set("legendURL",b.get("layer").legendURL)
}}}});
Ext.reg("gn_legendpanel",GeoNetwork.LegendPanel);Ext.namespace("GeoNetwork");
GeoNetwork.OpacitySlider=function(a){Ext.apply(this,a);
GeoNetwork.OpacitySlider.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.OpacitySlider,Ext.Slider,{layer:null,initComponent:function(){GeoNetwork.OpacitySlider.superclass.initComponent.call(this);
this.minValue=0;
this.maxValue=100;
this.value=this.getInitialValue();
this.on("change",this.setOpacity,this);
if(this.selModel){this.selModel.on("selectionchange",this.handleSelectionChange,this)
}},onDestroy:function(){this.un("change",this.setOpacity,this);
this.selModel.un("selectionchange",this.handleSelectionChange,this);
GeoNetwork.OpacitySlider.superclass.onDestroy.call(this)
},handleSelectionChange:function(b,a){if((a)&&(a.attributes.layer)){this.setLayer(a.attributes.layer)
}},getInitialValue:function(){if(this.layer===null){return 100
}var a=(typeof this.layer.opacity=="number")?this.layer.opacity*100:100;
return a
},setOpacity:function(b,c){var a=c/100;
if(this.layer){this.layer.setOpacity(a)
}},setLayer:function(a){this.layer=a;
if(this.rendered){this.setValue(this.getInitialValue());
this.syncThumb()
}},afterRender:function(){if(this.layer){this.setValue(this.getInitialValue())
}}});
Ext.reg("gn_opacityslider",GeoNetwork.OpacitySlider);Ext.namespace("Geonetwork","Geonetwork.print");
Geonetwork.print.PrintAction=function(a){var b=OpenLayers.Util.extend({iconCls:"mf-print-action",text:OpenLayers.Lang.translate("mf.print.print"),tooltip:OpenLayers.Lang.translate("mf.print.print-tooltip"),handler:this.handler,scope:this},a);
Geonetwork.print.PrintAction.superclass.constructor.call(this,b);
OpenLayers.Util.extend(this,a);
this.mask=new Ext.LoadMask(this.map.div,{msg:OpenLayers.Lang.translate("mf.print.loadingConfig")});
this.initPrint()
};
Ext.extend(Geonetwork.print.PrintAction,Ext.Action,{handler:function(){if(!this.printing){this.mask=null;
this.mask=new Ext.LoadMask(this.map.div,{msg:OpenLayers.Lang.translate("mf.print.loadingConfig")});
this.print()
}},fillSpec:function(a){var b={bbox:this.map.getExtent().toArray()};
var c=a.spec;
c.pages.push(b);
c.layout=this.getCurLayout()
},getCurDpi:function(){return this.config.dpis[0].value
},getCurLayout:function(){return this.config.layouts[0].name
}});
OpenLayers.Util.applyDefaults(Geonetwork.print.PrintAction.prototype,mapfish.widgets.print.Base);
Ext.reg("gn_printaction",Geonetwork.print.PrintAction);Ext.namespace("GeoNetwork");
GeoNetwork.ProjectionSelector=function(a){Ext.apply(this,a);
GeoNetwork.ProjectionSelector.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.ProjectionSelector,Ext.form.ComboBox,{projections:null,initComponent:function(){GeoNetwork.ProjectionSelector.superclass.initComponent.call(this);
this.on("select",this.reproject,this);
this.valueField="value";
this.autoWidth=true;
this.autoHeight=true;
this.displayField="text";
this.triggerAction="all";
this.mode="local";
this.store=new Ext.data.Store({reader:new Ext.data.ArrayReader({},[{name:"value"},{name:"text"}]),data:this.projections});
this.value=this.map.getProjection()
},reproject:function(b,a){GeoNetwork.OGCUtil.reprojectMap(this.map,new OpenLayers.Projection(a.get("value")),false)
}});
Ext.reg("gn_projectionselector",GeoNetwork.ProjectionSelector);Ext.namespace("GeoNetwork");
GeoNetwork.TimeSelector=function(a){Ext.apply(this,a);
GeoNetwork.TimeSelector.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.TimeSelector,Ext.form.FormPanel,{layer:null,numberOfSteps:12,border:false,originalFormat:null,initComponent:function(){this.buttons=[new Ext.Button({text:OpenLayers.i18n("wmsTimeUpdateButtonText"),handler:this.updateValue,scope:this})];
GeoNetwork.TimeSelector.superclass.initComponent.call(this)
},beforeDestroy:function(){this.updateValue();
GeoNetwork.TimeSelector.superclass.beforeDestroy.call(this)
},setLayer:function(a){this.layer=a;
this.originalFormat=this.layer.params.FORMAT||this.layer.params.format;
if(this.layer.dimensions&&this.layer.dimensions.time){this.add(new Ext.form.Label({text:OpenLayers.i18n("WMSTimePositionTitle")}));
this.add(new Ext.BoxComponent({height:10}));
this.add(this.createDateTimeField());
if(this.layer.dimensions.time.multipleVal){this.add(new Ext.BoxComponent({height:25}));
this.add(new Ext.form.Label({text:OpenLayers.i18n("WMSTimeMovieTitle")}));
this.add(new Ext.BoxComponent({height:10}));
this.add({xtype:"checkbox",listeners:{check:{fn:this.playMovie,scope:this}},hideLabel:true,boxLabel:OpenLayers.i18n("WMSTimeAnimationCheckbox",{steps:this.numberOfSteps})})
}this.doLayout()
}},getInterval:function(a){return parseInt(a.substring(a.indexOf("PT")+2,a.indexOf("M")))
},playMovie:function(d,g){if(g){var c,f,b;
if(this.layer.dimensions.time.values&&this.layer.dimensions.time.values.length>0){var e=this.layer.dimensions.time.values[0].split("/");
c=e[1];
f=this.getInterval(e[2]);
var h=Date.parseDate(c,"c");
h=h-(1000*60*f*this.numberOfSteps);
h=new Date(h);
b=this.formatTimeAsUTC(h)+"/"+c
}this.layer.mergeNewParams({TIME:b,FORMAT:"image/gif"})
}else{this.updateValue()
}},formatTimeAsUTC:function(a){var b=a.dateFormat("c");
var c=""+a.getUTCHours();
if(c.length<2){c="0"+c
}b=b.replace(b.substring(b.indexOf("T"),b.indexOf("T")+3),"T"+c);
b=b.replace(b.substring(b.indexOf("+"),b.indexOf("+")+6),"Z");
return b
},updateValue:function(){this.layer.mergeNewParams({TIME:this.formatTimeAsUTC(this.getForm().findField("current").getValue()),FORMAT:this.originalFormat})
},createDateTimeField:function(){var d,a,c;
if(this.layer.dimensions.time.values&&this.layer.dimensions.time.values.length>0){var b=this.layer.dimensions.time.values[0].split("/");
d=b[0];
a=b[1];
c=this.getInterval(b[2])
}return new Ext.ux.form.DateTime({hiddenFormat:"c",dateFormat:null,hideLabel:true,name:"current",dateConfig:{minValue:Date.parseDate(d,"c"),maxValue:Date.parseDate(a,"c")},timeConfig:{increment:c},value:(this.layer.params.TIME)?this.layer.params.TIME:this.layer.dimensions.time["default"],width:340})
}});
Ext.reg("gn_timeselector",GeoNetwork.TimeSelector);Ext.namespace("GeoNetwork");
GeoNetwork.BaseWindow=function(a){Ext.apply(this,a);
GeoNetwork.BaseWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.BaseWindow,Ext.Window,{map:null,initComponent:function(){GeoNetwork.BaseWindow.superclass.initComponent.call(this);
this.constrainHeader=true;
this.collapsible=true;
this.layout="fit";
this.plain=true;
this.stateful=false
}});Ext.namespace("GeoNetwork");
GeoNetwork.SingletonWindowManager=function(){var a=new Object();
var b=new Array();
return{registerWindow:function(f,d,c){var e=new d(c);
a[f]={windowz:e,classz:d,configz:c}
},getWindow:function(c){if(a[c]){return a[c].windowz
}else{return null
}},showWindow:function(e){if(a[e]){if(Ext.isEmpty(Ext.getCmp(e))){var c=a[e];
var d=new c.classz(c.configz);
a[e]={windowz:d,classz:c.classz,configz:c.configz}
}a[e].windowz.show();
return true
}else{return false
}},hideAllWindows:function(){for(key in a){if(a[key].windowz.isVisible()){a[key].windowz.setVisible(false);
b[b.length]=key
}}},restoreHiddenWindows:function(){for(var d=0,c=b.length;
d<c;
++d){a[b[d]].windowz.setVisible(true)
}b=new Array()
}}
};
GeoNetwork.WindowManager=new GeoNetwork.SingletonWindowManager();Ext.namespace("GeoNetwork");
GeoNetwork.AddWmsLayerWindow=function(a){Ext.apply(this,a);
GeoNetwork.AddWmsLayerWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.AddWmsLayerWindow,GeoNetwork.BaseWindow,{initComponent:function(){GeoNetwork.AddWmsLayerWindow.superclass.initComponent.call(this);
this.title=this.title||OpenLayers.i18n("addWMSWindowTitle");
this.width=600;
this.height=500;
var b=new Ext.data.Store({data:GeoNetwork.WMSList,reader:new Ext.data.ArrayReader({},[{name:"title"},{name:"url"}])});
var a=new Ext.Panel({border:false,deferredRender:false,layout:"fit",items:[{id:"gn_wmsbrowserpanel",xtype:"gn_wmsbrowserpanel",mode:GeoNetwork.wms.BrowserPanel.ADDWMS,wmsStore:b,map:this.map}]});
this.add(a);
this.doLayout()
},setUrl:function(a){Ext.getCmp("gn_wmsbrowserpanel").loadUrl(a)
}});Ext.namespace("GeoNetwork");
GeoNetwork.FeatureInfoWindow=function(a){Ext.apply(this,a);
GeoNetwork.FeatureInfoWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.FeatureInfoWindow,GeoNetwork.BaseWindow,{control:null,initComponent:function(){GeoNetwork.FeatureInfoWindow.superclass.initComponent.call(this);
this.title=this.title||OpenLayers.i18n("featureInfoWindow.windowTitle");
this.width=600;
this.height=250;
this.cls="popup-variant1";
var a=new GeoNetwork.FeatureInfoPanel();
this.add(a);
this.doLayout()
},setFeatures:function(a){this.items.items[0].showFeatures(a)
},setMap:function(a){this.items.items[0].setMap(a)
}});Ext.namespace("GeoNetwork");
GeoNetwork.OpacityWindow=function(a){Ext.apply(this,a);
GeoNetwork.OpacityWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.OpacityWindow,GeoNetwork.BaseWindow,{layer:null,initComponent:function(){GeoNetwork.OpacityWindow.superclass.initComponent.call(this);
this.title=this.title||OpenLayers.i18n("opacityWindowTitle");
this.width=200;
this.height=100;
this.opacitySlider=new GeoNetwork.OpacitySlider({layer:this.layer,selModel:this.selMode});
this.add(this.opacitySlider);
this.doLayout()
},setLayer:function(a){this.opacitySlider.setLayer(a)
}});Ext.namespace("GeoNetwork");
GeoNetwork.LoadWmcWindow=function(a){Ext.apply(this,a);
GeoNetwork.LoadWmcWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.LoadWmcWindow,GeoNetwork.BaseWindow,{initComponent:function(){GeoNetwork.LoadWmcWindow.superclass.initComponent.call(this);
Ext.QuickTips.init();
this.title=this.title||OpenLayers.i18n("selectWMCFile.windowTitle");
this.width=385;
this.resizable=false;
this.charset="UTF-8";
var a=new Ext.FormPanel({renderTo:"form_wmc",fileUpload:true,width:360,autoheight:true,layout:"fit",bodyStyle:"padding: 10px 10px 0 10px;",labelWidth:0,plain:true,frame:true,border:false,defaults:{anchor:"90%",msgTarget:"side",allowBlank:false},items:[{xtype:"fileuploadfield",id:"form-file",emptyText:OpenLayers.i18n("selectWMCFile"),hideLabel:true,buttonText:"",name:"Fileconten",buttonCfg:{text:"",iconCls:"selectfile"}}],buttons:[{text:OpenLayers.i18n("selectWMCFile.loadButtonText"),scope:this,handler:function(){if(a.getForm().isValid()){a.getForm().submit({url:"../../wmc/load.wmc",success:this.onSuccessLoad,failure:this.onFailure,scope:this})
}}},{text:OpenLayers.i18n("selectWMCFile.mergeButtonText"),scope:this,handler:function(){if(a.getForm().isValid()){a.getForm().submit({url:"../../wmc/load.wmc",success:this.onSuccessMerge,failure:this.onFailure,scope:this})
}}}]});
this.add(a);
this.doLayout()
},onSuccessLoad:function(c,d){var b=d.response.responseText;
var e=Ext.decode(b);
if(e.success){var a=OpenLayers.Function.bind(this.parseWMCLoad,this);
OpenLayers.loadURL(e.url,null,null,a)
}else{this.onAjaxFailure()
}},onSuccessMerge:function(c,d){var b=d.response.responseText;
var e=Ext.decode(b);
if(e.success){var a=OpenLayers.Function.bind(this.parseWMCMerge,this);
OpenLayers.loadURL(e.url,null,null,a)
}else{this.onAjaxFailure()
}},onFailure:function(a,b){Ext.MessageBox.show({icon:Ext.MessageBox.ERROR,title:OpenLayers.i18n("errorTitle"),msg:OpenLayers.i18n("InvalidWMC"),buttons:Ext.MessageBox.OK})
},parseWMCLoad:function(a){GeoNetwork.WMCManager.loadWmc(this.map,a.responseText);
Ext.WindowMgr.getActive().close()
},parseWMCMerge:function(a){GeoNetwork.WMCManager.mergeWmc(this.map,a.responseText);
Ext.WindowMgr.getActive().close()
}});Ext.namespace("GeoNetwork");
GeoNetwork.LayerStylesWindow=function(a){Ext.apply(this,a);
GeoNetwork.LayerStylesWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.LayerStylesWindow,GeoNetwork.BaseWindow,{initComponent:function(){GeoNetwork.LayerStylesWindow.superclass.initComponent.call(this);
this.title=this.title||OpenLayers.i18n("layerStylesWindowTitle");
this.width=575;
this.height=300;
this.layerStylesPanel=new GeoNetwork.wms.LayerStylesPanel({map:this.map});
this.add(this.layerStylesPanel);
this.addButton(OpenLayers.i18n("selectStyleButton"),this._selectStyle,this);
this.doLayout()
},showLayerStyles:function(a){this.layer=a;
this.layerStylesPanel.showLayerStyles(a)
},_selectStyle:function(){this.layer.mergeNewParams({styles:this.layerStylesPanel.selectedStyle});
this.layer.legendURL=this.layerStylesPanel.selectedStyleLegendUrl
}});Ext.namespace("GeoNetwork");
GeoNetwork.WmsLayerMetadataWindow=function(a){Ext.apply(this,a);
GeoNetwork.WmsLayerMetadataWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.WmsLayerMetadataWindow,GeoNetwork.BaseWindow,{layer:null,initComponent:function(){GeoNetwork.WmsLayerMetadataWindow.superclass.initComponent.call(this);
this.title=this.title||OpenLayers.i18n("layerInfoPanel.windowTitle");
this.width=575;
this.height=300;
this.infoLayerPanel=new GeoNetwork.wms.LayerInfoPanel({map:this.map});
this.add(this.infoLayerPanel);
this.doLayout()
},showLayerInfo:function(a){this.infoLayerPanel.layer=a;
this.infoLayerPanel.onlineresource=a.url;
this.infoLayerPanel.showLayerInfo()
}});Ext.namespace("GeoNetwork");
GeoNetwork.WMSTimeWindow=function(a){Ext.apply(this,a);
GeoNetwork.WMSTimeWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.WMSTimeWindow,GeoNetwork.BaseWindow,{initComponent:function(){GeoNetwork.WMSTimeWindow.superclass.initComponent.call(this);
this.title=this.title||OpenLayers.i18n("WMSTimeWindowTitle");
this.width=450;
this.height=300;
this.timeSelector=new GeoNetwork.TimeSelector({bodyStyle:"padding: 10px 10px 0 10px;"});
this.add(this.timeSelector);
this.doLayout()
},setLayer:function(a){this.timeSelector.setLayer(a)
}});Ext.namespace("GeoNetwork");
GeoNetwork.DisclaimerWindow=function(a){Ext.apply(this,a);
GeoNetwork.DisclaimerWindow.superclass.constructor.call(this)
};
Ext.extend(GeoNetwork.DisclaimerWindow,Ext.Window,{disclaimer:null,initComponent:function(){GeoNetwork.BaseWindow.superclass.initComponent.call(this);
this.id="disclaimerwindow";
this.constrainHeader=true;
this.layout="fit";
this.plain=true;
this.stateful=false;
this.title=OpenLayers.i18n("disclaimer.windowTitle");
this.minWidth=440;
this.minHeight=280;
this.width=440;
this.height=280;
this.autoScroll=true;
this.modal=true;
this.addButton(OpenLayers.i18n("disclaimer.buttonClose"),function(){this.close()
},this);
if(this.disclaimer.startsWith("http://")){this.on("show",this.showDisclaimerUrl)
}else{var a=new Ext.form.TextArea({hideLabel:true,name:"msg",value:this.disclaimer,anchor:"100% -53",enableKeyEvents:true,listeners:{keydown:function(c,b){if(!(b.getKey()==67&&b.ctrlKey)){b.stopEvent()
}}}});
this.add(a)
}this.doLayout()
},showDisclaimerUrl:function(){this.load({url:OpenLayers.ProxyHost+this.disclaimer,text:OpenLayers.i18n("disclaimer.loading"),timeout:30,scripts:false})
}});Ext.BLANK_IMAGE_URL=Env.url+"/scripts/ext/resources/images/default/s.gif";
OpenLayers.DOTS_PER_INCH=90.71;
OpenLayers.ProxyHost=Env.url+"/proxy?url=";
OpenLayers.ImgPath=Env.url+"/scripts/openlayers/img/";
OpenLayers.IMAGE_RELOAD_ATTEMPTS=3;
mapfish.SERVER_BASE_URL=Env.url+"/";
OpenLayers.Util.onImageLoadErrorColor="transparent";
function getOpenlayersLangCode(){switch(Env.lang){case"cat":a="ca";
break;
case"dut":a="nl";
break;
case"eng":a="en";
break;
case"fin":a="fi";
break;
case"fre":a="fr";
break;
case"ger":a="de";
break;
case"ita":a="it";
break;
case"spa":a="es";
break;
case"nor":a="no";
break;
case"rus":a="ru";
break;
case"por":a="pt";
break;
case"chi":a="cn";
break;
default:a="en"
}return a
}if(Env.lang){OpenLayers.Lang.setCode(getOpenlayersLangCode());
var s=document.createElement("script");
s.type="text/javascript";
s.src=Env.url+"/scripts/ext/locale/ext-lang-"+getOpenlayersLangCode()+".js";
document.getElementsByTagName("head")[0].appendChild(s)
}else{OpenLayers.Lang.setCode(GeoNetwork.defaultLocale);
var s=document.createElement("script");
s.type="text/javascript";
s.src=Env.url+"/scripts/ext/locale/ext-lang-"+GeoNetwork.defaultLocale+".js";
document.getElementsByTagName("head")[0].appendChild(s)
}OpenLayers.Util.onImageLoadError=function(){this._attempts=(this._attempts)?(this._attempts+1):1;
if(this._attempts<=OpenLayers.IMAGE_RELOAD_ATTEMPTS){this.src=this.src
}else{this.style.backgroundColor=OpenLayers.Util.onImageLoadErrorColor;
this.style.display="none"
}};Ext.namespace("GeoNetwork");
GeoNetwork.miniapp=function(){var m,j;
var h;
var e=[];
var l;
var d;
var k=function(p){var o=p||{projection:"EPSG:4326",units:"m",maxExtent:new OpenLayers.Bounds(-180,-90,180,90),restrictedExtent:new OpenLayers.Bounds(-180,-90,180,90),controls:[]};
if(!o.controls){o.controls=[]
}h=new OpenLayers.Map(o)
};
var c=function(q,p,r,o){h.addLayer(new OpenLayers.Layer.WMS(q,p,r,o))
};
var g=function(){h.addControl(new GeoNetwork.Control.ZoomWheel());
h.addControl(new OpenLayers.Control.LoadingPanel())
};
var n=function(o){d=$(o)
};
var i=function(o){m=[];
action=new GeoExt.Action({control:new OpenLayers.Control.ZoomToMaxExtent(),map:h,iconCls:"zoomfull",tooltip:{title:OpenLayers.i18n("zoomToMaxExtentTooltipTitle"),text:OpenLayers.i18n("zoomToMaxExtentTooltipText")}});
m.push(action);
m.push("-");
action=new GeoExt.Action({control:new OpenLayers.Control.ZoomBox(),map:h,toggleGroup:"move",allowDepress:false,iconCls:"zoomin",tooltip:{title:OpenLayers.i18n("zoominTooltipTitle"),text:OpenLayers.i18n("zoominTooltipText")}});
m.push(action);
action=new GeoExt.Action({control:new OpenLayers.Control.ZoomBox({displayClass:"ZoomOut",out:true}),map:h,toggleGroup:"move",allowDepress:false,tooltip:{title:OpenLayers.i18n("zoomoutTooltipTitle"),text:OpenLayers.i18n("zoomoutTooltipText")},iconCls:"zoomout"});
m.push(action);
action=new GeoExt.Action({control:new OpenLayers.Control.DragPan({isDefault:true}),toggleGroup:"move",allowDepress:false,pressed:true,map:h,iconCls:"pan",tooltip:{title:OpenLayers.i18n("dragTooltipTitle"),text:OpenLayers.i18n("dragTooltipText")}});
m.push(action);
m.push("-");
l=new GeoNetwork.Control.ExtentBox({minxelement:Ext.get(o.westBL),maxxelement:Ext.get(o.eastBL),minyelement:Ext.get(o.southBL),maxyelement:Ext.get(o.northBL)});
l.events.register("finishBox",null,function(p){d.selectedIndex=1;
if(e){for(var q=0;
q<e.length;
q++){e[q].synch(d.selectedIndex,l)
}}});
action=new GeoExt.Action({control:l,toggleGroup:"move",allowDepress:false,map:h,tooltip:{title:OpenLayers.i18n("selectExtentTooltipTitle"),text:OpenLayers.i18n("selectExtentTooltipText")},iconCls:"selextent"});
m.push(action)
};
var b=function b(o){if(l){l.updateMap();
if(o){l.zoomTo()
}}};
var f=function(p,o){i(o);
var q=new GeoExt.MapPanel({id:"mini_mappanel_"+p,renderTo:p,height:150,width:210,border:false,map:h,tbar:m})
};
var a=function a(){if(l){l.clear();
l.minxelement.dom.value="";
l.minyelement.dom.value="";
l.maxxelement.dom.value="";
l.maxyelement.dom.value="";
h.zoomToMaxExtent()
}};
return{init:function(t,p,s,o,r){if(!$(t)){return
}Ext.QuickTips.init();
n(p);
k(o);
for(var q=0;
q<s.length;
q++){c(s[q][0],s[q][1],s[q][2],s[q][3])
}f(t,r);
g();
h.zoomToMaxExtent();
Ext.EventManager.on(Ext.get(r.westBL),"change",b);
Ext.EventManager.on(Ext.get(r.eastBL),"change",b);
Ext.EventManager.on(Ext.get(r.southBL),"change",b);
Ext.EventManager.on(Ext.get(r.northBL),"change",b)
},clearExtentBox:function(){a()
},updateExtentBox:function(){b(true)
},getMap:function(){return h
},synch:function(o,p){$(d).selectedIndex=o;
if(p&&l){l.minxelement.set({value:p.minxelement.getValue()});
l.minyelement.set({value:p.minyelement.getValue()});
l.maxxelement.set({value:p.maxxelement.getValue()});
l.maxyelement.set({value:p.maxyelement.getValue()})
}b(false)
},setSynchMinimap:function(o){e.push(o)
},addWmsLayer:function(q,p,r,o){c(q,p,r,o)
}}
};
GeoNetwork.minimapSimpleSearch=new GeoNetwork.miniapp();
GeoNetwork.minimapAdvancedSearch=new GeoNetwork.miniapp();
GeoNetwork.minimapRemoteSearch=new GeoNetwork.miniapp();Ext.namespace("GeoNetwork");
var mapInit=false;
var activeIndex=0;
var printConfigUrl=mapfish.SERVER_BASE_URL+"pdf/info.json";
GeoNetwork.app=function(){var r,B,x,F;
var t,n,a;
var y;
var e;
var I;
var u;
var s;
var z=function(K,L){var J=K||{projection:"EPSG:4326",units:"degrees",maxExtent:new OpenLayers.Bounds(-180,-90,180,90),restrictedExtent:new OpenLayers.Bounds(-180,-90,180,90),controls:[]};
I=new OpenLayers.Map("ol_map",J);
u=L
};
var E=function(L,K,M,J){I.addLayer(new OpenLayers.Layer.WMS(L,K,M,J))
};
var g=function(J){var K=new OpenLayers.Layer.Image("Dummy","../../scripts/openlayers/img/blank.gif",J,I.getSize(),{isBaseLayer:true,displayInLayerSwitcher:false});
I.addLayer(K)
};
var D=function(){I.addControl(new GeoNetwork.Control.ZoomWheel());
I.addControl(new OpenLayers.Control.LoadingPanel())
};
var m=function(J){if(!J.hasListener("radiochange")){J.on("radiochange",function(K){e=K
})
}};
var q=function(K){if(K.hasChildNodes()){for(var J=0;
J<K.childNodes.length;
J++){var L=K.childNodes[J];
q(L)
}}else{m(K)
}};
var h=function(K){if(K){var J;
J=K.attributes.layer;
if(J){if(!J.isBaseLayer){if((typeof(J.isLoading)=="undefined")||(J.isLoading==false)){I.removeLayer(J);
if(e==K){e=null
}j(e);
Ext.getCmp("toctree").getSelectionModel().clearSelections()
}}}}};
var k=function(){var J=Ext.getCmp("toctree").getSelectionModel().getSelectedNode();
h(J)
};
var G=function(K){if(K){var J;
J=K.attributes.layer;
if(J){GeoNetwork.WindowManager.showWindow("opacity");
GeoNetwork.WindowManager.getWindow("opacity").setLayer(J)
}}};
var C=function(){var J=Ext.getCmp("toctree").getSelectionModel().getSelectedNode();
G(J)
};
var c=function(K){if(K){var J;
J=K.attributes.layer;
if(J&&J.dimensions&&J.dimensions.time){GeoNetwork.WindowManager.showWindow("wmstime");
GeoNetwork.WindowManager.getWindow("wmstime").setLayer(J)
}}};
var d=function(){var J=Ext.getCmp("toctree").getSelectionModel().getSelectedNode();
c(J)
};
var b=function(K){if(K){var J;
J=K.attributes.layer;
if((J)&&(J.styles)&&(J.styles.length>1)){GeoNetwork.WindowManager.showWindow("layerstyles");
GeoNetwork.WindowManager.getWindow("layerstyles").showLayerStyles(J)
}}};
var v=function(){var J=Ext.getCmp("toctree").getSelectionModel().getSelectedNode();
b(J)
};
var A=function(K){if(K){var J;
J=K.attributes.layer;
if(J){GeoNetwork.WindowManager.showWindow("wmsinfo");
GeoNetwork.WindowManager.getWindow("wmsinfo").showLayerInfo(J)
}}};
var l=function(){var J=Ext.getCmp("toctree").getSelectionModel().getSelectedNode();
A(J)
};
var j=function(K){if((K)&&(K.attributes.layer)){if(K.parentNode.attributes.nodeType=="gx_baselayercontainer"){Ext.getCmp("tbRemoveButton").disable();
Ext.getCmp("tbOpacityButton").disable()
}else{Ext.getCmp("tbRemoveButton").enable();
Ext.getCmp("tbOpacityButton").enable()
}var J=K.attributes.layer;
if(J&&J.dimensions&&J.dimensions.time){Ext.getCmp("tbWmsTimeButton").enable()
}else{Ext.getCmp("tbWmsTimeButton").disable()
}if((J)&&((!J.styles)||(J.styles.length<2))){Ext.getCmp("tbStylesButton").disable()
}else{Ext.getCmp("tbStylesButton").enable()
}Ext.getCmp("tbMetadataButton").enable();
Ext.getCmp("btnZoomToExtent").enable()
}else{Ext.getCmp("tbRemoveButton").disable();
Ext.getCmp("tbWmsTimeButton").disable();
Ext.getCmp("tbStylesButton").disable();
Ext.getCmp("tbOpacityButton").disable();
Ext.getCmp("tbMetadataButton").disable();
Ext.getCmp("btnZoomToExtent").disable()
}};
var f=function(){B=[];
var L=new GeoExt.Action({handler:function(){GeoNetwork.WindowManager.showWindow("addwms")
},iconCls:"addLayer",tooltip:"Add layer"});
B.push(L);
L=new GeoExt.Action({id:"tbRemoveButton",handler:function(){h(e)
},iconCls:"deleteLayer",tooltip:"Remove layer"});
B.push(L);
B.push("-");
L=new GeoExt.Action({id:"tbOpacityButton",handler:function(){G(e)
},iconCls:"layerOpacity",tooltip:"Layer opacity"});
B.push(L);
L=new GeoExt.Action({id:"tbStylesButton",handler:function(){b(e)
},iconCls:"layerStyles",tooltip:"Layer styles"});
B.push(L);
B.push("-");
L=new GeoExt.Action({id:"tbMetadataButton",handler:function(){A(e)
},iconCls:"wmsInfo",tooltip:"WMS Information"});
B.push(L);
B.push("-");
L=new GeoExt.Action({id:"tbWmsTimeButton",handler:function(){c(e)
},iconCls:"wmsTime",tooltip:"WMS Time"});
B.push(L);
r=[];
L=new GeoExt.Action({control:new OpenLayers.Control.ZoomToMaxExtent(),map:I,iconCls:"zoomfull",tooltip:{title:OpenLayers.i18n("zoomToMaxExtentTooltipTitle"),text:OpenLayers.i18n("zoomToMaxExtentTooltipText")}});
r.push(L);
r.push("-");
L=new GeoExt.Action({iconCls:"zoomlayer",id:"btnZoomToExtent",tooltip:{title:OpenLayers.i18n("zoomlayerTooltipTitle"),text:OpenLayers.i18n("zoomlayerTooltipText")},handler:function(){var T=e;
var R;
if(T){R=T.attributes.layer;
if(R){if(R.llbbox){var U=I.getProjectionObject();
var Q=new OpenLayers.Projection("WGS84");
var O=new OpenLayers.LonLat(R.llbbox[0],R.llbbox[1]).transform(Q,U);
var P=new OpenLayers.LonLat(R.llbbox[2],R.llbbox[3]).transform(Q,U);
var S=new OpenLayers.Bounds();
S.left=O.lon;
S.right=P.lon;
S.top=P.lat;
S.bottom=O.lat;
I.zoomToExtent(S)
}else{I.zoomToMaxExtent()
}}else{Ext.MessageBox.alert(OpenLayers.i18n("zoomlayer.selectLayerTitle"),OpenLayers.i18n("zoomlayer.selectLayerText"))
}}else{Ext.MessageBox.alert(OpenLayers.i18n("zoomlayer.selectLayerTitle"),OpenLayers.i18n("zoomlayer.selectLayerText"))
}}});
r.push(L);
r.push("-");
L=new GeoExt.Action({control:new OpenLayers.Control.ZoomBox(),map:I,toggleGroup:"move",allowDepress:false,iconCls:"zoomin",tooltip:{title:OpenLayers.i18n("zoominTooltipTitle"),text:OpenLayers.i18n("zoominTooltipText")}});
r.push(L);
L=new GeoExt.Action({control:new OpenLayers.Control.ZoomBox({displayClass:"ZoomOut",out:true}),toggleGroup:"move",allowDepress:false,map:I,iconCls:"zoomout",tooltip:{title:OpenLayers.i18n("zoomoutTooltipTitle"),text:OpenLayers.i18n("zoomoutTooltipText")}});
r.push(L);
L=new GeoExt.Action({control:new OpenLayers.Control.DragPan({isDefault:true}),toggleGroup:"move",allowDepress:false,pressed:true,map:I,iconCls:"pan",tooltip:{title:OpenLayers.i18n("dragTooltipTitle"),text:OpenLayers.i18n("dragTooltipText")}});
r.push(L);
r.push("-");
y=new OpenLayers.Control.WMSGetFeatureInfo({drillDown:true,infoFormat:"application/vnd.ogc.gml"});
var J=function(S){var P=-1;
for(var R=0,O=I.layers.length;
R<O;
R++){var Q=I.layers[R];
if(Q!=S){P=Math.max(I.getLayerIndex(I.layers[R]),P)
}}if(I.getLayerIndex(S)<P){I.setLayerIndex(S,P+1)
}};
s=new OpenLayers.Layer.Vector("Feature info",{displayInLayerSwitcher:false,styleMap:new OpenLayers.StyleMap({externalGraphic:OpenLayers.Util.getImagesLocation()+"marker.png",pointRadius:12})});
y.events.on({getfeatureinfo:function(P){var Q=I.getLonLatFromViewPortPx(P.xy);
var O=new OpenLayers.Geometry.Point(Q.lon,Q.lat);
s.destroyFeatures();
s.addFeatures(new OpenLayers.Feature.Vector(O));
J(s);
GeoNetwork.WindowManager.showWindow("featureinfo");
GeoNetwork.WindowManager.getWindow("featureinfo").setMap(I);
GeoNetwork.WindowManager.getWindow("featureinfo").setFeatures(P.features)
},deactivate:function(){s.destroyFeatures()
}});
L=new GeoExt.Action({control:y,toggleGroup:"move",allowDepress:false,pressed:false,map:I,iconCls:"query",tooltip:{title:OpenLayers.i18n("featureInfoTooltipTitle"),text:OpenLayers.i18n("featureInfoTooltipText")}});
r.push(L);
r.push("-");
ctrl=new OpenLayers.Control.NavigationHistory();
I.addControl(ctrl);
L=new GeoExt.Action({control:ctrl.previous,disabled:true,iconCls:"back",tooltip:{title:OpenLayers.i18n("previousTooltipTitle"),text:OpenLayers.i18n("previosTooltipText")}});
r.push(L);
L=new GeoExt.Action({control:ctrl.next,disabled:true,iconCls:"next",tooltip:{title:OpenLayers.i18n("nextTooltipTitle"),text:OpenLayers.i18n("nextTooltipText")}});
r.push(L);
r.push("-");
L=new GeoExt.Action({iconCls:"savewmc",tooltip:{title:OpenLayers.i18n("savewmcTooltipTitle"),text:OpenLayers.i18n("savewmcTooltipText")},handler:function(){GeoNetwork.WMCManager.saveContext(I)
}});
r.push(L);
L=new GeoExt.Action({iconCls:"loadwmc",tooltip:{title:OpenLayers.i18n("loadwmcTooltipTitle"),text:OpenLayers.i18n("loadwmcTooltipText")},handler:function(){GeoNetwork.WindowManager.showWindow("loadwmc")
}});
r.push(L);
r.push("-");
var N=new Geonetwork.print.PrintAction({map:I,text:"",tooltip:{title:OpenLayers.i18n("printTooltipTitle"),text:OpenLayers.i18n("printTooltipText")},iconCls:"print",configUrl:printConfigUrl,fillSpec:function(O){Geonetwork.print.PrintAction.prototype.fillSpec.call(this,O);
O.spec.rotation=0
}});
r.push(N);
r.push("-");
var K=new Ext.SplitButton({iconCls:"icon-measure-length",tooltip:"Measure",enableToggle:true,toggleGroup:"move",allowDepress:false,handler:function(O,P){if(!O.pressed){O.toggle()
}else{O.menu.items.itemAt(activeIndex).setChecked(true)
}},listeners:{toggle:function(O,P){if(!P){O.menu.items.each(function(Q){Q.setChecked(false)
})
}},render:function(O){Ext.ButtonToggleMgr.register(O)
}},menu:new Ext.menu.Menu({items:[new Ext.menu.CheckItem(new GeoExt.Action({text:"Length",iconCls:"icon-measure-length",toggleGroup:"measure",group:"move",allowDepress:false,map:I,control:i(OpenLayers.Handler.Path,"Length")})),new Ext.menu.CheckItem(new GeoExt.Action({text:"Area",iconCls:"icon-measure-area",toggleGroup:"measure",group:"move",allowDepress:false,map:I,control:i(OpenLayers.Handler.Polygon,"Area")}))]})});
K.menu.items.each(function(P,O){P.on({checkchange:function(R,Q){K.toggle(Q);
if(Q){activeIndex=O;
K.setIconClass(R.iconCls)
}}})
});
r.push(K);
r.push("->");
var M=new Ext.Panel({layout:"fit",border:false,cls:"projchooser",items:[{xtype:"gn_projectionselector",projections:GeoNetwork.ProjectionList,fieldLabel:OpenLayers.i18n("projectionTitle"),map:I}]});
r.push(M)
};
var w=function(){var L=new Ext.Panel({cls:"olControlScaleLine overlay-element overlay-scaleline",border:false});
L.on("render",function(){var T=new OpenLayers.Control.ScaleLine({div:L.body.dom});
I.addControl(T);
T.activate()
},this);
var J;
if(u.length>0){var Q=[];
var R=u;
var O=I.baseLayer.units;
for(var N=R.length-1;
N>=0;
N--){var K=R[N];
Q.push({level:N,resolution:OpenLayers.Util.getResolutionFromScale(K,O),scale:K})
}J=new GeoExt.data.ScaleStore({});
J.loadData(Q)
}else{J=new GeoExt.data.ScaleStore({map:I})
}var S=new Ext.form.ComboBox({emptyText:"Zoom level",tpl:'<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale)]}</div></tpl>',editable:false,triggerAction:"all",mode:"local",store:J,width:110});
S.on("click",function(T){T.stopEvent()
});
S.on("mousedown",function(T){T.stopEvent()
});
S.on("select",function(V,T,U){I.zoomTo(T.data.level)
},this);
var M=new Ext.Panel({items:[S],cls:"overlay-element overlay-scalechooser",border:false});
I.events.register("zoomend",this,function(){var T=J.queryBy(function(U){return I.getZoom()==U.data.level
});
if(T.length>0){T=T.items[0];
S.setValue("1 : "+parseInt(T.data.scale,10))
}else{if(!S.rendered){return
}S.clearValue()
}});
var P=new Ext.Panel({cls:"map-overlay",items:[L,M]});
P.on("afterlayout",function(){L.body.dom.style.position="relative";
L.body.dom.style.display="inline";
P.getEl().on("click",function(T){T.stopEvent()
});
P.getEl().on("mousedown",function(T){T.stopEvent()
})
},this);
return P
};
var i=function(L,P){var N=new OpenLayers.StyleMap({"default":new OpenLayers.Style(null,{rules:[new OpenLayers.Rule({symbolizer:{Point:{pointRadius:4,graphicName:"square",fillColor:"white",fillOpacity:1,strokeWidth:1,strokeOpacity:1,strokeColor:"#333333"},Line:{strokeWidth:3,strokeOpacity:1,strokeColor:"#666666",strokeDashstyle:"dash"},Polygon:{strokeWidth:2,strokeOpacity:1,strokeColor:"#666666",fillColor:"white",fillOpacity:0.3}}})]})});
var K=function(){if(J){J.destroy()
}};
var M=function(S){var T=S.measure;
var Q=S.units;
O.displaySystem="english";
var V=S.geometry.CLASS_NAME.indexOf("LineString")>-1?O.getBestLength(S.geometry):O.getBestArea(S.geometry);
var R=V[0];
var U=V[1];
O.displaySystem="metric";
var W=S.order==2?"<sup>2</sup>":"";
return T.toFixed(2)+" "+Q+W+"<br>"+R.toFixed(2)+" "+U+W
};
var J;
var O=new OpenLayers.Control.Measure(L,{persist:true,handlerOptions:{layerOptions:{styleMap:N}},eventListeners:{measurepartial:function(R){K();
J=new Ext.ToolTip({html:M(R),title:P,autoHide:false,closable:true,draggable:false,mouseOffset:[0,0],showDelay:1,listeners:{hide:K}});
if(R.measure>0){var Q=O.handler.lastUp;
var S=Ext.getCmp("mappanel").getPosition();
J.targetXY=[S[0]+Q.x,S[1]+Q.y];
J.show()
}},measure:function(Q){K();
J=new Ext.ToolTip({target:Ext.getBody(),html:M(Q),title:P,autoHide:false,closable:true,draggable:false,mouseOffset:[0,0],showDelay:1,listeners:{hide:function(){O.cancel();
K()
}}})
},deactivate:K,scope:this}});
return O
};
var H=function(){var J=new OpenLayers.Format.JSON().write([{nodeType:"gx_baselayercontainer"},{nodeType:"gx_overlaylayercontainer",expanded:true,loader:{baseAttrs:{radioGroup:"foo"}}}],true);
t=new Ext.tree.TreePanel({title:"Layer tree",id:"toctree",enableDD:true,loader:new Ext.tree.TreeLoader({applyLoader:false}),root:{nodeType:"async",children:Ext.decode(J)},listeners:{contextmenu:function(L,M){if((L.attributes.nodeType!="gx_overlaylayercontainer")&&(L.attributes.nodeType!="gx_baselayercontainer")){L.select();
var N=L.getOwnerTree().contextMenu;
if(L.parentNode.attributes.nodeType=="gx_baselayercontainer"){N.items.get("removeMenu").disable();
N.items.get("opacityMenu").disable()
}else{N.items.get("removeMenu").enable();
N.items.get("opacityMenu").enable()
}N.items.get("addMenu").hide();
var K=L.attributes.layer;
if(K&&K.dimensions&&K.dimensions.time){N.items.get("wmsTimeMenu").enable()
}else{N.items.get("wmsTimeMenu").disable()
}if((K)&&((!K.styles)||(K.styles.length<2))){N.items.get("stylesMenu").disable()
}else{N.items.get("stylesMenu").enable()
}N.contextNode=L;
N.showAt(M.getXY())
}else{if(L.attributes.nodeType=="gx_overlaylayercontainer"){L.select();
var N=L.getOwnerTree().contextMenu;
N.items.get("addMenu").show();
N.items.get("removeMenu").hide();
N.items.get("opacityMenu").hide();
N.items.get("wmsTimeMenu").hide();
N.items.get("stylesMenu").hide();
N.items.get("metadataMenu").hide();
N.contextNode=L;
N.showAt(M.getXY())
}}},scope:this},contextMenu:new Ext.menu.Menu({items:[{text:"Add layer",id:"addMenu",handler:function(){GeoNetwork.WindowManager.showWindow("addwms")
}},{text:OpenLayers.i18n("removeButtonText"),id:"removeMenu",handler:k},{text:"WMS information",id:"metadataMenu",handler:l},{text:OpenLayers.i18n("opacityButtonText"),id:"opacityMenu",handler:C},{text:"Styles",id:"stylesMenu",handler:v},{text:OpenLayers.i18n("WMSTimeWindowTitle"),id:"wmsTimeMenu",disabled:true,handler:d}]}),tbar:B,rootVisible:false,lines:false,border:false,region:"center"})
};
var p=function(){n=new GeoExt.LegendPanel({defaults:{labelCls:"mylabel",style:"padding:5px"},title:"Legend",height:200,autoScroll:true,split:true,collapsible:true,collapsed:true,border:false,region:"south"})
};
var o=function(){f();
H();
p();
var L=w();
var J=new Ext.Panel({region:"center",border:false,layout:"accordion",deferredRender:false,items:[t,{xtype:"print-simple",title:OpenLayers.i18n("mf.print.print"),bodyStyle:"padding: 7px;",formConfig:{labelWidth:65,defaults:{width:100,listWidth:100}},border:false,map:I,configUrl:printConfigUrl}]});
var M=new GeoExt.MapPanel({id:"mappanel",border:false,map:I,height:150,width:210,zoom:2,tbar:r,items:[L]});
F=new Ext.Panel({layout:"border",border:false,renderTo:"map_container",items:[{region:"west",xtype:"panel",collapsible:true,collapseMode:"mini",split:true,border:false,width:200,minSize:200,maxSize:300,layout:"border",items:[J,n]},{region:"center",layout:"fit",frame:false,border:false,margins:"0 0 0 0",items:[M]}]});
Ext.getCmp("toctree").on({insert:m,append:m,click:function(N){if(N.ui.radio){N.ui.radio.checked=true;
N.ui.fireEvent("radiochange",N)
}j(N)
},scope:this});
var K=Ext.getCmp("toctree").getRootNode();
q(K);
Ext.getCmp("toctree").on("nodedragover",function(N){if((N.dropNode.parentNode.attributes.nodeType=="gx_baselayercontainer")||(N.target.attributes.nodeType=="gx_baselayercontainer")||(N.target.parentNode.attributes.nodeType=="gx_baselayercontainer")||(N.target.parentNode==N.tree.root)){N.cancel=true
}});
j(e)
};
return{init:function(N,L,J){Ext.QuickTips.init();
z(L,J);
for(var M=0;
M<N.length;
M++){E(N[M][0],N[M][1],N[M][2],N[M][3])
}o();
D();
GeoNetwork.WindowManager.registerWindow("loadwmc",GeoNetwork.LoadWmcWindow,{map:I,id:"loadwmc"});
GeoNetwork.WindowManager.registerWindow("addwms",GeoNetwork.AddWmsLayerWindow,{map:I,id:"addwms"});
GeoNetwork.WindowManager.registerWindow("featureinfo",GeoNetwork.FeatureInfoWindow,{map:I,id:"featureinfo",control:y});
GeoNetwork.WindowManager.registerWindow("opacity",GeoNetwork.OpacityWindow,{map:I,id:"opacity",selMode:Ext.getCmp("toctree").getSelectionModel()});
GeoNetwork.WindowManager.registerWindow("layerstyles",GeoNetwork.LayerStylesWindow,{map:I,id:"layerstyles"});
GeoNetwork.WindowManager.registerWindow("wmstime",GeoNetwork.WMSTimeWindow,{map:I,id:"wmstime"});
GeoNetwork.WindowManager.registerWindow("wmsinfo",GeoNetwork.WmsLayerMetadataWindow,{map:I,id:"wmsinfo"});
Ext.getCmp("toctree").on({insert:m,append:m,click:function(O){if(O.ui.radio){O.ui.radio.checked=true;
O.ui.fireEvent("radiochange",O)
}j(O)
},scope:this});
var K=Ext.getCmp("toctree").getRootNode();
q(K);
j(e);
Ext.getCmp("toctree").on("nodedragover",function(O){if((O.dropNode.parentNode.attributes.nodeType=="gx_baselayercontainer")||(O.target.attributes.nodeType=="gx_baselayercontainer")||(O.target.parentNode.attributes.nodeType=="gx_baselayercontainer")||(O.target.parentNode==O.tree.root)){O.cancel=true
}});
I.events.register("moveend",I,function(O){GeoNetwork.MapStateManager.stoteMapExtextState(I)
});
I.events.register("addlayer",I,function(O){GeoNetwork.MapStateManager.storeMapLayersState(I)
});
I.events.register("removelayer",I,function(O){GeoNetwork.MapStateManager.storeMapLayersState(I)
});
I.events.register("changelayer",I,function(O){GeoNetwork.MapStateManager.storeMapLayersState(I)
});
I.addLayer(s)
},addWMSLayer:function(J){GeoNetwork.CatalogueInterface.addLayers(J)
},addWMSServerLayers:function(K){GeoNetwork.WindowManager.showWindow("addwms");
var J=GeoNetwork.WindowManager.getWindow("addwms");
J.setUrl(K)
},getViewport:function(){return F
},refreshViewport:function(){Ext.get("west_panel").setWidth(westPanelWidth);
F.doLayout()
},getMap:function(){return I
}}
};
GeoNetwork.defaultLocale="en";
GeoNetwork.ProjectionList=[];
GeoNetwork.WMSList=[];
GeoNetwork.mapViewer=new GeoNetwork.app();
Ext.onReady(function(){Ext.layout.BorderLayout.Region.prototype.getCollapsedEl=Ext.layout.BorderLayout.Region.prototype.getCollapsedEl.createSequence(function(){if((this.position=="north"||this.position=="south")&&!this.collapsedEl.titleEl){this.collapsedEl.titleEl=this.collapsedEl.createChild({cls:"x-collapsed-title",cn:this.panel.title})
}})
});