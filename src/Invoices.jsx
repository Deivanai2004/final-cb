import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Table,
  Badge,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import {
  BsFillEyeFill,
  BsTrash,
  BsPencil,
  BsDownload,
} from 'react-icons/bs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Invoices.css'
import Navbar from './Navbar';
import AddIcon from '@mui/icons-material/Add';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { Link } from 'react-router-dom';

const InvoicePopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [invoiceId, setInvoiceId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [invoiceData, setInvoiceData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [reload, setReload] = useState("")
  const [id,setId] = useState()

  const courses = [
    { id: 1, name: 'FULL STACK', amount: 5000 },
    { id: 2, name: 'JAVASCRIPT', amount: 3000 },
    { id: 3, name: 'FRONTEND', amount: 2000 },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token")
    const fetchData = async () => { 
        const response = await fetch("http://127.0.0.1:5000/api/invoices", {
          method:"GET",
          headers: {
            "Authorization":`Bearer ${token}`,
            "Content-Type":"application/json",
            "Accept":"application/json"
          }
        });

        const data = await response.json()
        console.log("RESPONSE",data)
        setInvoiceData(data)
    }

    fetchData();

  },[reload])

  const updateInvoice = async() => {
    const token = localStorage.getItem("token")
    const resp = await fetch(`http://localhost:5000/api/invoice/${id}`, {
      method:"PUT",
      headers: {
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
      body: JSON.stringify({
        name:name,
        email: email,
        address: address,
        date:selectedDate,
        selectedCourses: selectedCourses,
        amountpaid: parseInt(amountPaid),
        invoiceId: invoiceId
      })
    });

    const data = await resp.json();

    if(resp.ok) {
      setReload("reload")
      setId('')
    }
  }

  const submitInvoice = async() => {
      const token = localStorage.getItem("token")
      const resp = await fetch("http://localhost:5000/api/invoice/create", {
        method:"POST",
        headers: {
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json",
          "Accept":"application/json"
        },
        body: JSON.stringify({
          name:name,
          email: email,
          address: address,
          date:selectedDate,
          selectedCourses: selectedCourses,
          amountpaid: parseInt(amountPaid),
          invoiceId: invoiceId
        })
      });

      const data = await resp.json();

      if(response.ok) {
        setReload("reload")
      }
    }
  


  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };


  const handleDropdownChange = (e) => {
    const courseId = parseInt(e.target.value, 10);
    const selectedCourse = courses.find((course) => course.id === courseId);

    if (selectedCourse) {
      setSelectedCourses((prevSelected) => [...prevSelected, selectedCourse]);
    }
    console.log(selectedCourses)
  };

  const handleDeleteCourse = (courseId) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.filter((course) => course.id !== courseId)
    );
  };

  const calculateTotalAmount = () => {
    return selectedCourses.reduce((total, course) => total + course.amount, 0);
  };

  const calculateRemainingAmount = () => {
    return calculateTotalAmount() - amountPaid;
  };

  const handlePaymentStatus = () => {
    const remainingAmount = calculateRemainingAmount();

    if (amountPaid <= 0) {
      return <Badge bg="danger">Unpaid</Badge>;
    } else if (remainingAmount === 0) {
      return <Badge bg="success">Paid</Badge>;
    } else {
      return (
        <Badge bg="warning">
          Partially Paid (Remaining: Rs: {remainingAmount})
        </Badge>
      );
    }
  };

  const handlePaymentSubmit = () => {
    if (!name || !email || !address || selectedCourses.length === 0) {
      alert('Please fill in all details before submitting.');
      return;
   
    }
   

    const updatedInvoice = {
      name,
      email,
      address,
      invoiceId,
      date: selectedDate.toLocaleDateString(),
      selectedCourses,
      amountPaid,
      totalAmount: calculateTotalAmount(),
      paymentStatus: handlePaymentStatus(),
    };


    if (selectedInvoice) {
      // Update existing invoice
      const updatedData = invoiceData.map((invoice) =>
        invoice.invoiceId === selectedInvoice.invoiceId ? updatedInvoice : invoice
      );
      setInvoiceData(updatedData);
    } else {
      // Add new invoice
      setInvoiceData((prevData) => [...prevData, updatedInvoice]);
    }

    localStorage.setItem('invoiceData', JSON.stringify([...invoiceData, updatedInvoice]));
    selectedInvoice ? updateInvoice() :submitInvoice();
    resetForm();
    handleClose();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setAddress('');
    setSelectedCourses([]);
    setAmountPaid(0);
    setSelectedInvoice(null);
  };

  const generateInvoiceId = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
    const day = (`0${currentDate.getDate()}`).slice(-2);

    // Incrementing the 4-digit number for each invoice
    const lastInvoiceNumber = parseInt(localStorage.getItem('lastInvoiceNumber'), 10) || 0;
    const newInvoiceNumber = (lastInvoiceNumber + 1).toString().padStart(3, '0');
    localStorage.setItem('lastInvoiceNumber', newInvoiceNumber);

    setInvoiceId(`${year}CBINV${month}${day}${newInvoiceNumber}`);
  };



  const handleView = (invoiceId) => {
    console.log('View Invoice:', invoiceId);
  };

  const handleEdit = (invoiceId) => {

    const selected = invoiceData.find((invoice) => invoice._id === invoiceId);

    console.log(selected)
    setSelectedInvoice(selected);
    setId(invoiceId)
    setName(selected.name);
    setEmail(selected.email);
    setAddress(selected.billAdress);
    setSelectedCourses(selected.selectedCourses);
    setAmountPaid(selected.amountPaid);
    setInvoiceId(selected.invoiceId)
    setSelectedDate(new Date(selected.date));
    setShowModal(true);
    
  };

  const handleShow = () => {
    generateInvoiceId();
    console.log(selected)
    if (selected) {
      setName(selected.name);
      setEmail(selected.email);
      setAddress(selected.billAdress);
      setSelectedCourses(selected.selectedCourses);
      setAmountPaid(selected.amountPaid);
      setSelectedDate(new Date(selected.date));
    }
  
    setShowModal(true);
  };

  const handleDelete = (invoiceId) => {
    const fetchDelete = async () => {
      const resp = await fetch(`http://localhost:5000/api/invoice/${invoiceId}`, {
        method:"DELETE",
        headers: {
          "Authorization":`Bearer ${localStorage.getItem("token")}`,
          "Content-Type":"application/json",
          "Accept":"application/json"
        }
      });

      const data = await resp.json();

      if(resp.ok) {
        setReload("reload");
      }
    }

    fetchDelete();
  };

  const handleDownload = (invoiceId) => {
    // Add logic to handle the download action
    console.log('Download Invoice:', invoiceId);
  };

  return (
    <div>
      <Navbar />
      <div className='topic'>
        <h1>Invoices</h1>
        <hr className='line'></hr>
        <Button className='btn1' variant="primary" onClick={handleShow}>
          <AddIcon />
          Create Invoice
        </Button>
      
        <Link to="/invoice1">
        <Button className='btn2' variant="primary">
          <SpeakerNotesIcon />
          View Invoice
        </Button>
        </Link>
        <br></br>
        <br></br>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="invoiceId">
                <Form.Label>Invoice ID</Form.Label>
                <Form.Control type="text" value={invoiceId} readOnly />
              </Form.Group>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="date">
                <Form.Label>Select Date</Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                />
              </Form.Group>

              <Form.Group controlId="courseDropdown">
                <Form.Label>Select Courses:</Form.Label>
                <Form.Select onChange={handleDropdownChange} multiple>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} - Rs: {course.amount}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCourses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.name}</td>
                      <td>Rs: {course.amount}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <strong>Total Amount: Rs: {calculateTotalAmount()}</strong>
              <Form>
                <Form.Group controlId="amountPaid">
                  <Form.Label>Amount Paid:</Form.Label>
                  <Form.Control
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                </Form.Group>
                <div>{handlePaymentStatus()}</div>
              </Form>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handlePaymentSubmit}>
              
              {selectedInvoice ? 'Update Invoice' : 'Submit Payment'}
            </Button>
          </Modal.Footer>
        </Modal>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#Invoice Number</th>
              <th>Invoice Date</th>
              <th>Customer Name</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceId}</td>
                <td>{new Date(invoice.date).toDateString()}</td>
                <td>{invoice.name}</td>
                <td>{invoice.paymentStatus}</td>
                <td>
                  <OverlayTrigger
                    overlay={<Tooltip id={`view-tooltip-${invoice.id}`}>View</Tooltip>}
                  >
                    <Button variant="info" onClick={() => handleView(invoice.id)}>
                      <BsFillEyeFill />
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    overlay={<Tooltip id={`edit-tooltip-${invoice._id}`}>Edit</Tooltip>}
                  >
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(invoice._id)}
                    >
                      <BsPencil />
                    </Button>
                  </OverlayTrigger>

                  <Button
                    variant="danger"
                    onClick={() => handleDelete(invoice._id)}
                  >
                    <BsTrash />
                  </Button>

                  <OverlayTrigger
                    overlay={<Tooltip id={`download-tooltip-${invoice.id}`}>Download</Tooltip>}
                  >
                    <Button
                      variant="success"
                      onClick={() => handleDownload(invoice._id)}
                    >
                      <BsDownload />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InvoicePopup;
