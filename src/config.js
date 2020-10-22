import fs from 'fs';

let config = {};
if ( fs.existsSync( 'package.json' ) ) {
	config = JSON.parse( fs.readFileSync( 'package.json' ) ).dev;
}

export default config;
