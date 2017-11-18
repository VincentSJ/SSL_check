const https = require('https');

function getCert(url) {
    let options = {
        host: url,
        method: 'GET',
    }

    let req = https.request( options, function(res) {
        console.log( url + ' - ' + res.connection.getPeerCertificate().issuer.O );
    }).on( 'error', function(err) {
        console.log( url + ' - No certificate' );
    });

    res.end();
}

let params = process.argv[2].split(',');

for ( let i = 0; i < params.length; i++ ) {
    getCert( params[i] );
};