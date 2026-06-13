import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Button } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";

const ViewModal = ({ viewModal, setViewModal, data }) => {
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

  return (
    <Modal isOpen={viewModal} toggle={() => setViewModal(false)} size="md" centered>
      <ModalHeader className="d-flex justify-content-between align-items-center">
        <span>View Details</span>
        <Button close onClick={() => setViewModal(false)} />
      </ModalHeader>
      <hr />
      <ModalBody>
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
          <Col md="6" style={valueStyle}>{data?.name || "N/A"}</Col>
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
          <Col md="6" style={labelStyle}>Gender:</Col>
          <Col md="6" style={valueStyle}>{data?.gender || "N/A"}</Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Date of Birth:</Col>
          <Col md="6" style={valueStyle}>{data?.dob || "N/A"}</Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Address:</Col>
          <Col md="6" style={valueStyle}>{data?.address || "N/A"}</Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ViewModal;
