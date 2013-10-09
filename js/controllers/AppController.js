define(
    [
        'js/collections/SearchServices',
        'js/views/AppView',
        'jquery',
        'underscore'    
    ],

    function ( SearchServices,
               AppView,
               $, _
            ) {

        var AppController = function ( container ) {

            this.container = $( container );

            this.searchServices = new SearchServices();
            this.expectedServices = 0;

            this.appView = new AppView({
                el: this.container[0],
                collection : this.searchServices
            });

            this.bindHandlers();

            this.loadConfig();
        };

        AppController.prototype = {

            bindHandlers : function () {

                this.searchServices.on( 'add', this.checkServicesProgress, this );
            },

            checkServicesProgress : function () {
                if ( this.searchServices.length === this.expectedServices ) {
                    this.appView.render();
                }
            },

            loadConfig : function () {
                $.getJSON('config.json').done( this.parseConfig.bind(this) );
            },

            parseConfig : function ( cfg ) {

                var services = [];

                this.config = cfg;

                _.each( cfg.services, function ( service ) {

                    services.push( 'js/services/'+ service.module );
                });

                this.expectedServices = services.length;

                require( services, this.parseServices.bind(this) );
            },

            parseServices : function ( /* 1..n Services modules */ ) {

                _.each( arguments, _.bind( function ( Service ) {

                    var service = new Service();
                        service.setConfig( this.config.services[ service.id ].config );

                    this.searchServices.add( service );

                }, this) );
            }
        };

        return AppController;
    }
);