import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  openLoginModal,
  closeLoginModal,
  handleLogin,
  getCurrentUser,
} from "../../store/Actions/actionCreator";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import Cookies from 'universal-cookie';
const cookies = new Cookies(null ,{ path: '/' });

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showLoginModal } = useSelector((state) => state.loginModal);
  const { accessToken } = useSelector((state) => state.loginUser);
  console.log(accessToken);
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setLogin(prev => ({ ...prev, [name]: value }))
  }

  const submitLogin = (e) => {
    e.preventDefault()
    console.log(login);
    dispatch(handleLogin(login))
  
    handleClose()
  }

  const handleShow = () => {
    dispatch(openLoginModal());
  };

  const handleClose = () => {
    if (window.location.pathname === '/login') {
      navigate("/");
      dispatch(closeLoginModal())
    } else {
      dispatch(closeLoginModal());
    }
  };

  const toRegister = (e) => {
    e.preventDefault()
    navigate("/register")
    handleClose()
  }

  useEffect(() => {
    if(window.location.pathname === "/login"){
      handleShow()
    }
    
  }, []);

  useEffect(() => {
    if (accessToken) {
      dispatch(getCurrentUser(accessToken.access_token))
    }
  }, [accessToken])

  return (
    <>
      <Modal show={showLoginModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>LOGIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control name="email" onChange={handleChange} type="email" placeholder="Enter email" value={login.email}/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" onChange={handleChange} type="password" placeholder="Password" value={login.password}/>
            </Form.Group>
            <Form.Group className="display-flex-column">
              <Form.Text className="text-muted">
                Or Login With:
              </Form.Text>
              <Form.Group className="d-flex flex-row justify-content-center">
              <Button className="btn-warning text-white rounded-5 h-25 w-auto">
                <GoogleIcon />
              </Button>
              </Form.Group>
              <Form.Group>
                <Form.Text>
                  Don't have an account?
                  <Link onClick={toRegister}>Register Here</Link>
                </Form.Text>
              </Form.Group>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="flex justify-content-center">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
      
    </>
  );
};
