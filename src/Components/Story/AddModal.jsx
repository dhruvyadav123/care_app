import React, { useState } from "react";
import {
  Col,
  Input,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Btn } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { addStory, fetchStories } from "../../Redux/stateSlice/storyReducer";

const initialForm = {
  title: "",
  shortDescription: "",
  fullStory: "",
  order: "",
  file: null,
};

const AddModal = ({ viewModal, setViewModal }) => {
  const dispatch = useDispatch();
  const { addLoading } = useSelector((state) => state.stories);
  const [formData, setFormData] = useState(initialForm);

  const modalToggle = () => {
    setFormData(initialForm);
    setViewModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.shortDescription || !formData.fullStory || !formData.order || !formData.file) {
      alert("Please fill all fields.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("fullStory", formData.fullStory);
    data.append("order", formData.order);
    data.append("image", formData.file);

    await dispatch(addStory(data));
    await dispatch(fetchStories(1, 10));
    modalToggle();
  };

  return (
    <Modal isOpen={viewModal} toggle={modalToggle} size="lg" centered>
      <ModalHeader toggle={modalToggle}>Add Story</ModalHeader>
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label className="col-form-label pt-0">Title</Label>
            <Input type="text" name="title" placeholder="Enter title" value={formData.title} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Short Description</Label>
            <Input
              type="textarea"
              name="shortDescription"
              rows="3"
              placeholder="Enter short description"
              value={formData.shortDescription}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Full Story</Label>
            <Input
              type="textarea"
              name="fullStory"
              rows="6"
              placeholder="Enter full story"
              value={formData.fullStory}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Order</Label>
            <Input type="number" name="order" placeholder="Enter order" value={formData.order} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label className="col-sm-3 col-form-label">Upload Image</Label>
            <Col sm="9">
              <Input className="form-control" type="file" name="file" accept="image/*" onChange={handleInputChange} />
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: modalToggle, disabled: addLoading }}>Close</Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: addLoading }}>
          {addLoading ? "Saving..." : "Save"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
