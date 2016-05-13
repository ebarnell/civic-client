(function() {
  angular.module('civic.account')
    .controller('NotificationsController', NotificationsController)
    .config(notificationsConfig);

  // @ngInject
  function notificationsConfig($stateProvider) {
    $stateProvider.state('account.notifications', {
      url: '/notifications?category',
      controller: 'NotificationsController',
      templateUrl: 'app/views/account/notifications/notifications.tpl.html',
      data: {
        titleExp: '"Account Notifications"',
        navMode: 'sub'
      },
      resolve: {
        feed: /* @ngInject */ function($stateParams, CurrentUser) {
          //return CurrentUser.getFeed({page: $stateParams.page});
          return CurrentUser.getFeed({count: 25});
        }
      }
    })
  }

  // @ngInject
  function NotificationsController($scope,
                                   $state,
                                   $stateParams,
                                   CurrentUser,
                                   Security,
                                   feed,
                                   _) {
    if(_.isUndefined($stateParams.category)) {
      $state.go('account.notifications', {category: 'all', count: 25})
    }
    var vm = $scope.vm = {};

    vm.max = 25;
    vm.maxOptions = [25,50,100,150,200];
    vm.notifications = [];

    vm.total = Number();
    vm.totalNotifications = feed.total;

    vm.fetch = function() {
      CurrentUser.getFeed({count: vm.max})
    };

    $scope.$watch(function() { return CurrentUser.data.feed }, function(feed){
      vm.total = feed.length;

      if(_.isUndefined($stateParams.category) || $stateParams.category  === 'all') {
        angular.copy(feed, vm.notifications);
      } else {
        angular.copy(
          _.filter(feed, {type: $stateParams.category.substring(0,$stateParams.category.length-1)}),
          vm.notifications);
      }

      vm.categories = [
        {
          name: 'All',
          category: 'all',
          state: 'account.notifications({category:"all"})',
          count: feed.length
        },
        {
          name: 'Mentions',
          category: 'mentions',
          state: 'account.notifications({category:"mentions"})',
          count: _(feed).filter({type: 'mention'}).value().length
        },
        {
          name: 'Subscribed Events',
          category: 'subscribed_events',
          state: 'account.notifications({category:"subscribed_events"})',
          count: _(feed).filter({type: 'subscribed_event'}).value().length
        }
      ];
    }, true);

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead().then(function() {
        Security.reloadCurrentUser(); // to update notification counts
      });
    }
  }
})();