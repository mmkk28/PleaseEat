import { getUnsavedErrors, clearErrors } from '../utils/offlineErrorLogger';
import { saveMultipleErrorLogs } from '../db/functionHandler';
import mongoose from 'mongoose';

export const startErrorSyncJob = () => {
  // Run every 1 minute
  setInterval(async () => {
    try {
      const errors = await getUnsavedErrors();
      if (errors && errors.length > 0) {
        console.log(`Syncing ${errors.length} offline errors to database...`);
        // Use insertMany to bulk insert offline errors
        await saveMultipleErrorLogs(errors);
        
        // Clear the file only after successful insertion
        await clearErrors();
        console.log('Offline errors successfully synced to database.');
      }
    } catch (err) {
      const isDuplicatesOnly =
        err instanceof mongoose.mongo.MongoBulkWriteError &&
        ([] as mongoose.mongo.WriteError[]).concat(err.writeErrors).every((e) => e.code === 11000)

      if (isDuplicatesOnly) {
        // All failures were duplicates — data is already in DB, safe to clear
        await clearErrors()
        console.log('Offline errors already in DB (duplicates), cleared file.')
      } else {
        console.error('Failed to sync offline errors to DB:', err)
      }
    }
  }, 60000);
};
