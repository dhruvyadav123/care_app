import React, { useEffect, useMemo, useState } from "react";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { Btn } from "../../../AbstractElements";
import { addServiceCategory, fetchServiceCategories } from "../../../Redux/stateSlice/serviceCategoryReducer";

const defaultFormState = {
  name: "",
  type: "product",
  categoryId: "",
  isActive: true,
  file: null,
};

const AddModal = ({ isOpen, toggle, categoryType }) => {
  const dispatch = useDispatch();
  const { serviceCategories, addLoading } = useSelector((state) => state.serviceCategories);
  const [formData, setFormData] = useState(defaultFormState);
  const normalizedType = categoryType === "all" ? "product" : categoryType || "product";

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchServiceCategories(1, 100, { type: normalizedType }));
      setFormData((prevState) => ({
        ...defaultFormState,
        type: normalizedType,
      }));
    }
  }, [dispatch, isOpen, normalizedType]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dispatch(fetchServiceCategories(1, 100, { type: formData.type || "product" }));
  }, [dispatch, isOpen, formData.type]);

  const parentOptions = useMemo(
    () =>
      (serviceCategories || []).map((category) => ({
        label: category.name,
        value: category._id,
      })),
    [serviceCategories]
  );

  const selectedParent = parentOptions.find((option) => option.value === formData.categoryId) || null;

  const handleInputChange = (event) => {
    const { name, value, checked, type, files } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      categoryId: name === "type" ? "" : prevState.categoryId,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter category name.");
      return;
    }

    const response = await dispatch(addServiceCategory(formData));
    if (response?.success) {
      toggle();
      dispatch(fetchServiceCategories(1, 10, { type: normalizedType }));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>Add Category</ModalHeader>
      <ModalBody>
        <Form className="theme-form">
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>Category Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Category Type</Label>
                <Input type="select" name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Parent Category</Label>
                <Select
                  options={parentOptions}
                  isClearable
                  value={selectedParent}
                  onChange={(selectedOption) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      categoryId: selectedOption?.value || "",
                    }))
                  }
                  className="js-example-basic-single"
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup check className="mt-4 pt-2">
                <Input
                  id="addCategoryStatus"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <Label check htmlFor="addCategoryStatus">
                  Active
                </Label>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label>Category Icon</Label>
                <Input type="file" name="file" accept="image/*" onChange={handleInputChange} />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggle }}>Close</Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: addLoading }}>
          {addLoading ? "Saving..." : "Save"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
