import React, { useEffect, useMemo } from "react";
import { Col, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";

const FALLBACK_GAME_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='16' fill='%23f3f4f6'/%3E%3Cpath d='M36 45c0-4.97 4.03-9 9-9h30c4.97 0 9 4.03 9 9v30c0 4.97-4.03 9-9 9H45c-4.97 0-9-4.03-9-9V45Z' fill='%23d1d5db'/%3E%3Ccircle cx='49' cy='49' r='6' fill='%239ca3af'/%3E%3Cpath d='m47 73 11-12 9 9 6-7 11 10H47Z' fill='%236b7280'/%3E%3C/svg%3E";

const sanitizeImageValue = (value) => {
  if (!value) return "";
  const normalized = String(value).trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return "";
  }
  return normalized;
};

const resolvePreviewImage = (image) => {
  const sanitizedImage = sanitizeImageValue(image);
  if (!sanitizedImage) return FALLBACK_GAME_IMAGE;
  if (sanitizedImage.startsWith("blob:")) return sanitizedImage;
  if (sanitizedImage.startsWith("/game-thumbnails")) return sanitizedImage;
  if (/^(https?:)?\/\//i.test(sanitizedImage)) return sanitizedImage;
  if (sanitizedImage.startsWith("/uploads"))
    return `${BASE_URL}${sanitizedImage}`;
  if (/^\/?api\/uploads\//i.test(sanitizedImage)) {
    return `${BASE_URL}/${sanitizedImage.replace(/^\/?api\//i, "")}`;
  }
  if (sanitizedImage.startsWith("/")) return `${BASE_URL}${sanitizedImage}`;
  return `${BASE_URL}/uploads/${sanitizedImage}`;
};

const GameFormFields = ({
  formData,
  errors = {},
  onInputChange,
  existingImage,
  isAlzheimer = true,
}) => {
  const selectedImagePreview = useMemo(() => {
    if (!formData?.file) return "";
    return URL.createObjectURL(formData.file);
  }, [formData?.file]);

  useEffect(
    () => () => {
      if (selectedImagePreview) URL.revokeObjectURL(selectedImagePreview);
    },
    [selectedImagePreview],
  );

  const previewImage = selectedImagePreview || existingImage;

  return (
    <>
      <FormGroup>
        <Label className="col-form-label pt-0">Game Title</Label>
        <Input
          className="form-control"
          type="text"
          name="title"
          placeholder="Game Title"
          value={formData.title}
          onChange={onInputChange}
          invalid={Boolean(errors.title)}
        />
        {errors.title ? <FormFeedback>{errors.title}</FormFeedback> : null}
      </FormGroup>
      {isAlzheimer ? (
        <FormGroup>
          <Label className="col-form-label pt-0">Description</Label>
          <Input
            className="form-control"
            type="textarea"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={onInputChange}
            invalid={Boolean(errors.description)}
          />
          {errors.description ? (
            <FormFeedback>{errors.description}</FormFeedback>
          ) : null}
        </FormGroup>
      ) : null}
      <FormGroup>
        <Label className="col-form-label pt-0">Game Link</Label>
        <Input
          className="form-control"
          type="url"
          name="link_for_game"
          placeholder="https://games.careavatar.online/alzeimer/pattern-recognition/"
          value={formData.link_for_game}
          onChange={onInputChange}
          invalid={Boolean(errors.link_for_game)}
        />
        {errors.link_for_game ? (
          <FormFeedback>{errors.link_for_game}</FormFeedback>
        ) : null}
      </FormGroup>
      {isAlzheimer ? (
        <>
          <FormGroup>
            <Label className="col-form-label pt-0">Category</Label>
            <Input
              className="form-control"
              type="text"
              name="category"
              placeholder="Memory"
              value={formData.category}
              onChange={onInputChange}
              invalid={Boolean(errors.category)}
            />
            {errors.category ? (
              <FormFeedback>{errors.category}</FormFeedback>
            ) : null}
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label pt-0">Total Point</Label>
            <Input
              className="form-control"
              type="number"
              min="0"
              name="total_point"
              placeholder="100"
              value={formData.total_point}
              onChange={onInputChange}
              invalid={Boolean(errors.total_point)}
            />
            {errors.total_point ? (
              <FormFeedback>{errors.total_point}</FormFeedback>
            ) : null}
          </FormGroup>
        </>
      ) : null}
      {previewImage ? (
        <FormGroup>
          <Label className="col-form-label pt-0">
            {selectedImagePreview ? "Selected Thumbnail" : "Current Thumbnail"}
          </Label>
          <div>
            <img
              src={resolvePreviewImage(previewImage)}
              width="160"
              height="96"
              alt="game"
              className="rounded"
              style={{
                objectFit: "cover",
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
              }}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_GAME_IMAGE;
              }}
            />
          </div>
        </FormGroup>
      ) : null}
      <FormGroup>
        <Label className="col-form-label pt-0">Upload Thumbnail</Label>
        <Col sm="12">
          <Input
            className="form-control"
            type="file"
            accept="image/*"
            name="file"
            onChange={onInputChange}
            invalid={Boolean(errors.file)}
          />
          {errors.file ? <FormFeedback>{errors.file}</FormFeedback> : null}
        </Col>
      </FormGroup>
    </>
  );
};

export default GameFormFields;
