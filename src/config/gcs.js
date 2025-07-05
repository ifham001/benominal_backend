import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use relative path from current file to JSON key
const keyPath = path.resolve(__dirname, '../../google_keys.json');

const storage = new Storage({
  keyFilename: keyPath,
  projectId: 'deploy-4abde',
});

const bucket = storage.bucket('benominal');

export { storage, bucket };
