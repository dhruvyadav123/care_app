import React, { useState, useEffect } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Button,Table } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import { Tabs, Tab } from 'react-bootstrap';
import { LOCAL_URL } from "../../Config/AppConstant";
import axios from "axios";
import { getUserName } from "../../Utils/userDisplay";

const ViewModal = ({ viewModal, setViewModal, data }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [medicalRemainder, setMedicalRemainder] = useState([]);
  const [subscription, setSubscription] = useState([]);
  const [doctors, setDoctor] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [events, setEvents] = useState([]);

  const getMedicalReminder = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${LOCAL_URL}/fitness/order/user/${data._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Medical Remainder response::", response.data);
      setMedicalRemainder(response.data.data);
    } catch (error) {
      console.log("Error fetching medical reminders::", error);
    }
  };

  const getSubscription = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${LOCAL_URL}/fitness/subscription/vendor/user/${data._id}`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      console.log("Medical Remainder response::", response.data);
      setSubscription(response.data.subscriptions);
    } catch (error) {
      console.log("Error fetching medical reminders::", error);
    }
  };
  const getCommunities = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${LOCAL_URL}/communityMembers/${data._id}`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      console.log("communityMembers response::", response.data);
      setCommunities(response.data);
    } catch (error) {
      console.log("Error fetching communityMembers reminders::", error);
    }
  };
    const getDoctors = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${LOCAL_URL}/doctor/${data._id}`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      console.log("doctor response::", response.data);
      setDoctor(response.data);
    } catch (error) {
      console.log("Error fetching doctor reminders::", error);
    }
  };
   const getEvents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${LOCAL_URL}/events/${data._id}`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      console.log("events response::", response.data);
      setEvents(response.data);
    } catch (error) {
      console.log("Error fetching events::", error);
    }
  };
  useEffect(() => {
    if (activeTab === "medicalRemainder") {
      getMedicalReminder();
    } else if (activeTab === 'subscription') {
      getSubscription();
    }
     else if (activeTab === 'communities') {
      getCommunities();
    } else if (activeTab === 'doctors') {
      getDoctors();
    }else if (activeTab === 'events') {
      getEvents();
    }
  }, [activeTab, data._id]);

  const labelStyle = {
    fontWeight: "bold",
    color: "#6c757d",
  };

  const valueStyle = {
    color: "#495057",
  };

  const profileImageStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #6c757d",
  };

  const handleModalClose = () => {
    setViewModal(false);
    setActiveTab("personal");
  };

  return (
    <Modal
      isOpen={viewModal}
      toggle={handleModalClose}
      size="lg"
      centered
      style={{ maxWidth: "50%" }}
    >
      <ModalHeader className="d-flex justify-content-between align-items-center">
        <span>View Details</span>
        <Button close onClick={handleModalClose} />
      </ModalHeader>
      <ModalBody style={{ maxHeight: "60vh", overflowY: "auto", padding: '20px' }}>
        <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)} id="profile-tabs" className="mb-3">
          <Tab eventKey="personal" title="Personal Info">
            <Row className="text-center mb-4">
              <Col>
                <img
                  src={data?.avatar ? `${BASE_URL}/uploads/${data.avatar}` : "https://via.placeholder.com/100"}
                  alt="Profile"
                  style={profileImageStyle}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Name:</Col>
              <Col md="6" style={valueStyle}>{getUserName(data)}</Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Email:</Col>
              <Col md="6" style={valueStyle}>{data?.email || "N/A"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Phone:</Col>
              <Col md="6" style={valueStyle}>{data?.phoneNumber || "N/A"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Address:</Col>
              <Col md="6" style={valueStyle}>{data?.address || "N/A"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Status:</Col>
              <Col md="6" style={valueStyle}>
                {data?.status ? (
                  <span className="badge bg-success">Active</span>
                ) : (
                  <span className="badge bg-danger">Blocked</span>
                )}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>DOB:</Col>
              <Col md="6" style={valueStyle}>{data?.dob || "N/A"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Gender:</Col>
              <Col md="6" style={valueStyle}>{data?.gender || "N/A"}</Col>
            </Row>
          </Tab>

      <Tab eventKey="medicalRemainder" title="Medicine Order">
      {medicalRemainder && medicalRemainder.length > 0 ? (
        medicalRemainder.map((order, index) => (
          <div key={order._id || index} className="mb-4">
            <h6 className="fw-bold text-primary">
              Order #{index + 1} — Status:{" "}
              <span
                className={
                  order.status === "pending"
                    ? "text-warning"
                    : order.status === "accepted"
                    ? "text-success"
                    : "text-danger"
                }
              >
                {order.status}
              </span>
            </h6>
            <p className="mb-2 text-muted">
              <strong>Payment Type:</strong> {order.paymentType || "N/A"} <br />
              <strong>Created At:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()} <br />
              <strong>Vendors Sent:</strong> {order.sentToVendor?.length || 0}
            </p>

            {/* ✅ Table of Medicines */}
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Medicine Name</th>
                  <th>Manufacturer</th>
                  <th>Strength</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Amount</th>
                  <th>Composition</th>
                </tr>
              </thead>
              <tbody>
                {order.medicines.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.medicine?.name || "N/A"}</td>
                    <td>{item.medicine?.manufacturer_name || "N/A"}</td>
                    <td>{item.strength || "N/A"}</td>
                    <td>{item.quantity || 0}</td>
                    <td>{item.unit || "N/A"}</td>
                    <td>{item.amount || 0}</td>
                    <td>
                      {item.medicine?.short_composition1 || "N/A"},{" "}
                      {item.medicine?.short_composition2 || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <hr />
          </div>
        ))
      ) : (
        <p>No medicine orders available</p>
      )}
    </Tab>
        <Tab eventKey="subscription" title="Subscription">
      {subscription && subscription.length > 0 ? (
        <div className="mt-3">
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Label</th>
                <th>User Name</th>
                <th>Vendor Name</th>
                <th>Fitness Goal</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {subscription.map((sub, index) => (
                <tr key={sub._id || index}>
                  <td>{index + 1}</td>
                  <td>{sub.label || "N/A"}</td>
                  <td>{sub.userId?.name || "N/A"}</td>
                  <td>{sub.vendorId?.name || "N/A"}</td>
                  <td>{sub.fitnessGoal || "N/A"}</td>
                  <td
                    className={
                      sub.status === "active"
                        ? "text-success fw-bold"
                        : sub.status === "inactive"
                        ? "text-danger fw-bold"
                        : "text-muted"
                    }
                  >
                    {sub.status || "N/A"}
                  </td>
                  <td>
                    {sub.startDate
                      ? new Date(sub.startDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.endDate
                      ? new Date(sub.endDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="mt-3">No subscription data found</p>
      )}
    </Tab> <Tab eventKey="doctors" title="Doctors">
      {doctors && doctors.length > 0 ? (
        <div className="mt-3">
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Label</th>
                <th>User Name</th>
                <th>Vendor Name</th>
                <th>Fitness Goal</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {subscription.map((sub, index) => (
                <tr key={sub._id || index}>
                  <td>{index + 1}</td>
                  <td>{sub.label || "N/A"}</td>
                  <td>{sub.userId?.name || "N/A"}</td>
                  <td>{sub.vendorId?.name || "N/A"}</td>
                  <td>{sub.fitnessGoal || "N/A"}</td>
                  <td
                    className={
                      sub.status === "active"
                        ? "text-success fw-bold"
                        : sub.status === "inactive"
                        ? "text-danger fw-bold"
                        : "text-muted"
                    }
                  >
                    {sub.status || "N/A"}
                  </td>
                  <td>
                    {sub.startDate
                      ? new Date(sub.startDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.endDate
                      ? new Date(sub.endDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="mt-3">No doctors data found</p>
      )}
    </Tab> 
    <Tab eventKey="communities" title="Communities">
      {communities && communities.length > 0 ? (
        <div className="mt-3">
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Label</th>
                <th>User Name</th>
                <th>Vendor Name</th>
                <th>Fitness Goal</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {communities.map((sub, index) => (
                <tr key={sub._id || index}>
                  <td>{index + 1}</td>
                  <td>{sub.label || "N/A"}</td>
                  <td>{sub.userId?.name || "N/A"}</td>
                  <td>{sub.vendorId?.name || "N/A"}</td>
                  <td>{sub.fitnessGoal || "N/A"}</td>
                  <td
                    className={
                      sub.status === "active"
                        ? "text-success fw-bold"
                        : sub.status === "inactive"
                        ? "text-danger fw-bold"
                        : "text-muted"
                    }
                  >
                    {sub.status || "N/A"}
                  </td>
                  <td>
                    {sub.startDate
                      ? new Date(sub.startDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.endDate
                      ? new Date(sub.endDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="mt-3">No communtites data found</p>
      )}
    </Tab>
     <Tab eventKey="events" title="Events">
      {events && events.length > 0 ? (
        <div className="mt-3">
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Label</th>
                <th>User Name</th>
                <th>Vendor Name</th>
                <th>Fitness Goal</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {subscription.map((sub, index) => (
                <tr key={sub._id || index}>
                  <td>{index + 1}</td>
                  <td>{sub.label || "N/A"}</td>
                  <td>{sub.userId?.name || "N/A"}</td>
                  <td>{sub.vendorId?.name || "N/A"}</td>
                  <td>{sub.fitnessGoal || "N/A"}</td>
                  <td
                    className={
                      sub.status === "active"
                        ? "text-success fw-bold"
                        : sub.status === "inactive"
                        ? "text-danger fw-bold"
                        : "text-muted"
                    }
                  >
                    {sub.status || "N/A"}
                  </td>
                  <td>
                    {sub.startDate
                      ? new Date(sub.startDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.endDate
                      ? new Date(sub.endDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="mt-3">No Events data found</p>
      )}
    </Tab>
        </Tabs>
      </ModalBody>
    </Modal >
  );
};

export default ViewModal;
