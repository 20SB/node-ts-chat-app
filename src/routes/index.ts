import express from 'express';
const router = express.Router();
import userRoutes from './user';
import chatRoutes from './chat';

const defaultRoutes = [
    {
        path:"/user",
        route: userRoutes
    },{
        path:"/chat",
        route: chatRoutes
    }
]

defaultRoutes.forEach(route=>{
    router.use(route.path, route.route);
})

router.get('/', (req, res) => {
    res.send('Hello World');
});

export default router;