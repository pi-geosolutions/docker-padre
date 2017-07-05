(function() {

  goog.provide('app.animator');

  var module = angular.module('app.animator', []);

  gn.animatorDirective = function() {
    return {
      restrict: 'E',
      scope: {
        list: '=appAnimatorList',
        dateFormatter: '=?appAnimatorDateformatter',
        onchangeFn: '&appAnimatorOnchange'
      },
      controller: 'AppAnimatorController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '../../catalog/views/pigeo/js/animation/animator.html'
    };
  };
  module.directive('appAnimator', gn.animatorDirective);

  gn.AnimatorController = function($http, $scope, $timeout) {
    this.$timeout = $timeout;
    this.playing = false;
    this.promise;
    this.time;

    $scope.$watch(function(){
      return this.list;
    }.bind(this), function(list) {
      this.index = list.length-1;
    }.bind(this));

    $scope.$watch(function(){
      return this.index;
    }.bind(this), function(index) {
      this.onchangeFn({index: index});
      this.setTime_(index);
    }.bind(this));

  };

  gn.AnimatorController.prototype.next = function() {
    if(++this.index >= this.list.length) {
     this.first();
    }
  };
  gn.AnimatorController.prototype.previous = function() {
    if(--this.index < 0) {
      this.last();
    }
  };
  gn.AnimatorController.prototype.last = function() {
    this.index = this.list.length-1;
  };
  gn.AnimatorController.prototype.first = function() {
    this.index = 0;
  };
  gn.AnimatorController.prototype.previous = function() {
    if(--this.index < 0) {
      this.last();
    }
  };

  gn.AnimatorController.prototype.play = function(backward) {
    this.modeBackward = backward;
    if(!this.playing) this.applyNextValue_();
    this.playing = true;
  };

  gn.AnimatorController.prototype.stop = function() {
    var promise = this.promise;
    this.playing = false;
    if (promise) {
      this.$timeout.cancel(promise);
      this.promise = undefined;
    }
  };

  gn.AnimatorController.prototype.applyNextValue_ = function() {
    if(this.modeBackward) this.previous();
    else this.next();
    this.promise = this.$timeout(this.applyNextValue_.bind(this), 1000);
  };

  gn.AnimatorController.prototype.setTime_ = function(index) {
    /* from pigeo animation service, current date is eval from expression */
    if(this.dateFormatter) {
      var filename = this.list[index];
      function scopedEval(code){
        var vars = {
          "filename": filename
        };
        with(vars) {
          return eval('('+code+')');
        }
      }
      this.time = scopedEval(this.dateFormatter);
    }
    else {
      this.time = moment(this.list[index]).format('LLL');
    }
  };

  module.controller('AppAnimatorController',
    gn.AnimatorController);

  gn.AnimatorController['$inject'] = [
    '$http', '$scope', '$timeout'
  ];

})();
