import express from 'express';
import middlewares from '../middlewares';
import controllers from '../controllers';
const router = express.Router();

router.get('/',middlewares.auth.authenticate, async (req, res) => {
    console.log(req.user);
    res.send({message: "Chat route"});
})

// get or create private chat with limited msgs with specific user
router.get('/:partnerId',middlewares.auth.authenticate, controllers.Chat.getPrivateChat )

// // get chat details with limited msga of a particular chat
// router.get('/:userId',middlewares.auth.authenticate )

// // get all chat lists of a user with last message sorted by last message time
// router.get('/:userId',middlewares.auth.authenticate )

// // create group chat
// router.get('/:userId',middlewares.auth.authenticate )

// // update group chat
// router.get('/:userId',middlewares.auth.authenticate )

export default router;