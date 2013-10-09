
define('jquery', function () {
    return window.jQuery;
});

requirejs.config({
    paths : {
        'backbone' : 'vendor/backbone-amd/backbone',
        'underscore' : 'vendor/underscore-amd/underscore'
    }
});

require(
    [
        'js/controllers/AppController'
    ],

    function ( AppController ) {

        var app = new AppController( document.getElementById('app') );
    }
);