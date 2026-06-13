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
      <ModalHeader toggle={() => setModal(false)}>Caregiver Details</ModalHeader>
      <ModalBody>
        <div className="d-flex flex-column gap-2">
          <p><strong>Name:</strong> {data?.name || 'N/A'}</p>
          <p><strong>Phone Number:</strong> {data?.phoneNumber || 'N/A'}</p>
          <p><strong>Relation:</strong> {data?.relation || 'N/A'}</p>
          <p><strong>Address:</strong> {data?.address || 'N/A'}</p>
          <p><strong>FCM Token:</strong> {data?.fcmToken || 'N/A'}</p>
          <p><strong>Created At:</strong> {new Date(data?.createdAt).toLocaleString() || 'N/A'}</p>
          <hr />
          <h6>Linked Patient</h6>
          {data?.patientId ? (
            <>
              <p><strong>Full Name:</strong> {data.patientId.fullName}</p>
              <p><strong>Age:</strong> {data.patientId.age}</p>
              <p><strong>Gender:</strong> {data.patientId.gender}</p>
            </>
          ) : (
            <p>No linked patient found</p>
          )}
          {data?.image && (
            <>
              <hr />
              <strong>Image:</strong>
              <br />
              <img
                src={data.image}
                alt="caregiver"
                width={120}
                height={120}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
            </>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewAssessment;
