var mainViewport;
function initSimpleSearch(b){}function gn_anyKeyObserver(b){if(b.keyCode==Event.KEY_RETURN){runSimpleSearch()
}}function runCsvSearch(){var b=getGNServiceURL("csv.search");
if($("advanced_search_pnl").visible()){b=b+"?"+fetchParam("template")
}window.open(b,"csv");
metadataselect(0,"remove-all")
}function runPdfSearch(b){if(b){var e=getGNServiceURL("pdf.selection.search");
e=e+"?"+fetchParam("sortBy");
e=e+fetchParam("sortOrder");
if($("advanced_search_pnl").visible()){e=e+fetchParam("template")
}location.replace(e)
}else{var d=Ext.state.Manager.getProvider();
var c=d.get("search");
if(c&&c.searchTab=="advanced"){runAdvancedSearch("pdf")
}else{runSimpleSearch("pdf")
}}}function runSimpleSearch(c){if(c!="pdf"){preparePresent()
}setSort();
var b=$("simple_search_form").serialize(true);
if(c=="pdf"){gn_searchpdf(b)
}else{gn_search(b)
}}function resetWherePars(){setParam("region_simple",null);
setParam("region",null);
setParam("region_remote",null);
setParam("relation_simple","overlaps");
setParam("relation","overlaps");
setParam("relation_remote","overlaps");
resetMinimaps()
}function resetSimpleSearch(){var b=$("simple_search_form");
clearFormValues(b);
resetWherePars();
setParam(b.requestedLanguage_simple,Env.lang);
setParam(b.sortBy,"relevance");
setParam(b.sortOrder,"");
setParam(b.hitsPerPage_simple,"10");
setParam(b.output_simple,"full")
}function resetMinimaps(){GeoNetwork.minimapSimpleSearch.clearExtentBox();
var c=GeoNetwork.minimapSimpleSearch.getMap();
if(c){var b=Ext.getCmp("mini_mappanel_ol_minimap1");
b.map.setCenter(b.center,b.zoom)
}GeoNetwork.minimapAdvancedSearch.clearExtentBox();
c=GeoNetwork.minimapAdvancedSearch.getMap();
if(c){var b=Ext.getCmp("mini_mappanel_ol_minimap2");
b.map.setCenter(b.center,b.zoom)
}GeoNetwork.minimapRemoteSearch.clearExtentBox();
c=GeoNetwork.minimapRemoteSearch.getMap();
if(c){var b=Ext.getCmp("mini_mappanel_ol_minimap3");
b.map.setCenter(b.center,b.zoom)
}}function showAdvancedSearch(b){openSearch("advanced_search_pnl");
var c=Ext.state.Manager.getProvider();
c.set("search",{searchTab:"advanced"});
initAdvancedSearch();
if(b=="true"){runAdvancedSearch()
}else{setFormWithQueryParams("advanced_search_form")
}}function showSimpleSearch(b){openSearch("simple_search_pnl");
var c=Ext.state.Manager.getProvider();
c.set("search",{searchTab:"default"});
initSimpleSearch();
if(b=="true"){runSimpleSearch()
}else{setFormWithQueryParams("simple_search_form")
}}function showRemoteSearch(b){openSearch("remote_search_pnl");
var c=Ext.state.Manager.getProvider();
c.set("search",{searchTab:"remote"});
initRemoteSearch();
if(b=="true"){runRemoteSearch()
}else{setFormWithQueryParams("remote_search_form")
}}function setFormWithQueryParams(c){var d=Ext.state.Manager.getProvider();
var b=d.get("params");
if(b){var f=b.searchParams;
var g=$(c).getElements();
for(var e in f){g.each(function(h){if(h.name==e){if(h.tagName!="SELECT"){if(h.type=="checkbox"||h.type=="radio"){if(f[e]=="on"){h.checked=true;
if(h.onchange){h.onchange()
}}}else{h.value=f[e];
if(h.onchange){h.onchange()
}}}else{for(index=0;
index<h.length;
index++){if(h[index].value==f[e]){h.selectedIndex=index;
if(h.onchange){h.onchange()
}}}}}})
}}}function clearFormValues(c){var d=Ext.state.Manager.getProvider();
var b=d.clear("params");
var e=c.getElements();
e.each(function(f){if(f.tagName!="SELECT"){if(f.type=="checkbox"||f.type=="radio"){f.checked=false
}else{f.value=""
}}else{f.selectedIndex=-1
}})
}function openSearch(b){if(!Prototype.Browser.IE){Effect.BlindDown(b)
}else{$(b).show()
}}function closeSearch(b){if(!Prototype.Browser.IE){Effect.BlindUp($(b))
}else{$(b).hide()
}}function initAdvancedSearch(){new Ajax.Autocompleter("themekey","keywordList","portal.search.keywords?",{paramName:"keyword",updateElement:addQuote});
initCalendar()
}function runAdvancedSearch(c){if(c!="pdf"){preparePresent()
}setSort();
var b=$("advanced_search_form").serialize(true);
if(c=="pdf"){gn_searchpdf(b)
}else{gn_search(b)
}}function resetAdvancedSearch(){var b=$("advanced_search_form");
clearFormValues(b);
radioSimil=b.similarity;
radioSimil[1].checked=true;
resetWherePars();
setBoolParam(b.radfrom0,true);
b.radfrom1.disable();
b.radfromext1.disable();
setParam(b.requestedLanguage,Env.lang);
setParam(b.sortBy,"relevance");
setParam(b.hitsPerPage,"10");
setParam(b.output,"full");
selectorIds=[]
}function initRemoteSearch(){}function resetRemoteSearch(){var b=$("remote_search_form");
clearFormValues(b);
resetWherePars();
setParam(b.hitsPerPage,"10");
setBoolParam(b.serverhtml,false);
setParam(b.timeout,"20");
deselectAllServers(b)
}function profileSelected(){var e=$("remote_search_form");
var b=e.profile;
if(b.selectedIndex>0){var d=b.options[selectedIndex].value.split(" ");
deselectAllServers(e);
for(var c=0;
c<d.length;
c++){selectServer(d[c])
}}}function deselectAllServers(d){var b=d.servers;
for(var c=0;
c<b.length;
c++){b.options[c].selected=false
}}function selectServer(e){var d=$("remote_search_form");
var b=d.servers;
for(var c=0;
c<b.length;
c++){if(b.options[c].value==e){b.options[c].selected=true
}}}function checkRemoteFields(){var b=$("remote_search_form").serialize(true);
if(isWhitespace(b.or)&&isWhitespace(b.title)&&isWhitespace(b["abstract"])&&isWhitespace(b.themekey)&&isWhitespace(b.region)){alert(translate("noSearchCriteria"));
return false
}if(b.servers.length==0){alert(translate("noServer"));
return false
}return true
}function runRemoteSearch(c){if(checkRemoteFields()){if(c!="pdf"){preparePresent("remote")
}var b=$("remote_search_form").serialize(true);
b.remote="on";
b.attrset="geo";
if(c=="pdf"){b.hitsPerPage="1000";
location.replace(getGNServiceURL("pdf.search")+"?"+convertToParamString(b))
}else{gn_search(b)
}}}function convertToParamString(c){var b="";
for(var d in c){b+="&"+d+"="+c[d]
}return b
}function showFields(c,e){var c=$(c);
if(c){var d=c.getAttribute("src");
var b=d.lastIndexOf("/");
var e=$(e);
d=d.substring(0,b+1);
if(e.visible()){c.setAttribute("src",d+"plus.gif")
}else{c.setAttribute("src",d+"minus.png")
}e.toggle()
}}function setSort(){if($("sortBy").value=="title"){$("sortOrder").value="reverse"
}else{$("sortOrder").value=""
}if($("sortBy_simple").value=="title"){$("sortOrder_simple").value="reverse"
}else{$("sortOrder_simple").value=""
}}function setSortAndSearch(){$("sortBy").value=$F("sortBy.live");
$("sortBy_simple").value=$F("sortBy.live");
setSort();
var c=Ext.state.Manager.getProvider();
var b=c.get("search");
if(b&&b.searchTab=="advanced"){runAdvancedSearch()
}else{runSimpleSearch()
}}var ratingPopup=null;
function showRatingPopup(c){if(ratingPopup==null){ker.loadURL("rating.popup",ker.wrap(this,function(d){var e=document.createElement("div");
e.className="ratingBox";
e.innerHTML=d.responseText;
e.style.display="none";
e.style.zIndex=32000;
e.setAttribute("id","rating.popup");
$("content").appendChild(e);
ratingPopup=e;
setTimeout(ker.wrap(this,function(){showRatingPopup(c)
}),10)
}));
return
}var b=Position.positionedOffset($("rating.link."+c));
ratingPopup.style.left=b[0]-100+"px";
ratingPopup.style.top=b[1]+16+"px";
ratingPopup.setAttribute("mdid",c);
Element.show(ratingPopup)
}function hideRatingPopup(){var b=$("rating.popup");
if(b!=null){Element.hide(b);
Element.hide("rating.image")
}}function rateMetadata(b){var d=ratingPopup.getAttribute("mdid");
Element.show("rating.image");
var c="<request>   <id>"+d+"</id>   <rating>"+b+"</rating></request>";
ker.send("xml.metadata.rate",c,ker.wrap(this,rateMetadata_OK))
}function rateMetadata_OK(b){if(b.nodeName=="error"){ker.showError(translate("rateMetadataFailed"),b)
}else{hideRatingPopup()
}}function doRegionSearch(b){var c=$(b).value;
if(c==""){resetMinimaps()
}else{if(c=="userdefined"){}else{getRegion(c)
}}$("region").value=$(b).value;
$("region_remote").value=$(b).value;
$("region_simple").value=$(b).value
}function getRegion(d){if(d){var b="id="+encodeURIComponent(d)
}var c=new Ajax.Request(getGNServiceURL("xml.region.get"),{method:"get",parameters:b,onSuccess:function(h){var g=h.responseXML;
var k=xml.evalXPath(g,"regions/region/north");
var e=xml.evalXPath(g,"regions/region/south");
var f=xml.evalXPath(g,"regions/region/east");
var j=xml.evalXPath(g,"regions/region/west");
$("northBL").value=k;
$("southBL").value=e;
$("eastBL").value=f;
$("westBL").value=j;
$("northBL_remote").value=k;
$("southBL_remote").value=e;
$("eastBL_remote").value=f;
$("westBL_remote").value=j;
$("northBL_simple").value=k;
$("southBL_simple").value=e;
$("eastBL_simple").value=f;
$("westBL_simple").value=j;
GeoNetwork.minimapSimpleSearch.updateExtentBox();
GeoNetwork.minimapAdvancedSearch.updateExtentBox();
GeoNetwork.minimapRemoteSearch.updateExtentBox()
},onFailure:getRegion_error})
}function getRegion_error(){alert(translate("error"))
}function AoIrefresh(){$("region_simple").value="userdefined";
$("region_remote").value="userdefined";
$("region").value="userdefined"
}function runRssSearch(){var b=new Ajax.Request(getGNServiceURL("metadata.latest.updated"),{method:"get",parameters:null,onSuccess:gn_search_rss_complete})
}function gn_search_rss_complete(b){var c=$("latest_updates");
c.innerHTML=b.responseText
}function preparePresent(){$("loadingMD").show()
}function gn_search(b){var d=Ext.state.Manager.getProvider();
d.clear("params");
d.set("params",{searchParams:b});
var c=new Ajax.Request(getGNServiceURL("main.search.embedded"),{method:"get",parameters:b,onSuccess:gn_search_complete,onFailure:gn_search_error})
}function gn_searchpdf(b){b.hitsPerPage=9999;
location.replace(getGNServiceURL("pdf.search")+"?"+convertToParamString(b))
}function gn_present(b,e){preparePresent();
var c="from="+b+"&to="+e;
var d=new Ajax.Request(getGNServiceURL("main.present.embedded"),{method:"get",parameters:c,onSuccess:gn_search_complete,onFailure:gn_search_error})
}function gn_search_complete(b){var c=$("resultList");
c.innerHTML=b.responseText;
$("loadingMD").hide()
}function gn_showSingleMetadataUUID(c){var b="uuid="+c+"&control&currTab=simple";
gn_showSingleMet(b)
}function gn_showSingleMetadata(c){var b="id="+c+"&currTab=simple";
gn_showSingleMet(b)
}function gn_showSingleMet(b){if($("loadingMD")){$("loadingMD").show()
}var c=new Ajax.Request(getGNServiceURL("metadata.show.embedded"),{method:"get",parameters:b,onSuccess:function(f){if($("loadingMD")){$("loadingMD").hide()
}var e=$("resultList");
clearNode(e);
var g=document.createElement("div");
g.className="metadata_current";
g.style.display="none";
g.style.width="100%";
e.appendChild(g);
g.innerHTML=f.responseText;
Effect.BlindDown(g);
var d=new TooltipManager();
ker.loadMan.wait(d);
extentMap.initMapDiv()
},onFailure:gn_search_error})
}function gn_showMetadata(b){gn_showMetadataTab(b,"simple")
}function gn_showMetadataTab(e,b){var c="id="+e+"&currTab="+b;
$("gn_showmd_"+e).hide();
$("gn_loadmd_"+e).show();
var d=new Ajax.Request(getGNServiceURL("metadata.show.embedded"),{method:"get",parameters:c,onSuccess:function(h){var g=$("mdwhiteboard_"+e);
clearNode(g);
$("gn_loadmd_"+e).hide();
$("gn_hidemd_"+e).show();
var j=document.createElement("div");
j.className="metadata_current";
j.style.display="none";
j.style.width="100%";
g.appendChild(j);
j.innerHTML=h.responseText;
Effect.BlindDown(j);
var f=new TooltipManager();
ker.loadMan.wait(f);
extentMap.initMapDiv()
},onFailure:gn_search_error})
}function gn_hideMetadata(d){var b=$("mdwhiteboard_"+d);
var c=b.firstChild;
Effect.BlindUp(c,{afterFinish:function(e){clearNode(b);
$("gn_showmd_"+d).show();
$("gn_hidemd_"+d).hide()
}})
}function a(b){alert(b)
}function gn_search_error(b){Modalbox.show(b.responseText,{title:"Search Error",width:600});
$("loadingMD").hide();
return -1
}function gn_filteredSearch(){var c="";
if($("advanced_search_pnl").visible()){c=fetchParam("template")
}var b=new Ajax.Request(getGNServiceURL("selection.search"),{method:"get",parameters:c,onSuccess:gn_search_complete,onFailure:gn_search_error})
}function runCategorySearch(c){preparePresent();
var b="category="+c;
gn_search(b)
}function fetchMultipleParam(e){var d=$(e);
var f="&"+e+"=";
if(!d){return f
}else{var c="";
for(i=0;
i<d.length;
i++){if(d.options[i].selected){var b=d.options[i].value;
c+=f+encodeURIComponent(b)
}}if(c==""){return f
}else{return c
}}}function fetchParam(d){var c=$(d);
if(!c){return""
}else{var b=c.value;
if(b){return"&"+d+"="+encodeURIComponent(b)
}else{return""
}}}function fetchBoolParam(c){var b=$(c);
if(!b){return""
}else{if(b.checked){return"&"+c+"=on"
}else{return"&"+c+"=off"
}}}function fetchRadioParam(c){var b=document.getElementsByName(c);
var d=getCheckedValue(b);
return"&"+c+"="+d
}function getCheckedValue(c){if(!c){return""
}var d=c.length;
if(d==undefined){if(c.checked){return c.value
}else{return""
}}for(var b=0;
b<d;
b++){if(c[b].checked){return c[b].value
}}return""
}function setParam(c,d){var b=$(c);
if(b){b.value=d
}}function setBoolParam(c,d){var b=$(c);
if(b){b.checked=d
}}function addQuote(c,b){$(c).value='"'+b.innerHTML+'"'
}var selectorIds=[];
function popSelector(g,e,f,b,d){var c=$(e);
if(c.style.display=="block"){c.style.display="none";
return false
}c.style.top=g.cumulativeOffset().top+g.getHeight();
c.style.left=g.cumulativeOffset().left;
c.style.width="250px";
c.style.display="block";
if(!(f in selectorIds)||$(f).empty()){selectorIds[f]=true;
new Ajax.Updater(f,b+"="+$(d).value)
}}function keywordCheck(c,b){if(b){if($("themekey").value!==""){$("themekey").value+=" or "+c
}else{$("themekey").value=c
}}else{$("themekey").value=$("themekey").value.replace(" or "+c,"");
$("themekey").value=$("themekey").value.replace(c,"");
pos=$("themekey").value.indexOf(" or ");
if(pos===0){$("themekey").value=$("themekey").value.substring(4,$("themekey").value.length)
}}}function selectorCheck(e,c,d,b){e='"'+e+'"';
if(c){if($(d).value!=""){$(d).value+=" "+b+" "+e
}else{$(d).value=e
}}else{$(d).value=$(d).value.replace(" "+b+" "+e,"");
$(d).value=$(d).value.replace(e,"");
pos=$(d).value.indexOf(" "+b+" ");
if(pos==0){$(d).value=$(d).value.substring(b.length+2,$(d).value.length)
}}}function setDates(h){var d=$("dateFrom");
var c=$("dateTo");
var f=$("extFrom");
var b=$("extTo");
if(h==0){d.value="";
c.value="";
f.value="";
b.value="";
return
}today=new Date();
fday=today.getDate();
if(fday.toString().length==1){fday="0"+fday.toString()
}fmonth=today.getMonth()+1;
if(fmonth.toString().length==1){fmonth="0"+fmonth.toString()
}fyear=today.getYear();
if(fyear<1900){fyear=fyear+1900
}var e=fyear+"-"+fmonth+"-"+fday+"T23:59:59";
var g=(fyear-10)+"-"+fmonth+"-"+fday+"T00:00:00";
c.value=e;
d.value=g;
b.value=e;
f.value=g
}function check(c){var d=$("search-results-content").getElementsByTagName("INPUT");
var b=d.length;
for(var e=0;
e<b;
e++){d[e].checked=c
}}function metadataselect(e,c){if(c===true){c="add"
}else{if(c===false){c="remove"
}}var d="id="+e+"&selected="+c;
var b=new Ajax.Request(Env.locService+"/metadata.select",{method:"get",parameters:d,onComplete:function(f){},onLoaded:function(f){},onSuccess:function(g){var k=g.responseText;
var l=(new DOMParser()).parseFromString(k,"text/xml");
var f=l.getElementsByTagName("response")[0];
var j=f.getElementsByTagName("Selected")[0].firstChild.nodeValue;
var h=document.getElementById("nbselected");
h.innerHTML=j
},onFailure:function(f){alert(translate("metadataSelectionError"))
}});
if(c=="remove-all"){check(false)
}if(c=="add-all"){check(true)
}}function toggleMoreFields(){$("all_search_row").toggle();
$("phrase_search_row").toggle();
$("without_search_row").toggle();
var c=$("i_morefields").getAttribute("src");
var b=c.lastIndexOf("/");
c=c.substring(0,b+1);
if($("all_search_row").visible()==true){$("i_morefields").setAttribute("src",c+"minus.png")
}else{$("i_morefields").setAttribute("src",c+"plus.gif")
}}function toggleInspire(){$("inspiresearchfields").toggle();
var c=$("i_inspire").getAttribute("src");
var b=c.lastIndexOf("/");
c=c.substring(0,b+1);
if($("inspiresearchfields").visible()==true){$("i_inspire").setAttribute("src",c+"minus.png")
}else{$("i_inspire").setAttribute("src",c+"plus.gif")
}}function toggleWhen(){$("whensearchfields").toggle();
var c=$("i_when").getAttribute("src");
var b=c.lastIndexOf("/");
c=c.substring(0,b+1);
if($("whensearchfields").visible()==true){$("i_when").setAttribute("src",c+"minus.png")
}else{$("i_when").setAttribute("src",c+"plus.gif")
}}function addWMSLayer(b){Ext.getCmp("north-map-panel").expand();
GeoNetwork.mapViewer.addWMSLayer(b)
}function addWMSServerLayers(b){Ext.getCmp("north-map-panel").expand();
mainViewport.doLayout();
GeoNetwork.mapViewer.addWMSServerLayers(b)
}function addSelectedWMSLayers(d){var b=$$("#"+d+" input");
var e=new Array();
for(var c=0;
c<b.length;
c++){if(b[c].checked){e.push(b[c].value.split(","))
}}addWMSLayer(e)
}function gn_showInterList(d){var b="id="+d+"&currTab=distribution";
$("gn_showinterlist_"+d).hide();
$("gn_loadinterlist_"+d).show();
var c=new Ajax.Request(getGNServiceURL("metadata.show.embedded"),{method:"get",parameters:b,onSuccess:function(g){var f=$("ilwhiteboard_"+d);
clearNode(f);
f.show();
$("gn_loadinterlist_"+d).hide();
$("gn_hideinterlist_"+d).show();
var h=document.createElement("div");
h.className="metadata_current";
h.style.width="100%";
$(h).hide();
f.appendChild(h);
h.innerHTML=g.responseText;
Effect.BlindDown(h);
var e=new TooltipManager();
ker.loadMan.wait(e)
},onFailure:gn_search_error})
}function gn_hideInterList(d){var b=$("ilwhiteboard_"+d);
var c=b.firstChild;
Effect.BlindUp(c,{afterFinish:function(e){clearNode(b);
$("gn_showinterlist_"+d).show();
$("gn_hideinterlist_"+d).hide()
}})
}function showInspireSearch(){var b=$("inspire");
if(b.checked){b.value="true"
}else{b.value=""
}}function inspireAnnexChanged(b){var c=$("inspire");
if(b!=""){if(c){c.checked=true
}}else{if(c){c.checked=false
}}}function inspireClassificationDataServiceChanged(b){setParam("keyword",b)
}function taggleVisibility(b){var c=$(b);
if(c!=null){if(c.style.display=="none"){c.style.display="block"
}else{c.style.display="none"
}}else{return
}}function clearNode(b){var c=$(b);
while(c.firstChild){c.removeChild(c.firstChild)
}}function im_mm_getURLselectedbbox(b,c,d,e){return"geometry=POLYGON(( "+$("westBL").value+" "+$("northBL").value+", "+$("eastBL").value+" "+$("northBL").value+", "+$("eastBL").value+" "+$("southBL").value+", "+$("westBL").value+" "+$("southBL").value+", "+$("westBL").value+" "+$("northBL").value+"))"
}function inspireSourceTypeChanged(b){if(b=="dataset"){$("serviceType").value="";
$("serviceType").disable();
$("serviceTypeLabel").className="labelFieldDisabled";
$("classificationDataService").value="";
$("classificationDataService").disable();
$("classificationDataServiceLabel").className="labelFieldDisabled"
}else{$("serviceType").enable();
$("serviceTypeLabel").className="labelField";
$("classificationDataService").enable();
$("classificationDataServiceLabel").className="labelField"
}};