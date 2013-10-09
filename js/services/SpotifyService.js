define(
    [
        'js/collections/SearchResults',
        'backbone',
        'jquery'
    ],

    function ( SearchResults, Backbone, $ ) {

        return Backbone.Model.extend({

            id : 'spotify',
            title : 'Spotify',

            initialize : function () {

                this.searchResults = new SearchResults();
            },

            parseSearchResults : function ( results ) {

                if ( results && results.tracks ) {

                    _.each( results.tracks.slice(0, 10), _.bind(function ( result ) {

                        this.searchResults.add({
                            title : ( ( result.artists )?
                                    _.map(result.artists, function ( artist ) { return artist.name; }).join(', ') + ' - ' : '' ) + result.name,
                            link : 'http://open.spotify.com/track/'+ result.href.split(':').pop()
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
                    url : 'http://ws.spotify.com/search/1/track.json',
                    data : {
                        "q": query
                    },
                    dataType: 'json'
                })
                .done( _.bind(function ( data ){
                    deferred.resolve( this.parseSearchResults( data ) );
                }, this) );
            },

            setConfig : function ( config ) {
                this.config = config;
            }
        });
    }
);