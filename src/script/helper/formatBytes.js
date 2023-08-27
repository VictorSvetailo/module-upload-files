//The function named bytesToSize is used to convert the amount of
// bytes into a more human-readable string representing the size
// of a file or data in units of measurement such as "KB", "MB", "GB", "TB", etc.
export function formatBytes(bytes) {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
   if (!bytes) {
      return '0 Byte'
   }
   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}
