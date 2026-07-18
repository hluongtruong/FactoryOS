/**
 * ID formatting and SETTINGS key mappings defined by PR-04.
 *
 * @const {Object}
 */
var ID_TYPE_CONFIG = {
  PROJECT: {
    prefixKey: CONFIG.SETTINGS_KEYS.PROJECT_PREFIX,
    sequenceKey: CONFIG.SETTINGS_KEYS.CURRENT_PROJECT_NO,
    digits: 3,
    usesYear: true
  },
  TASK: {
    prefixKey: CONFIG.SETTINGS_KEYS.TASK_PREFIX,
    sequenceKey: CONFIG.SETTINGS_KEYS.CURRENT_TASK_NO,
    digits: 6,
    usesYear: false
  },
  INBOX: {
    prefixKey: CONFIG.SETTINGS_KEYS.INBOX_PREFIX,
    sequenceKey: CONFIG.SETTINGS_KEYS.CURRENT_INBOX_NO,
    digits: 6,
    usesYear: false
  },
  KNOWLEDGE: {
    prefixKey: CONFIG.SETTINGS_KEYS.KNOWLEDGE_PREFIX,
    sequenceKey: CONFIG.SETTINGS_KEYS.CURRENT_KNOWLEDGE_NO,
    digits: 6,
    usesYear: false
  }
};

/**
 * Lock wait time used to serialize SETTINGS sequence updates.
 *
 * @const {number}
 */
var ID_SERVICE_LOCK_TIMEOUT_MS = 30000;

/**
 * Generates and persists the next Project ID.
 *
 * @return {string} Next Project ID in the configured PRJ-YYYY-NNN format.
 * @throws {Error} When required configuration is invalid or unavailable.
 */
function nextProjectId() {
  return generateNextId_(ID_TYPE_CONFIG.PROJECT);
}

/**
 * Generates and persists the next Task ID.
 *
 * @return {string} Next Task ID in the configured prefix-NNNNNN format.
 * @throws {Error} When required configuration is invalid or unavailable.
 */
function nextTaskId() {
  return generateNextId_(ID_TYPE_CONFIG.TASK);
}

/**
 * Generates and persists the next Inbox ID.
 *
 * @return {string} Next Inbox ID in the configured prefix-NNNNNN format.
 * @throws {Error} When required configuration is invalid or unavailable.
 */
function nextInboxId() {
  return generateNextId_(ID_TYPE_CONFIG.INBOX);
}

/**
 * Generates and persists the next Knowledge ID.
 *
 * @return {string} Next Knowledge ID in the configured prefix-NNNNNN format.
 * @throws {Error} When required configuration is invalid or unavailable.
 */
function nextKnowledgeId() {
  return generateNextId_(ID_TYPE_CONFIG.KNOWLEDGE);
}

/**
 * Returns the next Project ID without updating SETTINGS.
 *
 * @return {string} Next Project ID preview.
 * @throws {Error} When required configuration is invalid or unavailable.
 */
function peekProjectId() {
  return peekId_(ID_TYPE_CONFIG.PROJECT);
}

/**
 * Returns the next Task ID without updating SETTINGS.
 *
 * @return {string} Next Task ID preview.
 * @throws {Error} When required configuration is invalid or unavailable.
 */
function peekTaskId() {
  return peekId_(ID_TYPE_CONFIG.TASK);
}

/**
 * Returns the next Inbox ID without updating SETTINGS.
 *
 * @return {string} Next Inbox ID preview.
 * @throws {Error} When required configuration is invalid or unavailable.
 */
function peekInboxId() {
  return peekId_(ID_TYPE_CONFIG.INBOX);
}

/**
 * Returns the next Knowledge ID without updating SETTINGS.
 *
 * @return {string} Next Knowledge ID preview.
 * @throws {Error} When required configuration is invalid or unavailable.
 */
function peekKnowledgeId() {
  return peekId_(ID_TYPE_CONFIG.KNOWLEDGE);
}

/**
 * Formats a numeric sequence with a configurable prefix and zero-padding.
 *
 * @param {string} prefix ID prefix.
 * @param {number} number Sequence number.
 * @param {number} digits Required digit width.
 * @return {string} Formatted ID.
 * @throws {Error} When a formatting argument is invalid.
 */
function formatId(prefix, number, digits) {
  validatePrefix_(prefix);
  validateSequence_(number);
  validateDigits_(digits);

  return prefix + '-' + padNumber_(number, digits);
}

/**
 * Resets the Project sequence for a supplied project year.
 *
 * @param {number} year Project year to store in SETTINGS.
 * @return {boolean} True when both SETTINGS values are updated.
 * @throws {Error} When the year or SETTINGS update is invalid.
 */
function resetYear(year) {
  validateYear_(year);

  return withSettingsLock_(function () {
    reload();

    var previousYear = getSetting(CONFIG.SETTINGS_KEYS.PROJECT_CURRENT_YEAR);
    var previousSequence = getSetting(CONFIG.SETTINGS_KEYS.CURRENT_PROJECT_NO);
    validateYear_(previousYear);
    validateSequence_(previousSequence);

    var yearUpdated = false;
    try {
      setSetting(CONFIG.SETTINGS_KEYS.PROJECT_CURRENT_YEAR, year);
      yearUpdated = true;
      setSetting(CONFIG.SETTINGS_KEYS.CURRENT_PROJECT_NO, 0);
      return true;
    } catch (error) {
      if (yearUpdated) {
        restoreProjectSettings_(previousYear, previousSequence);
      }

      throw error;
    }
  });
}

/**
 * @param {Object} idConfig ID type configuration.
 * @return {string} Persisted next ID.
 * @private
 */
function generateNextId_(idConfig) {
  return withSettingsLock_(function () {
    reload();

    var sequence = getSequence_(idConfig.sequenceKey);
    var nextSequence = sequence + 1;
    setSetting(idConfig.sequenceKey, nextSequence);

    return buildId_(idConfig, nextSequence);
  });
}

/**
 * @param {Object} idConfig ID type configuration.
 * @return {string} Next ID preview.
 * @private
 */
function peekId_(idConfig) {
  reload();
  return buildId_(idConfig, getSequence_(idConfig.sequenceKey) + 1);
}

/**
 * @param {Object} idConfig ID type configuration.
 * @param {number} sequence Sequence number to format.
 * @return {string} Formatted business ID.
 * @private
 */
function buildId_(idConfig, sequence) {
  var prefix = getSetting(idConfig.prefixKey);
  validatePrefix_(prefix);
  validateSequence_(sequence);

  if (idConfig.usesYear) {
    var year = getSetting(CONFIG.SETTINGS_KEYS.PROJECT_CURRENT_YEAR);
    validateYear_(year);
    return formatId(prefix + '-' + year, sequence, idConfig.digits);
  }

  return formatId(prefix, sequence, idConfig.digits);
}

/**
 * @param {string} sequenceKey SETTINGS key holding the current sequence.
 * @return {number} Current sequence.
 * @private
 */
function getSequence_(sequenceKey) {
  var sequence = getSetting(sequenceKey);
  validateSequence_(sequence);
  return sequence;
}

/**
 * @param {Function} operation Operation that requires exclusive SETTINGS access.
 * @return {*} Operation result.
 * @private
 */
function withSettingsLock_(operation) {
  var lock = LockService.getScriptLock();
  var acquired = false;

  try {
    acquired = lock.tryLock(ID_SERVICE_LOCK_TIMEOUT_MS);
    if (!acquired) {
      throw createIdError_('Unable to acquire the ID generation lock.');
    }

    return operation();
  } finally {
    if (acquired) {
      lock.releaseLock();
    }
  }
}

/**
 * @param {*} prefix Configured prefix.
 * @throws {Error} When the prefix is invalid.
 * @private
 */
function validatePrefix_(prefix) {
  if (typeof prefix !== 'string' || prefix.trim() === '') {
    throw createIdError_('ID prefix is required.');
  }
}

/**
 * @param {*} sequence Configured or generated sequence.
 * @throws {Error} When the sequence is invalid.
 * @private
 */
function validateSequence_(sequence) {
  if (typeof sequence !== 'number' || !isFinite(sequence) ||
      Math.floor(sequence) !== sequence || sequence < 0) {
    throw createIdError_('ID sequence must be a non-negative integer.');
  }
}

/**
 * @param {*} year Configured project year.
 * @throws {Error} When the year is invalid.
 * @private
 */
function validateYear_(year) {
  if (typeof year !== 'number' || !isFinite(year) ||
      Math.floor(year) !== year || year < 1000 || year > 9999) {
    throw createIdError_('Project year must be a four-digit integer.');
  }
}

/**
 * @param {*} digits Required padding width.
 * @throws {Error} When the digit width is invalid.
 * @private
 */
function validateDigits_(digits) {
  if (typeof digits !== 'number' || !isFinite(digits) ||
      Math.floor(digits) !== digits || digits < 1) {
    throw createIdError_('ID digit width must be a positive integer.');
  }
}

/**
 * @param {number} number Number to pad.
 * @param {number} digits Minimum digit width.
 * @return {string} Zero-padded number.
 * @private
 */
function padNumber_(number, digits) {
  var value = String(number);

  while (value.length < digits) {
    value = '0' + value;
  }

  return value;
}

/**
 * Restores Project SETTINGS after a failed reset operation.
 *
 * @param {number} year Previous project year.
 * @param {number} sequence Previous project sequence.
 * @throws {Error} When compensation cannot restore SETTINGS.
 * @private
 */
function restoreProjectSettings_(year, sequence) {
  try {
    setSetting(CONFIG.SETTINGS_KEYS.PROJECT_CURRENT_YEAR, year);
    setSetting(CONFIG.SETTINGS_KEYS.CURRENT_PROJECT_NO, sequence);
  } catch (error) {
    throw createIdError_('Failed to restore Project SETTINGS after reset failure.');
  }
}

/**
 * @param {string} message Error detail.
 * @return {Error} Configuration error.
 * @private
 */
function createIdError_(message) {
  return new Error(CONFIG.ERROR_CODES.CONFIGURATION + ': ' + message);
}
