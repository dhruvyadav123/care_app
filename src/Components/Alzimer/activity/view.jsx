import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

const ViewActivity = ({ modal, setModal, data }) => {
  if (!data) return null;

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Activity Details</ModalHeader>
      <ModalBody>
        <div className="mb-3">
          <strong>Title:</strong> {data.title}
        </div>

        {data.thumbnail && (
          <div className="mb-3">
            <strong>Thumbnail:</strong><br />
            <img
              src={data.thumbnail}
              alt="Activity Thumbnail"
              style={{ width: "200px", height: "auto", borderRadius: "8px" }}
            />
          </div>
        )}

        {data.music && (
          <div>
            <strong>Music:</strong><br />
            <audio
              controls
              src={data.music}
              style={{ width: "100%" }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="d-flex justify-content-center">
        <Button color="secondary" onClick={() => setModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewActivity;