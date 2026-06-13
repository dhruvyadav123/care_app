import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  ModalFooter,
} from "reactstrap";
import { Btn } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import {
  editAlzheimerGame,
  fetchAlzheimerGames,
} from "../../Redux/stateSlice/alzheimerGamesReducer";
import { editGame, fetchGames } from "../../Redux/stateSlice/gamesReducer";
import GameFormFields from "./GameFormFields";

const getExistingImageValue = (game) =>
  game?.image?.url ||
  game?.image?.path ||
  game?.image?.secure_url ||
  game?.image?.location ||
  game?.image ||
  game?.filepath ||
  game?.filePath ||
  game?.path ||
  game?.url ||
  game?.imageUrl ||
  game?.image_url ||
  game?.thumbnail?.url ||
  game?.thumbnail?.path ||
  game?.thumbnail ||
  game?.thumbnailUrl ||
  game?.thumbnail_url ||
  game?.gameImage?.url ||
  game?.gameImage?.path ||
  game?.gameImage ||
  game?.coverImage?.url ||
  game?.coverImage?.path ||
  game?.coverImage ||
  game?.file?.url ||
  game?.file?.path ||
  game?.file ||
  "";

const EditModal = (props) => {
  const dispatch = useDispatch();
  const isAlzheimer = props.gameType === "alzheimer";
  const alzheimerEditLoading = useSelector((state) => state.alzheimerGames?.editLoading);
  const autismEditLoading = useSelector((state) => state.allGames?.editLoading);
  const editLoading = isAlzheimer ? alzheimerEditLoading : autismEditLoading;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link_for_game: "",
    category: "",
    total_point: "",
    file: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (props.category) {
      setFormData({
        title: props.category.title || props.category.label || "",
        description: props.category.description || "",
        link_for_game: props.category.link_for_game || props.category.link || "",
        category: props.category.category || "",
        total_point: props.category.total_point || "",
        file: null,
      });
      setErrors({});
    }
  }, [props.category]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const nextValue = files ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) nextErrors.title = "Title is required.";
    if (isAlzheimer && !formData.description.trim()) {
      nextErrors.description = "Description is required.";
    }
    if (!formData.link_for_game.trim()) {
      nextErrors.link_for_game = "Game link is required.";
    }
    if (isAlzheimer && !formData.category.trim()) nextErrors.category = "Category is required.";
    if (isAlzheimer && (!formData.total_point || Number(formData.total_point) < 0)) {
      nextErrors.total_point = "Enter a valid point value.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEditCategory = async (dataNew) => {
    if (!validateForm()) return;

    const data = new FormData();
    if (isAlzheimer) {
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("link_for_game", formData.link_for_game.trim());
      data.append("category", formData.category.trim());
      data.append("total_point", String(formData.total_point).trim());
    } else {
      data.append("label", formData.title.trim());
      data.append("link", formData.link_for_game.trim());
    }
    if (formData.file) {
      data.append("image", formData.file);
    }

    try {
      await dispatch(isAlzheimer ? editAlzheimerGame(dataNew._id, data) : editGame(dataNew._id, data));
      props.EditModaltoggle();
      await dispatch(isAlzheimer ? fetchAlzheimerGames(props.currentPage || 1, 10) : fetchGames(props.currentPage || 1, 10));
    } catch (error) {
      // Errors are already surfaced by the request interceptor.
    }
  };

  return (
    <Modal
      isOpen={props.editModal}
      toggle={props.EditModaltoggle}
      size="md"
      centered
      scrollable
    >
      <ModalHeader toggle={props.EditModaltoggle}>
        Edit Game
      </ModalHeader>
      <ModalBody style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Form className="theme-form">
          <GameFormFields
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            existingImage={getExistingImageValue(props?.category)}
            isAlzheimer={isAlzheimer}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: props.EditModaltoggle }}>
          Close
        </Btn>
        <Btn
          attrBtn={{
            color: "primary",
            onClick: () => handleEditCategory(props.category),
            disabled: editLoading,
          }}
        >
          {editLoading ? "Saving..." : "Save"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
