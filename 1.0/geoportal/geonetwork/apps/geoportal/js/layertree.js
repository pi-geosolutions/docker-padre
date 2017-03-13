
{treeConfig : [
	{
		nodeType    : 'gx_baselayercontainer'
		,text	    : 'Fond de carte'
		,allowDrag  : false
		,allowDrop  : false
	},
	
	{
		text        : 'ILWAC'
		,expanded   : true
		,cls 	    : 'ilwac'
		,children   : [
		    {
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml_x_landsat_region' 
		        ,layer       : "la couverture Landsat d'ILWAC" 
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'
		    },{
				nodeType    : 'gx_layer'
				,layers      : 'ml:ml_5d2_ocsol10'
				,layer       : "Occupation des sols provisoire réalisée à partir des images Landsat 2010"
				, qtip	: "Il s'agit de la version béta, améliorée par rapport à la 1ere verion en ligne. La version finale fournira des améliorations supplémentaires"
				,legend		:"http://ilwac.ige.fr/legendes/cos_ilwac_legende.png"
				//,uuid       : '62b236b3-23ca-4e02-a418-a5cd37b08d88'                         //***********************OK
				,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
				,format		: "image/png"
				,type		: 'wms'              
			},{
				nodeType    : 'gx_layer'
				,layers      : 'ml:ml_5d_ocsol_change'
						,layer       : "Changements majeurs de l'Occupation du Sol entre 1990 et 2010 (version de travail)"
						, qtip	: "Il s'agit d'une version provisoire, de travail, pas encore homogénéisée et finalisée"
				,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
				,format		: "image/png"
				,type		: 'wms'              
			} 
		]
	},
	
	{
		text        : 'Donnés générales'
		,expanded   : false
		,children   : [
		    {
		        text        : 'Limites administratives (source DNH)'
				,expanded   : true
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_1a3_communes'
						,layer       : "Communes"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_1a2_cercles' 
						,layer       : "Cercles" 
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_1a1_regions' 
						,layer       : "Régions" 
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					}]
		    },{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_0e1_toponymes' 
						,layer       : "Toponymes" 
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
			},{
		        text        : 'Relief (source NASA)'
				
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml_1b_srtm_t' 
						,layer       : "Altitudes"
						,uuid		: '10def5ed-db37-417c-ae98-e41539577543'                         //***********************OK						
						,url		:  'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_1b_slp_t' 
						,layer       : "Pentes ( en %)"
						,uuid		: '10def5ed-db37-417c-ae98-e41539577543'                         //***********************OK						
						,url		:  'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_1b_hill_t' 
						,layer       : "Ombrage"
						,uuid		: '10def5ed-db37-417c-ae98-e41539577543'                         //***********************OK						
						,url		:  'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,opacity	: 0.3
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_1b_srtmhill_t' 
						,layer       : "Teintes hypsométriques"
						,uuid		: '10def5ed-db37-417c-ae98-e41539577543'                         //***********************OK						
						,url		:  'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					}]
		    },{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_1a4_villages_igm' 
		        ,layer       : "Villages (source IGM)" 
		        ,url		: '/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'
		    },{
		        text        : 'Population'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_1c2_afripop' 
						,layer       : "Densité de population 2010 (source AFRIPOP)" 
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,uuid		: '6e75f3eb-5b23-496a-9070-1b84d7123a6d'                         //***********************OK					
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_1c_rur_pov' 
						,layer       : "Population rurale et pauvreté (source FAO)" 
						,uuid		: '2d39cf0c-1bf5-43a2-8408-0a0a0ab783d6 '                         //***********************OK				
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'povmap-global-subnational-infant-mortality-rates_2000' 
						,layer       : "Taux de mortalité infantile (source SEDAC)" 
						,uuid		: '2d39cf0c-1bf5-43a2-8408-0a0a0ab783d6 '                         //***********************OK				
						,url		: 'http://sedac.ciesin.columbia.edu/geoserver/gwc/service/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'povmap-global-subnational-prevalence-child-malnutrition' 
						,layer       : "Malnutrition infantile (source SEDAC)" 
						,uuid		: '2d39cf0c-1bf5-43a2-8408-0a0a0ab783d6 '                         //***********************OK				
						,url		: 'http://sedac.ciesin.columbia.edu/geoserver/gwc/service/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
                        nodeType    : 'gx_layer'
                        ,layer      : "Ratios population rurale/urbaine (source INS)" 
                        ,url            : 'http://ilwac.ige.fr/geoportal-services/json_getChartData.php'
						,uuid		: 'cc2f192e-e202-4e3a-85eb-c6d994f7f6a0'                         //***********************OK						
                        ,tablenames     : ['v_1c4_pop_urb_rur_reg','v_1c4_pop_urb_rur_cer']
                        ,changeScales: [2500000,0]
                        ,charting_fields: ["poprur","popurb","niv"]
                        ,other_fields: [] // [ "codecercle", "nomcercle" ]
						//**************************************************************************************************************                        
 						,context 	: {  //optional field, overrides the default one
							            getSize: function(feature) {     // on definit ici la taille des camemberts
											var val1 = parseInt(feature.attributes["poprur"]);
											var val2 = parseInt(feature.attributes["popurb"]);
											var niv = feature.attributes["niv"];
											var valtot = val1 + val2;
							               var masize = 10 + (valtot / ( niv * niv * 500  ) );
												// on utilise le niveau pour faire une taille variabel
											return masize ;
							            },
							            getChartURL: function(feature) {   // on definit ici les secteurs...
											var val1 = parseInt(feature.attributes["poprur"]);
											var val2 = parseInt(feature.attributes["popurb"]);
											var valtot = val1 + val2;
							                var values = (val1/valtot)+'' + ',' + (val2/valtot)+'';
							                var charturl = 'http://chart.apis.google.com/chart?cht=p&chd=t:' + values + '&chs=500x500&chf=bg,s,ffffff00&chco=11FF55,FF0000';    //'&chs=' + size + 'x' + size + 
							                return charturl;
							            }
	    		            		  }  
	    		        ,template : { //optional field, overrides the default one. Needs context field to be defined too.
										pointRadius: "${getSize}",
										fillOpacity: 0.8,
										externalGraphic: "${getChartURL}"
							        }
									
											
									
									
						//**************************************************************************************************************                        
                                                ,format         : "geojson"
                                                ,type           : 'chart'
                                                ,checked:false
					}]
		    },{
		        text        : 'Infrastructure'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_1d1_igm_routes' 
						,layer       : "Réseau routier (source IGM)"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_1d5_airports' 
						,layer       : "Aéroports"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,uuid		: '9381e910-b06d-11db-8922-000d939bc5d8'                         //***********************OK	 
						,format		: "image/png"
						,type		: 'wms'
					},{
						text        : 'Référentiel topographique'
						,children   : [
							{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_1d7_utm' 
								,layer       : "Grille UTM (source ESRI)" 
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'
							}/*,{
								nodeType    : 'gx_layer'
								,layers      : 'bf:	bf_1e_Grille_200 '
								,layer       : "Tableaux d’assemblage des cartes au 1/200.000" 
								,url		: '/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'
							}*/]
					}]
		    },{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_1e_classements'
		        ,layer       : "Aires classées (source SIFOR)"
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'            
		    },{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_1f1_zonage_agro_ecologique'
		        ,layer       : "Zonage Agro-ecologique (source PIRT)"
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'            
		    },{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_1h1_zones_eco_ali '
		        ,layer       : "Zonage D’Economie Alimentaire (source FEWS NET)"
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'            
		    },{
		        text        : 'Pirl'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5d3_pirl_fv' 
						,layer       : "PIRL : Formations végétales"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5d4_pirl_oat' 
						,layer       : "PIRL : Occupation Agricole des Terres"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						//,uuid		: '9381e910-b06d-11db-8922-000d939bc5d8'                         //***********************OK	 
						,format		: "image/png"
						,type		: 'wms'
					}]
		    }       
		]
	},

	{
		text        : 'Climat'
		,children   : [
		    {
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_2a_ecozones'
						,layer       : "Ecozones ecoclimatiques de la FAO"
						,uuid		: '6baa98cb-47e5-45f0-9dc0-07b562a6a56f'                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'            
					},{
				text        : 'Données climatologiques (source WorldClim)'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_2_precmoy'
						,layer       : "Précipitations moyennes - moyenne annuelle"
						,uuid		: '39a1a07f-3f4b-47fb-a799-f68122740219'                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'            
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_2_tminmoy'
						,uuid		: '1b2954a5-8cc8-41b0-90e9-e3cd8d85fb2d'                         //***********************OK
						,layer      : "Températures minimum - moyenne annuelle"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'            
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_2_tmaxmoy'
						,layer       : "Températures maximum - moyenne annuelle"
						,uuid		: '82d77e78-c8e6-4af2-83f0-b2c3dfaac244'                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'            
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_2_tmeanmoy'
						,uuid		: 'ec3b0105-cc49-43d7-a193-80842dc9bea0'                         //***********************OK
						,layer       : "Températures moyennes - moyenne annuelle"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'            
					},{
						text        : 'Variables bioclimatiques'
						
						,children   : [
							{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g01_bio01'
								,layer       : "Température annuelle moyenne - bio01"
								,uuid		: 'da6b0fc5-d491-4b4e-a5da-30fa44724a14'                         //***********************OK
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g02_bio02'
								,layer       : "Ecart diurne moyen (moyenne mensuelle de(Tmax-Tmin)) - bio02"
								,uuid		: 'a023b0ce-7a79-4707-b28e-c3b4eafdf289'                         //***********************OK
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g04_bio04'
								,layer       : "Saisonnalité des températures (standard deviation *100)- bio04"
								,uuid		: '1d9c5bb3-ac01-47bc-8c24-6c04aed6d352'                         //***********************OK
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g05_bio05'
								,layer       : "Temperature maxi du mois le plus chaud - bio05"
								,uuid		: 'c9944c77-6ddb-494f-81a4-bccd35438b65'                         //***********************OK
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g06_bio06'
								,layer       : "Température minimale du mois le plus froid - bio06"
								,uuid		: '5c8d57d3-8a17-431c-a9f2-0104447ba473'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g07_bio07'
								,layer       : "Ecart thermique annuel maximum (bio05-bio06) - bio07"
								,uuid		: '395059b6-7f7d-4676-976b-e2c2226cfec4'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g08_bio08'
								,layer       : "Température moyenne du trimestre le plus humide - bio08"
								,uuid		: '961bb98d-fea6-4224-ade2-a53a02600e27'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g09_bio09'
								,layer       : "Température moyenne du trimestre le plus sec - bio09"
								,uuid		: 'bdac3229-e67d-4be0-a876-5d86cbe91cb9'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g10_bio10'
								,layer       : "Température moyenne du trimestre le plus chaud - bio10"
								,uuid		: '3c65291a-37b2-40f5-9628-b0e71e94f735'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g11_bio11'
								,layer       : "Température moyenne du trimestre le plus froid - bio11"
								,uuid		: 'f83debe0-1a39-4acf-89e7-b09c2f14a2f5'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g12_bio12'
								,layer       : "Précipitation annuelle totale en mm - bio12"
								,uuid		: '773a2714-220c-4097-b738-af8ec476f719'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g13_bio13'
								,layer       : "Précipitations du mois le plus humide en mm - bio13"
								,uuid		: '128340ce-6785-4f97-ac12-a11ce8360a77'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g14_bio14'
								,layer       : "Précipitations du mois le plus sec en mm - bio14"
								,uuid		: 'a54f6c5c-5ef1-4241-86d3-82343fa3fe51'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g16_bio16'
								,layer       : "Précipitations du trimestre le plus humide en mm - bio16"
								,uuid		: 'db901710-efaa-436d-b43e-174dab5d7c82'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g17_bio17'
								,layer       : "Précipitations du trimestre le plus sec en mm - bio17"
								,uuid		: '9765ea32-f84f-4157-9286-99e4b7c53d11'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g18_bio18'
								,layer       : "Précipitations du trimestre le plus chaud en mm - bio18"
								,uuid		: '62d5e9d5-a097-46c9-b67b-7fdbf1361076'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							},{
								nodeType    : 'gx_layer'
								,layers      : 'ml:ml_2g19_bio19'
								,layer       : "Précipitations du trimestre le plus froid en mm - bio19"
								,uuid		: 'ab3255c2-c1a1-4caf-b7ef-87812c72f1d8'                         //***********************OK    
								,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
								,format		: "image/png"
								,type		: 'wms'              
							}
					]}		
			]},{
				text        : 'Evapotranspiration'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_2f_etpact5'
						,layer       : "ETP moyenne annuelle (source FAO)"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,uuid		: '06d77288-7ff4-404e-9d94-6ea738de0a52'                          //***********************OK  
						,format		: "image/png"
						,type		: 'wms'            
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_2f_etp_yr'
						,layer       : "ETP totale annuelle (source FAO)"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,uuid		: '01c3848e-f978-4ffa-a13d-b8a8ce1124cd'                          //***********************OK  
						,format		: "image/png"
						,type		: 'wms'            
					}		
			]},{
				text        : 'Sécheresse (source UNEP)'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'preview:dr_events'
						,uuid        : 'bb844eba-ced8-4e3b-b70a-a2b70c987ce8'
						,layer       : "Sécheresse : évènements marquants"
						,url		: 'http://preview.grid.unep.ch:8080/geoserver/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'preview:dr_physexp'
						,layer       : "Sécheresse : Exposition physique"
						,uuid        : '1379cbc1-445d-476a-a33b-c54d764a4e7b'
						,url		: 'http://preview.grid.unep.ch:8080/geoserver/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'preview:dr_ecoexp'
						,layer       : "Sécheresse : Exposition économique"
						,uuid        : 'e0122c05-6392-4927-b306-6c3015b63e2a'
						,url		: 'http://preview.grid.unep.ch:8080/geoserver/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					}
			]}        
		]
	},

	{
		text        : 'Eaux'
		,children   : [
			{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_3c3_hydro'
		        ,layer       : "Réseau hydrographique (source VMAP0)"
				,uuid        : '858fe564-e6d0-4d80-b62c-2a066c45c445'
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'
		        ,qtip       : ""
		        //,icon       : './img/Mountain-16x16.png'                
		    },{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_3e1_inwatr'
		        ,layer       : "Lacs et Plans d'eau (source Inwatr_p - FAO)"
				,uuid       : '6ce1c61e-8285-4353-ac1c-c7c55c8e4a84'                           //***********************OK  
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'
		        ,qtip       : ""
		        //,icon       : './img/Mountain-16x16.png'                
		    },{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_3g1_forages'
		        ,layer       : "Forages 2011 (source DNH)"
				//,uuid        : '858fe564-e6d0-4d80-b62c-2a066c45c445'
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'
		        ,qtip       : ""
		        //,icon       : './img/Mountain-16x16.png'                
		    },{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_3h1_puits'
		        ,layer       : "Puits 2011 (source DNH)"
				//,uuid        : '858fe564-e6d0-4d80-b62c-2a066c45c445'
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'
		        ,qtip       : ""
		        //,icon       : './img/Mountain-16x16.png'                
		    },{
				text        : 'Inondations (source UNEP-Dartmouth)'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'preview:fl_frequency'
						,layer       : "Inondations : Fréquence"
						,url		: 'http://preview.grid.unep.ch:8080/geoserver/wms?'
						,uuid       : '2bf2e3f7-3525-4e20-896e-6b79b75f0265'                         //***********************OK
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'preview:fl_physexp'
						,layer       : "Inondations : Exposition physique"
						,url		: 'http://preview.grid.unep.ch:8080/geoserver/wms?'
						,uuid       : '1bac1f2a-8ae3-4239-8bbf-d4a51e354ea6'                         //***********************OK
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'preview:fl_ecoexp'
						,layer       : "Inondations : Exposition économique"
						,url		: 'http://preview.grid.unep.ch:8080/geoserver/wms?'
						,uuid       : '091ad92d-90c0-4090-858b-d8eba63b847b'                         //***********************OK
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'preview:fl_risk'
						,layer       : "Inondations : Risque"
						,url		: 'http://preview.grid.unep.ch:8080/geoserver/wms?'
						,uuid       : '55c1816f-3cbe-4203-8150-1209e44bf86a'                         //***********************OK
						,format		: "image/png"
						,type		: 'wms'              
					}
			]},{
				text        : 'Risque inondations'
				//,expanded   : true
				,children   : [
					{
						nodeType    : 'gx_layer'
						,draggable  : false
						,layers      : 'abn:abn_3l1_stations'
						,layer       : "Stations hydrométriques avec données 2011-2012"
						,url		: 'http://ne-gdt.ige.fr//geoserver-prod/wms?'
						, uuid      :'938fadc6-40e3-49e6-9df1-1afa0e52d1bc '
						,format		: "image/png"
						,type		: 'wms'              
					}	
			]},{
				text        : 'Bassins versants'
				,children   : [
					{
					text        : 'sourve FAO - USGS'
					,children   : [
								{
									nodeType    : 'gx_layer'
									,layers      : 'ml:ml_3d1_h1k_lev1'
									,layer       : "H1k-lev1 (sourve FAO - USGS)"
									, uuid      :'f6707169-dbbc-45aa-a3e1-084cf5d33114'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'              
								},{
									nodeType    : 'gx_layer'
									,layers      : 'ml:ml_3d1_h1k_lev2'
									,layer       : "H1k-lev2 (sourve FAO - USGS)"
									, uuid      :'f6707169-dbbc-45aa-a3e1-084cf5d33114'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'              
								},{
									nodeType    : 'gx_layer'
									,layers      : 'ml:ml_3d1_h1k_lev6 '
									,layer       : "H1k-lev6 (sourve FAO - USGS)"
									, uuid      :'f6707169-dbbc-45aa-a3e1-084cf5d33114'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'      
								}
						]},{
					text        : 'source FAO-Alcom'
					,children   : [
								{
									nodeType    : 'gx_layer'
									,layers      : 'ml:ml_3d3_alcomwwf_l2'
									,layer       : "Bassins (source FAO-alcom)"
									,uuid       : 'b343493a-b48a-40e4-8208-18b308434873'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'              
								},{
									nodeType    : 'gx_layer'
									,layers      : 'ml:ml_3d3_alcomwwf_l1'
									,layer       : "sous-bassins (source FAO-alcom)"
									,uuid       : 'b343493a-b48a-40e4-8208-18b308434873'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'              
								}
						]},{
					text        : 'source FAO'
					,children   : [
								{
									nodeType    : 'gx_layer'
									,layers      : 'ml_3d2_hydrobasins_l1'
									,layer       : "Bassins majeurs (source FAO)"
									,uuid       : '4aca00d1-1e88-42ab-9219-90f0f7f40edd'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'              
								},{
									nodeType    : 'gx_layer'
									,layers      : 'ml_3d2_hydrobasins'
									,layer       : "Bassins (source FAO)"
									,uuid       : '4aca00d1-1e88-42ab-9219-90f0f7f40edd'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'              
								}
						]}
			]},{
		        nodeType    : 'gx_layer'
		        ,layers      : 'ml:ml_3k1_aquiferes'
		        ,layer       : "Principaux aquifères (source DNH)"
				//,uuid        : '858fe564-e6d0-4d80-b62c-2a066c45c445'
		        ,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
		        ,format		: "image/png"
		        ,type		: 'wms'
		        ,qtip       : ""
		        //,icon       : './img/Mountain-16x16.png'                
		    }  
		]
	},{
		text        : 'Sols'
		,expanded   : false
		,children   : [
		    {
					text        : 'Caractéristiques géomorphologiques / hydrologiques'
					,children   : [
								{
									nodeType    : 'gx_layer'
									,layers      : 'ml:ml_4b_afsys_twi' 
									,layer       : "Indice topographique d'humidité / Topographic Wetness Index - TWI (source AFSIS)" 
									,uuid       : '39ab271f-2693-48c0-afc0-f451510ee257'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'
								},{
									nodeType    : 'gx_layer'
									,layers      : 'ml:ml_4b_afsys_sca' 
									,layer       : "Indice d'accumulation / Specific Catchment Area - SCA (source AFSIS)" 	 
									,uuid       : '4f6cb3f0-7ff1-4dae-8298-25c7ca6ba39b'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'
								}
					]
			},{
					text        : 'Pédologie'
					,children   : [
								{
									nodeType    : 'gx_layer'
									,layers      : 'ml:ml_4a_hwsd' 
									,layer       : "Harmonised World Soil Database" 
									,uuid       : 'ce0c9967-7963-471d-9a2e-3dbc28683ba3'                         //***********************OK
									,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
									,format		: "image/png"
									,type		: 'wms'
								}
					]
			}
		]
	},

	{
		text        : 'Végétation'
		,children   : [
			{
				text        : 'Globcover'
				,expanded   : true
				,children   : [
					{
						nodeType    : 'gx_layer'
						,draggable  : false
						,layers      : 'ml:ml_5a1_globcover' 
						,layer       : "Globcover 2009 (source ESA) " 
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
                                                nodeType    : 'gx_layer'
                                                ,draggable  : false
                                                ,layer      : "Occupation des sols par entité administrative" 
                                                ,url            : 'http://ilwac.ige.fr/geoportal-services/json_getChartData.php'
                                               ,tablenames     : ['v_7d2_globcover_reg','v_7d2_globcover_cer','v_7d2_globcover_com']
											   ,legend		:"http://ilwac.ige.fr/legendes/globcover.jpg"
                                                ,changeScales: [4000000,1000000,0]
                                                ,charting_fields: ["value_11","value_14","value_20","value_30","value_40","value_60","value_110","value_120","value_130","value_140","value_150","value_180","value_190","value_200","value_210","surface","niv"]
                                                ,other_fields: [] // [ "codecercle", "nomcercle" ]
//**************************************************************************************************************                        
 						,context 	: {  //optional field, overrides the default one
							            getSize: function(feature) {     // on definit ici la taille des camemberts

											var valtot = parseInt(feature.attributes["surface"]);
											var niv = feature.attributes["niv"];
							                var masize = 15 + (valtot / ( niv * niv * 10000 ) );
												

							                return masize ;
							            },
							            getChartURL: function(feature) {   // on definit ici les secteurs...
											var val1 = parseInt(feature.attributes["value_11"]);
											var val2 = parseInt(feature.attributes["value_14"]);
											var val3 = parseInt(feature.attributes["value_20"]);
											var val4 = parseInt(feature.attributes["value_30"]);
											var val5 = parseInt(feature.attributes["value_40"]);
											var val6 = parseInt(feature.attributes["value_60"]);
											var val7 = parseInt(feature.attributes["value_110"]);
											var val8 = parseInt(feature.attributes["value_120"]);
											var val9 = parseInt(feature.attributes["value_130"]);
											var val10 = parseInt(feature.attributes["value_140"]);
											var val11 = parseInt(feature.attributes["value_150"]);
											var val12 = parseInt(feature.attributes["value_180"]);
											var val13 = parseInt(feature.attributes["value_190"]);
											var val14 = parseInt(feature.attributes["value_200"]);
											var val15 = parseInt(feature.attributes["value_210"]);
											var valtot = parseInt(feature.attributes["surface"]);
							                var values = (val1/valtot)+'' + ',' + (val2/valtot)+'' + ',' + (val3/valtot)+'' + ',' + (val4/valtot)+'' + ',' + (val5/valtot)+'' + ',' + (val6/valtot)+'' + ',' + (val7/valtot)+'' + ',' + (val8/valtot)+'' + ',' + (val9/valtot)+'' + ',' + (val10/valtot)+'' + ',' + (val11/valtot)+'' + ',' + (val12/valtot)+'' + ',' + (val13/valtot)+'' + ',' + (val14/valtot)+'' + ',' + (val15/valtot)+'';
							                var charturl = 'http://chart.apis.google.com/chart?cht=p3&chd=t:' + values + '&chs=500x500&chf=bg,s,ffffff00&chco=AAF0F0,FFFF64,DCF064,CDCD66,006400,AAC800,8CA000,BE9600,966400,FFB432,FFEBAF,00DC82,C31400,FFF5D7,0046C8';    //'&chs=' + size + 'x' + size + 
							                return charturl;
							            }

	    		            		  }  
	    		        ,template : { //optional field, overrides the default one. Needs context field to be defined too.
										pointRadius: "${getSize}",
										fillOpacity: 0.8,
										externalGraphic: "${getChartURL}"
							        }

//**************************************************************************************************************                        
                                                ,format         : "geojson"
                                                ,type           : 'chart'
                                                ,checked:false}
				]
			},{
				text        : 'Feux de Brousse repérés au cours des dernières(source FIRMS) :'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'global:ml_5b2_fires24'
						,layer       : " feux au cours des dernières 24 Heures"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,TILED       : false
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'global:ml_5b2_fires48'
						,layer       : " feux au cours des dernières 48 Heures"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,TILED       : false
						,format		: "image/png"
						,type		: 'wms'              
					}
			]},{
				text        : 'Surfaces brulées depuis 2000(source FIRMS) :'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5b1_sb_00_11'
						,layer       : "Feux de Brousse repérés depuis 2000"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					}
			]},{
				text        : 'Occupation du sol 2010 (source OSS - Azimut) :'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5d1_landsat2010_p'
						,layer       : "Composition colorée réalisée à partir des images Landsat 2010"
						,uuid       : '62b236b3-23ca-4e02-a418-a5cd37b08d88'                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5d2_ocsol10'
						,layer       : "Occupation des sols réalisée à partir des images Landsat 2010"
						,legend		:"http://ilwac.ige.fr/legendes/cos_ilwac_legende.png"
						//,uuid       : '62b236b3-23ca-4e02-a418-a5cd37b08d88'                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5d_ocsol_change'
						,layer       : "Changements majeurs de l'Occupation du Sol entre 1990 et 2010 (version de travail)"
						, qtip	: "Il s'agit d'une version provisoire, de travail, pas encore homogénéisée et finalisée"
						//,legend		:"http://ilwac.ige.fr/legendes/cos_ilwac_legende.png"
						//,uuid       : '62b236b3-23ca-4e02-a418-a5cd37b08d88'                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					}
			]},{
				text        : 'Inventaire SIFOR'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5f1_sifor1'
						,layer       : "Formations végétales"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,uuid       : '72dd8e61-cd88-4a3b-8a8f-c1a48e079b26'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5f4_paturages'
						,layer       : "Pâturages"
						,opacity	: 0.5
						,uuid       : '72dd8e61-cd88-4a3b-8a8f-c1a48e079b26' 
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5f2_plantations'
						,layer       : "Plantations"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,uuid       : '72dd8e61-cd88-4a3b-8a8f-c1a48e079b26'                         						
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5f3_placettes_sanitaire'
						,layer       : "Placettes  : etat sanitaire"
						,uuid       : '72dd8e61-cd88-4a3b-8a8f-c1a48e079b26'                         						
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5f3_placettes_role'
						,layer       : "Placettes  : rôle forestier"
						,uuid       : '72dd8e61-cd88-4a3b-8a8f-c1a48e079b26'                         						
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5f3_placettes_pedo'
						,layer       : "Placettes  : pédologie"
						,uuid       : '72dd8e61-cd88-4a3b-8a8f-c1a48e079b26'                         						
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					}
			]},{
				text        : 'NDVI (MODIS)'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml:ml_5e1_ndvi_2011'
						,layer       : "NDVI moyen de 2011"
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'              
					}
			]}
		]
	},

	{
		text        : "Fiches Communales d’Analyse des Risques / FICAR 15-03-12 (source DGPC)"
		,children   : [
			{
				text        : 'Risques naturels'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a01_glissement' 
						,layer       : "Glissement - Eboulement" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a02_secheresse' 
						,layer       : "Sécheresse" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a03_inondation' 
						,layer       : "Inondations" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a09_erosion' 
						,layer       : "Erosion" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a10_acridien' 
						,layer       : "Invasions acridiennes" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a11_aviaire' 
						,layer       : "Invasions aviaires" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a08_secousses' 
						,layer       : "Secousses telluriques" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					}
				]
			},{
				text        : 'Risques anthropiques'
				,children   : [
					{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a04_feu' 
						,layer       : "Feux de brousse" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a05_industrie' 
						,layer       : "Risques industriels" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a14_gaz' 
						,layer       : "Explosion de gaz" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a06_barrage' 
						,layer       : "Barrages" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a07_transport' 
						,layer       : "Transports" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a12_epidemie' 
						,layer       : "Epidémies" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					},{
						nodeType    : 'gx_layer'
						,layers      : 'ml_a_6a13_epizootie' 
						,layer       : "Epizooties" 
						,uuid       : '53f5d0b8-2a03-4562-b124-bc3635aa20d4 '                         //***********************OK
						,url		: 'http://ilwac.ige.fr/geoserver-prod/wms?'
						,format		: "image/png"
						,type		: 'wms'
					}	
				]
			}
			
		]
	},

	{
		text        : 'Indicateurs de suivi évaluation'
		,children   : [
			{
		    text        : 'Surfaces brulées'
				,expanded   : true
				,children   : [
							{
                                                nodeType    : 'gx_layer'
                                                ,draggable  : false
                                                ,layer      : "Proportion du territoire atteint par les feux en 2010" 
                                                ,url            : 'http://ilwac.ige.fr/geoportal-services/json_getChartData.php'
												,legend		:"http://ilwac.ige.fr/legendes/feux.jpg"
                                               ,tablenames     : ['v_7_sb10_reg','v_7_sb10_cer','v_7_sb10_com']
                                                ,changeScales: [4000000,1000000,0]
                                                ,charting_fields: ["feu0","feu1","feu2","feu3","surface","niv"]
                                                ,other_fields: [] // [ "codecercle", "nomcercle" ]
//**************************************************************************************************************                        
 						,context 	: {  //optional field, overrides the default one
							            getSize: function(feature) {     // on definit ici la taille des camemberts

											var valtot = parseInt(feature.attributes["surface"]);
											var niv = feature.attributes["niv"];
							                var masize = 10 + (valtot / ( niv * niv * 5000 ) );
												// on utilise le niveau pour faire une taille variabel

							                return masize ;
							            },
							            getChartURL: function(feature) {   // on definit ici les secteurs...
											var val1 = parseInt(feature.attributes["feu0"]);
											var val2 = parseInt(feature.attributes["feu1"]);
											var val3 = parseInt(feature.attributes["feu2"]);
											var val4 = parseInt(feature.attributes["feu3"]);
											var valtot = parseInt(feature.attributes["surface"])
							                var values = (val1/valtot)+'' + ',' + (val2/valtot)+'' + ',' + (val3/valtot)+'' + ',' + (val4/valtot)+'';
							                var charturl = 'http://chart.apis.google.com/chart?cht=p&chd=t:' + values + '&chs=500x500&chf=bg,s,ffffff00&chco=FFF4D655,FF5454,CE1D14,540905';    //'&chs=' + size + 'x' + size + 
							                return charturl;
							            }

	    		            		  }  
	    		        ,template : { //optional field, overrides the default one. Needs context field to be defined too.
										pointRadius: "${getSize}",
										fillOpacity: 0.8,
										externalGraphic: "${getChartURL}"
							        }
//**************************************************************************************************************                        
                                                ,format         : "geojson"
                                                ,type           : 'chart'
                                                ,checked:false
							},{
                                                nodeType    : 'gx_layer'
                                                ,draggable  : false
                                                ,layer      : "Etat des surfaces brulées depuis 2000" 
						,qtip: "Pour une meilleure lisibilité, à utiliser conjointement avec les limites administratives"
                                                ,url            : 'http://ilwac.ige.fr/geoportal-services/json_getChartData.php'
												,legend		:"http://ilwac.ige.fr/legendes/feux2000.jpg"
                                               ,tablenames     : ['v_7a_sbtot_reg','v_7a_sbtot_cer','v_7a_sbtot_com']
                                                ,changeScales: [4000000,1000000,0]
                                                ,charting_fields: ["value_0","value_1","value_2","value_3","value_4","value_5","value_6","value_7","value_8","value_9","value_10","value_11","value_12","value_13","value_14","value_15","surf","niv"]
                                                ,other_fields: [] // [ "codecercle", "nomcercle" ]
//**************************************************************************************************************                        
 						,context 	: {  //optional field, overrides the default one
							            getSize: function(feature) {     // on definit ici la taille des camemberts

											var valtot = parseInt(feature.attributes["surf"]);
											var niv = feature.attributes["niv"];
							                var masize = 15 + (valtot / ( niv * niv * 5000 ) );
												

							                return masize ;
							            },
							            getChartURL: function(feature) {   // on definit ici les secteurs...
												var val1 = parseInt(feature.attributes["value_0"]);
												var val2 = parseInt(feature.attributes["value_1"]);
												var val3 = parseInt(feature.attributes["value_2"]);
												var val4 = parseInt(feature.attributes["value_3"]);
												var val5 = parseInt(feature.attributes["value_4"]);
												var val6 = parseInt(feature.attributes["value_5"]);
												var val7 = parseInt(feature.attributes["value_6"]);
												var val8 = parseInt(feature.attributes["value_7"]);
												var val9 = parseInt(feature.attributes["value_8"]);
												var val10 = parseInt(feature.attributes["value_9"]);
												var val11 = parseInt(feature.attributes["value_10"]);
												var val12 = parseInt(feature.attributes["value_11"]);
												var val13 = parseInt(feature.attributes["value_12"]);
												var val14 = parseInt(feature.attributes["value_13"]);
												var val15 = parseInt(feature.attributes["value_14"]);
												var val16 = parseInt(feature.attributes["value_15"]);
											var valtot = parseInt(feature.attributes["surf"]);
							                var values = (val1/valtot)+'' + ',' + (val2/valtot)+'' + ',' + (val3/valtot)+'' + ',' + (val4/valtot)+'' + ',' + (val5/valtot)+'' + ',' + (val6/valtot)+'' + ',' + (val7/valtot)+'' + ',' + (val8/valtot)+'' + ',' + (val9/valtot)+'' + ',' + (val10/valtot)+'' + ',' + (val11/valtot)+'' + ',' + (val12/valtot)+'' + ',' + (val13/valtot)+'' + ',' + (val14/valtot)+'' + ',' + (val15/valtot)+'' + ',' + (val16/valtot)+'';
;
							                var charturl = 'http://chart.apis.google.com/chart?cht=p&chd=t:' + values + '&chs=500x500&chf=bg,s,ffffff00&chco=FFFFFF00,fff1f2FF,ffc3c3,ff7778,ff4d4e,ff2b2b,ed0d0e,da0708,c90707,b20707,930707,7c0707,6d0707,5b0707,430707,320808';    //'&chs=' + size + 'x' + size + 
							                return charturl;
							            }

	    		            		  }  
	    		        ,template : { //optional field, overrides the default one. Needs context field to be defined too.
										pointRadius: "${getSize}",
										fillOpacity: 0.8,
										externalGraphic: "${getChartURL}"
							        }
//**************************************************************************************************************                        
                                                ,format         : "geojson"
                                                ,type           : 'chart'
                                                ,checked:false
							}
				]
			},{
		    text        : 'Risques (source FICAR2012)'
				,expanded   : true
				,children   : [
							{
                                                nodeType    : 'gx_layer'
                                                ,draggable  : false
                                                ,layer      : "Nombre de risques identifiés par commune" 
                                                ,url            : 'http://ilwac.ige.fr/geoportal-services/json_getChartData.php'
                                               ,tablenames     : ['fake','v_6b_nbficar']
                                                ,changeScales: [1500000,0]
                                                ,charting_fields: ["risnat","risanth"]
                                                ,other_fields: [] // [ "codecercle", "nomcercle" ]
//**************************************************************************************************************                        
 						,context 	: {  //optional field, overrides the default one
							            getSize: function(feature) {     // on definit ici la taille des camemberts

											var val1 = parseInt(feature.attributes["risnat"]);
											var val2 = parseInt(feature.attributes["risanth"]);
											var valtot = val1 + val2;
							                var masize = 40;
												
							                return masize ;
							            },
							            getChartURL: function(feature) {   // on definit ici les secteurs...
											var val1 = parseInt(feature.attributes["risnat"]);
											var val2 = parseInt(feature.attributes["risanth"]);
											var valtot = val1 + val2;
							                var values = (val1*100/7)+'' + ',' + (val2*100/7)+'';
							                var charturl = 'http://chart.apis.google.com/chart?cht=bvg&chd=t:' + values + '&chs=500x500&chbh=82,8&chf=bg,s,ffffff00&chco=095402|970032';    //'&chs=' + size + 'x' + size + 
							                return charturl;
							            }

	    		            		  }  
	    		        ,template : { //optional field, overrides the default one. Needs context field to be defined too.
										pointRadius: "${getSize}",
										fillOpacity: 0.8,
										externalGraphic: "${getChartURL}"
							        }
//**************************************************************************************************************                        
                                                ,format         : "geojson"
                                                ,type           : 'chart'
                                                ,checked:false
            }
				]
			}
		]
	}
]}
