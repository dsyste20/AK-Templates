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
  // Extract file extension and sanitize separately
  const lastDotIndex = fileName.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
  const extension = lastDotIndex > 0 ? fileName.slice(lastDotIndex) : '';
  // Sanitize base name more strictly - only allow alphanumeric, underscore, and hyphen
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
  // Only allow common image extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const sanitizedExtension = allowedExtensions.includes(extension.toLowerCase()) ? extension.toLowerCase() : '.png';
  return `${userId}/${folder}/${timestamp}-${sanitizedBaseName}${sanitizedExtension}`;
}
