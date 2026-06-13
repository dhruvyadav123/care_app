import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "react-feather";
import { Btn, H4, P } from "../AbstractElements";
import logo from "../assets/images/hclogo.jpg";
import { clearAuthError, clearAuthSuccess, login } from "../features/auth/authSlice";
import authService from "../Services/authService";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, status, error, successMessage } = useSelector((state) => state.auth);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    preferredRole: "auto",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (error?.message) {
      toast.error(error.message);
      dispatch(clearAuthError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAuthSuccess());
    }
  }, [dispatch, successMessage]);

  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(from || authService.getDashboardPath(role), { replace: true });
    }
  }, [from, isAuthenticated, navigate, role]);

  const validation = useMemo(
    () => ({
      email: !formState.email.trim() ? "Email is required." : "",
      password: !formState.password ? "Password is required." : "",
    }),
    [formState.email, formState.password]
  );

  const hasErrors = Boolean(validation.email || validation.password);
  const isSubmitting = status === "loading";

  const handleChange = ({ target: { name, value } }) => {
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (hasErrors) {
      return;
    }

    await dispatch(login(formState));
  };

  return (
    <Fragment>
      <Container
        fluid
        className="p-0 login-page"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Row className="justify-content-center w-100 m-0">
          <Col xs="12" sm="10" md="8" lg="5" xl="4">
            <div
              className="login-card"
              style={{
                padding: "2rem",
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div className="login-main login-tab">
                <Form className="theme-form" onSubmit={handleSubmit} noValidate>
                  <div className="text-center mb-4">
                    <img
                      src={logo}
                      alt="Logo"
                      style={{
                        width: "140px",
                        height: "140px",
                        objectFit: "contain",
                        marginBottom: "1rem",
                      }}
                    />
                    <H4
                      style={{
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Sign In
                    </H4>
                    <P attrPara={{ style: { marginBottom: 0, color: "#666" } }}>
                      Please enter your email and password.
                    </P>
                  </div>

                  <FormGroup className="mb-3">
                    <Label className="form-label">Email</Label>
                    <Input
                      className="form-control"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                      invalid={Boolean(touched.email && validation.email)}
                      autoComplete="username"
                      style={{
                        padding: "0.6rem 1rem",
                        borderRadius: "6px",
                      }}
                    />
                    <FormFeedback>{validation.email}</FormFeedback>
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Label className="form-label">Password</Label>
                    <div style={{ position: "relative" }}>
                      <Input
                        className="form-control"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formState.password}
                        onChange={handleChange}
                        onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                        invalid={Boolean(touched.password && validation.password)}
                        autoComplete="current-password"
                        style={{
                          padding: "0.6rem 2.75rem 0.6rem 1rem",
                          borderRadius: "6px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "10px",
                          border: 0,
                          background: "transparent",
                          color: "#666",
                          cursor: "pointer",
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <FormFeedback>{validation.password}</FormFeedback>
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-0">
                    <Btn
                      attrBtn={{
                        color: "primary",
                        className: "d-block w-100 mt-3",
                        type: "submit",
                        disabled: isSubmitting,
                        style: {
                          padding: "0.7rem",
                          borderRadius: "6px",
                          fontSize: "1rem",
                        },
                      }}
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
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

export default Login;
