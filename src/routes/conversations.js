import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'

import {
  createConversation,
  readConversations,
  readConversation,
  deleteConversations,
} from '../controllers/users.js'


const router = express.Router()

router.post('/', content('application/json'), createConversation)
router.get('/user/:user_id', auth.jwt, readConversations);
router.get('/:session_id', auth.jwt, readConversation);
router.delete('/user/:user_id', auth.jwt, deleteConversations);
