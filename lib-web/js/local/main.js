/*
 * Program execution.
 */
VD.main = function() {
    // Shortcuts:
    var config = VD.config;

    // Program scope vars:
    var start = config.defaultStart; //init

    /* Procedural flow: */
    // - Set polling on an interval
    pollServer();
    setInterval( pollServer, config.queryInterval * 1000 );

    /* Server interactions: */
    // Redraw
    function redraw( data ) {
        console.debug( 'redrawing...', $(config.mapContainerName) );
        console.debug( data.meta );
    }

    function pollServer() {
        var request = new Request.JSON({

            url: config.apiUrl,
            method: 'get',

            data: { // our demo runner and jsfiddle will return this exact data as a JSON string
                start: start
            },

            onSuccess: function( responseJSON, responseText ) {
                start ++;
                redraw( responseJSON );
            },

            onComplete: function( response ) {
                console.debug( 'complete!' );
            },

            onError: function( text, error ) {
                console.debug( 'ERROR!!!', error );
            }

        }).send();
    }

    /* Server interactions: */
}();
