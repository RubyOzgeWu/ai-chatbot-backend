import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'

import {
  createUser,
  readUser,
  login,
  logout,
  extend,
} from '../controllers/users.js'

const router = express.Router()

router.post('/', content('application/json'), createUser)
router.get('/', auth.jwt, readUser)
router.post('/login', content('application/json'), auth.login, login)
router.post('/logout', auth.jwt, logout)
router.post('/extend', auth.jwt, extend)
// router.get('/all', auth.jwt, admin, getUsers)
// router.delete('/:id', auth.jwt, admin, deleteUser)

export default router