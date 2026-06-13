import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../Config/AppConstant";
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
import { fetchGames, editGame } from "../../Redux/stateSlice/gamesReducer";

const EditModal = ({ category, editModal, setEditModal }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    label: "",
    link: "",
    file: null,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        label: category.label || "",
        link: category.link || "",
        file: null,
      });
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditCategory = async () => {
    if (!formData.label || !formData.link) {
      alert("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("label", formData.label);
    data.append("link", formData.link);
    if (formData.file) {
      data.append("image", formData.file);
    }

    await dispatch(editGame(category._id, data));
    setEditModal(false);
    await dispatch(fetchGames(1, 10));
  };

  return (
    <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="md" centered>
      <ModalHeader toggle={() => setEditModal(false)}>
        Edit Fitness Video
      </ModalHeader>
      <hr />
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label className="col-form-label pt-0">Category Name</Label>
            <Input
              className="form-control"
              type="text"
              name="label"
              placeholder="Category Name"
              value={formData.label}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Link</Label>
            <Input
              className="form-control"
              type="text"
              name="link"
              placeholder="Link"
              value={formData.link}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            {category?.filepath && (
              <img src={`${BASE_URL}${category.filepath}`} width={60} height={60} alt="Game" />
            )}
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label">Upload Image</Label>
            <Col>
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
        <Btn attrBtn={{ color: "secondary", onClick: () => setEditModal(false) }}>
          Close
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleEditCategory }}>
          Save
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
