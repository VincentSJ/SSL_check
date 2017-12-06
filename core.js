const https = require('https');
//const fs = require('fs');

let warnCount = 0,
    errCount = 0;

function getCertificateInfo(url) {
    let options = {
        host: url,
        method: 'GET'
    };

    let req = https.request(options, function(res) {
        let siteCert = res.connection.getPeerCertificate(true).issuer.O,
            body = '';

        res.on("data", function(chunk) {
            body += chunk.toString(); //combine all cnunks in one
        }).on("end", function() {
            //console.log('Cert - ' + url + ' - ' + siteCert);

            const src = /src="http:\/\/[^"']/,
                  href = /href="http:\/\/(?!it-clever\.ru)/;

            let isSrc = src.test(body),
                isHref = href.test(body);

            if ( isSrc && !isHref ) {
                console.log('\x1b[31mError\x1b[0m - ' + url + ' - Mixed content detected');
                errCount++;
            }

            if ( !isSrc && isHref ) {
                console.log('\x1b[33mWarn\x1b[0m - ' + url + ' - HTTP links detected');
                warnCount++;
            }

            if ( isSrc && isHref) {
                console.log('\x1b[31mError\x1b[0m/\x1b[33mWarn\x1b[0m - ' + url + ' - Mixed content and HTTP links detected');
                warnCount++;
                errCount++;
            }

            if ( !isSrc && !isHref ) {
                console.log('\x1b[32mOK\x1b[0m - ' + url);
            }

        /*
        fs.writeFile("body.txt", body, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log('\x1b[32mfile created\x1b[0m');
        });
        */

            if ( params.length != 0 ) {
                getCertificateInfo(params.shift())
            } else {
                console.log('Work\'s done with: ' + errCount + ' error(s) and ' + warnCount + ' warning(s)');
            }
        });

    }).on('error', function(err) {
        console.log('No certificate found - ' + url);
    });

    req.end();
}

let params = [];

for ( let i = 2; i < process.argv.length; i++) {
    params.push(process.argv[i].replace(/,/g, ''));
}

console.log('Url\'s number: ' + params.length)

getCertificateInfo(params.shift());