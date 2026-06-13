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
import { editServiceCategory, fetchServiceCategories } from "../../../Redux/stateSlice/serviceCategoryReducer";
import { resolveAssetUrl } from "../../../Utils/media";

const defaultFormState = {
  name: "",
  type: "product",
  categoryId: "",
  isActive: true,
  file: null,
};

const EditModal = ({ category, isOpen, toggle, categoryType }) => {
  const dispatch = useDispatch();
  const { serviceCategories, editLoading } = useSelector((state) => state.serviceCategories);
  const [formData, setFormData] = useState(defaultFormState);
  const normalizedType = categoryType === "all" ? "product" : categoryType || "product";

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchServiceCategories(1, 100, { type: normalizedType }));
    }
  }, [dispatch, isOpen, normalizedType]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dispatch(fetchServiceCategories(1, 100, { type: formData.type || "product" }));
  }, [dispatch, isOpen, formData.type]);

  useEffect(() => {
    if (!category) {
      setFormData(defaultFormState);
      return;
    }

    setFormData({
      name: category.name || "",
      type: category.type || normalizedType,
      categoryId: category.categoryId?._id || category.categoryId || "",
      isActive: typeof category.isActive === "boolean" ? category.isActive : String(category.isActive) !== "false",
      file: null,
    });
  }, [category, normalizedType]);

  const parentOptions = useMemo(
    () =>
      (serviceCategories || [])
        .filter((item) => item._id !== category?._id)
        .map((item) => ({
          label: item.name,
          value: item._id,
        })),
    [serviceCategories, category]
  );

  const selectedParent = parentOptions.find((option) => option.value === formData.categoryId) || null;
  const iconPreview = resolveAssetUrl(category?.icon || category?.categoryIcon);

  const handleInputChange = (event) => {
    const { name, value, checked, type, files } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      categoryId: name === "type" ? "" : prevState.categoryId,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    if (!category?._id) {
      return;
    }

    if (!formData.name.trim()) {
      alert("Please enter category name.");
      return;
    }

    const response = await dispatch(editServiceCategory(category._id, formData));
    if (response?.success) {
      toggle();
      dispatch(fetchServiceCategories(1, 10, { type: normalizedType }));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>Edit Category</ModalHeader>
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
                  id="editCategoryStatus"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <Label check htmlFor="editCategoryStatus">
                  Active
                </Label>
              </FormGroup>
            </Col>
            <Col md="4">
              {iconPreview ? (
                <div className="text-center">
                  <img
                    src={iconPreview}
                    alt={category?.name || "Category"}
                    className="img-fluid rounded"
                    style={{ maxHeight: "110px", objectFit: "cover" }}
                  />
                </div>
              ) : null}
            </Col>
            <Col md="8">
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
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: editLoading }}>
          {editLoading ? "Saving..." : "Save"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
