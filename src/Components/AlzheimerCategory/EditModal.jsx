import React, { useState, useEffect } from "react";
import {BASE_URL } from "../../Config/AppConstant";
import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  ModalFooter,
} from "reactstrap";
import { Btn } from "../../AbstractElements";
import { useDispatch } from "react-redux";
import { fetchGames,editGame } from "../../Redux/stateSlice/gamesReducer";

const EditModal = (props) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    label: "",
    link: "",
    file: null,
  });

  console.log(props.category)

  useEffect(() => {
    if (props.category) {
      setFormData({
        label: props.category.label || "",
        link: props.category.link || "",
        file: null,
      });
    }
  }, [props.category]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditCategory = async(dataNew) => {
    if (!formData.label || !formData.link) {
      alert("Please fill all required fields.");
      return;
    }
  
    const data = new FormData();
    data.append("label", formData.label);
    data.append("link", formData.link);
    if (formData.file) {
      data.append("image", formData.file); // Only include the file if provided
    }
    console.log(dataNew._id)
  
    console.log("edit-data", {
      id: dataNew._id,
      payload: formData.file ? "Updating name and image" : "Updating only name",
    });
  
   await dispatch(editGame(dataNew._id, data));
    props.EditModaltoggle();
  await  dispatch(fetchGames(1, 10))
  };
  

  return (
    <Modal
      isOpen={props.editModal}
      toggle={props.EditModaltoggle}
      size="md"
      centered
    >
      <ModalHeader
        style={{ padding: "15px 0px 0px 20px!important" }}
        toggle={props.EditModaltoggle}
      >
        Edit Game
      </ModalHeader>
      <hr />
      <ModalBody>
        <Form className="theme-form">
          <FormGroup>
            <Label className="col-form-label pt-0">Game Name</Label>
            <Input
              className="form-control"
              type="text"
              name="label"
              placeholder="Game Name"
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
            <img src={`${BASE_URL}${props?.category?.filepath}`} width={'60'} height={'60'} />
          </FormGroup>
          <FormGroup>
            <Label className="col-sm-3 col-form-label">Upload File</Label>
            <Col sm="9">
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
        <Btn attrBtn={{ color: "secondary", onClick: props.EditModaltoggle }}>
          Close
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick:()=> handleEditCategory(props.category) }}>
          Save
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
