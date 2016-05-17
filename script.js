/**
 * You must include the dependency on 'ngMaterial'
 */
var app = angular.module('app', ['ngMaterial']);

app.controller('Main', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.submit = function() {
        // query wiki

        // /w/api.php?action=query&format=json&list=search&srsearch=grass
        $http.jsonp('//en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch={0}&callback=JSON_CALLBACK'.lp_format($scope.query))
            .success(function(data) {
                l(data.query.search);
                $scope.results = data.query.search;
            });
    }
    $scope.query = 'grass';
    $scope.submit();
    
    $scope.insertSnippet = function(snip) {
        return $sce.trustAsHtml(snip);
    }
}]);

app.directive('myEnter', function() {
    return function(scope, element, attrs) {
        l('int the custom directive');
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});

// '{0}{1}'.lp_format('asdf', 1 + 2);
if (!String.prototype.format) {
    String.prototype.lp_format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function l(message) {
    console.log(message);
}

// $(document).ready(function() {

//     // get history
//     var last = localStorage.getItem('lastsearch');
//     if (last !== 'null')
//         document.querySelector('input').defaultValue = last || '';
//     find(last);

//     // find("history");

//     function find(q) {
//         $.ajax({
//             url: '//en.wikipedia.org/w/api.php',
//             data: {
//                 action: 'query',
//                 list: 'search',
//                 srsearch: q,
//                 format: 'json'
//             },
//             dataType: 'jsonp',
//             success: function(data) {
//                 localStorage.setItem('lastsearch', q);
//                 console.log(data);
//                 data.query.search.forEach(function(elem) {
//                     $('ul').append(
//                         '<li>' +
//                         '<a href="http://en.wikipedia.org/wiki/ ' + elem.title + '">' +
//                         '<div>' +
//                         '<span class="title">' + elem.title + '</span>' +
//                         '<br>' +
//                         '<span class="snippet">' + elem.snippet + '</span>' +
//                         '</div>' +
//                         '</a>' +
//                         '</li>'
//                     )
//                 });
//             }
//         });
//     }

//     $('input').on('keyup', function(e) {
//         if (e.keyCode === 13) {
//             $('li').remove();
//             find($('input')[0].value);
//         }
//     });
// });