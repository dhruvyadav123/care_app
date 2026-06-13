import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Btn, P } from "../../AbstractElements";

const DeleteModal = ({ isOpen, toggle, onConfirm, deleting, expertName }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Delete Expert</ModalHeader>
      <ModalBody>
        <P attrPara={{ className: "mb-0 text-muted" }}>
          {`Are you sure you want to delete ${expertName || "this expert"}? This action cannot be undone.`}
        </P>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggle, disabled: deleting }}>
          Cancel
        </Btn>
        <Btn attrBtn={{ color: "danger", onClick: onConfirm, disabled: deleting }}>
          {deleting ? "Deleting..." : "Delete"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
