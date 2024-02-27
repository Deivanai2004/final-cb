// server.js

// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const Invoice = require('./models/invoice');
const User = require('./models/user');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Set up middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection failed:', err);
});

// Middleware to handle CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware for JWT verification
const middleWare = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error('Unauthorized Access: No or invalid token');
    return res.status(401).send("Unauthorized Access");
  }

  const token = authHeader.substring(7);

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode; // Attach the decoded user information to the request object
    next();
  } catch (error) {
    console.error('Token Verification Error:', error);
    return res.status(401).send("Unauthorized Access");
  }
};

// Register User
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the user's password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login User
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create and send a JWT token for authentication
    const token = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: '24hrs' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected route to view invoices
app.get('/api/invoices', middleWare, async (req, res) => {
  try {
    // Fetch and return all invoices
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/api/invoice/create', middleWare, async (req, res) => {
  try {
    console.log('Request received:', req.body);

    const { name, email, address, date, invoiceId,selectedCourses, amountpaid } = req.body;
    let currentDate = new Date();
    let nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    console.log('Next month date:', nextMonthDate);


    let totalAmount = 0;
    for (const course of selectedCourses) {
      totalAmount += course.amount * course.qty;
    }

    let paidStatus;
    if (totalAmount === amountpaid) {
      paidStatus = "Paid";
    } else if (totalAmount > amountpaid) {
      paidStatus = "Pending";
    } else {
      paidStatus = "Not paid";
    }
    console.log(invoiceId);
    const invoiceNew = new Invoice({
      name: name,
      email: email,
      date: new Date(),
      selectedCourses: selectedCourses,
      amountPaid: amountpaid,
      createdBy: "Stephy",
      billAdress: address,
      invoiceId:invoiceId,
      nextDueDate: nextMonthDate,
      totalAmount: totalAmount,
      paymentStatus: paidStatus,
    });

    const result = await invoiceNew.save();
    console.log('Invoice saved to database:', result);

    res.json({ status: "Created" }); // Send success response
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ status: "Something went wrong", error: error.message }); // Send error response
  }
});

app.get("/api/invoice/:invoiceID", middleWare, async (req, res) => {
  const invoiceExist = await Invoice.findOne({ _id: req.params.invoiceID });
  if (invoiceExist) {
    return res.json({ invoice: invoiceExist })
  } else {
    return res.json({ invoice: "Not found" });
  }
});

app.delete("/api/invoice/:invoiceID", middleWare, async (req, res) => {
  const invoiceExist = await Invoice.findOneAndDelete({ _id: req.params.invoiceID })
  if (invoiceExist) {
    return res.json({ status: "Deleted" })
  } else
    return res.json({ status: "Something went wrong" })
});

app.put("/api/invoice/:invoiceID", middleWare, async (req, res) => {
  const { name, email, address, date, selectedCourses, amountpaid } = req.body;
  let currentDate = new Date();
  let nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());

  try {
    const existingInvoice = await Invoice.findOne({ _id: req.params.invoiceID });

    if (!existingInvoice) {
      return res.status(404).json({ status: "Invoice not found" });
    }

    let totalAmount = 0;
    for (const course of selectedCourses) {
      totalAmount += course.amount * course.qty;
    }

    let paidStatus;
    if (totalAmount === amountpaid) {
      paidStatus = "Paid";
    } else if (totalAmount > amountpaid) {
      paidStatus = "Pending";
    } else {
      paidStatus = "Not paid";
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: req.params.invoiceID },
      {
        name: name,
        email: email,
        date: new Date(),
        selectedCourses: selectedCourses,
        amountPaid: amountpaid,
        createdBy: "Stephy",
        billAdress: address,
        nextDueDate: nextMonthDate,
        totalAmount: totalAmount,
        paymentStatus: paidStatus,
      },
      { new: true }
    );

    if (updatedInvoice) {
      return res.json({ status: "Updated" });
    } else {
      return res.json({ status: "Something went wrong" });
    }
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ status: "Something went wrong" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
