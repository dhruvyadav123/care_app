import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

const ViewVideo = ({ modal, setModal, data }) => {
  if (!data) return null;

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
      <ModalHeader toggle={() => setModal(false)}>Video Details</ModalHeader>
      <ModalBody className="p-4">
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ fontSize: "16px", marginBottom: "10px" }}>
            <strong>Title:</strong>{" "}
            <span style={{ color: "#333" }}>{data.title}</span>
          </p>
          <p style={{ fontSize: "15px", marginBottom: "18px" }}>
            <strong>Uploaded By:</strong>{" "}
            <span style={{ color: "#555" }}>{data.uploadedBy}</span>
          </p>

          {data.thumbnail && (
            <img
              src={
                typeof data.thumbnail === "string"
                  ? data.thumbnail
                  : URL.createObjectURL(data.thumbnail)
              }
              alt="Thumbnail"
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "20px",
                objectFit: "cover",
                maxHeight: "300px",
              }}
            />
          )}

          {data.video && (
            <video
              controls
              style={{
                width: "100%",
                borderRadius: "10px",
                backgroundColor: "#000",
                maxHeight: "450px",
              }}
              src={
                typeof data.video === "string"
                  ? data.video
                  : URL.createObjectURL(data.video)
              }
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewVideo;