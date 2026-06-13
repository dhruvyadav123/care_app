import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const ViewVacination = ({data,ViewModal,setViewModal}) => {

  const labelStyle = {
    fontWeight: "bold",
    color: "#6c757d",
  };

  const valueStyle = {
    color: "#495057",
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
          Vaccination Type:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.vaccinationType || "N/A"}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
          Description:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.description || "N/A"}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ViewVacination;