import { supabase } from './supabaseClient';

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - The storage bucket name (e.g., 'assets')
 * @param {string} path - The path within the bucket (e.g., 'logos/user123/logo.png')
 * @param {File} file - The file to upload
 * @returns {Promise<{url: string|null, error: Error|null}>}
 */
export async function uploadToStorage(bucket, path, file) {
  try {
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    return { url: null, error };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The path to the file to delete
 * @returns {Promise<{error: Error|null}>}
 */
export async function deleteFromStorage(bucket, path) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    return { error };
  } catch (error) {
    return { error };
  }
}

/**
 * Generate a unique file path for uploads
 * @param {string} userId - The user's ID
 * @param {string} folder - The folder name (e.g., 'logos', 'backgrounds')
 * @param {string} fileName - The original file name
 * @returns {string} A unique file path
 */
export function generateFilePath(userId, folder, fileName) {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${folder}/${timestamp}-${sanitizedFileName}`;
}
