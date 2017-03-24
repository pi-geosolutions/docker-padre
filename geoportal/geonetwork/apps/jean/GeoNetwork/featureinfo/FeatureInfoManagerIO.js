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
Ext.namespace('GeoNetwork.FeatureInfo');


/** api: (define)
 *  module = GeoNetwork.admin
 *  class = FeatureInfoManagerIO
 */
/** api: constructor 
 *  .. class:: FeatureInfoManagerIO(config)
 *
 *  Input/output features for layertree
 *
 */
GeoNetwork.FeatureInfo.FeatureInfoManagerIO = Ext.extend(Object, {
    serviceBaseUrl : null,
    verbose:false,//displays error and info messages : set it true on the admin side, false on the client side

    
    constructor: function(config){
    	GeoNetwork.FeatureInfo.FeatureInfoManagerIO.superclass.constructor.call(this, config);
        Ext.apply(this, config);
    },
    
  ////
 ////      IN 
////
    pull: function() {
    	return this.getFromDB();
    },
    
    /**
     * Gets the layertree as json data from the DB, via pigeo services
     * 
     * TODO :
     */
    getFromDB: function() {
    	var json={};
        var request = OpenLayers.Request.GET({
            url: this.serviceBaseUrl + "/pigeo.featureinfos.get",
            async: false
        });

        if (request.responseText) {
        	json = Ext.util.JSON.decode( request.responseText );
        } 
        return json;
    },    

    ////
   ////      OUT
  ////

    push: function(data){
    	this.pushToDB(data);
    },
    
    pushToDB: function(data) {
    	var serviceurl = this.serviceBaseUrl + "/pigeo.featureinfos.set";
    	OpenLayers.Request.POST({
		    url: serviceurl,
		    header:{"Content-Type":"text/xml"},
		    data: data,
            success: function(response){
            	//console.log('OK');
            },
            failure: function(response){
            	console.error('[FeatureInfoManager.js] Error trying to save fields information to DB');
            },
            scope : this
        });
    }
});