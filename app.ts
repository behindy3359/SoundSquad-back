import express, { Express, Request, Response } from 'express';

import userRouter from './routes/Ruser';
import searchRouter from './routes/Rsearch';
import communityRouter from './routes/Rcommunity';

import dotenv from 'dotenv';
import sequelize  from './models';
import cors from 'cors';
import session from 'express-session';

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('hello');
})

const today = new Date()
const expireDate = new Date()
expireDate.setDate(today.getDate() + 1)

app.use(session({
    secret : process.env.COOKIE_SECRET || 'default_secret_session_key ' , 
    resave : false, 
    saveUninitialized : false, 
    cookie : {
      httpOnly :true,
      secure : false,
      expires : expireDate
    }    
}));

app.use('/user', userRouter);
app.use('/search', searchRouter);
app.use('/community', communityRouter);


app.get('*', (req: Request, res: Response) => {
    res.render('404');
});

const startServer = async () => {
    try {
        await sequelize.sequelize.authenticate();
        console.log('Database connected!');
        
        app.listen(PORT, () => {
            console.log(`Server running on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();