define(
    [
        'js/collections/SearchResults',
        'backbone',
        'jquery'
    ],

    function ( SearchResults, Backbone, $ ) {

        return Backbone.Model.extend({

            id : 'deezer',
            title : 'Deezer',

            initialize : function () {

                this.searchResults = new SearchResults();
            },

            parseSearchResults : function ( results ) {

                if ( results && results.total ) {

                    _.each( results.data.slice(0, 10), _.bind(function ( result ) {

                        this.searchResults.add({
                            title : ( ( result.artist )? result.artist.name + ' - ' : '' ) + result.title,
                            link : result.link
                        });

                    }, this) );
                }
                return this.searchResults;
            },

            search : function ( query ) {

                var deferred = new $.Deferred();

                this.searchResults.reset();
                this.searchService( deferred, query );

                return deferred.promise();
            },

            searchService : function ( deferred, query ) {

                $.ajax({
                    url : 'https://api.deezer.com/search/track/?index=0&nb_items=10&output=jsonp&q='+ query,
                    dataType: 'jsonp'
                })
                .done( function ( data ){
                    deferred.resolve( this.parseSearchResults( data ) );
                }.bind(this) );
            },

            setConfig : function ( config ) {
                this.config = config;
            }
        });
    }
);