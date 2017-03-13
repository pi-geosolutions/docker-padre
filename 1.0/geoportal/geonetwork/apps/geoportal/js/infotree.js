/*********************************************
*	Tree config for SI-GDT information tool
**********************************************/
window.Geoportal.DashBoard = {
		fichesPratiquesURL : 'http://192.168.1.86/jean/sigdt-config/services-ilwac/getFichePratique.php?',
		showlayerinfos : true,
		infosConfig : [{
	   		text        : 'NDVI',
	   		type		: 'ndvipanel',
	   		text_intro	: "<h1>NDVI data analysis</h1><p>NDVI data (vegetation indices) are produced on a decade " +
	   				"(10 days) regularity basis (1, 11 and 21th day each month).</p>" +
	   				"<p>With this tool, you can query historical NDVI data in several modes." +
	   				"Please choose one among the modes proposed on the left. </p>",
	   		annees		: ['1998', '1999', '2000', '2001','2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009','2010', '2011', '2012'],
	   		mois 		: [['01','janvier'],['02','février'],['03','mars'],['04','avril'],['05','mai'],['06','juin'],['07','juillet'],['08','août'],['09','septembre'],['10','octobre'],['11','novembre'],['12','décembre']],
	   		jours 		: ['01','11','21'],
	   		children	: [
	   		    {
	   		    	text		: 'Annual data',
	   		    	type		: 'ndvi_annual',
	   		    	text_intro	: "Display the NDVI variation on an area over the last year (10-days intervals) : ",
	   		    	text_body	: "",
	   		    	/*chart		: {
	   		    		type		: "line",
	   		    		url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/ilwac_json_queryNDVI.php?mode=year'
	   		    	}*/
	   		    	chart		: {
	   		    		type		: "column",
	   		    		url			: 'http://gm-risk.pigeo.fr/gm-risk-gn2_10/srv/eng/pigeo.ndvi.getvalues_tsv?data=ndvi&mode=yearByMonths'
	   		    	}
	   		    },
	   		    {
	   		    	text		: "Yearly variations",
	   		    	type		: 'ndvi_decade',
	   		    	text_intro	: "Display the NDVI variation on an area over the past years : ",
	   		    	text_body	: "",
	   		    	chart		: {
	   		    		type		: "column",
	   		    		url			: 'http://gm-risk.pigeo.fr/gm-risk-gn2_10/srv/eng/pigeo.ndvi.getvalues_tsv?data=ndvi&mode=decade'
	   		    	}
	   		    }
	   	    ] 
	   	},{
	   		text        : 'SoilMoisture',
	   		type		: 'ndvipanel',
	   		text_intro	: "<h1>Soil moisture analysis</h1><p>Soil moisture indices are produced on a decade " +
	   				"(10 days) regularity basis (1, 11 and 21th day each month).</p>" +
	   				"<p>With this tool, you can query historical Soil moisture data in several modes." +
	   				"Please choose one among the modes proposed on the left. </p>",
	   		annees		: ['1998', '1999', '2000', '2001','2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009','2010', '2011'],
	   		mois 		: [['01','janvier'],['02','février'],['03','mars'],['04','avril'],['05','mai'],['06','juin'],['07','juillet'],['08','août'],['09','septembre'],['10','octobre'],['11','novembre'],['12','décembre']],
	   		jours 		: ['01','11','21'],
	   		children	: [
	   		    {
	   		    	text		: 'Annual data',
	   		    	type		: 'ndvi_annual',
	   		    	text_intro	: "Display the Soil moisture variation on an area over the last year (10-days intervals) : ",
	   		    	text_body	: "",
	   		    	/*chart		: {
	   		    		type		: "line",
	   		    		url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/ilwac_json_queryNDVI.php?mode=year'
	   		    	}*/
	   		    	chart		: {
	   		    		type		: "column",
	   		    		url			: 'http://gm-risk.pigeo.fr/gm-risk-gn2_10/srv/eng/pigeo.ndvi.getvalues_tsv?data=sm&mode=yearByMonths'
	   		    	}
	   		    },
	   		    {
	   		    	text		: "Yearly variations",
	   		    	type		: 'ndvi_decade',
	   		    	text_intro	: "Display the Soil moisture variation on an area over the past years : ",
	   		    	text_body	: "",
	   		    	chart		: {
	   		    		type		: "column",
	   		    		url			: 'http://gm-risk.pigeo.fr/gm-risk-gn2_10/srv/eng/pigeo.ndvi.getvalues_tsv?data=sm&mode=decade'
	   		    	}
	   		    }
	   	    ] 
	   	},{
	   		text        : 'VCI',
	   		type		: 'ndvipanel',
	   		text_intro	: "<h1>Vegetation Condition Index analysis</h1><p>Vegetation Condition Index indices are produced on a decade " +
	   				"(10 days) regularity basis (1, 11 and 21th day each month).</p>" +
	   				"<p>With this tool, you can query historical Vegetation Condition Index data in several modes." +
	   				"Please choose one among the modes proposed on the left. </p>",
	   		annees		: ['1998', '1999', '2000', '2001','2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009','2010', '2011'],
	   		mois 		: [['01','janvier'],['02','février'],['03','mars'],['04','avril'],['05','mai'],['06','juin'],['07','juillet'],['08','août'],['09','septembre'],['10','octobre'],['11','novembre'],['12','décembre']],
	   		jours 		: ['01','11','21'],
	   		children	: [
	   		    {
	   		    	text		: 'Annual data',
	   		    	type		: 'ndvi_annual',
	   		    	text_intro	: "Display the Vegetation Condition Index variation on an area over the last year (10-days intervals) : ",
	   		    	text_body	: "",
	   		    	/*chart		: {
	   		    		type		: "line",
	   		    		url			: 'http://192.168.1.86/jean/sigdt-config/services-ilwac/ilwac_json_queryNDVI.php?mode=year'
	   		    	}*/
	   		    	chart		: {
	   		    		type		: "column",
	   		    		url			: 'http://gm-risk.pigeo.fr/gm-risk-gn2_10/srv/eng/pigeo.ndvi.getvalues_tsv?data=vci&mode=yearByMonths'
	   		    	}
	   		    },
	   		    {
	   		    	text		: "Yearly variations",
	   		    	type		: 'ndvi_decade',
	   		    	text_intro	: "Display the Vegetation Condition Index variation on an area over the past years : ",
	   		    	text_body	: "",
	   		    	chart		: {
	   		    		type		: "column",
	   		    		url			: 'http://gm-risk.pigeo.fr/gm-risk-gn2_10/srv/eng/pigeo.ndvi.getvalues_tsv?data=vci&mode=decade'
	   		    	}
	   		    }
	   	    ] 
	   	}]
}