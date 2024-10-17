import config from 'config';

export default function startConfig() {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}

export const publicFolder: string = "public"; // ROOT PUBLIC FOLDER
