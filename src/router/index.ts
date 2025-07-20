import  express from "express";
import offersRouter from '../controller/offers';

const router = express.Router();
const AppRouter = () => {
    router.get('/', (_, res)=> {
        res.status(200).json({
            message: 'Welcome to the API',
            statusCode: 200,
            status: 'success'
        });
    })
    router.use('/', offersRouter);
    return router;
    
}

export default AppRouter;