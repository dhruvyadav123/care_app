import React from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";

const EventDelete = ({ isDelete, setIsDelete, onDelete }) => {
  console.log("isDelete", isDelete);
  console.log("setIsDelete", setIsDelete);
  console.log("onDelete", onDelete);
  return (
    <Modal
      isOpen={isDelete}
      toggle={() => setIsDelete(false)}
      size="md"
      centered
      className="delete-modal"
    >
      <ModalHeader
        toggle={() => setIsDelete(false)}
        className="text-center"
        style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          fontWeight: "bold",
          borderBottom: "2px solid #f5c6cb",
        }}
      >
        <h5>Delete Event</h5>
      </ModalHeader>
      <ModalBody className="text-center" style={{ paddingTop: "30px" }}>
        <p style={{ fontSize: "16px", color: "#495057" }}>
          Are you sure you want to delete this Event? This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-center">
        <Button
          color="secondary"
          onClick={() => setIsDelete(false)}
          style={{
            fontWeight: "bold",
            borderRadius: "25px",
            padding: "10px 20px",
            backgroundColor: "#6c757d",
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onDelete}
          style={{
            fontWeight: "bold",
            borderRadius: "25px",
            padding: "10px 20px",
            backgroundColor: "#dc3545",
          }}
        >
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EventDelete;
