const express = require('express');
const app = express();

const connectDB = require("./config/db")


connectDB();
app.get('/' , (req ,res) => res.send('App Running'));
app.use(express.json({extended : false}));

app.use('/api/users' , require('./routes/api/user'));
app.use('/api/auth' , require('./routes/api/auth'));
app.use('/api/profile' , require('./routes/api/profile'));
app.use('/api/posts' , require('./routes/api/posts'));



const PORT = process.env.PORT || 5000;

app.listen(PORT , () => console.log(`Server started on port ${PORT}`));
