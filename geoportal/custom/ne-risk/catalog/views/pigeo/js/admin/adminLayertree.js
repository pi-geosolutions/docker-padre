
if(!goog) {
  var goog = {};
  goog.UID_PROPERTY_ = 'closure_uid_406936994';
  goog.uidCounter_ = 0;
  goog.getUid = function(obj) {
    return obj[goog.UID_PROPERTY_] ||
        (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
  };
}

(function() {

  goog.provide('app.admin.layertree');

  var module = angular.module('app.admin.layertree', []);

  var layertreeDirective = function($compile) {
    return {
      restrict: 'A',
      scope: true,
      templateUrl: '../../catalog/views/pigeo/js/admin/adminlayertree.html',
      controller: 'AdminLayertreeController'
    };
  };

  module.directive('adminLayertree', ['$compile', layertreeDirective]);

   var LayertreeController = function($scope, $element, $attrs) {

    var isRoot = !angular.isDefined($attrs['adminLayertreeNotroot']);
    this.isRoot = isRoot;

    this.layer = isRoot ? null :
        $scope.$eval(nodelayerExpr, {'node': this.node});

    var nodeExpr = $attrs['adminLayertree'];

    this.node = undefined;

    if (isRoot) {
      $scope.$watch(nodeExpr, function(newVal, oldVal) {
        this.node = newVal;
      }.bind(this));
    } else {
      this.node = ($scope.$eval(nodeExpr));
    }

    var nodelayerExpr = $attrs['adminLayertreeNodelayer'];
    if (!angular.isDefined(nodelayerExpr)) {
      var nodelayerexprExpr = $attrs['adminLayertreeNodelayerexpr'];
      nodelayerExpr = $scope.$eval(nodelayerexprExpr);
    }

    this.nodelayerExpr = nodelayerExpr;
    this.layer = isRoot ? null :
        ($scope.$eval(nodelayerExpr, {'node': this.node}));

    this.parentUid = $scope.$parent.uid;
    this.uid = goog.getUid(this);
    this.depth = isRoot ? 0 : $scope.$parent.depth + 1;

    $scope.uid = this.uid;
    $scope.depth = this.depth;
    $scope.layertreeCtrl = this;
  };

  LayertreeController.prototype.toggleNode = function(evt) {
    if(this.node.children) {
      var el = $(evt.target);
      if(el.is('i')) {
        el = el.parent();
      }
      el.find('i.fa').first().toggleClass('fa-minus-square')
          .toggleClass('fa-plus-square');

      el.find('i.fa').last().toggleClass('fa-folder')
          .toggleClass('fa-folder-open');
    }
  };

  module.controller('AdminLayertreeController',
      LayertreeController);

  LayertreeController['$inject'] = [
    '$scope',
    '$element',
    '$attrs'
  ];

  /**
   * Backups list directive
   */
  module.directive('piBackupList', ['$http', '$translate' , function($http, $translate) {
    return {
      restrict: 'A',
      scope: true,
      templateUrl: '../../catalog/views/pigeo/js/admin/backuplist.html',
      link: function(scope) {

        var addToLog = scope.addToLog;

        var loadList = function() {
          return $http.get('pigeo.layertree.admin.backups.list@json').then(function(response) {
            scope.backuplist = response.data[0];
            addToLog('backuplistloadsuccess', 'success');
          }, function() {
            addToLog('backuplistloadfailure', 'danger');
          });
        };

        scope.removeBackup = function(id) {
          return $http.get('pigeo.layertree.admin.backups.remove@json', {
            params: {id: id}
          }).then(function(response) {
            if(response.data[0] == "true") {
              addToLog($translate.instant('backupremovesuccess', {id:id}), 'success');
              loadList();
            }
            else {
              addToLog($translate.instant('backupremovefailure', {id:id}), 'danger');
            }
          }, function() {
            addToLog($translate.instant('backupremovefailure', {id:id}), 'danger');
          });
        };

        loadList();
      }
    };
  }]);

  module.directive('jsonText', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ngModel) {
        function removeParent(node) {
          delete node.parent;
          if(node.children) {
            node.children.forEach(function(n) {
              removeParent(n);
            });
          }
        };
        function out(data) {
          var tree = angular.copy(data);
          removeParent(tree);
          return JSON.stringify(tree);
        }
        ngModel.$formatters.push(out);
      }
    };
  });

})();
