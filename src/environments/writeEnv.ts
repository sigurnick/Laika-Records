const setEnv = () => {
  // Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.ts';
  // Load node modules
  require('dotenv').config({
    path: '.env',
  });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {

  firebaseConfig:{
    projectId: ${process.env['projectId']}
    appId: ${process.env['appId']}
    databaseURL: ${process.env['databaseURL']}
    storageBucket: ${process.env['storageBucket']}
    apiKey: ${process.env['apiKey']}
    authDomain: ${process.env['authDomain']}
    messagingSenderId: ${process.env['messagingSenderId']}
    measurementId: ${process.env['measurementId']}
  },

    discogs_api_key: ${process.env['discogs_api_key']}
    discogs_api_secret: ${process.env['discogs_api_secret']}
    paypall_client_id: ${process.env['paypall_client_id']}

  production: true,
};
`;
  require('fs').writeFile(targetPath, envConfigFile, (err: any) => {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log(
        `Angular environment.ts file generated correctly at ${targetPath} \n`
      );
    }
  });
};
setEnv();
