import React, { useState } from "react";
import { BASE_URL } from "../../Config/AppConstant";
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
import { addGame,fetchGames } from "../../Redux/stateSlice/gamesReducer";

const AddModal = (props) => {

 
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    label: "",
    link: "",
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddCategory = async() => {
    if (!formData.label ||!formData.link || !formData.file) {
      alert("Please fill all fields.");
      return;
    }

    const data = new FormData();
    data.append("label", formData.label);
    data.append("link", formData.link);
    data.append("image", formData.file);

    console.log("add-data",data)
    // console.log("add-data",formData.categoryName,formData.file)

  await  dispatch(addGame(data));
    props.Modaltoggle();
   await dispatch(fetchGames(1, 10))
  };

  return (
    <Modal
      isOpen={props.viewModal}
      toggle={props.Modaltoggle}
      size="md"
      centered
    >
      <ModalHeader
        style={{ padding: "15px 0px 0px 20px!important" }}
        toggle={props.Modaltoggle}
      >
        Add Member
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
            <Label className="col-sm-3 col-form-label">Upload Thumbnail</Label>
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
        <Btn attrBtn={{ color: "secondary", onClick: props.Modaltoggle }}>
          Close
        </Btn>
        <Btn attrBtn={{ color: "primary", onClick: handleAddCategory }}>
          Save
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
