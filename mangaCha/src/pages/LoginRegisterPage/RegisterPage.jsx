import React, { useState } from "react";
import "./Register.css"
import {useNavigate} from 'react-router-dom'
import { useDispatch } from "react-redux";
import { handleRegister } from "../../store/Actions/actionCreator";

export const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    console.log("Form data submitted:", formData);
      await dispatch(handleRegister(formData))
      navigate("/login")
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="bg-register">
      <img src="/preloader.png" className="register-img"/>
    <div className="register">
      <div className="form-register">
        <form onSubmit={handleSubmit}>
          <div className="row mb-4">
            <div className="col">
              <div className="form-outline">
                <input
                  type="text"
                  id="form3Example1"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <label className="form-label" htmlFor="form3Example1">
                  First name
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-outline">
                <input
                  type="text"
                  id="form3Example2"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  />
                <label className="form-label" htmlFor="form3Example2">
                  Last name
                </label>
              </div>
            </div>
          </div>

          <div className="form-outline mb-4">
            <input
              type="email"
              id="form3Example3"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              />
            <label className="form-label" htmlFor="form3Example3">
              Email address
            </label>
          </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              id="form3Example4"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label className="form-label" htmlFor="form3Example4">
              Password
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-block mb-4">
            Sign up
          </button>
        </form>
      </div>
    </div>
              </div>
  );
};
