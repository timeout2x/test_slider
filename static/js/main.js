require.config({
  shim: {
    'angular' : {'exports' : 'angular'},
  },
  priority: ['angular']
});

require(['jquery', 'angular', 'app'], function($, angular, app) {
  $(function() {
    var html = document.getElementsByTagName('html')[0];

    html.setAttribute('ng-app', 'app');
    if (!html.dataset) html.dataset = {};
    html.dataset.ngApp = 'app';
    angular.bootstrap(document, ['app']);
  });
});