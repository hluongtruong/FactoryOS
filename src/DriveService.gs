/**
 * Gets the configured FactoryOS root folder.
 *
 * @return {GoogleAppsScript.Drive.Folder} Root folder.
 * @throws {Error} When configuration is missing or the folder is unavailable.
 */
function getRootFolder() {
  var rootFolderId = getRequiredSetting_(CONFIG.SETTINGS_KEYS.DRIVE_ROOT_FOLDER_ID);
  return getFolder_(rootFolderId, 'Root folder');
}

/**
 * Gets a Google Drive folder by ID.
 *
 * @param {string} folderId Folder ID.
 * @return {GoogleAppsScript.Drive.Folder} Folder.
 * @throws {Error} When the folder ID is invalid or unavailable.
 */
function getFolder(folderId) {
  return getFolder_(folderId, 'Folder');
}

/**
 * Creates a folder inside the configured FactoryOS root hierarchy.
 *
 * @param {string} parentFolderId Parent folder ID.
 * @param {string} folderName New folder name.
 * @return {GoogleAppsScript.Drive.Folder} Created folder.
 * @throws {Error} When the parent or name is invalid, or creation fails.
 */
function createFolder(parentFolderId, folderName) {
  return executeDriveOperation_('Folder creation', function () {
    validateName_(folderName, 'Folder name');
    var parentFolder = getFolder_(parentFolderId, 'Parent folder');
    ensureFolderWithinRoot_(parentFolder);
    var folder = parentFolder.createFolder(folderName);
    logDriveOperation_('folder created');
    return folder;
  });
}

/**
 * Finds a named folder inside a parent folder in the FactoryOS root hierarchy.
 *
 * @param {string} parentFolderId Parent folder ID.
 * @param {string} folderName Folder name to find.
 * @return {GoogleAppsScript.Drive.Folder} Matching folder.
 * @throws {Error} When the parent is invalid or no matching folder exists.
 */
function findFolder(parentFolderId, folderName) {
  return executeDriveOperation_('Folder lookup', function () {
    validateName_(folderName, 'Folder name');
    var parentFolder = getFolder_(parentFolderId, 'Parent folder');
    ensureFolderWithinRoot_(parentFolder);
    var folders = parentFolder.getFoldersByName(folderName);

    if (!folders.hasNext()) {
      throw createDriveError_('Folder not found.');
    }

    return folders.next();
  });
}

/**
 * Copies the configured Template Folder into the configured root folder and
 * renames the copy using the supplied Project ID and Project name.
 *
 * @param {string} projectId Project business ID.
 * @param {string} projectName Project name.
 * @return {string} Created project folder ID.
 * @throws {Error} When configuration is missing or the folder copy fails.
 */
function createProjectFolder(projectId, projectName) {
  return executeDriveOperation_('Project folder creation', function () {
    validateName_(projectId, 'Project ID');
    validateName_(projectName, 'Project name');

    var rootFolder = getRootFolder();
    var templateFolderId = getRequiredSetting_(CONFIG.SETTINGS_KEYS.TEMPLATE_FOLDER_ID);
    var templateFolder = getFolder_(templateFolderId, 'Template folder');
    var folderName = projectId + '_' + projectName;
    var projectFolder = copyFolder_(templateFolder, rootFolder, folderName);

    logDriveOperation_('project folder created');
    return projectFolder.getId();
  });
}

/**
 * Moves a project folder to trash for a failed project-creation rollback.
 *
 * @param {string} folderId Project folder ID.
 * @return {boolean} True when the folder has been moved to trash.
 * @throws {Error} When the folder ID is invalid, unavailable, or cannot be trashed.
 */
function deleteProjectFolder(folderId) {
  return executeDriveOperation_('Project folder rollback', function () {
    var folder = getFolder_(folderId, 'Project folder');
    ensureFolderWithinRoot_(folder);

    if (folder.isTrashed()) {
      throw createDriveError_('Project folder not found.');
    }

    folder.setTrashed(true);
    logDriveOperation_('project folder rollback success');
    return true;
  });
}

/**
 * Copies a Template Folder into a destination folder in the FactoryOS root
 * hierarchy.
 *
 * @param {string} templateId Template Folder ID.
 * @param {string} destinationFolderId Destination folder ID.
 * @return {string} Copied folder ID.
 * @throws {Error} When either folder is unavailable or the copy fails.
 */
function copyTemplate(templateId, destinationFolderId) {
  return executeDriveOperation_('Template folder copy', function () {
    var templateFolder = getFolder_(templateId, 'Template folder');
    ensureFolderWithinTemplateFolder_(templateFolder);
    var destinationFolder = getFolder_(destinationFolderId, 'Destination folder');
    ensureFolderWithinRoot_(destinationFolder);
    var copiedFolder = copyFolder_(templateFolder, destinationFolder, templateFolder.getName());

    logDriveOperation_('template folder copied');
    return copiedFolder.getId();
  });
}

/**
 * Creates a file in a folder within the configured FactoryOS root hierarchy.
 *
 * @param {string} folderId Destination folder ID.
 * @param {string} fileName New file name.
 * @param {string|BlobSource} content File content.
 * @return {GoogleAppsScript.Drive.File} Created file.
 * @throws {Error} When the destination, name, or creation request is invalid.
 */
function createFile(folderId, fileName, content) {
  return executeDriveOperation_('File creation', function () {
    validateName_(fileName, 'File name');
    var folder = getFolder_(folderId, 'Destination folder');
    ensureFolderWithinRoot_(folder);
    var file = folder.createFile(fileName, content);

    logDriveOperation_('file created');
    return file;
  });
}

/**
 * Moves a file to a folder within the configured FactoryOS root hierarchy.
 *
 * @param {string} fileId File ID.
 * @param {string} destinationFolderId Destination folder ID.
 * @return {GoogleAppsScript.Drive.File} Moved file.
 * @throws {Error} When the file or destination is unavailable.
 */
function moveFile(fileId, destinationFolderId) {
  return executeDriveOperation_('File move', function () {
    var file = getFile_(fileId, 'File');
    var destinationFolder = getFolder_(destinationFolderId, 'Destination folder');
    ensureFileWithinRoot_(file);
    ensureFolderWithinRoot_(destinationFolder);
    var movedFile = file.moveTo(destinationFolder);

    logDriveOperation_('file moved');
    return movedFile;
  });
}

/**
 * Renames a file within the configured FactoryOS root hierarchy.
 *
 * @param {string} fileId File ID.
 * @param {string} newName New file name.
 * @return {GoogleAppsScript.Drive.File} Renamed file.
 * @throws {Error} When the file or name is invalid.
 */
function renameFile(fileId, newName) {
  return executeDriveOperation_('File rename', function () {
    validateName_(newName, 'File name');
    var file = getFile_(fileId, 'File');
    ensureFileWithinRoot_(file);
    var renamedFile = file.setName(newName);

    logDriveOperation_('file renamed');
    return renamedFile;
  });
}

/**
 * Soft-deletes a file within the configured FactoryOS root hierarchy.
 *
 * @param {string} fileId File ID.
 * @return {GoogleAppsScript.Drive.File} Trashed file.
 * @throws {Error} When the file is unavailable or cannot be trashed.
 */
function deleteFile(fileId) {
  return executeDriveOperation_('File deletion', function () {
    var file = getFile_(fileId, 'File');
    ensureFileWithinRoot_(file);
    var trashedFile = file.setTrashed(true);

    logDriveOperation_('file soft-deleted');
    return trashedFile;
  });
}

/**
 * Gets a Google Drive file by ID.
 *
 * @param {string} fileId File ID.
 * @return {GoogleAppsScript.Drive.File} File.
 * @throws {Error} When the file ID is invalid or unavailable.
 */
function getFile(fileId) {
  return getFile_(fileId, 'File');
}

/**
 * Gets serializable metadata for a Google Drive folder.
 *
 * @param {string} folderId Folder ID.
 * @return {{id: string, name: string, url: string, parentIds: Array<string>}} Folder metadata.
 * @throws {Error} When the folder is unavailable.
 */
function getFolderInfo(folderId) {
  return executeDriveOperation_('Folder metadata retrieval', function () {
    var folder = getFolder_(folderId, 'Folder');
    return {
      id: folder.getId(),
      name: folder.getName(),
      url: folder.getUrl(),
      parentIds: getParentIds_(folder)
    };
  });
}

/**
 * Checks whether a file can be accessed by ID.
 *
 * @param {string} fileId File ID.
 * @return {boolean} True when the file exists and is accessible.
 */
function fileExists(fileId) {
  if (!isNonEmptyString_(fileId)) {
    return false;
  }

  try {
    DriveApp.getFileById(fileId);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks whether a folder can be accessed by ID.
 *
 * @param {string} folderId Folder ID.
 * @return {boolean} True when the folder exists and is accessible.
 */
function folderExists(folderId) {
  if (!isNonEmptyString_(folderId)) {
    return false;
  }

  try {
    DriveApp.getFolderById(folderId);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * @param {GoogleAppsScript.Drive.Folder} sourceFolder Source folder.
 * @param {GoogleAppsScript.Drive.Folder} destinationFolder Destination folder.
 * @param {string} copiedName Name for the copied folder.
 * @return {GoogleAppsScript.Drive.Folder} Copied folder.
 * @private
 */
function copyFolder_(sourceFolder, destinationFolder, copiedName) {
  var copiedFolder = destinationFolder.createFolder(copiedName);
  var files = sourceFolder.getFiles();

  while (files.hasNext()) {
    var file = files.next();
    file.makeCopy(file.getName(), copiedFolder);
  }

  var folders = sourceFolder.getFolders();
  while (folders.hasNext()) {
    var childFolder = folders.next();
    copyFolder_(childFolder, copiedFolder, childFolder.getName());
  }

  return copiedFolder;
}

/**
 * @param {GoogleAppsScript.Drive.Folder} folder Folder to validate.
 * @throws {Error} When the folder is outside the configured root hierarchy.
 * @private
 */
function ensureFolderWithinRoot_(folder) {
  if (!isItemWithinRoot_(folder)) {
    throw createDriveError_('Folder is outside the configured root folder.');
  }
}

/**
 * @param {GoogleAppsScript.Drive.File} file File to validate.
 * @throws {Error} When the file is outside the configured root hierarchy.
 * @private
 */
function ensureFileWithinRoot_(file) {
  if (!isItemWithinRoot_(file)) {
    throw createDriveError_('File is outside the configured root folder.');
  }
}

/**
 * @param {GoogleAppsScript.Drive.Folder} folder Template folder to validate.
 * @throws {Error} When the folder is outside the configured Template Folder.
 * @private
 */
function ensureFolderWithinTemplateFolder_(folder) {
  var templateRootId = getRequiredSetting_(CONFIG.SETTINGS_KEYS.TEMPLATE_FOLDER_ID);

  if (!isItemWithinFolder_(folder, templateRootId)) {
    throw createDriveError_('Folder is outside the configured Template Folder.');
  }
}

/**
 * @param {GoogleAppsScript.Drive.File|GoogleAppsScript.Drive.Folder} item Drive item.
 * @return {boolean} Whether the item belongs to the configured root hierarchy.
 * @private
 */
function isItemWithinRoot_(item) {
  return isItemWithinFolder_(item, getRootFolder().getId());
}

/**
 * @param {GoogleAppsScript.Drive.File|GoogleAppsScript.Drive.Folder} item Drive item.
 * @param {string} ancestorFolderId Required ancestor folder ID.
 * @return {boolean} Whether the item belongs to the ancestor folder hierarchy.
 * @private
 */
function isItemWithinFolder_(item, ancestorFolderId) {
  var pendingItems = [item];
  var visitedIds = {};

  while (pendingItems.length > 0) {
    var currentItem = pendingItems.pop();
    var currentId = currentItem.getId();

    if (currentId === ancestorFolderId) {
      return true;
    }

    if (visitedIds[currentId]) {
      continue;
    }

    visitedIds[currentId] = true;
    var parents = currentItem.getParents();
    while (parents.hasNext()) {
      pendingItems.push(parents.next());
    }
  }

  return false;
}

/**
 * @param {GoogleAppsScript.Drive.Folder} folder Folder.
 * @return {Array<string>} Parent folder IDs.
 * @private
 */
function getParentIds_(folder) {
  var parentIds = [];
  var parents = folder.getParents();

  while (parents.hasNext()) {
    parentIds.push(parents.next().getId());
  }

  return parentIds;
}

/**
 * @param {string} settingKey SETTINGS key.
 * @return {string} Required configured value.
 * @throws {Error} When the setting is missing or empty.
 * @private
 */
function getRequiredSetting_(settingKey) {
  var value = getSetting(settingKey);

  if (!isNonEmptyString_(value)) {
    throw createConfigurationError_('Required Drive configuration is missing.');
  }

  return value;
}

/**
 * @param {string} folderId Folder ID.
 * @param {string} label Item label for error messages.
 * @return {GoogleAppsScript.Drive.Folder} Folder.
 * @private
 */
function getFolder_(folderId, label) {
  validateDriveId_(folderId, label);

  return executeDriveOperation_(label + ' retrieval', function () {
    return DriveApp.getFolderById(folderId);
  });
}

/**
 * @param {string} fileId File ID.
 * @param {string} label Item label for error messages.
 * @return {GoogleAppsScript.Drive.File} File.
 * @private
 */
function getFile_(fileId, label) {
  validateDriveId_(fileId, label);

  return executeDriveOperation_(label + ' retrieval', function () {
    return DriveApp.getFileById(fileId);
  });
}

/**
 * @param {*} value Identifier to validate.
 * @param {string} label Item label for error messages.
 * @throws {Error} When the identifier is invalid.
 * @private
 */
function validateDriveId_(value, label) {
  if (!isNonEmptyString_(value)) {
    throw createDriveError_(label + ' ID is required.');
  }
}

/**
 * @param {*} value Name to validate.
 * @param {string} label Name label for error messages.
 * @throws {Error} When the name is invalid.
 * @private
 */
function validateName_(value, label) {
  if (!isNonEmptyString_(value)) {
    throw createDriveError_(label + ' is required.');
  }
}

/**
 * @param {*} value Value to test.
 * @return {boolean} Whether the value is a non-empty string.
 * @private
 */
function isNonEmptyString_(value) {
  return typeof value === 'string' && value.trim() !== '';
}

/**
 * @param {string} operation Operation label.
 * @param {Function} operationFunction Drive operation.
 * @return {*} Operation result.
 * @private
 */
function executeDriveOperation_(operation, operationFunction) {
  try {
    return operationFunction();
  } catch (error) {
    if (isFactoryOsError_(error)) {
      throw error;
    }

    throw createDriveError_(operation + ' failed.');
  }
}

/**
 * @param {Error} error Error to inspect.
 * @return {boolean} Whether the error already uses a FactoryOS code.
 * @private
 */
function isFactoryOsError_(error) {
  return error && typeof error.message === 'string' &&
    (error.message.indexOf('CFG001:') === 0 || error.message.indexOf('DRV001:') === 0);
}

/**
 * @param {string} operation Non-sensitive operation description.
 * @private
 */
function logDriveOperation_(operation) {
  console.log('DriveService: ' + operation + '.');
}

/**
 * @param {string} message Error detail.
 * @return {Error} Configuration error.
 * @private
 */
function createConfigurationError_(message) {
  return new Error(CONFIG.ERROR_CODES.CONFIGURATION + ': ' + message);
}

/**
 * @param {string} message Error detail.
 * @return {Error} Drive error.
 * @private
 */
function createDriveError_(message) {
  return new Error('DRV001: ' + message);
}
