import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { resolveAssetUrl } from "../../Utils/media";

const ViewModal = ({data,ViewModal,setViewModal}) => {

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

  const avatarUrl = resolveAssetUrl(data?.avatar);
  const initials = String(data?.name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "SA";

  return (
    <Modal
      isOpen={ViewModal}
      toggle={() => {setViewModal(false)}}
      size="md"
      centered
    >
      <ModalHeader
        style={{ padding: "15px 0px 0px 20px!important" }}
        toggle={() => {setViewModal(false)}}
      >
        View Details
      </ModalHeader>
      <hr />
      <ModalBody>
        <Row className="text-center mb-4">
          <Col>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={data?.name || "Profile"}
                style={profileImageStyle}
              />
            ) : (
              <div
                className="d-inline-flex align-items-center justify-content-center text-white fw-semibold"
                style={{
                  ...profileImageStyle,
                  background: "linear-gradient(135deg, #7366ff 0%, #9b8cff 100%)",
                  fontSize: "30px",
                }}
              >
                {initials}
              </div>
            )}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Name:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.name || "N/A"}
          </Col>
        </Row>

        {/* Email */}
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Email:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.email || "N/A"}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Phone:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.phoneNumber || "N/A"}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Role:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.roles?.role || "N/A"}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ViewModal;
