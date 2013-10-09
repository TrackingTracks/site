/**
 *
 */
define(
    [
        'jquery',
        'vendor/handlebars/handlebars'
    ],
        
    function ( $, Handlebars ) {

        var Template = function ( html ) {
            this.template = Handlebars.compile( html );
        };

        Template.prototype.render = function () {
            return this.template.apply( this.template, arguments );
        };

        return {
            load: function(name, req, load, config) {
                var url = req.toUrl( name );

                $.ajax({
                    url: url,
                    dataType: 'html',
                    success: function ( html ) {

                        load( new Template( html ) );
                    },
                    error: function() {
                        load( null );
                    }
                });
            }
        };
    }
);