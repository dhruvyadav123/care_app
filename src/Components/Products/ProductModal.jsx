import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { Btn } from "../../AbstractElements";
import { fetchServiceCategories } from "../../Redux/stateSlice/serviceCategoryReducer";
import { getProductImageSource } from "../../Utils/productImage";

const defaultFormState = {
  name: "",
  description: "",
  condition: "new",
  price: "",
  stock: "",
  deliveryCharge: "",
  isAvailable: true,
  file: null,
};

const ProductModal = ({
  isOpen,
  toggle,
  title,
  initialProduct = null,
  onSubmit,
  submitting,
}) => {
  const dispatch = useDispatch();
  const { serviceCategories, loading: categoriesLoading } = useSelector((state) => state.serviceCategories);
  const [formData, setFormData] = useState(defaultFormState);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formError, setFormError] = useState("");

  const categoryOptions = useMemo(
    () =>
      (serviceCategories || []).map((category) => ({
        label: category.name,
        value: category._id,
      })),
    [serviceCategories]
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchServiceCategories(1, 100, { type: "product" }));
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialProduct) {
      const categoryValue =
        initialProduct.categoryId?._id ||
        initialProduct.categoryId ||
        initialProduct.serviceCategoryId?._id ||
        initialProduct.serviceCategoryId ||
        "";

      setFormData({
        name: initialProduct.name || "",
        description: initialProduct.description || "",
        condition: initialProduct.condition || "new",
        price: initialProduct.price ?? "",
        stock: initialProduct.stock ?? "",
        deliveryCharge: initialProduct.deliveryCharge ?? "",
        isAvailable:
          typeof initialProduct.isAvailable === "boolean"
            ? initialProduct.isAvailable
            : String(initialProduct.isAvailable || "").toLowerCase() === "true",
        file: null,
      });

      setSelectedCategory(
        categoryValue
          ? {
              value: categoryValue,
              label:
                initialProduct.categoryId?.name ||
                initialProduct.serviceCategoryId?.name ||
                "Selected category",
            }
          : null
      );
      setFormError("");
    } else {
      setFormData(defaultFormState);
      setSelectedCategory(null);
      setFormError("");
    }
  }, [initialProduct, isOpen]);

  useEffect(() => {
    if (!selectedCategory?.value || !categoryOptions.length) {
      return;
    }

    const matchedCategory = categoryOptions.find((option) => option.value === selectedCategory.value);
    if (matchedCategory && matchedCategory.label !== selectedCategory.label) {
      setSelectedCategory(matchedCategory);
    }
  }, [categoryOptions, selectedCategory]);

  const handleInputChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    setFormError("");
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const previewImage = formData.file
    ? URL.createObjectURL(formData.file)
    : getProductImageSource(initialProduct);

  const handleSave = () => {
    if (!selectedCategory?.value) {
      setFormError("Please select a category.");
      return;
    }

    if (!formData.name || !formData.price || !formData.stock) {
      setFormError("Please fill all required fields.");
      return;
    }

    setFormError("");

    const payload = new FormData();
    payload.append("categoryId", selectedCategory.value);
    payload.append("serviceCategoryId", selectedCategory.value);
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("condition", formData.condition);
    payload.append("price", formData.price);
    payload.append("stock", formData.stock);
    payload.append("deliveryCharge", formData.deliveryCharge || 0);
    payload.append("isAvailable", String(formData.isAvailable));

    if (formData.file) {
      payload.append("image", formData.file);
    }

    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>
        <Form className="theme-form">
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>Product Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Category</Label>
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={(option) => {
                    setSelectedCategory(option);
                    setFormError("");
                  }}
                  isLoading={categoriesLoading}
                  className="js-example-basic-single"
                  placeholder={categoriesLoading ? "Loading categories..." : "Select category"}
                  noOptionsMessage={() => "No categories found"}
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label>Description</Label>
                <Input
                  type="textarea"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Condition</Label>
                <Input type="select" name="condition" value={formData.condition} onChange={handleInputChange}>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Price</Label>
                <Input type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Stock</Label>
                <Input type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Delivery Charge</Label>
                <Input
                  type="number"
                  min="0"
                  name="deliveryCharge"
                  value={formData.deliveryCharge}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup check className="mt-4 pt-2">
                <Input
                  id="isAvailable"
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                />
                <Label check htmlFor="isAvailable">
                  Available
                </Label>
              </FormGroup>
            </Col>
            <Col md="8">
              <FormGroup>
                <Label>Product Image</Label>
                <Input type="file" name="file" accept="image/*" onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md="4">
              {previewImage ? (
                <div className="text-center">
                  <img
                    src={previewImage}
                    alt="Product preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "110px", objectFit: "cover" }}
                  />
                </div>
              ) : null}
            </Col>
          </Row>
        </Form>
        {formError ? <p className="text-danger mt-2 mb-0">{formError}</p> : null}
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: toggle }}>Close</Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: submitting || categoriesLoading }}>
          {submitting ? "Saving..." : "Save"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default ProductModal;
