import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const API_URL = 'http://localhost:3000';
// Keep browser and Node-side test data on the same calendar day.
export const TEST_NOW = new Date('2026-05-16T12:00:00.000Z');
export const ASSETS_DIR = path.join(dirname, '../assets');
export const TESTED_FORM_ID = '98ffcaf1-ae8c-4d0f-b647-08ddbc7c9753';

export const MOCK_PDF_FILEPATH = path.join(ASSETS_DIR, 'test-pdf-file.pdf');
export const MOCK_IMAGE_FILEPATH = path.join(ASSETS_DIR, 'test-image-file.jpg');
