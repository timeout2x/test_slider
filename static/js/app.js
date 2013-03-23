define(['angular'], function (angular) {
  'use strict';

  angular.module('app', [])
    .controller('WeatherListController', ['$scope', '$http', function($scope, $http) {
      var url = 'http://query.yahooapis.com/v1/public/yql?q=use%20\'http%3A%2F%2Fgithub.com%2Fyql%2Fyql-tables%2Fraw%2Fmaster%2Fweather%2Fweather.bylocation.xml\'%20as%20we%3Bselect%20*%20from%20we%20where%20unit%3D\'c\'%20and%20location%20in(\'moscow\'%2C%20\'opatija\'%2C%20\'london\'%2C%20\'washington\'%2C%20\'paris\'%2C%20\'melbourne\')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK'
      , interval, timeout;

      $http.jsonp(url).success(function(data) {
        if (data && data.error) {
          alert('Yahoo returned following error: '+data.error.description);
          return;
        }
        if (data && data.query && data.query.results && data.query.results.weather && data.query.results.weather.length > 0) {
          $scope.cities = [];
          for (var i=0;i<data.query.results.weather.length;i++) {
            var city = data.query.results.weather[i].rss.channel, hour = new Date(city.item.condition.date.substring(0, city.item.condition.date.length - 4)).getHours();
            
            // Check if local time is between sunrise and sunset -> show day picture, otherwise -> night 
            if (hour >= parseInt(city.astronomy.sunrise) && hour < parseInt(city.astronomy.sunset) + 12) {
              city.daynight = 'd';
            }
            else {
              city.daynight = 'n';
            }
            
            if (i == 0) {
              city.className = 'active';
            }
            else {
              city.className = '';
            }
            
            $scope.cities.push(city);
            console.log(city);
          }
          
          startSlideShow();
        }
        
      });
      
      function startSlideShow() {
        if (interval) clearInterval(interval);
        
        interval = setInterval(function() {
          var active = $('#counter').children('.active').next();
          if (active.length < 1) active = $('#counter').children().first();
          
          if (active.length > 0) {
            showSlide(active);
          }
        }, 5000);
      }
      
      function showSlide(el) {
        $('#counter .active').removeClass('active');
        $('#slider .active').removeClass('active');
        
        el.addClass('active');
        $('#slider').children().eq(el.index()).addClass('active');
      }
      
      function restartSlideShow() {
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(interval);
        timeout = setTimeout(function() {
          startSlideShow();
        }, 5000);
      }

      $('#counter').on('click', 'div', function() {
        showSlide($(this));
        
        // Restart interval to give user some time to view slide
        restartSlideShow();
      });
      
      $('#arrow-prev, #arrow-next').click(function() {
        var active = $('#counter').children('.active');
        
        if ($(this).is('#arrow-prev')) {
          active = active.prev();
          if (active.length < 1) {
            active = $('#counter').children().last();
          }
        }
        else {
          active = active.next();
          if (active.length < 1) {
            active = $('#counter').children().first();
          }
        }
        showSlide(active);
        
        // Restart interval to give user some time to view slide
        restartSlideShow();
      });

  }]);
});


