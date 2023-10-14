type ENVTypes = {
	API_URL: string;
	TOKEN_KEY: string;
	GOOGLE_API_KEY: string;
};
const ENV: ENVTypes = {
	API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
	TOKEN_KEY: process.env.EXPO_PUBLIC_TOKEN_KEY ?? '',
	GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? '',
};

export default ENV;
