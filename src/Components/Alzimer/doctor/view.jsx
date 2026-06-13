import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

const ViewDoctor = ({ modal, setModal, data }) => {
  if (!data) return null;

  return (
    <Modal isOpen={modal} toggle={() => setModal(false)} size="md" centered>
      <ModalHeader toggle={() => setModal(false)}>Doctor Details</ModalHeader>
      <ModalBody>
        <div className="mb-3 d-flex align-items-center">
          {data.image && (
            <img
              src={data.image}
              alt="Doctor"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%", marginRight: 15 }}
            />
          )}
          <div>
            <h5 className="mb-0">{data.name}</h5>
            <small className="text-muted">{data.specialist}</small>
          </div>
        </div>

        <div className="mb-2"><strong>Phone:</strong> {data.number}</div>
        <div className="mb-2"><strong>Experience:</strong> {data.experience}</div>
          {/* <div className="mb-2"><strong>Rating:</strong> {data.rating} ⭐</div> */}
        <div><strong>About:</strong><br /> {data.about}</div>
      </ModalBody>

      <ModalFooter className="d-flex justify-content-center">
        <Button color="secondary" onClick={() => setModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewDoctor;