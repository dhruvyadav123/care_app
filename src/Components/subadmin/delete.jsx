import React from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";

const DeleteSubAdmin = ({ isDelete, setIsDelete, onDelete }) => {
  return (
    <Modal isOpen={isDelete} toggle={() => setIsDelete(false)} size="md" centered>
      <ModalHeader toggle={() => setIsDelete(false)} className="text-center">
        <h4 style={{ color: "#dc3545" }}>Delete User</h4>
      </ModalHeader>
      <ModalBody className="text-center">
        <p style={{ fontSize: "16px" }}>
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-center">
        <Button
          color="secondary"
          onClick={() => setIsDelete(false)}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onDelete}
        >
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteSubAdmin;
