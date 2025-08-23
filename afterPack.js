exports.default = async function(context) {
  const fs = require('fs').promises;
  const path = require('path');
  const sandboxPath = path.join(context.appOutDir, 'chrome-sandbox');
  try {
    await fs.chown(sandboxPath, 0, 0); // Set owner to root:root
    await fs.chmod(sandboxPath, 0o4755); // Set permissions to 4755
  } catch (error) {
    console.warn('Failed to set chrome-sandbox permissions:', error.message);
  }
};