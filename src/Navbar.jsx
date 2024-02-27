import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navbar.css'
import logo from './assets/vpsedadmin-logo-white.png';
import Button from 'react-bootstrap/Button';
function Navbarr() {
  return (
    <Navbar className="bgcolor">
      <Container>
      <img src={logo} alt="Logo" width="128px"/>

        <Navbar.Brand href="#home"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link className="txt-color" href="#home">Home</Nav.Link>
            <Nav.Link className="txt-color"href="#link">Admin</Nav.Link>
            <NavDropdown color='white' title="Dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <div>
     <Button variant="outline-light" id='logout'>Logout</Button>
     </div>
    </Navbar>
    
  );
}

export default Navbarr;