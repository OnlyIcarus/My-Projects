//Taken from Topic 5 of Enterprise Web Systems

import express from 'express'
import authCtrl from './auth.controller.js'

const router = express.Router()

router.route('/auth/signin')
  .post(authCtrl.signin)
router.route('/auth/signout')
  .get(authCtrl.signout)

export default router