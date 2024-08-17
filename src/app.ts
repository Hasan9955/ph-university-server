import { userRoutes } from './app/modules/user/user.route';
import { StudentRoutes } from './app/modules/student/student.route';
import express, { Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/Middlewares/globalErrorHandler';
import notFound from './app/Middlewares/notFound';
import router from './app/Routes';
import cookieParser from 'cookie-parser';


const app = express();



//parsers
app.use(express.json());
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:8000'] }));

//application routes
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  // res.send('Server is going on...');
});

app.use(globalErrorHandler)

app.use(notFound)

export default app;
