import React, { useContext, useState } from "react";
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
import homeBannersService from "../../Services/homeBanner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomizerContext from "../../_helper/Customizer";


const AddModal = (props) => {
  const { layoutURL } = useContext(CustomizerContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  console.log(formData, "this is set form data")
  const handleAddCategory = async() => {
    if (!formData.file) {
      alert("Please fill all fields.");
      return;
    }

    const data = new FormData();
    data.append("image", formData.file);

    try {
      await homeBannersService.create(data);
      toast.success("Banner created successfully!");
      navigate(`${process.env.PUBLIC_URL}/banner/home_banner`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lead.");
    }

  // await  dispatch(addGame(data));
  //   props.Modaltoggle();
  //  await dispatch(fetchGames(1, 10))
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
        Add Extra Banners
      </ModalHeader>
      <hr />
      <ModalBody>
        <Form className="theme-form">
          {/* <FormGroup>
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
          </FormGroup> */}
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

