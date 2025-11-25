import { supabase } from './supabaseClient';

// Validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

/**
 * Validates a file before upload
 * @param {File} file - The file to validate
 * @throws {Error} If file is invalid
 */
function validateFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds maximum allowed size of 5MB');
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('File type not allowed. Only PNG, JPG, JPEG, and WebP images are accepted');
  }
}

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - The storage bucket name (e.g., 'assets')
 * @param {string} path - The path within the bucket (e.g., 'logos/user123/logo.png')
 * @param {File} file - The file to upload
 * @returns {Promise<{url: string|null, error: Error|null}>}
 * @throws {Error} If file validation fails or upload fails
 */
export async function uploadToStorage(bucket, path, file) {
  try {
    // Validate file before upload
    validateFile(file);

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
  // Sanitize userId to prevent path traversal - only allow alphanumeric, underscore, and hyphen
  const sanitizedUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '_');
  // Extract file extension and sanitize separately (handle dotfiles by finding last dot after position 0)
  const lastDotIndex = fileName.lastIndexOf('.');
  const hasValidExtension = lastDotIndex > 0;
  const baseName = hasValidExtension ? fileName.slice(0, lastDotIndex) : fileName;
  const extension = hasValidExtension ? fileName.slice(lastDotIndex) : '';
  // Sanitize base name more strictly - only allow alphanumeric, underscore, and hyphen
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50) || 'file';
  // Only allow common image extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const sanitizedExtension = allowedExtensions.includes(extension.toLowerCase()) ? extension.toLowerCase() : '';
  // Use timestamp-based unique name if no valid extension
  const finalFileName = sanitizedExtension ? `${sanitizedBaseName}${sanitizedExtension}` : sanitizedBaseName;
  return `${sanitizedUserId}/${folder}/${timestamp}-${finalFileName}`;
}
