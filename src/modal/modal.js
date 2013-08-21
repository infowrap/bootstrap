angular.module('ui.bootstrap.modal', ['ui.bootstrap.dialog'])
.directive('modal', ['$parse', '$dialog', '$rootScope', function($parse, $dialog, $rootScope) {
  return {
    restrict: 'EA',
    terminal: true,
    link: function(scope, elm, attrs) {
      var opts = angular.extend({}, scope.$eval(attrs.uiOptions || attrs.bsOptions || attrs.options));
      var shownExpr = attrs.modal || attrs.show;
      var setClosed;

      // Create a dialog with the template as the contents of the directive
      // Add the current scope as the resolve in order to make the directive scope as a dialog controller scope
      opts = angular.extend(opts, {
        template: elm.html(),
        resolve: { $scope: function() { return scope; } }
      });
      var dialog = $dialog.dialog(opts);

      elm.remove();

      if (attrs.close) {
        setClosed = function() {
          $parse(attrs.close)(scope);
        };
      } else {
        setClosed = function() {
          if (angular.isFunction($parse(shownExpr).assign)) {
            $parse(shownExpr).assign(scope, false);
          }
        };
      }

      scope.$watch(shownExpr, function(isShown, oldShown) {
        if (isShown) {
          // IW CUSTOM
          // to support custom modal class names - the core implementation was limited because it could not be dynamically set
          dialog.modalEl.removeClass(); // reset classes first
          if($rootScope.modalClass){
            dialog.modalEl.addClass($rootScope.modalClass);
          }
          // END IW CUSTOM
          dialog.open().then(function(){
            setClosed();
          });
        } else {
          //Make sure it is not opened
          if (dialog.isOpen()){
            dialog.close();
          }
        }
      });
    }
  };
}]);
