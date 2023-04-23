import {fileURLToPath} from 'node:url';
import path from 'node:path';


export const __app = path.dirname(fileURLToPath(import.meta.url));

export const __root = path.join(__app, '..')
