import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import { Btn } from "../../../AbstractElements";

const FilterModal = ({ isOpen, toggle, categories, selectedCategory, applyFilter, clearFilter }) => {
  const [localSelectedCategory, setLocalSelectedCategory] = useState("");

  // Sync with parent selectedCategory when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedCategory(selectedCategory || "");
    }
  }, [isOpen, selectedCategory]);

  const handleChange = (e) => setLocalSelectedCategory(e.target.value);

  const handleApply = () => {
    applyFilter(localSelectedCategory);
    toggle();
  };

  const handleClear = () => {
    setLocalSelectedCategory("");
    clearFilter();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Filter Vendors by Category</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="categorySelect"><strong>Select Category</strong></Label>
            <Input
              type="select"
              name="category"
              id="categorySelect"
              value={localSelectedCategory}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
        
        {/* Current Active Filter Display */}
        {selectedCategory && (
          <div className="mt-3 p-2 bg-light rounded">
            <small className="text-muted">Current Filter:</small>
            <div className="fw-bold">
              {categories?.find(cat => cat._id === selectedCategory)?.name}
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: handleClear }}>
          Clear Filter
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleApply }}>
          Apply Filter
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default FilterModal;
