import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';

const ViewAssessment = ({ modal, setModal, data }) => {
  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Assessment Details</ModalHeader>
      <ModalBody>
        <p><strong>Question:</strong> {data?.question || 'N/A'}</p>
        <p><strong>Type:</strong> {data?.type || 'N/A'}</p>
        {/* If you want to show more fields later, add them here */}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setModal(false)}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewAssessment;