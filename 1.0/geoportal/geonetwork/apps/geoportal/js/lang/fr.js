/*
 * Copyright (C) 2009 GeoNetwork
 *
 * This file is part of GeoNetwork
 *
 * GeoNetwork is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * GeoNetwork is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GeoNetwork.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.namespace('GeoNetwork', 'GeoNetwork.jpLang');

GeoNetwork.jpLang.fr = {
	//fixes
    'org': "Organisation",
    //new ones
	'choose': 'Selectionner',
	'facetsTitle':'Affiner la recherche',
	'form': 'Formulaire de recherche',
    'geogCriteria': 'Critères géographiques',
    'gxBaseLayerContainer':"Fond de carte",
    'PigeoGeoserver':'Serveur cartographique pi-Geosolutions',
    'legend:':'Légende :',
    'organize': 'Organiser',
    'geocatalogue':'Géo-catalogue',
    'overlay:':'Calque : ',
    'ovGoogleHybrid':"Fond de carte Hybride Google",
	'print': 'Imprimer',
	'printHeader':"Veuillez noter qu'il ne s'agit pas réellement d'une page d'impression mais d'un générateur de PDF. Il produit un document PDF, que vous êtes ensuite libre d'imprimer, ou de stocker sur votre ordinateur."+
		"<br /><b>Attention :</b> Les données de fond d'origine Google/Bing ne seront pas affichées dans la vue exportée, à cause de restrictions de licence Google/Bing. Veillez donc à afficher d'autres données en guise de fond de plan.",
	'results': 'Résultats de la recherche',
	'showLegend': 'Afficher la légende',
	'horizCurtainButtonText': '\'Rideau\' horizontal',
	'vertCurtainButtonText': '\'Rideau\' vertical',
	'apply':'Appliquer',
	'day':'Jour',
	'month':'Mois',
	'year':'Année',
	'dashBoardTooltipTitle':'Tableau de bord',
	'dashBoardTooltipText':"Cliquer en un point de la carte pour afficher l'outil de profils temporels. Il vous permettra d'analyser l'évolution de diverses données en fonction du temps",
	"dash_DashBoardWindow.windowTitle" : "Profils temporels",
	'dash_ChooseDecade':'Déterminer la décade à afficher',
	'dash_ChooseYear':"Choisir l'année à afficher",
	'linkedMtdWarnTitle' : 'Attention',
	'linkedMtdWarnText' : 'Vous allez perdre tous les changements effectués depuis la dernière sauvegarde. Si vous avez changé du contenu, vous voudrez probablement enregistrer les modifications, au préalable. Voulez-vous continuer malgré tout ?',
	'tools':'Localiser',
	'shortcuts':'Raccourcis',
	'pratiquesGDT':'Pratiques de Gestion Durable des Terres (GDT)',
	'pratiquesConfTitle':'<h1 class="soberH1">Carte des pratiques GDT</h1>',
	'shortcutsAdminTitle': '<h1 class="soberH1">Entités administratives</h1>',
	'shortcutsZaeTitle': '<h1 class="soberH1">Zonages agro-écologiques</h1>',
	'geonamesSearchPanelTitle' : 'Chercher un lieu (base Geonames)',
	'geonamesCbHeader': '<h1 class="soberH1">Chercher un lieu (base Geonames)</h1>Cet outil effectue une recherche de lieux dans la base de données Geonames (geonames.org). <br />Entrez les premières lettre du nom de lieu recherché, et s\'il est présent dans la base, les résultats correspondant seront listés. Lorsque vous survolez un résultat, sa position est pointée sur la carte.',
	'geonamesLoadingText': 'Interrogation de la base Geonames...',
	'geonamesEmptyText': 'Chercher un lieu (Geonames)',
	'SLMtools' : 'Bonnes pratiques GDT',
	'searchTools' : 'Outils de recherche (lieux)',
	'openPratiqueSheet' : 'Ouvrir la fiche',
	'legend': 'Legende',
	'openLegendButtonText':'Ouvrir la légende dans un popup',
	'tools.measure':'Mesurer',
	'tools.measure.length':'Longueur',
	'tools.measure.area':'Surface',
	'ltmanager.title':'Manage Layertree',
	'ltmanager.console.html':'&gt; <b>Bienvenue dans le panneau de gestion du Référentiel de Données Géographiques</b><br />C\'est ici que vous pourrez visualier, éditer et transformer les couches carto et leur ordonnancement.<br />',
	'ltmanager.console.loadsuccessful':"Chargement de la liste des groupes effectuée",
	'ltmanager.console.loadfailure':"Un problème a été rencontré en essayant de charger la liste des groupes",
	'ltmanager.console.reloadsuccessful':"Arborescence rechargée avec succès",
	'ltmanager.console.reloadfailure':"ERREUR: Rechargement de l'arborescence impossible. Veuillez contacter l'administrateur du portail",
	'ltmanager.actions.addnode':'Ajouter une noeud',
	'ltmanager.actions.addnode-warning': "Veuillez d'abord sélectionner un noeud parent dans l'arborescence",
	'ltmanager.actions.delnode-warningl1':"Vous êtes sur le point de supprimer le noeud ",
	'ltmanager.actions.delnode-warningl2':"<br /> <b>Attention ! Cela va aussi supprimer tous ses noeuds enfants !",
	'ltmanager.actions.delnode':"Supprimer le noeud",
	'ltmanager.actions.delnode-removed':"Noeud supprimé : ",
	'ltmanager.actions.warning-select':"Vous devez d'abord sélectionner un noeud",
	'ltmanager.actions.exportjson':'Exporter vers Json',
	'ltmanager.actions.importjson':'Importer depuis Json',
	'ltmanager.actions.savetodb':'Sauver (vers la BD)',
	'ltmanager.actions.savetodb.givenamet':'Nom',
	'ltmanager.actions.savetodb.givename':'Donnez un nom :',
	'ltmanager.actions.reload':'Recharger',
	'ltmanager.actions.restore':'Restaurer depuis une version antérieure',
	'ltmanager.actions.add.folder':'Ajouter un dossier',
	'ltmanager.actions.add.wms':'Ajouter une couche WMS (défaut)',
	'ltmanager.actions.add.chart':'Ajouter une couche de graphiques (ex. : camemberts)',
	'ltmanager.actions.remove':'Supprimer',
	'ltmanager.actions.duplicate':'Dupliquer',
	'ltmanager.menu.tree':'Arborescence',
	'ltmanager.menu.add':'Ajouter',
	'ltIO.tree2json.title':'Arborescence (JSON)',
	'ltIO.json2tree.title':'Importer depuis Json',
	'ltIO.json2tree.form':'Coller le code JSON dans cette fenêtre',
	'ltIO.json2tree.title':'Arborescence (JSON)',
	'ltIO.json2tree.msg.loadsuccessful':"Nouvelle configuration chargée. N'oubliez pas de <i>Sauver vers la BD</i> pour appliquer durablement les changements. Vous pouvez également revenir à la dernière version sauvée dans la BD en faisant Arborescence -> Recharger.",
	'ltIO.json2tree.applybtn':'Appliquer',
	'ltIO.json2tree.cancelbtn':'Annuler',
	'ltIO.dbio.reloading':"Rechargement de l'arborescence",
	'ltIO.dbio.warning.changed':"La base de données a changé !",
	'ltIO.dbio.warning.changedmsg':"<b>ATTENTION : le contenu de la base de données a changé depuis que vous avez chargé l'arborescence</b><br /><b>Continuer l'opération va écraser des changements créés par un autre utilisateur. Voulez-vous vraiment continuer ?</b><br /><br /><i>Si vous n'êtes pas certain, il est préférable d'annuler et de vous référer à la documentation.</i>",
	'ltIO.dbio.savelt':"Sauver l'arborescence",
	'ltIO.dbio.warning.savefailure':"ERREUR : impossible de sauver l'arboresc ence sur la BD. Veuillez en informer l'administrateur du portail.",
	'backupmanager.title':'Choisir la sauvegarde à restaurer',
	'backupmanager.tb.restore':'Restaurer',
	'backupmanager.tb.view':'Voir',
	'backupmanager.tb.remove':'Supprimer',
	'backupmanager.log.restored':"Nouvelle configuration chargée. N'oubliez pas de <i>Sauver vers la BD</i> pour appliquer durablement les changements. Vous pouvez également revenir à la dernière version sauvée dans la BD en faisant Arborescence -> Recharger.",
	'backupmanager.view.title':'Arborescence (JSON)',
	'backupmanager.log.removed':"supprimé la sauvegarde ",
	'backupmanager.log.removeerror':"erreur rencontrée en essayant de supprimer la sauvegarde ",
	'backupmanager.remove.errortitle':"Supprimer une sauvegarde",
	'backupmanager.remove.errormsg':"ERREUR : impossibled e supprimer la sauvegarde. Veuillez contacter votre administrateur.",
	'geoportal.layer.abstract.form.title':'Paramètres du noeud',
	'geoportal.layer.abstract.form.generalfs':'Paramètres généraux',
	'geoportal.layer.abstract.form.generalfs.id':'ID',
	'geoportal.layer.abstract.form.generalfs.type':'Type',
	'geoportal.layer.abstract.form.generalfs.text':'Texte',
	'geoportal.layer.abstract.form.generalfs.opacity':'Opacité',
	'geoportal.layer.abstract.form.generalfs.css':'Classe CSS',
	'geoportal.layer.abstract.form.generalfs.comments':'Commentaires',
	'geoportal.layer.abstract.form.generalfs.ext':'Extensions',
	'geoportal.layer.abstract.form.btn.cancel':'Annuler les changements',
	'geoportal.layer.abstract.form.groupsfs':'Visibilité selon les Groupes',
	'geoportal.layer.abstract.form.groupsfs.groups':'Groupes',
	'geoportal.layer.abstract.form.log.loaded':'paramètres chargés pour la couche : ',
	'geoportal.layer.abstract.form.log.updated':" couche carto mise à jour avec succès. N'oubliez pas de sauver vers la BD lorsque vous avez fini.",
	'geoportal.layer.folder.form.title':'Paramètres du dossier',
	'geoportal.layer.wms.form.title':'Paramètres du noeud WMS',
	'geoportal.layer.wms.form.wmsfs':'Paramètres WMS',
	'geoportal.layer.wms.form.wmsfs.url':'URL du serveur WMS',
	'geoportal.layer.wms.form.wmsfs.layers':'Nom(s) de(s) couche(s)',
	'geoportal.layer.wms.form.wmsfs.format':'Format d\'mage',
	'geoportal.layer.wms.form.wmsfs.formatpng':'PNG',
	'geoportal.layer.wms.form.wmsfs.formatjpg':'JPG',
	'geoportal.layer.wms.form.wmsfs.tiled':'Tuilé',
	'geoportal.layer.wms.form.wmsfs.queryable':'Interrogeable ?',
	'geoportal.layer.wms.form.wmsfs.legend':'URL de la légende (facultatif)',
	'geoportal.layer.wms.form.mtdfs':'Référence métadonnée',
	'geoportal.layer.wms.form.mtdfs.uuid':'UUID',
	'geoportal.layer.wms.form.pqfs':"Activer l'Interrogation Polygonale ? (disponible uniquement pour des données d'origine raster hébergées sur un serveur Geoserver doté de l'extension WPS)",
	'geoportal.layer.wms.form.pqfs.layer':'Couche WMS à interroger',
	'geoportal.layer.wms.form.pqfs.band':'N° de bande à utiliser pour calculer les stats (entier)',
	'geoportal.layer.wms.form.pqfs.header':'Entête',
	'geoportal.layer.wms.form.pqfs.stats':'Stats à récupérer : ',
	'geoportal.layer.wms.form.pqfs.stats.count':'Nb de piwels couverts',
	'geoportal.layer.wms.form.pqfs.stats.min':'Valeur min', 
	'geoportal.layer.wms.form.pqfs.stats.max':'Valeur max', 
	'geoportal.layer.wms.form.pqfs.stats.sum':'Somme', 
	'geoportal.layer.wms.form.pqfs.stats.avg':'Valeur moyenne', 
	'geoportal.layer.wms.form.pqfs.stats.stddev':'Ecart-type', 
	'geoportal.layer.wms.form.pqfs.round':'Arrondir (nb de décimales)',
	'geoportal.layer.chart.form.title':'Paramètres du noeud Graphique', 
	'geoportal.layer.chart.form.geofs':'Paramètres Geographiques',
	'geoportal.layer.chart.form.geofs.url': 'URL du serveur WFS',
	'geoportal.layer.chart.form.geofs.chsc': 'Echelle(s) seuil',
	'geoportal.layer.chart.form.geofs.format':'Format de donnée',
	'geoportal.layer.chart.form.geofs.formatgeojson': 'GeoJSON',
	'geoportal.layer.chart.form.geofs.legend': 'URL de la légende',
	'geoportal.layer.chart.form.geofs.join': 'Champ de jointure de données',
	'geoportal.layer.chart.form.dbfs':'Paramètres de la base de données',
	'geoportal.layer.chart.form.dbfs.db':'Base de données',
	'geoportal.layer.chart.form.dbfs.tables':'Nom(s) de(s) table(s)',
	'geoportal.layer.chart.form.dbfs.values':'Champ contenant les valeurs',
	'geoportal.layer.chart.form.dbfs.labels':'Champ contenant les étiquettes',
	'geoportal.layer.chart.form.dbfs.where':'clause WHERE (facultatif)',
	'geoportal.layer.chart.form.repfs':'Représentation',
	'geoportal.layer.chart.form.repfs.charttype':'Type de graphique',
	'geoportal.layer.chart.form.repfs.piechart':'Camemberts',
	'geoportal.layer.chart.form.repfs.barchart':'Barres',
	'geoportal.layer.chart.form.repfs.colors':'Codes de couleur',
	'geoportal.layer.chart.form.repfs.size':'Taille des graphiques',

		
		'featureInfoWindow.windowTitle':'Interrogation de couches cartographiques',
		'featureInfoTitle':'Eléments interrogés:',
		'fi_manageFields':'Gérer les attributs',
		"featureInfoManager.windowTitle":'Gestionnaire d\'attributs',
		"featureInfoManager.langGrid.code":'Code',
		"featureInfoManager.langGrid.name":'Nom',
		"featureInfoManager.langGrid.title":'Choisir le langage actif',
		'featureInfoManager.fieldsGrid.title':'Liste des attributs',
		'featureInfoManager.fieldsGrid.save':'Sauver pour cette couche seulement',
		'featureInfoManager.fieldsGrid.saveall':'Sauver tous les changements',

		'animations.title':'Animations',
		'animations.tooltipText':"Permet d'explorer des données disponibles à plusieurs dates (exemple : données météo)<br />" +
				" Des boutons vous permettront de jouer une animation en continu, afficher la donnée date après date, etc.",
	'animations.progress.empty':'Aucun jeu de donnée sélectionné...',
	'animations.combo.empty':"Choisir la donnée source pour l'animation",
	'animations.load':'Charger',
	'animations.btn_first':'Première image',
	'animations.btn_previous' : 'Image précédente',
	'animations.btn_pause':'Arrête la boucle',
	'animations.btn_loopforward':'Boucler vers l\'avant',
	'animations.btn_loopbackward':'Boucler vers l\'arrière',
	'animations.btn_next':'Image suivante',
	'animations.btn_last' :'Dernière image',
	'animations.ready':"100%, prêt pour l'animation !",

		'hasMtd':"Métadonnées présentes dans le catalogue. Pour les voir, cliquer droit sur la couche, et choisir 'Métadonnées'.",
		'isQueryable': 'Vous pouvez effectuer des interrogations sur cette couche cartographique',
		'isPQueryable': 'Vous pouvez utiliser l\'outil Interrogation Polygonale sur cette couche cartographique',
		'polygonQueryWindow.windowTitle':'Interrogation Polygonale',
		'polygonQueryWindow.header.title':'Présentation',
		'polygonQueryWindow.header.text':'<h3>Présentation</h3> <p>L\'outil <i>Interrogation Polygonale</i> est actif. Vous pouvez dessiner sur la carte le '+
			'polygone définissant la surface sur laquelle vous voulez collecter les informations. Clore le dessin par un double-clic.'+
			'<br />Une fois le polygone terminé, le panneau ci-dessous va s\'actualiser automatiquement et afficher les informations'+
			'collectées. Les informations affichées dans le panneau ci-dessous correspondent au polygone dessiné en rouge sur la'+
			'carte et à la couche cartographique stipulée ci-dessous.'+
			'<br />Pour sortir du mode <i>Interrogation polygonale</i>, sélectionnez un autre outil dans la barre d\'outils de la carte.'+
			'L\'outil par défault est l\'outil déplacement (icône <i>main</i>).</p>',
		'polygonQueryWindow.target' :"Couche cible : ",
		'polygonQueryWindow.resText.empty':'Pas encore de résultat.',
		'polygonQuery.count': 'Nb de pixels',
		'polygonQuery.min': 'Min',
		'polygonQuery.max': 'Max',
		'polygonQuery.avg': 'Moyenne',
		'polygonQuery.sum': 'Total',
		'polygonQuery.stddev': 'Ecart type',
		'polygonQuery.resultsHeader': 'Statistiques collectées : ',
		'polygonQuery.loading':'Interrogation en cours...',
		'polygonQuery.queryFailure':'Une erreur est survenue lors de la récupération des statistiques. Il est possible que cela '+
			'soit dû à une instabilité de votre connexion internet. Si le problème persiste, merci de contacter l\'administrateur'+
			'du géoportail.',
		'zz':'zz'
};
OpenLayers.Util.extend(OpenLayers.Lang.fr, GeoNetwork.jpLang.fr);