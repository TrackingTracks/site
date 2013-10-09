// jQuery.XDomainRequest.js
// Author: Jason Moon - @JSONMOON
// IE8+
//
// @modified VPRO Digitaal; if processData=false in a POST request
// xdr.send the post data as provided
if (!jQuery.support.cors && window.XDomainRequest) {

    //MGNL-9386 - the NPO widget also includes this plugin and replaces our adjusted code.
    //            Therefore we pretend to have added cors support so the next inclusion
    //            of the plugin won't replace our code.
    jQuery.support.cors = true;

    var httpRegEx = /^https?:\/\//i;
    var getOrPostRegEx = /^get|post$/i;
    var postRegEx = /^post$/i;
    var sameSchemeRegEx = new RegExp('^' + location.protocol, 'i');
    var jsonRegEx = /\/json/i;
    var xmlRegEx = /\/xml/i;

    //MGNL-9386 - in case we're registering later than the NPO widget, use a + in front
    //            of the data type
    //            http://stackoverflow.com/questions/6130894/unregister-or-override-a-custom-ajaxtransport-in-jquery
    jQuery.ajaxTransport('+text +html +xml +json', function(options, userOptions, jqXHR) {

        // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
        if ( options.crossDomain &&
             options.async &&
             getOrPostRegEx.test(options.type) &&
             httpRegEx.test(userOptions.url) &&
             sameSchemeRegEx.test(userOptions.url) ) {

            var xdr = null;
            var userType = (userOptions.dataType || '').toLowerCase();

            return {
                send: function(headers, complete) {
                    xdr = new XDomainRequest();

                    if (/^\d+$/.test(userOptions.timeout)) {
                        xdr.timeout = userOptions.timeout;
                    }
                    // ie9 needs onprogress handler for large requests
                    // http://bugs.jquery.com/ticket/8283#comment:28
                    xdr.onprogress = function() {
                    };

                    xdr.ontimeout = function() {
                        complete(500, 'timeout');
                    };
                    xdr.onload = function() {

                        var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;

                        var status = {
                            code: 200,
                            message: 'success'
                        };
                        var responses = {
                            text: xdr.responseText
                        };

                        try {

                            if ((userType === 'json') || ((userType !== 'text') && jsonRegEx.test(xdr.contentType))) {
                                try {
                                    responses.json = jQuery.parseJSON(xdr.responseText);
                                } catch(e) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    //throw 'Invalid JSON: ' + xdr.responseText;
                                }
                            } else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                var doc = new ActiveXObject('Microsoft.XMLDOM');
                                doc.async = false;
                                try {
                                    doc.loadXML(xdr.responseText);
                                } catch(e) {
                                    doc = undefined;
                                }
                                if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    throw 'Invalid XML: ' + xdr.responseText;
                                }
                                responses.xml = doc;
                            }
                        } catch(parseMessage) {
                            throw parseMessage;
                        } finally {
                            complete(status.code, status.message, responses, allResponseHeaders);
                        }
                    };
                    xdr.onerror = function() {
                        complete(500, 'error', {
                            text: xdr.responseText
                        });
                    };

                    var postData = '';

                    if ( userOptions.data ) {

                        if ( postRegEx.test( options.type ) &&
                             jsonRegEx.test( options.contentType ) &&
                             userOptions.processData === false ) {

                            postData = userOptions.data; // leave post data as is
                        } else {
                            postData = jQuery.param( userOptions.data, userOptions.traditional ) || '';
                        }
                    }

                    xdr.open(options.type, options.url);
                    xdr.send(postData);
                },
                abort: function() {
                    if (xdr) {
                        xdr.abort();
                    }
                }
            };
        }
    });
}