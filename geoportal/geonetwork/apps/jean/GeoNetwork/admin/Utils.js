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
Ext.namespace('GeoNetwork.admin');


/** static
 *  module = GeoNetwork.admin
 *  class = Utils
 *
 *  Utils for geoportal admin classes 
 *
 */
GeoNetwork.admin.Utils = {

    /**
     * Utils
     * */
    clone: function(obj) {
    	var newobj = {};
    	return Ext.apply(newobj, obj);
    },
    
    //logs messages in the south panel, used as a console
    log: function(where, msg) { //careful, it will work only if the class has fully loaded.
    	if (where==null) return;
    	if (where.body!=null) {
    		where.body.dom.innerHTML+="<br />&gt; "+msg;
    		where.body.scroll('b', Infinity);
    	}
    },
    encodeHTML: function(str) {
    	return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    },
    decodeHTML: function(str) {
    	return str.replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&');
    }
};