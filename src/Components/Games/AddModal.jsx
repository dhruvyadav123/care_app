import React, { useState } from "react";
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
  addAlzheimerGame,
  fetchAlzheimerGames,
} from "../../Redux/stateSlice/alzheimerGamesReducer";
import { addGame, fetchGames } from "../../Redux/stateSlice/gamesReducer";
import GameFormFields from "./GameFormFields";

const AddModal = (props) => {
  const dispatch = useDispatch();
  const isAlzheimer = props.gameType === "alzheimer";
  const alzheimerAddLoading = useSelector((state) => state.alzheimerGames?.addLoading);
  const autismAddLoading = useSelector((state) => state.allGames?.addLoading);
  const addLoading = isAlzheimer ? alzheimerAddLoading : autismAddLoading;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link_for_game: "",
    category: "",
    total_point: "",
    file: null,
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.file) nextErrors.file = "Thumbnail is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link_for_game: "",
      category: "",
      total_point: "",
      file: null,
    });
    setErrors({});
  };

  const handleAddCategory = async () => {
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
    data.append("image", formData.file);

    try {
      await dispatch(isAlzheimer ? addAlzheimerGame(data) : addGame(data));
      props.Modaltoggle();
      resetForm();
      await dispatch(isAlzheimer ? fetchAlzheimerGames(1, 10) : fetchGames(1, 10));
    } catch (error) {
      // Errors are already surfaced by the request interceptor.
    }
  };

  return (
    <Modal
      isOpen={props.viewModal}
      toggle={props.Modaltoggle}
      size="md"
      centered
      scrollable
    >
      <ModalHeader toggle={props.Modaltoggle}>
        Add Game
      </ModalHeader>
      <ModalBody style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Form className="theme-form">
          <GameFormFields
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isAlzheimer={isAlzheimer}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: props.Modaltoggle }}>
          Close
        </Btn>
        <Btn
          attrBtn={{
            color: "primary",
            onClick: handleAddCategory,
            disabled: addLoading,
          }}
        >
          {addLoading ? "Saving..." : "Save"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
