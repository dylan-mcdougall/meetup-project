const { validationResult, body } = require('express-validator');
const { check } = require('express-validator');
const { Venue } = require('../db/models');

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
      .isIn(['Online', 'In person'])
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

const validateGroupBody = [
  body('name')
    .notEmpty()
    .isString()
    .isLength({ min: 1, max: 60})
    .withMessage("Name must be 60 characters or less"),
  body("about")
    .notEmpty()
    .isString()
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  body('type')
    .notEmpty()
    .isString()
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  body('private')
    .isBoolean()
    .withMessage("Private must be a boolean"),
  body('city')
    .notEmpty()
    .withMessage("City is required"),
  body('state')
    .notEmpty()
    .withMessage("State is required"),
    handleValidationErrors
]

const validateVenueBody = [
  body('address')
    .notEmpty()
    .withMessage("Street address is required"),
  body('city')
    .notEmpty()
    .withMessage("City is required"),
  body('state')
    .notEmpty()
    .withMessage("State is required"),
  body('lat')
    .notEmpty()
    .isDecimal()
    .withMessage("Latitude is not valid"),
  body('lng')
    .notEmpty()
    .isDecimal()
    .withMessage("Longitude is not valid"),
  handleValidationErrors
]

const validateEventBody = [
  body('venueId')
    .optional()
    .isInt()
    .custom(async value => {
      const currVenue = await Venue.findByPk(value)

      if (value && !currVenue) return Promise.reject()
    })
    .withMessage("Venue does not exist"),
  body('name')
    .notEmpty()
    .isString()
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  body('type')
    .notEmpty()
    .isString()
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  body('capacity')
    .notEmpty()
    .isInt()
    .withMessage("Capacity must be an integer"),
  body('price')
    .notEmpty()
    .isDecimal()
    .withMessage("Price is invalid"),
  body('description')
    .notEmpty()
    .isString()
    .withMessage("Description is required"),
  body('startDate')
    .custom(async value => {
      if (Date.parse(value) < Date.now()) return Promise.reject()
    })
    .withMessage("Start date must be in the future"),
  body('endDate')
    .custom(async (value, { req }) => {
      if (Date.parse(value) < Date.parse(req.body.startDate)) return Promise.reject()
    })
    .withMessage("End date is less than start date"),
    handleValidationErrors
]

module.exports = {
  handleValidationErrors, validateQueryPagination, validateGroupBody, validateVenueBody, validateEventBody
};
