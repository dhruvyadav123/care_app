import React, { useState } from "react";
import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  Input,
  ModalFooter,
} from "reactstrap";
import { Btn } from "../../AbstractElements";
import { useDispatch } from "react-redux";
import { createEvent } from "../../Redux/stateSlice/doneListReducer";

const AddModal = (props) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddCategory = async () => {
    if (!formData.name || !formData.file) {
      alert("Please fill all fields.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("image", formData.file);

    await dispatch(createEvent(data)).unwrap();
    if (props.refreshCategories) {
      await props.refreshCategories();
    }
    props.Modaltoggle();
    setFormData({ name: "", file: null });
  };

  return (
    <Modal
      isOpen={props.viewModal}
      toggle={props.Modaltoggle}
      size="md"
      centered
    >
      <ModalHeader
        style={{ padding: "15px 0px 0px 20px!important" }}
        toggle={props.Modaltoggle}
      >
        Add Donation Category
      </ModalHeader>
      <hr />
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label className="col-form-label pt-0">Category Name</Label>
            <Input
              className="form-control"
              type="text"
              name="name"
              placeholder="Donation category name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-sm-3 col-form-label">Upload Image</Label>
            <Col sm="9">
              <Input
                className="form-control"
                type="file"
                name="file"
                onChange={handleInputChange}
              />
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: props.Modaltoggle }}>
          Close
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleAddCategory }}>
          Save
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
