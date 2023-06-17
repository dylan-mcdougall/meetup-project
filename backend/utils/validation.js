const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateQueryPagination = [
  check('page')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Page must be greater than or equal to 1 and less than or equal to 10"),
  check('size')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage("Size must be greater than or equal to 1 and less than or equal to 20"),
  check('name')
      .optional()
      .isAlphanumeric('en-US',{ignore:" "})
      .withMessage("Name must be a string"),
  check('type')
      .optional()
      .isIn(['Online', 'In Person'])
      .withMessage("Type must be 'Online' or 'In Person'"),
  check('startDate')
      .optional()
      .custom(async value => {
          const dateTime = new Date(value)

          if (isNaN(dateTime.getTime())) return Promise.reject()
      })
      .withMessage("Start date must be a valid datetime"),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors, validateQueryPagination
};
