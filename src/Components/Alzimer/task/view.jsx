import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

const ViewTask = ({ modal, setModal, data }) => {
  if (!data) return null;

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Task Details</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <strong>Title:</strong> {data.title}
        </div>

        <div className="mb-3">
          <strong>Description:</strong><br />
          {data.description || "N/A"}
        </div>

        <div className="mb-3">
          <strong>Link:</strong><br />
          {data.link ? (
            <a href={data.link} target="_blank" rel="noopener noreferrer">{data.link}</a>
          ) : (
            "N/A"
          )}
        </div>

        <div className="mb-3">
          <strong>Category:</strong> {data.category || "N/A"}
        </div>

        <div className="mb-3">
          <strong>Activity Task:</strong> {data.activityTask || "N/A"}
        </div>

        <div className="mb-3">
          <strong>Thumbnail:</strong><br />
          {data.thumbnail ? (
            <img
              src={data.thumbnail}
              alt="Thumbnail"
              style={{ width: "150px", height: "auto", borderRadius: "8px" }}
            />
          ) : (
            "No thumbnail"
          )}
        </div>
      </ModalBody>

      <ModalFooter className="d-flex justify-content-center">
        <Button color="secondary" onClick={() => setModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewTask;