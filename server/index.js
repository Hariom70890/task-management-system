const express = require( 'express' ); 
const dotenv = require( 'dotenv' );
// const cookiesParser = require( 'cookie-parser' );
const cors = require( 'cors' );

const connectDB = require( './config/db' );
const userRouter = require( './routes/userRoute' );
const taskRouter = require( './routes/taskRoute' );
const cookieParser = require( 'cookie-parser' );
const app = express(); 

dotenv.config();
app.use( express.json() ); 
// app.use( cors() ); 
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // Enable sending cookies and authorization headers
}));
app.use( cookieParser() ); 

connectDB();

app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Server is running fine');
});
app.use( '/api/user', userRouter );
app.use( '/api/task', taskRouter );

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  