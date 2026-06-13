import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Button } from "reactstrap";
import { BASE_URL } from "../../../Config/AppConstant";  // Make sure this is correct

const ViewModal = ({ data, viewModal, setViewModal }) => {
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
    <Modal isOpen={viewModal} toggle={() => setViewModal(false)} size="lg" centered>
      <ModalHeader className="d-flex justify-content-between align-items-center">
        <span>Community Details</span>
        <Button close onClick={() => setViewModal(false)} />
      </ModalHeader>
      <hr />
      <ModalBody>
        <Row className="text-center mb-4">
          <Col>
            <img
              src={data?.communityLogo ? `${BASE_URL}/uploads/${data.communityLogo}` : "https://via.placeholder.com/100"}
              alt="Community Logo"
              style={profileImageStyle}
            />
          </Col>
        </Row>

        {/* Community Name */}
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Community Name:</Col>
          <Col md="6" style={valueStyle}>{data?.name || "N/A"}</Col>
        </Row>

        {/* Creator */}
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Creator:</Col>
          <Col md="6" style={valueStyle}>{data?.creator?.name || "N/A"}</Col>
        </Row>

        {/* Category */}
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Category:</Col>
          <Col md="6" style={valueStyle}>{data?.category?.name || "N/A"}</Col>
        </Row>

        {/* Type */}
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Type:</Col>
          <Col md="6" style={valueStyle}>{data?.type || "N/A"}</Col>
        </Row>

        {/* Status */}
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Status:</Col>
          <Col md="6" style={valueStyle}>{data?.status || "N/A"}</Col>
        </Row>

        {/* Hobbies */}
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Hobbies:</Col>
          <Col md="6" style={valueStyle}>
            {data?.hobbies?.length ? data.hobbies.join(", ") : "N/A"}
          </Col>
        </Row>

        {/* Members */}
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>Members:</Col>
          <Col md="6" style={valueStyle}>
            {data?.members?.length ? data.members.map((member) => member.name).join(", ") : "N/A"}
          </Col>
        </Row>
        
      </ModalBody>
    </Modal>
  );
};

export default ViewModal;
