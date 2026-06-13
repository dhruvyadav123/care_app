import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewMedicine = ({data,ViewModal,setViewModal}) => {

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

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Name:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.name || "N/A"}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
          Short Composition1:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.short_composition1 || "N/A"}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
          Short Composition2:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.short_composition2 || "N/A"}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ViewMedicine;