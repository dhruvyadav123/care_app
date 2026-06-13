import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { BASE_URL } from "../../../Config/AppConstant";

const ViewDoctor = ({ data, ViewModal, setViewModal }) => {

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
    <Modal
      isOpen={ViewModal}
      toggle={() => { setViewModal(false) }}
      size="md"
      centered
    >
      <ModalHeader
        style={{ padding: "15px 0px 0px 20px!important" }}
        toggle={() => { setViewModal(false) }}
      >
        View Details
      </ModalHeader>
      <hr />
      <ModalBody>
        <Row className="text-center mb-4">
          <Col>
            <img
              src={
                `${BASE_URL}/uploads/${data?.avatar}` ||
                "https://via.placeholder.com/100"
              }
              alt="Profile"
              style={profileImageStyle}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Doctor Name:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.doctorName || "N/A"}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            doctor Number:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.doctorNumber || "N/A"}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Hospital Name:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.hospitalName || "N/A"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Hospital Number:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.hospitalNumber || "N/A"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Relative Name:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.relativeName || "N/A"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Relative Number:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.relativeNumber || "N/A"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Disease:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.disease || "N/A"}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ViewDoctor;