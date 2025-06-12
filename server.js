


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Using your updated role-based logic
const productRoutes = require('./routes/productRoute');
const tshirtRoute = require('./routes/tshirts');
const updateRoute = require('./routes/Update')
const cartRoute = require('./routes/cart')
const checkRoute = require('./routes/checkout')
const dashboardRoute = require('./routes/dashboardConroller')

const app = express();
app.use(cors());
app.use(express.json());

// Use auth routes (handles /register, /login, /profile)
app.use('/api/auth', authRoutes); //for login//
app.use('/api/products', productRoutes); //for add a products//
app.use('/api/tshirt', tshirtRoute); //for get a products//
app.use('/api/put',updateRoute) // for update a products //
app.use('/api/cart',cartRoute) //for cart //
app.use('/api/checkout',checkRoute) //for checkout //
app.use('/api/admin',dashboardRoute) //for dashboard//


// Connect to MongoDB
mongoose.connect('mongodb+srv://dinesh071077:ndGAfgn87mnTeglt@cluster0.ljbtvt1.mongodb.net/myDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Start server
app.listen(5000, () => {
  console.log('Server is running on port http://localhost:5000');
});
