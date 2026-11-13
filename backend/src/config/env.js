import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve root directory safely in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point dotenv to the .env file in your backend root folder
dotenv.config({ path: path.join(__dirname, '../../.env') });