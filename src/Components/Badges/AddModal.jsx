import React, { useEffect, useState } from "react";
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
import { addBadge, fetchBadges } from "../../Redux/stateSlice/badgeReducer";

const initialForm = {
  name: "",
  price: "",
  file: null,
};

const AddModal = ({ viewModal, setViewModal }) => {
  const dispatch = useDispatch();
  const { addLoading, error } = useSelector((state) => state.badges);
  const [formData, setFormData] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!formData.file) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(formData.file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.file]);

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
    if (!formData.name.trim() || !formData.price || !formData.file) {
      alert("Please fill all fields.");
      return;
    }

    if (Number(formData.price) <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("price", formData.price);
    data.append("icon", formData.file);

    const result = await dispatch(addBadge(data));
    if (result?.success) {
      await dispatch(fetchBadges(1, 10));
      modalToggle();
    }
  };

  return (
    <Modal isOpen={viewModal} toggle={modalToggle} size="md" centered>
      <ModalHeader toggle={modalToggle}>Add Badge</ModalHeader>
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label className="col-form-label pt-0">Badge Name</Label>
            <Input type="text" name="name" placeholder="Enter badge name" value={formData.name} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Price</Label>
            <Input type="number" name="price" placeholder="Enter price" value={formData.price} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label className="col-sm-3 col-form-label">Upload Icon</Label>
            <Col sm="9">
              <Input className="form-control" type="file" name="file" accept="image/*" onChange={handleInputChange} />
            </Col>
          </FormGroup>
          {previewUrl ? (
            <FormGroup>
              <Label className="col-form-label pt-0">Preview</Label>
              <div>
                <img
                  src={previewUrl}
                  alt="Badge preview"
                  style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
            </FormGroup>
          ) : null}
          {error ? <p className="text-danger mb-0">{error}</p> : null}
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
