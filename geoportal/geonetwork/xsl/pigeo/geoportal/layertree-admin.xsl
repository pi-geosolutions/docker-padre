<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
							  xmlns:fo="http://www.w3.org/1999/XSL/Format">

	<xsl:include href="../../header.xsl"/>
	<xsl:include href="../../banner.xsl"/>

	<xsl:variable name="widgetPath">../../apps</xsl:variable>
	<xsl:variable name="indent" select="100"/>

	<xsl:template mode="css" match="/" priority="2">
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/js/ext/resources/css/ext-all.css"/>
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/js/ext-ux/FileUploadField/file-upload.css"/>
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/js/ext-ux/MultiselectItemSelector-3.0/Multiselect.css"/>
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/css/gnmapdefault.css"/>
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/css/gnmetadatadefault.css"/>
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/css/metadata-view.css"/>
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/geoportal/css/admin.css"/>
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/geoportal/css/gnjp.css"/>
		<link rel="stylesheet" type="text/css" href="{$widgetPath}/geoportal/css/Spinner.css"/>
	</xsl:template>

	<xsl:template mode="script" match="/" priority="2">
		<script type="text/javascript" src="{$widgetPath}/js/ext/adapter/ext/ext-base.js"/>
		<script type="text/javascript" src="{$widgetPath}/js/ext/ext-all-debug.js"/>
		<script type="text/javascript" src="{$widgetPath}/js/proj4js-compressed.js"/>
		<script type="text/javascript" language="JavaScript">
			window.GeoportalAdmin = {
				templatesoverrides : { //here comes templates overrides for Layers types
					folder : {
						text:"Nouveau dossier",
					},
					wms : {
						text:"Nouvelle couche WMS",
						qcktip : 'Vous pouvez placer ici vos commentaires au sujet de cette couche',
						url: "http://bi-risk.pigeo.fr/geoserver-prod/bi/wms?"
				    },
					chart : {
						text:"Nouvelle couche Graphique",
						qcktip : 'Vous pouvez placer ici vos commentaires au sujet de cette couche',
						url:'http://bi-risk.pigeo.fr/geoserver-prod/bi/ows?service=WFS%26version=1.0.0%26request=GetFeature%26maxFeatures=500%26outputFormat=application/json%26typeName=',
						dbname : 'bi_risk_geodata'
					}
				}
			};
		 </script>
		 <xsl:choose>
			<xsl:when test="/root/request/debug">
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/Rating/RatingItem.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/FileUploadField/FileUploadField.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/TwinTriggerComboBox/TwinTriggerComboBox.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/DateTime/DateTime.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/RowExpander/RowExpander.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/MultiselectItemSelector-3.0/DDView.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/MultiselectItemSelector-3.0/Multiselect.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/SuperBoxSelect/SuperBoxSelect.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/ext-ux/LightBox/lightbox.js"/>

				<script type="text/javascript" src="{$widgetPath}/js/OpenLayers/lib/OpenLayers.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/GeoExt/script/GeoExt.js"/>
				<script type="text/javascript" src="{$widgetPath}/js/GeoNetwork/lib/GeoNetwork.js"/>
			</xsl:when>
			<xsl:otherwise>
				<script type="text/javascript" src="{$widgetPath}/js/GeoNetwork-mini.js"/>
			</xsl:otherwise>
		</xsl:choose>
		
		<script type="text/javascript" src="{$widgetPath}/jean/Ext/SpinnerField/Spinner.js"/>
		<script type="text/javascript" src="{$widgetPath}/jean/Ext/SpinnerField/SpinnerField.js"/>
    	<script type="text/javascript" src="{$widgetPath}/geoportal/js/lang/fr.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/geoportal/js/lang/en.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/layers/GeoportalAbstractLayer.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/layers/GeoportalFolderLayer.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/layers/GeoportalWMSLayer.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/layers/GeoportalChartLayer.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/layers/GeoportalAbstractLayerForm.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/layers/GeoportalFolderLayerForm.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/layers/GeoportalWMSLayerForm.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/layers/GeoportalChartLayerForm.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/admin/Utils.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/admin/LayertreeIO.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/admin/BackupGridManager.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/admin/GeoportalTreeLoader.js"></script>
    	<script type="text/javascript" src="{$widgetPath}/jean/GeoNetwork/admin/LayertreeManagerPanel.js"></script>
    	
    	
    	
    	
		<!-- TODO : Here we load "search" app configuration. It may be another app which is used 
			as default. This should be improved when moving admin to widgets. 
		<script type="text/javascript" src="{$widgetPath}/search/js/map/Settings.js"/>-->
		

		<script type="text/javascript" language="JavaScript">
			var catalogue;
			OpenLayers.ImgPath = '<xsl:value-of select="$widgetPath"/>/js/OpenLayers/img/';

			Ext.onReady(function(){
				Ext.QuickTips.init();
				// Apply a set of config properties to the singleton
				Ext.apply(Ext.QuickTips.getQuickTip(), {
				    maxWidth: 200,
				    minWidth: 100,
				    showDelay: 50,      // Show 50ms after entering target
				    trackMouse: true
				});
				GeoNetwork.Util.setLang('<xsl:value-of select="/root/gui/language"/>', '<xsl:value-of select="$widgetPath"/>');

				catalogue = new GeoNetwork.Catalogue({
					statusBarId : 'info',
					hostUrl: '../..',
					lang: '<xsl:value-of select="/root/gui/language"/>',
					mdOverlayedCmpId : 'resultsPanel'
				});

				var manager = new GeoNetwork.admin.LayertreeManagerPanel({
					renderTo		: 	'manager',
					catalogue		: 	catalogue,
					autoWidth 		: 	true,
					serviceBaseUrl 	: 	'<xsl:value-of select="/root/gui/locService"/>'
				});
			})
		</script>
	</xsl:template>

	<xsl:template match="/">
		<html>
			<head>
				<xsl:call-template name="header"/>
				<xsl:apply-templates mode="script" select="/"/>

				<style type="text/css">
					body {
						height:100%;
					}
				</style>
			</head>
			<body>
				<xsl:call-template name="banner"/>
				<div id="content_container">
					<xsl:call-template name="content"/>
				</div>
			</body>
		</html>
	</xsl:template>

	<xsl:template name="content">

		<table  width="100%" height="100%">
<!--  		<tr>
				<td class="padded-content" width="{$indent}"/>
				<td class="dots"/>
				<td class="padded-content" style="height:25px;">
					<h1><xsl:value-of select="'Manage layertree'"/></h1>
				</td>
			</tr>
-->				<tr>
				<td class="padded-content" width="{$indent}"/>
				<td class="dots"/>
				<td >
					<div id="manager" style="width:100%;" align="left"/>
				</td>
			</tr>
			<tr>
				<td class="padded-content" width="{$indent}" style="height:25px;"/>
				<td class="dots"/>
				<td class="padded-content" style="text-align:center;">
					<button class="content" onclick="load('{/root/gui/locService}/admin')">
						<xsl:value-of select="/root/gui/strings/back"/>
					</button>
				</td>
			</tr>
			<tr><td class="blue-content" colspan="3"/></tr>
		</table> 
	</xsl:template>

</xsl:stylesheet>
