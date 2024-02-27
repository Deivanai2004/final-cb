const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: Date,
    selectedCourses: [{ name: String, amount: Number, qty: Number }],
    amountPaid: Number,
  
    createdBy: String,
    billAdress: String,
    nextDueDate: Date,
    invoiceId:String,
    totalAmount: Number,
    paymentStatus: String,
});

const Invoice = mongoose.model('invoices-record', invoiceSchema);

module.exports = Invoice;
