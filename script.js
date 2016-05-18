/**
 * You must include the dependency on 'ngMaterial'
 */
var app = angular.module('app', ['ngMaterial']);

app.controller('Main', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.submit = function() {
        
        // set the local storage item to the search query
        localStorage.setItem('lastsearch', $scope.query);

        // http reqeuest to the wiki api
        $http.jsonp('//en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch={0}&callback=JSON_CALLBACK'.lp_format($scope.query))
            .success(function(data) {
                $scope.results = data.query.search;
            });
    }

    // get history from local storage
    // and submit the search if there's a recent search
    var last = localStorage.getItem('lastsearch');
    if (last !== 'null' && last != null) {
        $scope.query = last;
        $scope.submit(last);
    }
    
    // insertsearch the search result snippets into the dom
    // have to use sce becaseu angular doesn't trust the incoming html
    $scope.insertSnippet = function(snip) {
        return $sce.trustAsHtml(snip);
    }
}]);


// detect the enter key press from the search input
app.directive('myEnter', function() {
    return function(scope, element, attrs) {
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

// shortcut for console.log()
function l (message) {
  console.log(message);
}