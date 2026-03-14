import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const ERROR_FILE_PATH = path.join(__dirname, '../../unsaved_errors.jsonl');

export const saveError = async (errorData: any) => {
  try {
    // With JSONL, we never need to read the whole file first.
    // We just append a new stringified object with a newline character!
    const jsonString = JSON.stringify({ localId: randomUUID(), ...errorData }) + '\n';
    await fs.appendFile(ERROR_FILE_PATH, jsonString, 'utf-8');
  } catch (err) {
    console.error('Failed to save offline error:', err);
  }
};

export const getUnsavedErrors = async (): Promise<any[]> => {
  try {
    if (existsSync(ERROR_FILE_PATH)) {
      const fileContent = await fs.readFile(ERROR_FILE_PATH, 'utf-8');
      if (fileContent.trim()) {
        // Split by newline, filter out empty lines, then parse each line safely
        return fileContent
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            try {
              return JSON.parse(line);
            } catch (parseError) {
              console.error('Skipping corrupted offline error log line:', line);
              return null; // Ignore this specific broken line
            }
          })
          .filter(parsedObj => parsedObj !== null);
      }
    }
  } catch (err) {
    console.error('Failed to read offline errors:', err);
  }
  return [];
};

export const clearErrors = async () => {
  try {
    if (existsSync(ERROR_FILE_PATH)) {
      await fs.unlink(ERROR_FILE_PATH);
    }
  } catch (err) {
    console.error('Failed to clear offline errors:', err);
  }
};
