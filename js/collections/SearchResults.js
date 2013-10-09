define(
    [
        'backbone',
        'js/models/SearchResultModel'
    ],
    function ( Backbone, SearchResultModel ) {

        return Backbone.Collection.extend({
            model : SearchResultModel
        });
    }
);