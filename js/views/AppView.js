define(
    [
        'backbone',
        'underscore',
        'js/lib/template!templates/app.html',
        'js/lib/template!templates/searchresults.html'
    ],
    function ( Backbone, _, appTemplate, resultsTemplate ) {

        return Backbone.View.extend({

            events : {
                'submit .search-form' : 'handleSearchSubmit'
            },

            handleSearchSubmit : function ( e ) {
                e.preventDefault();

                this.$el.find('.search-results').empty();

                _.each( this.collection.models, _.bind(function ( service ) {
                    service.search( this.$el.find('[name=query]').val() ).done( _.bind(function ( searchResults ) {
                        this.renderSearchResults( service, searchResults );

                    },this) );
                },this));

            },

            render : function () {

                if ( this.collection.length ) {
                    this.renderSearchBox();
                }
            },

            renderSearchBox : function () {

                this.$el.html( appTemplate.render({
                    services : _.map( this.collection.models, function ( service ) {
                         return ({
                             id : service.id,
                             title : service.title
                         });
                    })
                }) );
            },

            renderSearchResults : function ( service, searchResults ) {
                this.$el.find('.search-results').append(
                    resultsTemplate.render({
                        service: {
                            title: service.title
                        },
                        results: searchResults.toJSON()
                    })
                );
            }
        });
    }
);