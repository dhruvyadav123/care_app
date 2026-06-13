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
import { editStory, fetchStories } from "../../Redux/stateSlice/storyReducer";
import { resolveAssetUrl } from "../../Utils/media";

const DEFAULT_STORY_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'><rect width='70' height='70' rx='12' fill='%23f3f4f6'/><circle cx='35' cy='26' r='12' fill='%23d1d5db'/><path d='M16 56c4-11 11-17 19-17s15 6 19 17' fill='%23d1d5db'/></svg>";
const STORY_IMAGE_OVERRIDE_KEY = "story-image-overrides";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const saveStoryImageOverride = async (storyId, file) => {
  if (!storyId || !file || typeof window === "undefined") {
    return;
  }

  try {
    const dataUrl = await fileToDataUrl(file);
    const overrides = JSON.parse(window.localStorage.getItem(STORY_IMAGE_OVERRIDE_KEY) || "{}");
    overrides[storyId] = dataUrl;
    window.localStorage.setItem(STORY_IMAGE_OVERRIDE_KEY, JSON.stringify(overrides));
  } catch (error) {
    console.error("Failed to save story image override:", error);
  }
};

const EditModal = ({ category, editModal, setEditModal }) => {
  const dispatch = useDispatch();
  const { editLoading } = useSelector((state) => state.stories);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullStory: "",
    order: "",
    file: null,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        title: category?.title || "",
        shortDescription: category?.shortDescription || "",
        fullStory: category?.fullStory || "",
        order: category?.order || "",
        file: null,
      });
    }
  }, [category]);

  const modalToggle = () => setEditModal(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    if (!category?._id) return;
    if (!formData.title || !formData.shortDescription || !formData.fullStory || !formData.order) {
      alert("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("fullStory", formData.fullStory);
    data.append("order", formData.order);
    if (formData.file) {
      data.append("image", formData.file);
    }

    const result = await dispatch(editStory(category._id, data));
    if (result?.success) {
      if (formData.file) {
        await saveStoryImageOverride(category._id, formData.file);
      }
      await dispatch(fetchStories(1, 10));
      modalToggle();
    }
  };

  const selectedFilePreview = formData.file ? URL.createObjectURL(formData.file) : null;
  const previewSrc =
    selectedFilePreview ||
    resolveAssetUrl(
      category?.image ||
        category?.imageUrl ||
        category?.imageURL ||
        category?.image_url ||
        category?.filepath ||
        category?.filePath ||
        category?.storyImage ||
        category?.storyImageUrl ||
        category?.story_image ||
        category?.story_image_url ||
        category?.banner ||
        category?.bannerImage ||
        category?.bannerUrl ||
        category?.thumbnail ||
        category?.thumbnailUrl ||
        category?.coverImage ||
        category?.coverUrl ||
        category?.media ||
        category?.asset ||
        category?.file ||
        category
    ) ||
    DEFAULT_STORY_IMAGE;

  return (
    <Modal isOpen={editModal} toggle={modalToggle} size="lg" centered>
      <ModalHeader toggle={modalToggle}>Edit Story</ModalHeader>
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label className="col-form-label pt-0">Title</Label>
            <Input type="text" name="title" value={formData.title} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Short Description</Label>
            <Input type="textarea" name="shortDescription" rows="3" value={formData.shortDescription} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Full Story</Label>
            <Input type="textarea" name="fullStory" rows="6" value={formData.fullStory} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Order</Label>
            <Input type="number" name="order" value={formData.order} onChange={handleInputChange} />
          </FormGroup>
          {previewSrc && (
            <FormGroup>
              <Label className="col-form-label pt-0">Current Image</Label>
              <div>
                <img
                  src={previewSrc}
                  alt="Story"
                  width="70"
                  height="70"
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_STORY_IMAGE;
                  }}
                />
              </div>
            </FormGroup>
          )}
          <FormGroup>
            <Label className="col-sm-3 col-form-label">Upload New Image</Label>
            <Col sm="9">
              <Input className="form-control" type="file" name="file" accept="image/*" onChange={handleInputChange} />
            </Col>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: modalToggle, disabled: editLoading }}>Close</Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleSave, disabled: editLoading }}>
          {editLoading ? "Updating..." : "Update"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
