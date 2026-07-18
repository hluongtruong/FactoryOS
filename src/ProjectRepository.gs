/**
 * Frozen PROJECT object-to-column mapping defined by ADR-004.
 *
 * @const {Array<Object>}
 */
var PROJECT_FIELD_CONFIG = [
  { property: 'projectId', column: CONFIG.PROJECT_COLUMNS.PROJECT_ID },
  { property: 'projectName', column: CONFIG.PROJECT_COLUMNS.PROJECT_NAME },
  { property: 'purpose', column: CONFIG.PROJECT_COLUMNS.PURPOSE },
  { property: 'priority', column: CONFIG.PROJECT_COLUMNS.PRIORITY },
  { property: 'status', column: CONFIG.PROJECT_COLUMNS.STATUS },
  { property: 'owner', column: CONFIG.PROJECT_COLUMNS.OWNER },
  { property: 'nextAction', column: CONFIG.PROJECT_COLUMNS.NEXT_ACTION },
  { property: 'deadline', column: CONFIG.PROJECT_COLUMNS.DEADLINE },
  { property: 'projectFolderId', column: CONFIG.PROJECT_COLUMNS.PROJECT_FOLDER_ID },
  { property: 'projectFolderUrl', column: CONFIG.PROJECT_COLUMNS.PROJECT_FOLDER_URL },
  { property: 'createdAt', column: CONFIG.PROJECT_COLUMNS.CREATED_AT },
  { property: 'updatedAt', column: CONFIG.PROJECT_COLUMNS.UPDATED_AT }
];

/** @const {string} */
var PROJECT_DELETED_STATUS = 'DELETED';

/** @type {?Object<string, number>} */
var PROJECT_COLUMN_CACHE = null;

/**
 * @return {Array<Object>} All normalized Project records.
 */
function findAll() {
  return mapRowsToProjects_(getProjectTable_());
}

/**
 * @param {*} projectId Project ID.
 * @return {?Object} Matching Project, or null when absent.
 */
function findById(projectId) {
  return findProject_(getProjectTable_(), projectId);
}

/**
 * @param {*} projectName Project name.
 * @return {Array<Object>} Matching Projects.
 */
function findByName(projectName) {
  return findProjectsAndLog_(function (project) {
    return project.projectName === projectName;
  });
}

/**
 * @param {*} status Project status.
 * @return {Array<Object>} Matching Projects.
 */
function findByStatus(status) {
  return findProjectsAndLog_(function (project) {
    return project.status === status;
  });
}

/**
 * @param {*} owner Project owner.
 * @return {Array<Object>} Matching Projects.
 */
function findByOwner(owner) {
  return findProjectsAndLog_(function (project) {
    return project.owner === owner;
  });
}

/**
 * Searches PROJECT_ID, PROJECT_NAME, PURPOSE, and OWNER with a
 * case-insensitive partial match.
 *
 * @param {*} keyword Search keyword.
 * @return {Array<Object>} Matching Projects.
 */
function search(keyword) {
  var normalizedKeyword = normalizeSearchValue_(keyword);
  return findProjectsAndLog_(function (project) {
    return containsSearchValue_(project.projectId, normalizedKeyword) ||
      containsSearchValue_(project.projectName, normalizedKeyword) ||
      containsSearchValue_(project.purpose, normalizedKeyword) ||
      containsSearchValue_(project.owner, normalizedKeyword);
  });
}

/**
 * @param {Object} project ADR-004 Project object.
 * @return {Object} Inserted Project.
 * @throws {Error} When the Project ID already exists or the write fails.
 */
function insert(project) {
  assertProjectObjectStructure_(project);
  return executeDatabaseOperation_('Project insert', function () {
    var table = getProjectTable_();
    if (findProject_(table, project.projectId)) {
      throw createDatabaseError_('Duplicate Project ID.');
    }

    table.sheet.getRange(table.lastRow + 1, 1, 1, table.headers.length)
      .setValues([mapProjectToRow_(project, table.columns, table.headers.length)]);
    logRepositoryOperation_('insert');
    return copyProject_(project);
  });
}

/**
 * @param {Object} project ADR-004 Project object.
 * @return {Object} Updated Project.
 * @throws {Error} When the target Project is absent or the write fails.
 */
function update(project) {
  assertProjectObjectStructure_(project);
  return executeDatabaseOperation_('Project update', function () {
    var table = getProjectTable_();
    var rowIndex = findProjectRowIndex_(table, project.projectId);
    if (rowIndex === -1) {
      throw createDatabaseError_('Project update target not found.');
    }

    table.sheet.getRange(rowIndex + 2, 1, 1, table.headers.length)
      .setValues([mapProjectToRow_(project, table.columns, table.headers.length)]);
    logRepositoryOperation_('update');
    return copyProject_(project);
  });
}

/**
 * Logically deletes a Project by setting its STATUS to the PR-06 marker.
 *
 * @param {*} projectId Project ID.
 * @return {Object} Logically deleted Project.
 * @throws {Error} When the target Project is absent or the write fails.
 */
function deleteProject(projectId) {
  return executeDatabaseOperation_('Project delete', function () {
    var table = getProjectTable_();
    var rowIndex = findProjectRowIndex_(table, projectId);
    if (rowIndex === -1) {
      throw createDatabaseError_('Project delete target not found.');
    }

    var statusColumn = table.columns[CONFIG.PROJECT_COLUMNS.STATUS];
    table.sheet.getRange(rowIndex + 2, statusColumn + 1).setValue(PROJECT_DELETED_STATUS);
    var project = mapRowToProject_(table.rows[rowIndex], table.columns);
    project.status = PROJECT_DELETED_STATUS;
    logRepositoryOperation_('delete');
    return project;
  });
}

/**
 * @param {*} projectId Project ID.
 * @return {boolean} Whether the Project exists.
 */
function exists(projectId) {
  return findById(projectId) !== null;
}

/**
 * @return {number} Number of PROJECT records.
 */
function count() {
  return getProjectTable_().rows.length;
}

/**
 * @param {Function} predicate Project predicate.
 * @return {Array<Object>} Matching Projects.
 * @private
 */
function findProjectsAndLog_(predicate) {
  var projects = findProjects_(getProjectTable_(), predicate);
  logRepositoryOperation_('search');
  return projects;
}

/**
 * @return {{sheet: GoogleAppsScript.Spreadsheet.Sheet, headers: Array<*>, columns: Object<string, number>, rows: Array<Array<*>>, lastRow: number}} PROJECT table data.
 * @private
 */
function getProjectTable_() {
  return executeDatabaseOperation_('Project read', function () {
    var sheet = getProjectSheet_();
    var values = sheet.getDataRange().getValues();
    if (values.length === 0) {
      throw createDatabaseError_('PROJECT header row is missing.');
    }

    return {
      sheet: sheet,
      headers: values[0],
      columns: getProjectColumnMap_(values[0]),
      rows: values.slice(1),
      lastRow: values.length
    };
  });
}

/**
 * @return {GoogleAppsScript.Spreadsheet.Sheet} PROJECT sheet.
 * @private
 */
function getProjectSheet_() {
  assertProjectConfiguration_();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PROJECT);
  if (!sheet) {
    throw createDatabaseError_('PROJECT sheet not found.');
  }

  return sheet;
}

/**
 * Returns the cached PROJECT header mapping for this Apps Script runtime.
 *
 * @param {Array<*>} headers PROJECT headers.
 * @return {Object<string, number>} Configured zero-based column indexes.
 * @private
 */
function getProjectColumnMap_(headers) {
  if (PROJECT_COLUMN_CACHE === null) {
    PROJECT_COLUMN_CACHE = createProjectColumnMap_(headers);
  }
  return PROJECT_COLUMN_CACHE;
}

/**
 * @param {Array<*>} headers PROJECT headers.
 * @return {Object<string, number>} Configured zero-based column indexes.
 * @private
 */
function createProjectColumnMap_(headers) {
  var headerIndexes = {};
  var columns = {};

  for (var index = 0; index < headers.length; index++) {
    headerIndexes[headers[index]] = index;
  }

  for (var fieldIndex = 0; fieldIndex < PROJECT_FIELD_CONFIG.length; fieldIndex++) {
    var columnName = PROJECT_FIELD_CONFIG[fieldIndex].column;
    if (!Object.prototype.hasOwnProperty.call(headerIndexes, columnName)) {
      throw createDatabaseError_('Invalid PROJECT header mapping.');
    }
    columns[columnName] = headerIndexes[columnName];
  }

  return columns;
}

/**
 * @param {{rows: Array<Array<*>>, columns: Object<string, number>}} table PROJECT table.
 * @return {Array<Object>} Project objects.
 * @private
 */
function mapRowsToProjects_(table) {
  var projects = [];
  for (var index = 0; index < table.rows.length; index++) {
    projects.push(mapRowToProject_(table.rows[index], table.columns));
  }
  return projects;
}

/**
 * @param {Array<*>} row PROJECT row.
 * @param {Object<string, number>} columns Header mapping.
 * @return {Object} ADR-004 Project object.
 * @private
 */
function mapRowToProject_(row, columns) {
  var project = {};
  for (var index = 0; index < PROJECT_FIELD_CONFIG.length; index++) {
    var field = PROJECT_FIELD_CONFIG[index];
    project[field.property] = row[columns[field.column]];
  }
  return project;
}

/**
 * @param {Object} project ADR-004 Project object.
 * @param {Object<string, number>} columns Header mapping.
 * @param {number} columnCount Number of PROJECT columns.
 * @return {Array<*>} Row values in the actual header order.
 * @private
 */
function mapProjectToRow_(project, columns, columnCount) {
  var row = new Array(columnCount);
  for (var index = 0; index < PROJECT_FIELD_CONFIG.length; index++) {
    var field = PROJECT_FIELD_CONFIG[index];
    row[columns[field.column]] = project[field.property];
  }
  return row;
}

/**
 * @param {{rows: Array<Array<*>>, columns: Object<string, number>}} table PROJECT table.
 * @param {Function} predicate Project predicate.
 * @return {Array<Object>} Matching Projects.
 * @private
 */
function findProjects_(table, predicate) {
  var projects = [];
  for (var index = 0; index < table.rows.length; index++) {
    var project = mapRowToProject_(table.rows[index], table.columns);
    if (predicate(project)) {
      projects.push(project);
    }
  }
  return projects;
}

/**
 * @param {{rows: Array<Array<*>>, columns: Object<string, number>}} table PROJECT table.
 * @param {*} projectId Project ID.
 * @return {?Object} Matching Project, or null when absent.
 * @private
 */
function findProject_(table, projectId) {
  var rowIndex = findProjectRowIndex_(table, projectId);
  return rowIndex === -1 ? null : mapRowToProject_(table.rows[rowIndex], table.columns);
}

/**
 * @param {{rows: Array<Array<*>>, columns: Object<string, number>}} table PROJECT table.
 * @param {*} projectId Project ID.
 * @return {number} Zero-based row index, or -1.
 * @private
 */
function findProjectRowIndex_(table, projectId) {
  var idColumn = table.columns[CONFIG.PROJECT_COLUMNS.PROJECT_ID];
  for (var index = 0; index < table.rows.length; index++) {
    if (table.rows[index][idColumn] === projectId) {
      return index;
    }
  }
  return -1;
}

/**
 * @param {*} value Value to normalize.
 * @return {string} Lowercase search value.
 * @private
 */
function normalizeSearchValue_(value) {
  return value === null || value === undefined ? '' : String(value).toLowerCase();
}

/**
 * @param {*} value Value to search.
 * @param {string} keyword Normalized keyword.
 * @return {boolean} Whether value contains keyword.
 * @private
 */
function containsSearchValue_(value, keyword) {
  return normalizeSearchValue_(value).indexOf(keyword) !== -1;
}

/**
 * @param {Object} project Project object.
 * @throws {Error} When the object does not have the ADR-004 shape.
 * @private
 */
function assertProjectObjectStructure_(project) {
  if (project === null || typeof project !== 'object' || Array.isArray(project)) {
    throw createDatabaseError_('Invalid Project object.');
  }
  for (var index = 0; index < PROJECT_FIELD_CONFIG.length; index++) {
    var property = PROJECT_FIELD_CONFIG[index].property;
    if (!Object.prototype.hasOwnProperty.call(project, property)) {
      throw createDatabaseError_('Invalid Project object.');
    }
  }
}

/**
 * @throws {Error} When ADR-004 Config is unavailable.
 * @private
 */
function assertProjectConfiguration_() {
  if (!CONFIG || !CONFIG.SHEETS || !CONFIG.PROJECT_COLUMNS || !CONFIG.SHEETS.PROJECT) {
    throw createConfigurationError_('PROJECT configuration is missing.');
  }
  for (var index = 0; index < PROJECT_FIELD_CONFIG.length; index++) {
    var column = PROJECT_FIELD_CONFIG[index].column;
    if (typeof column !== 'string' || column === '') {
      throw createConfigurationError_('PROJECT column configuration is missing.');
    }
  }
}

/**
 * @param {Object} project Project object.
 * @return {Object} ADR-004 Project object copy.
 * @private
 */
function copyProject_(project) {
  var copy = {};
  for (var index = 0; index < PROJECT_FIELD_CONFIG.length; index++) {
    var property = PROJECT_FIELD_CONFIG[index].property;
    copy[property] = project[property];
  }
  return copy;
}

/**
 * @param {string} operation Non-sensitive operation name.
 * @private
 */
function logRepositoryOperation_(operation) {
  console.log('ProjectRepository: ' + operation + '.');
}

/**
 * @param {string} operation Operation name.
 * @param {Function} operationFunction Spreadsheet operation.
 * @return {*} Operation result.
 * @private
 */
function executeDatabaseOperation_(operation, operationFunction) {
  try {
    return operationFunction();
  } catch (error) {
    if (isRepositoryError_(error)) {
      throw error;
    }
    logRepositoryOperation_('read failure');
    throw createDatabaseError_(operation + ' failed.');
  }
}

/**
 * @param {Error} error Error to inspect.
 * @return {boolean} Whether error has a FactoryOS code.
 * @private
 */
function isRepositoryError_(error) {
  return error && typeof error.message === 'string' &&
    (error.message.indexOf('CFG001:') === 0 || error.message.indexOf('DB001:') === 0);
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
 * @return {Error} Database error.
 * @private
 */
function createDatabaseError_(message) {
  return new Error('DB001: ' + message);
}
