define(
    [
        'js/collections/SearchResults',
        'backbone',
        'jquery'
    ],

    function ( SearchResults, Backbone, $ ) {

        return Backbone.Model.extend({

            id : 'soundcloud',
            title : 'SoundCloud',

            initialize : function () {

                this.searchResults = new SearchResults();
            },

            parseSearchResults : function ( results ) {

                _.each( results, function ( result ) {

                    this.searchResults.add({
                        title : result.title,
                        link : result.permalink_url
                    });

                }.bind(this) );

                return this.searchResults;
            },

            search : function ( query ) {

                var deferred = new $.Deferred();

                this.searchResults.reset();

                if ( ! this.SoundCloud ) {

                    require( ['http://connect.soundcloud.com/sdk.js'], function () {

                        this.SoundCloud = window.SC;
                        this.SoundCloud.initialize({
                            client_id: this.config.apiKey
                        });

                        this.searchService( deferred, query );

                    }.bind(this) );

                } else {
                    this.searchService( deferred, query );
                }

                return deferred.promise();
            },

            searchService : function ( deferred, query ) {

                this.SoundCloud.get('/tracks/', {
                    "q": query,
                    "limit": 10
                    },
                    function ( data ){
                        deferred.resolve( this.parseSearchResults( data ) );
                    }.bind(this)
                );
            },

            setConfig : function ( config ) {
                this.config = config;
            }
        });
    }
);