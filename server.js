


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Using your updated role-based logic
const productRoutes = require('./routes/productRoute');
const tshirtRoute = require('./routes/tshirts');
const updateRoute = require('./routes/Update')

const app = express();
app.use(cors());
app.use(express.json());

// Use auth routes (handles /register, /login, /profile)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tshirt', tshirtRoute);
app.use('/api/put',updateRoute)

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
