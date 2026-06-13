import React, { useState, useEffect } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Button } from "reactstrap";
import { BASE_URL, LOCAL_URL } from "../../../Config/AppConstant";
import Rating from "react-rating";
import { Tabs, Tab } from 'react-bootstrap';
import axios from "axios";

const ViewModal = (props) => {
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [getVideos, setVideos] = useState([]);
  const data = props.data.expert;

  const getVideosByVendor = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${LOCAL_URL}/fitness/fitnessVideo/${data && data._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(response.data.fitnessVideos);
    } catch (error) {
      console.log("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "videos") {
      getVideosByVendor();
    }
  }, [activeTab, props.data._id]);

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
      size="lg"
      centered
    >
      <ModalHeader
        style={{ padding: "15px 0px 0px 20px!important" }}
        toggle={props.Modaltoggle}
      >
        View Details
      </ModalHeader>
      <ModalBody>
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          id="profile-tabs"
          className="mb-3"
        >
          <Tab eventKey="personalInfo" title="Personal Info">
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
              <Col md="6" style={labelStyle}>Status:</Col>
              <Col md="6" style={valueStyle}>
                <span
                  className={`badge badge-light-${data?.status === "1" ? "success" : "danger"}`}
                >
                  {data?.status === "1" ? "Active" : "Deactive"}
                </span>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Description:</Col>
              <Col md="6" style={valueStyle}>{data?.description || "N/A"}</Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Category:</Col>
              <Col md="6" style={valueStyle}>
                <div>{data?.category ? data.category.map((cate, idx) => <div key={idx}>{cate.name}</div>) : "N/A"}</div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="6" style={labelStyle}>Rating:</Col>
              <Col md="6" style={valueStyle}>
                <Rating
                  initialRating={data?.averageRating || 0}
                  emptySymbol={<span className="fa fa-star-o" style={{ color: "gray", fontSize: "18px" }}></span>}
                  fullSymbol={<span className="fa fa-star" style={{ color: "gold", fontSize: "18px" }}></span>}
                />
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="videos" title="Videos">
            {getVideos.length > 0 ? (
              getVideos.map((video, index) => (
                <div key={index} className="video-item mb-4">
                  <Row className="mb-3">
                    <Col md="6" style={labelStyle}>Video Description:</Col>
                    <Col md="6" style={valueStyle}>{video.description || "N/A"}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6" style={labelStyle}>Image:</Col>
                    <Col md="6" style={valueStyle}>
                      <img 
                        src={video.image ? `${BASE_URL}/uploads/${video.image}` : "https://via.placeholder.com/150"} 
                        alt="Video thumbnail" 
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6" style={labelStyle}>Video:</Col>
                    <Col md="6" style={valueStyle}>
                      <a href={video.video ? `${BASE_URL}/uploads/${video.video}` : "#"} target="_blank" rel="noopener noreferrer">Watch Video</a>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6" style={labelStyle}>Tags:</Col>
                    <Col md="6" style={valueStyle}>
                      {video.tags?.length > 0 ? video.tags.join(", ") : "N/A"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6" style={labelStyle}>Duration (in seconds):</Col>
                    <Col md="6" style={valueStyle}>{video.duration || "N/A"}</Col>
                  </Row>
                </div>
              ))
            ) : (
              <p>No videos available</p>
            )}
          </Tab>
        </Tabs>
      </ModalBody>
    </Modal>
  );
};

export default ViewModal;
