/**
 * Creates a Project through the approved Sprint-02 workflow.
 *
 * @param {Object} projectInput Form-supplied Project data.
 * @return {{success: boolean, message: string, data: Object, errors: Array<string>=}} Service result.
 * @throws {Error} When ID generation, folder creation, persistence, or rollback fails.
 */
function createProject(projectInput) {
  var inputValidation = validateProjectInput(projectInput);
  if (!inputValidation.valid) {
    logProjectServiceEvent_('create failure');
    return createFailureResult_('Validation failed.', inputValidation.errors);
  }

  var projectId = generateProjectId();
  var folder = createProjectFolder(projectId, projectInput.projectName);
  var project = buildProject_(projectInput, projectId, folder);

  try {
    var insertedProject = insert(project);
    logProjectServiceEvent_('create success');
    return createSuccessResult_('Project created successfully.', insertedProject);
  } catch (error) {
    rollbackProjectFolder_(folder.folderId);
    logProjectServiceEvent_('create failure');
    throw error;
  }
}

/**
 * Updates a complete Project entity.
 *
 * @param {Object} project ADR-004 Project entity.
 * @return {{success: boolean, message: string, data: Object, errors: Array<string>=}} Service result.
 * @throws {Error} When persistence fails.
 */
function updateProject(project) {
  var entityValidation = validateProject(project);
  if (!entityValidation.valid) {
    return createFailureResult_('Validation failed.', entityValidation.errors);
  }

  var updatedProject = update(project);
  logProjectServiceEvent_('update success');
  return createSuccessResult_('Project updated successfully.', updatedProject);
}

/**
 * Closes a Project by updating its configured terminal status.
 *
 * @param {string} projectId Project business ID.
 * @return {{success: boolean, message: string, data: Object}} Service result.
 * @throws {Error} When the Project does not exist or persistence fails.
 */
function closeProject(projectId) {
  var project = findById(projectId);
  if (project === null) {
    throw new Error('DB001: Project not found.');
  }

  var closedStatus = getClosedProjectStatus_();
  if (project.status === closedStatus) {
    return createSuccessResult_('Project is already closed.', project);
  }

  project.status = closedStatus;
  project.updatedAt = new Date();
  var updatedProject = update(project);
  logProjectServiceEvent_('close success');
  return createSuccessResult_('Project closed successfully.', updatedProject);
}
/**
 * Logically removes a Project through the repository.
 *
 * @param {string} projectId Project business ID.
 * @return {{success: boolean, message: string, data: Object}} Service result.
 * @throws {Error} When persistence fails.
 */
function removeProject(projectId) {
  var removedProject = deleteProject(projectId);
  logProjectServiceEvent_('remove success');
  return createSuccessResult_('Project removed successfully.', removedProject);
}

/**
 * Gets a Project by business ID.
 *
 * @param {string} projectId Project business ID.
 * @return {{success: boolean, message: string, data: Object}} Service result.
 * @throws {Error} When the repository read fails.
 */
function getProject(projectId) {
  return createSuccessResult_('Project retrieved successfully.', findById(projectId));
}

/**
 * Searches Projects by keyword.
 *
 * @param {string} keyword Search keyword.
 * @return {{success: boolean, message: string, data: Array<Object>}} Service result.
 * @throws {Error} When the repository read fails.
 */
function searchProjects(keyword) {
  return createSuccessResult_('Projects retrieved successfully.', search(keyword));
}

/**
 * Checks whether a Project exists.
 *
 * @param {string} projectId Project business ID.
 * @return {{success: boolean, message: string, data: boolean}} Service result.
 * @throws {Error} When the repository read fails.
 */
function projectExists(projectId) {
  return createSuccessResult_('Project existence checked successfully.', exists(projectId));
}

/**
 * Counts all Projects.
 *
 * @return {{success: boolean, message: string, data: number}} Service result.
 * @throws {Error} When the repository read fails.
 */
function countProjects() {
  return createSuccessResult_('Project count retrieved successfully.', count());
}

/**
 * @param {Object} projectInput Form-supplied Project data.
 * @param {string} projectId Generated Project business ID.
 * @param {{folderId: string, folderUrl: string}} folder Created folder details.
 * @return {Object} ADR-004 Project entity.
 * @private
 */
function buildProject_(projectInput, projectId, folder) {
  var createdAt = new Date();
  var updatedAt = new Date();

  return {
    projectId: projectId,
    projectName: projectInput.projectName,
    purpose: projectInput.purpose,
    priority: projectInput.priority,
    status: getDefaultProjectStatus_(),
    owner: projectInput.owner,
    nextAction: projectInput.nextAction,
    deadline: projectInput.deadline,
    projectFolderId: folder.folderId,
    projectFolderUrl: folder.folderUrl,
    createdAt: createdAt,
    updatedAt: updatedAt
  };
}

/**
 * @return {string} Configured default status for new Projects.
 * @throws {Error} When the status configuration is missing.
 * @private
 */
function getDefaultProjectStatus_() {
  if (!CONFIG || !CONFIG.DEFAULTS ||
      typeof CONFIG.DEFAULTS.PROJECT_STATUS !== 'string' ||
      CONFIG.DEFAULTS.PROJECT_STATUS.trim() === '') {
    throw new Error('CFG001: Default Project status is missing.');
  }

  return CONFIG.DEFAULTS.PROJECT_STATUS;
}

/**
 * @return {string} Configured terminal status for closed Projects.
 * @throws {Error} When the status configuration is missing.
 * @private
 */
function getClosedProjectStatus_() {
  if (typeof CONFIG === 'undefined' || !CONFIG.PROJECT_STATUSES ||
      typeof CONFIG.PROJECT_STATUSES.CLOSED !== 'string' ||
      CONFIG.PROJECT_STATUSES.CLOSED.trim() === '') {
    throw new Error('CFG001: Closed Project status is missing.');
  }

  return CONFIG.PROJECT_STATUSES.CLOSED;
}
/**
 * @param {string} folderId Created Project folder ID.
 * @throws {Error} When rollback fails.
 * @private
 */
function rollbackProjectFolder_(folderId) {
  try {
    deleteProjectFolder(folderId);
    logProjectServiceEvent_('rollback success');
  } catch (error) {
    logProjectServiceEvent_('rollback failure');
    throw error;
  }
}

/**
 * @param {string} message Non-sensitive result message.
 * @param {*} data Service result data.
 * @return {{success: boolean, message: string, data: *}} Success result.
 * @private
 */
function createSuccessResult_(message, data) {
  return {
    success: true,
    message: message,
    data: data
  };
}

/**
 * @param {string} message Non-sensitive failure message.
 * @param {Array<string>} errors Validation errors.
 * @return {{success: boolean, message: string, data: Object, errors: Array<string>}} Failure result.
 * @private
 */
function createFailureResult_(message, errors) {
  return {
    success: false,
    message: message,
    data: {},
    errors: errors
  };
}

/**
 * @param {string} event Non-sensitive business event.
 * @private
 */
function logProjectServiceEvent_(event) {
  console.log('ProjectService: ' + event + '.');
}