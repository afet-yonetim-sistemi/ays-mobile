const { exec } = require('child_process');
require('dotenv').config();
// eslint-disable-next-line no-undef
const OPEN_API_URL = process.env.OPEN_API_URL;

const isDevelopment = process.env.NODE_ENV === 'development';

const generateTypes = async () => {
	const outputFile = './src/types/OpenAPITypes.ts';
	console.log(`Generating types from ${OPEN_API_URL} to ${outputFile}`);
	exec(`npx openapi-typescript ${OPEN_API_URL} -o ${outputFile}`, (err, stdout) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(stdout);
	});
};

if (isDevelopment) {
	generateTypes();
} else {
	console.log('Generating types is ignored');
}
