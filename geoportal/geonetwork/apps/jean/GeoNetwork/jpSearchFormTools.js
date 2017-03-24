/*

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
 * Contact: Jean Pommier, jean.pommier@ige.fr
 */
Ext.namespace("GeoNetwork.util");

/** api: (define)
 *  module = GeoNetwork.util
 *  class = jpSearchFormTools
 */
/** api: example
 *  jpSearchFormTools is a fork from GeoNetwork.Util.SearchFormTools
 *
 *
 *  .. code-block:: javascript
 *
 *      searchForm = new Ext.FormPanel({
 *                items : GeoNetwork.jpSearchFormTools.getAdvancedFormFields(catalogue.services),
 *               ...
 *
 *  TODO : Add distributed search
 *
 */
GeoNetwork.util.jpSearchFormTools = {

	groupField: null,
	
    /** api:method[getSimpleFormFields]
     *  :param services: Optional GeoNetwork services URL used for OpenSearch suggestion URL. If not defined, no suggestion fields.
     *  :return: A GeoNetwork simple form
     *
     *  Create a simple form
     */
    /*getSimpleFormFields: function(services, withTypes, typeCodelist, withRelation){
        var fields = [];
        if (services) {
            fields.push(new GeoNetwork.form.OpenSearchSuggestionTextField({
                hideLabel: true,
                width: 285,
                minChars: 2,
                loadingText: '...',
                hideTrigger: true,
                url: services.opensearchSuggest,
                listeners: {
//                      TODO : Unable field tooltips
//                    'afterrender': function () {
//                        new Ext.ToolTip({
//                            target: "E_any",
//                            anchor: 'bottom',
//                            anchorOffset: 15,
//                            html: OpenLayers.i18n('anyTT')
//                        });
//                    }
                }
            }));
        } else {
            fields.push(GeoNetwork.util.jpSearchFormTools.getFullTextField());
        }
        
        if (withTypes) {
            fields.push(GeoNetwork.util.jpSearchFormTools.getTypesField(typeCodelist, true));
        }
        return fields;
    },*/
    getGeographicFormFields: function (map, withRelation) {
    	var fields = [];
    	
    	var geomField = new Ext.form.TextField({
            name: 'E_geometry',
            id: 'geometry',
            cls : 'geometryWKT',
            itemCls : 'geometryWKT',
            fieldLabel: OpenLayers.i18n('wkt'),
            toolTip : '(eg. POLYGON((-180 -90,180 -90,180 90,-180 90,-180 -90)) or POINT(6 10))',
            //inputType: 'hidden',
            hideLabel: false
        });

    	var activated = false;
    	var layer_style= OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0;
        layer_style.strokeOpacity = 0.8;
        layer_style.strokeDashstyle = 'dash';
        layer_style.strokeWidth = 4;
        var vectorLayer = null;
        
    	var extentBox = new GeoNetwork.Control.ExtentBox({
            wktelement: geomField,
            vectorLayerStyle: layer_style
	     });
    	
	    var action_selextent = new GeoExt.Action({
	        control: extentBox,
	        toggleGroup:  "move",
	        allowDepress: false,
	        cls: 'selextentBTN',
	        pressed: activated ? true : false,
	        map: map,
	        text: OpenLayers.i18n("selectExtentTooltipTitle"),
	        tooltip: {
	            title: OpenLayers.i18n("selectExtentTooltipTitle"), 
	            text: OpenLayers.i18n("selectExtentTooltipText")
	        },
	        iconCls: 'selextentBTNicon'
	    });
	    vectorLayer = extentBox.getOrCreateLayer();
	    vectorLayer.displayInLayerSwitcher = false;
	    var selextentButton=new Ext.Button(action_selextent);
    	
	    var action_clear = {
                iconCls: "delextentBTNicon",
    	        cls: 'delextentBTN',
                tooltip: {
                    title: OpenLayers.i18n("clearExtentTooltipTitle"), 
                    text: OpenLayers.i18n("clearExtentTooltipText")
                },
                handler: function(){
                    vectorLayer.destroyFeatures();
                    geomField.setValue('');
                    if (withRelation) {
                    	Ext.getCmp('E_relationCb').reset();
                    }
                },
                scope: this
            };
	    var clearButton=new Ext.Button(action_clear);
	    
	    fields.push(selextentButton, clearButton);
	    
    	fields.push(geomField);
   	
        if (withRelation) {
            fields.push(GeoNetwork.util.jpSearchFormTools.getRelationField());
        }
        
        
        var geogFieldset = new Ext.form.FieldSet({
            title: OpenLayers.i18n('geogCriteria'),
            autoWidth: true,
            collapsible: true,
            collapsed: false,
            defaults: {
                width: 160
            },
            items: fields
        });

    	return geogFieldset;
    },
    /** api:method[getFullTextField]
     *  :return: A full text search text field
     *
     *  Create full text search field
     */
    getFullTextField: function(){
        return new Ext.form.TextField({
            name: 'E_any',
            id: 'E_any',
            fieldLabel: OpenLayers.i18n("fullTextSearch"),
            hideLabel: false
        });
    },
    /** api:method[getTypesField]
     *  :return: Type selection using combo box based
     *   on hierarchy level values.
     */
    getTypesField: function(codeList, multi){
        var defaultCodeList = [['dataset', OpenLayers.i18n('dataset')], 
                               ['series', OpenLayers.i18n('series')],
                               ['service', OpenLayers.i18n('service')],
                               ['model', OpenLayers.i18n('featureCat')]],
            config = {
                    name: 'E_type',
                    mode: 'local',
                    autoSelect: false,
                    triggerAction: 'all',
                    fieldLabel: OpenLayers.i18n('resourceType'),
                    store: new Ext.data.ArrayStore({
                        id: 0,
                        fields: ['id', 'name'],
                        data: codeList || defaultCodeList
                    }),
                    valueField: 'id',
                    displayField: 'name'
                };
        
        if (multi) {
            Ext.apply(config, {
                valueDelimiter: ' or '
                });
            return new Ext.ux.form.SuperBoxSelect(config);
        } else {
            return new Ext.form.ComboBox(config);
        }
    },

    /** api:method[getRelationField]
     *  :return: A combo with geom relations
     *
     *  Create geometry relation field
     */
    getRelationField: function(){
        return new Ext.form.ComboBox({
            name: 'E_relation',
            id: 'E_relationCb',
            mode: 'local',
            width: 150,
            triggerAction: 'all',
            fieldLabel: OpenLayers.i18n('relationType'),
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['relation', 'label'],
                data: [['', ''],  
                        ['intersection', OpenLayers.i18n('intersection')], 
                        ['overlaps', OpenLayers.i18n('overlaps')], 
                        ['encloses', OpenLayers.i18n('encloses')], 
                        ['fullyOutsideOf', OpenLayers.i18n('fullyOutsideOf')], 
                        ['crosses', OpenLayers.i18n('crosses')], 
                        ['touches', OpenLayers.i18n('touches')], 
                        ['within', OpenLayers.i18n('within')]]
            }),
            valueField: 'relation',
            displayField: 'label'
        });
    }

};
