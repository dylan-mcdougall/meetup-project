const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Image } = require('../../db/models');


const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.get('/current/groups', requireAuth, async (req, res, next) => {
  let tempArr = [];
  const list = await Membership.findAll({
    where: { memberId: req.user.id },
    attributes: [
      'groupId'
    ]
  });
  
  for (let i = 0; i < list.length; i++) {
    tempArr.push(list[i].groupId);
  }

  const target = await Group.findAll({
    where: { [Op.in]: { id: tempArr } }
  })

  for (let i = 0; i < target.length; i++) {
    const numMembers = await Membership.findAll({
      where: { groupId: target[i].id, status: { [Op.in]: ['member', 'host', 'co-host']} }
    })
    target[i].dataValues.numMembers = numMembers.length;
    const preview = await Image.findOne({
      where: { imageableId: target[i].id, preview: true, imageableType: 'Group' }
    });
    target[i].dataValues.preview = preview.imageUrl
  }

  return res.json(target);
})

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      const errResponse = {
        message: "",
        errors: {}
      }
      const emailCheck = await User.findOne({ where: { email: email } });
      if (emailCheck) {
        errResponse.message = "User already exists";
        errResponse.errors.email = "User with that email already exists"
      }
      const usernameCheck = await User.findOne({ where: { username: username } });
      if (usernameCheck) {
        errResponse.message = "User already exists";
        errResponse.errors.username = "User with that username already exists"
      }
      console.log(errResponse);
      if (errResponse.message === "User already exists") {
        return res.status(500).json(errResponse);
      }

      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
      

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);


module.exports = router;
