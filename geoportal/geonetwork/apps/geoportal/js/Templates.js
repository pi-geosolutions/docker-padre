/*
 * Copyright (C) 2001-2011 Food and Agriculture Organization of the
 * United Nations (FAO-UN), United Nations World Food Programme (WFP)
 * and United Nations Environment Programme (UNEP)
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
 * Contact: Jeroen Ticheler - FAO - Viale delle Terme di Caracalla 2,
 * Rome - Italy. email: geonetwork@osgeo.org
 */
Ext.namespace('GeoNetwork');

/** api: (define)
 *  module = GeoNetwork
 *  class = Templates
 *  base_link = `Ext.XTemplate <http://extjs.com/deploy/dev/docs/?class=Ext.XTemplate>`_
 */
/** api: constructor 
 *  .. class:: GeoNetwork.Templates()
 *  
 *   ****Extends the Geonetwork Template class           ****
 *   ****Adds a new template for compact, side-panel view****
 */

/** api: constructor 
 *  .. class:: GeoNetwork.Templates.COMPACT()
 * 
 *   An instance of a pre-configured GeoNetwork.Templates with compact view
 */
GeoNetwork.Templates.COMPACT = new Ext.XTemplate(
        '<ul>',
          '<tpl for=".">',
            '<li class="md md-compact" style="{featurecolorCSS}"  title="{abstract}">',
                '<table><tr>',
	                '<td id="{uuid}">',
	                '<div class="thumb">',
		                GeoNetwork.Templates.RATING_TPL,
		                '<div class="thumbnail">',
		                    '<tpl if="thumbnail">',
		                    	'<tpl if="overview">',
		                        	'<a rel="lightbox" href="{overview}"><img src="{thumbnail}" alt="Thumbnail"/></a>', 
		                    	'</tpl>',
		                    	'<tpl if="overview==\'\'">',
		                    		'<a rel="lightbox" href="{thumbnail}"><img src="{thumbnail}" alt="Thumbnail"/></a>', 
		                		'</tpl>',
		                    '</tpl>',
		                    '<tpl if="thumbnail==\'\'"></tpl>',
		                '</div>',
	                '</div>',

                    GeoNetwork.Templates.TITLE,
                    '<p class="abstract">{[Ext.util.Format.ellipsis(Ext.util.Format.stripTags(values.abstract), 150, true)]}</p>',    // FIXME : 250 as parameters
                    '<tpl if="subject">',
                        '<p class="subject">'+OpenLayers.i18n("keywords")+' : <tpl for="subject">',
                            '{value}{[xindex==xcount?"":", "]}',
                        '</tpl></p>',
                    '</tpl>',
                    '<div class="md-links" id="md-links-{id}">',
                    '</div>',
                '</td>',
                '<td class="icon">', 
					'<tpl if="this.hasHttpLinks(values.links)">',
						'<div class="md-mn links-http" title="'+OpenLayers.i18n("link-http")+" : "+OpenLayers.i18n("link-general")+'">&nbsp;</div>',
					'</tpl>',
					'<tpl if="this.hasDownloadLinks(values.links)">',
						'<div class="md-mn links-download" title="'+OpenLayers.i18n("link-download")+" : "+OpenLayers.i18n("link-general")+'">&nbsp;</div>',
					'</tpl>',
					'<tpl if="this.hasWmsLinks(values.links)">',
						'<div class="md-mn links-wms" title="'+OpenLayers.i18n("link-wms")+" : "+OpenLayers.i18n("link-general")+'">&nbsp;</div>',
					'</tpl>',
					'<tpl if="this.hasGELinks(values.links)">',
						'<div class="md-mn links-ge" title="'+OpenLayers.i18n("link-ge")+" : "+OpenLayers.i18n("link-general")+'">&nbsp;</div>',
					'</tpl>',
				'</td>',
                '</td></tr></table>',
                '<div class="relation" title="' + OpenLayers.i18n('relateddatasets') + '"><span></span><ul id="md-relation-{id}"></ul></div>',
                '<div class="md-contact">',
                  '<tpl for="contact">',
                      // metadata contact are not displayed.
                      '<tpl if="applies==\'resource\'">',
                          '<span title="{role} - {applies}"><tpl if="values.logo !== undefined && values.logo !== \'\'">',
                              '<img src="{logo}" class="orgLogo"/>',
                          '</tpl>',
                          '{name}&nbsp;&nbsp;</span>',
                      '</tpl>',
                  '</tpl>',
                  '<tpl if="edit==\'true\' && isharvested!=\'y\'">',
                      '<br/><span class="md-mn md-mn-user" title="' + OpenLayers.i18n('ownerName') + '">{ownername} - ' + OpenLayers.i18n('lastUpdate') + '{[values.changedate.split(\'T\')[0]]}</span>',
                  '</tpl>',
                '</div>',
//                '<tpl if="edit==\'true\' && idxMsg">',
//                    '<div class="label label-warning">{idxMsg}</div>',
//                '</tpl>',
            '</li>',
        '</tpl>',
    '</ul>',
    {
        	hasDownloadLinks: function(values) {
                var i;
                for (i = 0; i < values.length; i ++) {
                    if (values[i].type.indexOf("download") != -1 || values[i].protocol.indexOf("download") != -1 || 
                    		values[i].type === 'application/x-compressed' || values.type == 'application/zip') {
                        return true;
                    }
                }
                return false;
            },
            hasHttpLinks: function(values) {
                var i;
                for (i = 0; i < values.length; i ++) {
                    if (values[i].type == 'text/html') {
                        return true;
                    }
                }
                return false;
            },
            hasWmsLinks: function(values) {
                var i;
                for (i = 0; i < values.length; i ++) {
                    if (values[i].type == 'application/vnd.ogc.wms_xml' || values[i].type == 'OGC:WMS') {
                        return true;
                    }
                }
                return false;
            },
            hasGELinks: function(values) {
                var i;
                for (i = 0; i < values.length; i ++) {
                    if (values[i].type == 'application/vnd.google-earth.kml+xml') {
                        return true;
                    }
                }
                return false;
            }
    }
);

