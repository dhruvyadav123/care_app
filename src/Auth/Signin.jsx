import React, { Fragment, useState } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Btn, H4 } from "../AbstractElements";
import {
  EmailAddress,
  Password,
  SignIn,
} from "../Constant";
import { useNavigate } from "react-router-dom";
import man from "../assets/images/dashboard/profile.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLogin } from "../Redux/stateSlice/authSlice";
import { API_URL } from "../Config/AppConstant";
import logo from "../../src/assets/images/hclogo.jpg";
import { getDashboardPath, normalizeRole, resolveAvatarUrl, USER_ROLES } from "../Utils/authRole";

const Signin = ({ selected }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const history = useNavigate();
  const persistSession = ({ user, token, role }) => {
    const normalizedRole = normalizeRole(role);
    const avatar = resolveAvatarUrl(user?.avatar || user?.avtar, man);

    dispatch(setLogin({ user, token, role: normalizedRole }));
    localStorage.setItem("token", token);
    localStorage.setItem("authenticated", true);
    localStorage.setItem("login", true);
    localStorage.setItem("profileURL", avatar);
    localStorage.setItem("Name", user?.name || "");
    localStorage.setItem("userRole", normalizedRole);
  };

  const attemptAdminLogin = async () => {
    const response = await axios.post(`${API_URL}/admin/login`, {
      email,
      password,
    });

    return {
      user: response.data?.user || response.data?.admin,
      token: response.data?.token,
      role: response.data?.user?.role || response.data?.role || USER_ROLES.ADMIN,
    };
  };

  const attemptExpertLogin = async () => {
    const response = await axios.post(`${API_URL}/admin/expert/login`, {
      email,
      password,
    });

    return {
      user: response.data?.expert || response.data?.user,
      token: response.data?.token,
      role: response.data?.expert?.role || response.data?.role || USER_ROLES.EXPERT,
    };
  };

  const loginAuth = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!email || !password) {
        toast.error("Please enter required fields!");
        setSubmitting(false);
        return;
      }

      let session;
      try {
        session = await attemptAdminLogin();
      } catch (adminError) {
        session = await attemptExpertLogin();
      }

      const { user, token, role } = session;

      if (!user || !token) {
        throw new Error("Invalid login response");
      }

      persistSession({ user, token, role });
      toast.success("Login successful!");
      setTimeout(() => {
        history(getDashboardPath(role));
      }, 1000);
    } catch (error) {
      console.error("Login Error::", error);
      toast.error(error.response?.data?.msg || error.response?.data?.message || error.message || "Login failed!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Fragment>
      <Container fluid className="p-0 login-page" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
        <Row className="justify-content-center w-100">
          <Col xs="12" sm="10" md="8" lg="6" xl="5">
            <div className="login-card" style={{ 
              padding: "2rem", 
              // borderRadius: "8px", 
              backgroundColor: "white",
              // border: "1px solid #e0e0e0"
            }}>
              <div className="login-main login-tab">
                <Form className="theme-form">
                  <div className="text-center mb-4">
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ 
                        width: "200px", 
                        height: "200px",
                        objectFit: "contain",
                        marginBottom: "1rem"
                      }}
                    />
                    <H4 style={{ 
                      fontWeight: "600",
                      color: "#333",
                      marginBottom: "0.5rem"
                    }}>
                      Sign In
                    </H4>
                  </div>
                  
                  <FormGroup className="mb-3">
                    <Label className="form-label">{EmailAddress}</Label>
                    <Input
                      className="form-control"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      style={{
                        padding: "0.6rem 1rem",
                        borderRadius: "6px"
                      }}
                    />
                  </FormGroup>
                  
                  <FormGroup className="mb-4">
                    <Label className="form-label">{Password}</Label>
                    <div style={{ position: "relative" }}>
                      <Input
                        className="form-control"
                        type={togglePassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        style={{
                          padding: "0.6rem 1rem",
                          borderRadius: "6px"
                        }}
                      />
                      <span 
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "10px",
                          cursor: "pointer",
                          color: "#666",
                          fontSize: "14px"
                        }}
                        onClick={() => setTogglePassword(!togglePassword)}
                      >
                        {togglePassword ? "Hide" : "Show"}
                      </span>
                    </div>
                  </FormGroup>
                  
                  <FormGroup className="mb-0">
                    <Btn
                      attrBtn={{
                        color: "primary",
                        className: "d-block w-100 mt-3",
                        onClick: (e) => loginAuth(e),
                        disabled: submitting,
                        style: {
                          padding: "0.7rem",
                          borderRadius: "6px",
                          fontSize: "1rem"
                        }
                      }}
                    >
                      {submitting ? "Signing In..." : SignIn}
                    </Btn>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} />
    </Fragment>
  );
};

export default Signin;
