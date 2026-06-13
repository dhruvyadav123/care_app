import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { BASE_URL } from "../../../Config/AppConstant";
import Rating from "react-rating";

const ViewModal = (props) => {
  const data = props.data.expert;

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
      isOpen={props.viewModal}
      toggle={props.Modaltoggle}
      size="md"
      centered
    >
      <ModalHeader
        style={{ padding: "15px 0px 0px 20px!important" }}
        toggle={props.Modaltoggle}
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
            Name:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.name || "N/A"}
          </Col>
        </Row>
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
            Gender:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.gender || "N/A"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Date of Birth:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.dob || "N/A"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Status:
          </Col>
          <Col md="6" style={valueStyle}>
            <span
              className={`badge badge-light-${
                data?.status === "1" ? "success" : "danger"
              }`}
            >
              {data?.status === "1" ? "Active" : "Deactive"}
            </span>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Category:
          </Col>
          <Col md="6" style={valueStyle}>
            <div>{data?.category.map((cate) => cate.name)} </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Address:
          </Col>
          <Col md="6" style={valueStyle}>
            {data?.address || "N/A"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md="6" style={labelStyle}>
            Rating:
          </Col>
          <Col md="6" style={valueStyle}>
            <Rating
              initialRating={props?.data?.averageRating}
              emptySymbol={
                <span
                  className="fa fa-star-o"
                  style={{ color: "gray", fontSize: "18px" }}
                ></span>
              }
              fullSymbol={
                <span
                  className="fa fa-star"
                  style={{ color: "gold", fontSize: "18px" }}
                ></span>
              }
            />
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

export default ViewModal;
