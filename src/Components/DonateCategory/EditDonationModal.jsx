import React, { useState, useEffect } from "react";
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
import { resolveAssetUrl } from "../../Utils/media";
import DonateService from "../../Services/donateListServic";

const resolveCategoryImage = (category) =>
  resolveAssetUrl(
    category?.imageURL ||
      category?.imageUrl ||
      category?.filepath ||
      category?.image ||
      category?.icon ||
      category?.filePath ||
      category?.file_path ||
      category
  );

const EditDonationModal = ({ category, editModal, EditModaltoggle, refreshCategories }) => {
  const [formData, setFormData] = useState({ name: "", file: null });

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name || "", file: null });
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
    if (!formData.name) {
      alert("Please enter a name.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.file) {
      data.append("image", formData.file);
    }

    try {
      await DonateService.update(category._id, data);
      alert("Category updated successfully!");
      EditModaltoggle();
      if (refreshCategories) {
        await refreshCategories();
      }
    } catch (err) {
      console.error("Donation category update failed:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "Error updating category.";
      alert(errorMessage);
    }
  };


  return (
    <Modal isOpen={editModal} toggle={EditModaltoggle} size="md" centered>
      <ModalHeader toggle={EditModaltoggle}>Edit Donation Category</ModalHeader>
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label>Category Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Category Name"
            />
          </FormGroup>
          {resolveCategoryImage(category) && (
            <FormGroup>
              <img
                src={resolveCategoryImage(category)}
                width="60"
                height="60"
                alt="category"
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label>Upload Image</Label>
            <Col sm="12">
              <Input type="file" name="file" onChange={handleInputChange} />
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: EditModaltoggle }}>Close</Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleEditCategory }}>Save</Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditDonationModal;
