import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import packageJson from '../package.json';
import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';

export function init( args ) {
	let targetDirectory;

	const program = new Command( packageJson.name )
		.version( packageJson.version )
		.arguments( '<project-directory>' )
		.usage( `${chalk.green('<project-directory>')} [options]` )
		.action( dir => {
			targetDirectory = dir;
		} )
		.parse( process.argv );

	if ( 'undefined' === typeof targetDirectory ) {
		// Use current.
		targetDirectory = '.';
	}

	createDev( targetDirectory );
}

function createDev( targetDirectory ) {

	// Ensure that target is current or a subdirectory.
	const relative = path.relative( '.', targetDirectory );
	if ( relative.startsWith( '..' ) || path.isAbsolute( relative ) ) {
		console.log(
			`${chalk.red('Error')}: Please choose a subdirectory or current directory.`
		);

		process.exit(1);
	}

	const targetPath = path.resolve( targetDirectory );
	fs.ensureDirSync( targetPath );

	// Ensure that target is empty.
	const files = fs.readdirSync( targetPath );
	if ( files.length > 0 ) {
		console.log(
			`${chalk.red('Error')}: The directory ${chalk.green(targetPath)} contains files that could conflict.`
		);
		console.log(
			'Either try using a new directory name, or remove the files.'
		);

		process.exit(1);
	}

	console.log();
	console.log( `Creating a new dev project in ${chalk.green(targetPath)}.` );
	console.log();

	const basename = path.basename( targetPath );
	let packageJson = JSON.parse( fs.readFileSync( path.resolve( __dirname, 'templates/package.json' ) ) );
	packageJson = {
		name: basename,
		...packageJson,
	};

	fs.writeFileSync(
		path.join( targetPath, 'package.json' ),
		JSON.stringify( packageJson, null, 2 ) + os.EOL
	);

	execSync( 'dev-script', { stdio: 'inherit' } );
}
