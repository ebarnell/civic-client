(function() {
  'use strict';
  angular.module('civic.events.variants')
    .directive('variantTalkRevisionSummary', variantTalkRevisionSummary)
    .controller('VariantTalkRevisionSummaryController', VariantTalkRevisionSummaryController);

  // @ngInject
  function variantTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/talk/revisions/variantTalkRevisionSummary.tpl.html',
      controller: 'VariantTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function VariantTalkRevisionSummaryController($scope, $stateParams, VariantRevisions, Security, formConfig) {
    var vm = $scope.vm = {};
    vm.isAdmin = Security.isAdmin;
    vm.isAuthenticated = Security.isAuthenticated;
    vm.variantTalkModel = VariantRevisions;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    $scope.acceptRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      VariantRevisions.acceptRevision($stateParams.variantId, $stateParams.revisionId)
        .then(function(response) {
          vm.formMessages['acceptSuccess'] = true;
        })
        .catch(function(error) {
          console.error('revision accept error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function (){
          console.log('accept revision successful.');
        });
    };

    $scope.rejectRevision = function() {
      vm.formErrors = {};
      vm.formMessages = {};
      VariantRevisions.rejectRevision($stateParams.variantId, $stateParams.revisionId)
        .then(function(response) {
          vm.formMessages['rejectSuccess'] = true;
        })
        .catch(function(error) {
          console.error('revision reject error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function (){
          console.log('reject revision successful.');
        });
    };
  }
})();
