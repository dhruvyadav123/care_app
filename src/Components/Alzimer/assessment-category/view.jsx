import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";

const ViewAssessmentCategory = ({ modal, setModal, data }) => {
  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Category Details</ModalHeader>
      <ModalBody>
        <p>
          <strong>Name:</strong> {data?.name || "N/A"}
        </p>
        <p>
          <strong>Description:</strong> {data?.description || "N/A"}
        </p>
      </ModalBody>
    </Modal>
  );
};

export default ViewAssessmentCategory;