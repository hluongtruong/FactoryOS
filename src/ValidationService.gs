/**
 * Required form-input fields defined by PR-03B.
 *
 * @const {Array<string>}
 */
var PROJECT_INPUT_REQUIRED_FIELDS = [
  'projectName',
  'purpose'
];

/**
 * Required Project entity fields defined by ADR-004 and PR-03B.
 *
 * @const {Array<string>}
 */
var PROJECT_ENTITY_REQUIRED_FIELDS = [
  'projectId',
  'projectName',
  'purpose',
  'status',
  'projectFolderId',
  'projectFolderUrl',
  'createdAt',
  'updatedAt'
];

/**
 * Validates that a value is present.
 *
 * @param {*} value Value to validate.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateRequired(value, fieldName) {
  if (isEmptyValue_(value)) {
    return createInvalidResult_(getFieldName_(fieldName) + ' is required.');
  }

  return createValidResult_();
}

/**
 * Validates that a value is empty.
 *
 * @param {*} value Value to validate.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateEmpty(value, fieldName) {
  if (!isEmptyValue_(value)) {
    return createInvalidResult_(getFieldName_(fieldName) + ' must be empty.');
  }

  return createValidResult_();
}

/**
 * Validates that a value is a string.
 *
 * @param {*} value Value to validate.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateString(value, fieldName) {
  if (typeof value !== 'string') {
    return createInvalidResult_(getFieldName_(fieldName) + ' must be a string.');
  }

  return createValidResult_();
}

/**
 * Validates that a value is a finite number.
 *
 * @param {*} value Value to validate.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateNumber(value, fieldName) {
  if (typeof value !== 'number' || !isFinite(value)) {
    return createInvalidResult_(getFieldName_(fieldName) + ' must be a number.');
  }

  return createValidResult_();
}

/**
 * Validates that a value is an integer.
 *
 * @param {*} value Value to validate.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateInteger(value, fieldName) {
  if (typeof value !== 'number' || !isFinite(value) || Math.floor(value) !== value) {
    return createInvalidResult_(getFieldName_(fieldName) + ' must be an integer.');
  }

  return createValidResult_();
}

/**
 * Validates that a value is a decimal number with a fractional part.
 *
 * @param {*} value Value to validate.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateDecimal(value, fieldName) {
  if (typeof value !== 'number' || !isFinite(value) || Math.floor(value) === value) {
    return createInvalidResult_(getFieldName_(fieldName) + ' must be a decimal number.');
  }

  return createValidResult_();
}

/**
 * Validates that a value is a valid JavaScript Date.
 *
 * @param {*} value Value to validate.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateDate(value, fieldName) {
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    return createInvalidResult_(getFieldName_(fieldName) + ' must be a valid date.');
  }

  return createValidResult_();
}

/**
 * Validates that a value is included in an allowed value list.
 *
 * @param {*} value Value to validate.
 * @param {Array<*>} allowedValues Allowed values.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateEnum(value, allowedValues, fieldName) {
  if (!Array.isArray(allowedValues)) {
    return createInvalidResult_('Allowed values must be an array.');
  }

  if (allowedValues.indexOf(value) === -1) {
    return createInvalidResult_(getFieldName_(fieldName) + ' is invalid.');
  }

  return createValidResult_();
}

/**
 * Validates a value against a regular expression.
 *
 * @param {*} value Value to validate.
 * @param {RegExp} regex Regular expression to apply.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateRegex(value, regex, fieldName) {
  if (!(regex instanceof RegExp)) {
    return createInvalidResult_('Regular expression must be a RegExp object.');
  }

  regex.lastIndex = 0;
  var matches = regex.test(value);
  regex.lastIndex = 0;

  if (!matches) {
    return createInvalidResult_(getFieldName_(fieldName) + ' format is invalid.');
  }

  return createValidResult_();
}

/**
 * Validates that a string meets a minimum length.
 *
 * @param {*} value Value to validate.
 * @param {number} length Minimum length.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateMinLength(value, length, fieldName) {
  var lengthValidation = validateLengthArgument_(length, 'Minimum');
  if (!lengthValidation.valid) {
    return lengthValidation;
  }

  var stringValidation = validateString(value, fieldName);
  if (!stringValidation.valid) {
    return stringValidation;
  }

  if (value.length < length) {
    return createInvalidResult_(getFieldName_(fieldName) + ' must be at least ' + length + ' characters.');
  }

  return createValidResult_();
}

/**
 * Validates that a string does not exceed a maximum length.
 *
 * @param {*} value Value to validate.
 * @param {number} length Maximum length.
 * @param {string=} fieldName Field name used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateMaxLength(value, length, fieldName) {
  var lengthValidation = validateLengthArgument_(length, 'Maximum');
  if (!lengthValidation.valid) {
    return lengthValidation;
  }

  var stringValidation = validateString(value, fieldName);
  if (!stringValidation.valid) {
    return stringValidation;
  }

  if (value.length > length) {
    return createInvalidResult_(getFieldName_(fieldName) + ' must not exceed ' + length + ' characters.');
  }

  return createValidResult_();
}

/**
 * Validates form-supplied Project input before generated fields exist.
 *
 * @param {Object} projectInput Project input to validate.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateProjectInput(projectInput) {
  return validateProjectFields_(projectInput, PROJECT_INPUT_REQUIRED_FIELDS);
}

/**
 * Validates a complete Project entity according to the ADR-004 contract.
 *
 * @param {Object} project Project entity to validate.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 */
function validateProject(project) {
  return validateProjectFields_(project, PROJECT_ENTITY_REQUIRED_FIELDS);
}

/**
 * @param {Object} project Project data to validate.
 * @param {Array<string>} requiredFields Required Project field names.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 * @private
 */
function validateProjectFields_(project, requiredFields) {
  if (project === null || typeof project !== 'object' || Array.isArray(project)) {
    return createInvalidResult_('Project data must be an object.');
  }

  var errors = [];
  for (var index = 0; index < requiredFields.length; index++) {
    var fieldName = requiredFields[index];
    var validation = validateRequired(project[fieldName], fieldName);

    if (!validation.valid) {
      errors.push(validation.errors[0]);
    }
  }

  return createValidationResult_(errors);
}

/**
 * @param {*} value Value to evaluate.
 * @return {boolean} Whether the value is absent or a whitespace-only string.
 * @private
 */
function isEmptyValue_(value) {
  return value === null || value === undefined ||
    (typeof value === 'string' && value.trim() === '');
}

/**
 * @param {number} length Length argument to validate.
 * @param {string} label Length label used in the error message.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 * @private
 */
function validateLengthArgument_(length, label) {
  if (typeof length !== 'number' || !isFinite(length) ||
      Math.floor(length) !== length || length < 0) {
    return createInvalidResult_(label + ' length must be a non-negative integer.');
  }

  return createValidResult_();
}

/**
 * @param {string=} fieldName Field name.
 * @return {string} Field name for an error message.
 * @private
 */
function getFieldName_(fieldName) {
  return typeof fieldName === 'string' && fieldName.trim() !== '' ? fieldName : 'Value';
}

/**
 * @return {{valid: boolean, errors: Array<string>}} Successful validation result.
 * @private
 */
function createValidResult_() {
  return createValidationResult_([]);
}

/**
 * @param {string} message Validation error message.
 * @return {{valid: boolean, errors: Array<string>}} Failed validation result.
 * @private
 */
function createInvalidResult_(message) {
  return createValidationResult_([message]);
}

/**
 * @param {Array<string>} errors Validation error messages.
 * @return {{valid: boolean, errors: Array<string>}} Validation result.
 * @private
 */
function createValidationResult_(errors) {
  return {
    valid: errors.length === 0,
    errors: errors
  };
}
