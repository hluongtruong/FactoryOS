/**
 * Runtime-only cache for SETTINGS values. It is reset when the script runtime
 * ends and is intentionally not backed by CacheService.
 *
 * @type {?Object<string, *>}
 */
var settingsCache = null;

/**
 * Gets a configuration value from the SETTINGS sheet.
 *
 * @param {string} key SETTINGS key to retrieve.
 * @return {*} The configured value.
 * @throws {Error} When the SETTINGS contract is invalid or the key is missing.
 */
function getSetting(key) {
  validateSettingKey_(key);
  var settings = getSettingsCache_();

  if (!Object.prototype.hasOwnProperty.call(settings, key)) {
    throw createSettingsError_('Setting not found: ' + key);
  }

  return settings[key];
}

/**
 * Updates an existing configuration value in the SETTINGS sheet.
 *
 * @param {string} key SETTINGS key to update.
 * @param {*} value New configuration value.
 * @throws {Error} When the SETTINGS contract is invalid or the key is missing.
 */
function setSetting(key, value) {
  validateSettingKey_(key);

  var settingsTable = getSettingsTable_();
  var rowIndex = findSettingRow_(settingsTable.values, settingsTable.columns, key);

  if (rowIndex === -1) {
    throw createSettingsError_('Setting not found: ' + key);
  }

  settingsTable.sheet
    .getRange(rowIndex + 1, settingsTable.columns[CONFIG.SETTINGS_COLUMNS.VALUE] + 1)
    .setValue(value);

  reload();
}

/**
 * Clears the runtime SETTINGS cache. The next read loads current values from
 * the spreadsheet.
 */
function reload() {
  settingsCache = null;
}

/**
 * Gets all configuration values from the SETTINGS sheet as a key-value map.
 *
 * @return {Object<string, *>} SETTINGS values indexed by key.
 * @throws {Error} When the SETTINGS sheet or its required headers are invalid.
 */
function getAllSettings() {
  return copySettings_(getSettingsCache_());
}

/**
 * @return {Object<string, *>} Cached SETTINGS values.
 * @private
 */
function getSettingsCache_() {
  if (settingsCache === null) {
    settingsCache = loadSettings_();
  }

  return settingsCache;
}

/**
 * Reads and validates all SETTINGS values from the spreadsheet.
 *
 * @return {Object<string, *>} SETTINGS values indexed by key.
 * @private
 */
function loadSettings_() {
  var settingsTable = getSettingsTable_();
  var settings = {};
  var keyColumn = settingsTable.columns[CONFIG.SETTINGS_COLUMNS.KEY];
  var valueColumn = settingsTable.columns[CONFIG.SETTINGS_COLUMNS.VALUE];

  for (var rowIndex = 1; rowIndex < settingsTable.values.length; rowIndex++) {
    var key = settingsTable.values[rowIndex][keyColumn];

    if (key === '') {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(settings, key)) {
      throw createSettingsError_('Duplicate setting key: ' + key);
    }

    settings[key] = settingsTable.values[rowIndex][valueColumn];
  }

  return settings;
}

/**
 * @param {Object<string, *>} settings SETTINGS values to copy.
 * @return {Object<string, *>} Copy of SETTINGS values.
 * @private
 */
function copySettings_(settings) {
  var copy = {};

  for (var key in settings) {
    if (Object.prototype.hasOwnProperty.call(settings, key)) {
      copy[key] = settings[key];
    }
  }

  return copy;
}

/**
 * @return {{sheet: GoogleAppsScript.Spreadsheet.Sheet, values: Array<Array<*>>, columns: Object<string, number>}}
 * @private
 */
function getSettingsTable_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAMES.SETTINGS);

  if (!sheet) {
    throw createSettingsError_(CONFIG.SHEET_NAMES.SETTINGS + ' sheet not found.');
  }

  var values = sheet.getDataRange().getValues();
  if (values.length === 0) {
    throw createSettingsError_(CONFIG.SHEET_NAMES.SETTINGS + ' sheet is empty.');
  }

  return {
    sheet: sheet,
    values: values,
    columns: getSettingsColumnMap_(values[0])
  };
}

/**
 * @param {Array<*>} headers SETTINGS header row.
 * @return {Object<string, number>} Zero-based column indexes by header name.
 * @private
 */
function getSettingsColumnMap_(headers) {
  var columns = {};

  for (var columnIndex = 0; columnIndex < headers.length; columnIndex++) {
    columns[headers[columnIndex]] = columnIndex;
  }

  var requiredColumns = CONFIG.SETTINGS_COLUMNS;
  for (var columnName in requiredColumns) {
    if (!Object.prototype.hasOwnProperty.call(requiredColumns, columnName)) {
      continue;
    }

    var header = requiredColumns[columnName];
    if (!Object.prototype.hasOwnProperty.call(columns, header)) {
      throw createSettingsError_('Missing SETTINGS header: ' + header);
    }
  }

  return columns;
}

/**
 * @param {Array<Array<*>>} values SETTINGS sheet values including the header row.
 * @param {Object<string, number>} columns Zero-based column indexes by header name.
 * @param {string} key SETTINGS key to find.
 * @return {number} Zero-based row index, or -1 when not found.
 * @private
 */
function findSettingRow_(values, columns, key) {
  var keyColumn = columns[CONFIG.SETTINGS_COLUMNS.KEY];

  for (var rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (values[rowIndex][keyColumn] === key) {
      return rowIndex;
    }
  }

  return -1;
}

/**
 * @param {string} key SETTINGS key to validate.
 * @throws {Error} When the key is empty or not declared in Config.
 * @private
 */
function validateSettingKey_(key) {
  if (typeof key !== 'string' || key.trim() === '') {
    throw createSettingsError_('Setting key is required.');
  }

  if (!Object.prototype.hasOwnProperty.call(CONFIG.SETTINGS_KEYS, key)) {
    throw createSettingsError_('Invalid setting key: ' + key);
  }
}

/**
 * @param {string} message Error detail.
 * @return {Error} Configuration error.
 * @private
 */
function createSettingsError_(message) {
  return new Error(CONFIG.ERROR_CODES.CONFIGURATION + ': ' + message);
}
