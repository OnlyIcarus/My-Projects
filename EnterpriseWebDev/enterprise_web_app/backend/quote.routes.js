//Taken and adapted from Topic 5 of Enterprise Web Systems

import express from 'express'
import quoteCtrl from './quote.controller.js'
import authCtrl from './user.controller.js'

const router = express.Router()

router.route('/api/quote')
  .get(quoteCtrl.list)
  .post(quoteCtrl.create)

router.route('/api/quote/:quoteId')
  .get(quoteCtrl.read)
  .put(quoteCtrl.update)
  .delete(quoteCtrl.remove)

router.route('/api/calculate/:quoteId')
  .get(quoteCtrl.calculate)

router.route('/api/list/:email')
  .get(quoteCtrl.read)

router.param('quoteId', quoteCtrl.quoteById)
router.param('email', quoteCtrl.listByEmail)
  
export default router
