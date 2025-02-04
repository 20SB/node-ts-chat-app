import express from 'express';
import controllers from '../controllers';
const router = express.Router();

// router.post('/login', controllers.User.create);
router.post('/register', controllers.User.create);
// router.get('/:id');
// router.put('/');
// router.get('/all');

export default router;
