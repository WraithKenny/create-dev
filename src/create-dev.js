import path from 'path';
import config from './config';

const root = path.resolve();

export function cli( args ) {
	console.log(args);
	console.log(config);
	console.log(root);
}
