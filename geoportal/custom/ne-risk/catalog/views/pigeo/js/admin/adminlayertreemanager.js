(function() {

  goog.provide('app.admin.layertreemanager');

  goog.require('app.admin.layertree');
  goog.require('app.admin.layertree.service');

  var module = angular.module('app.admin.layertreemanager',
    ['app.admin.layertree', 'app.admin.layertree.service']);

  module.constant('appCatalogUrl', 'pigeo.layertree.get');
//  module.constant('piCatalogUrl', '../../catalog/views/pigeo/data/layertree.json');

  var getNodeText = function(htmlParentNode, nodeName) {
    var parent = $(htmlParentNode);
    return $(parent.find(nodeName)).text();
  };

  /**
   * Admin layertree manager Controller.
   */
  module.controller('AppAdminLayertreeManagerController', [
    '$scope',
    '$routeParams',
    '$http',
    '$translate',
    'appCatalogUrl',
    'appAdminLayertreeService',
    function($scope, $routeParams, $http, $translate,
             appCatalogUrl, layerTreeService) {

      // Right panel view content
      $scope.rightPanel;

      // Model for import tree input
      $scope.import = {
        tree: ''
      };

      // log stream
      $scope.logs = '';

      // the active node of the original tree
      var activeNode;

      // Store a node in the paperweight
      $scope.paperWeight;

      /**
       * Append some log in layertree log console.
       * @param {string} msg
       * @param {string} type used for bootstrap text class (success or error ..)
       */
      var addToLog = function(msg, type) {
        $scope.logs += layerTreeService.addToLog(msg, type, ".logging");
      };
      $scope.addToLog = addToLog;
      addToLog('layertreewelcome');

      $scope.getLayer = function(node) {
        var type = node.type;
        if(type == 'wms' || type == 'chart') {
          return true;
        }
      };

      /**
       * Load node info and fill the form
       * @param {object} node from the tree
       */
      $scope.loadNodeInfo = function(node) {
        if(activeNode != node) {
          activeNode = node;
          $scope.activeLayer = angular.copy(node);
          addToLog($translate.instant('layertreenodeloading',{layer: node.text}));
        }
        $scope.rightPanel = undefined;
      };

      /**
       * Cancel changes done on the node info
       */
      $scope.resetNode = function() {
        $scope.activeLayer = angular.copy(activeNode);
      };

      /**
       * Apply changes made on the node to the tree.
       * After changes are applied, they are not revertible on the tree.
       */
      $scope.applyChanges = function() {
        var checked = activeNode.checked;
        angular.extend(activeNode, $scope.activeLayer);
        activeNode.checked = checked;
      };

      /**
       * Save the tree in the database. Also save a backup.
       * @param force
       */
      $scope.saveLayertree = function(force) {

        var simpleTree = angular.copy($scope.tree);
        var xml = layerTreeService.getTreeAsXml(simpleTree,
          moment(new Date()).format());

        $http.post('pigeo.layertree.admin.set_force', xml,  {
          headers: {'Content-type': 'application/xml'}
        }).then(
          function(response) {
            var doc = ol.xml.parse(response.data);
            var status = getNodeText(doc, 'status')
            if(status == 'error') {
              var message = getNodeText(doc, 'message')
              addToLog('layertreesaveerror', 'danger');
              addToLog(message, 'danger');
            }
            else {
              addToLog('layertreesavesuccess', 'success');
            }
          },
          function () {
            addToLog('layertreesaveerror', 'danger');
          });
      };

      /**
       * Load a layertree from backup
       * @param id
       * @returns {*}
       */
      $scope.loadLayertree = function(id) {
        var url = id ? 'pigeo.layertree.admin.backups.get?id=' + id :
          appCatalogUrl;
        return $http.get(url).then(function(catalog) {
          $scope.tree = catalog.data;
          layerTreeService.setParent($scope.tree);
          addToLog('layertreeloadsuccess', 'success');
        }, function(response) {
          addToLog('layertreeloaderror', 'danger');
        });
      };

      /**
       * Create a new node in the actual active node.
       *
       * @param {string} type of the node
       */
      $scope.createNode = function(type, node) {
        if(activeNode) {
          var newNode = node || {
              id: 'x',
              type: type,
              text: 'new ' + type
            };
          newNode.parent = activeNode;
          if(activeNode.children) {
            activeNode.children.push(newNode);
          }
          else {
            activeNode.children = [newNode];
          }
          if(!node) {
            addToLog($translate.instant('nodecreated', {
              text: activeNode.text,
              type: type
            }), 'success');
          }
          activeNode = newNode;
          $scope.activeLayer = activeNode;
        }
      };

      /**
       * Remove a node from the tree
       */
      $scope.removeTreeNode = function() {
        if(activeNode) {
          var a = activeNode.parent.children;
          a.splice(a.indexOf(activeNode), 1);
          if(!a.length) {
            delete activeNode.parent.children;
          }
          addToLog($translate.instant('noderemoved',{id: activeNode.text}), 'success');
          activeNode = undefined;
          $scope.activeLayer = undefined;
        }
      };

      $scope.copyNode = function() {
        var copy = angular.copy(activeNode);
        copy.id = 'x';
        $scope.paperWeight = angular.copy(copy);
      };

      $scope.cutNode = function() {
        $scope.paperWeight = angular.copy(activeNode);
        $scope.removeTreeNode();
      };

      $scope.pasteNode = function() {
        $scope.createNode(undefined, $scope.paperWeight);
      };

      /**
       * Duplicate the current active node in the same folder.
       * Add a temp '(copy)' label to the new node.
       */
      $scope.duplicateNode = function() {
        var parent = activeNode.parent;
        var newNode = angular.copy(activeNode);
        newNode.id = 'x';
        newNode.text += ' (copy)';
        parent.children.push(newNode);
        addToLog($translate.instant('nodeduplicated',{text: activeNode.text}), 'success');
      };

      $scope.importFromJson = function() {
        try {
          $scope.tree = JSON.parse($scope.import.tree);
          layerTreeService.setParent($scope.tree);
          $scope.activeLayer = $scope.tree;
          activeNode = $scope.activeLayer;
          $scope.rightPanel = undefined;
          addToLog('importtreesuccess', 'success');
        }
        catch(e) {
          addToLog('importtreeerror', 'danger');
        }
      };

      $scope.updatePaperweight = function() {
        try {
          $scope.tree = JSON.parse($scope.import.tree);
          layerTreeService.setParent($scope.tree);
          $scope.activeLayer = $scope.tree;
          activeNode = $scope.activeLayer;
          $scope.rightPanel = undefined;
          addToLog('updatepaperweightsuccess', 'success');
        }
        catch(e) {
          addToLog('updatepaperweighteerror', 'danger');
        }

      };

      $scope.getBackupList = function() {
        return $http.get('pigeo.layertree.admin.backups.list@json').then(function(response) {
          $scope.backuplist = response[0];
          addToLog('backuplistloadsuccess', 'success');
        }, function() {
          addToLog('backuplistloaderror', 'danger');
        });
      };

      // Load layer tree
      $scope.loadLayertree();

      $scope.setRightPanel = function(view) {
        $scope.rightPanel = view;
      };

      // Load groups
      $http.get('admin.group.list@json').success(function(data) {
        $scope.groups = data !== 'null' ? data : null;
        addToLog('groupsloadsuccess', 'success');
      }).error(function(data) {
        addToLog('groupsloadfailure', 'danger');
      });
    }]);

})();
