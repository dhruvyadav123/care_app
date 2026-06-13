import React, { useEffect, useRef, useState } from "react";
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
import { Btn } from "../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { fetchDietCharts, uploadDietChart } from "../../../Redux/stateSlice/dietChartReducer";

const AddModal = ({ viewModal, modalToggle }) => {
  const dispatch = useDispatch();
  const { uploadLoading } = useSelector((state) => state.dietCharts);
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!viewModal) {
      setFile(null);
      setFormError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [viewModal]);

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFormError("");
    }
  };

  const handleUploadDietChart = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!file) {
      setFormError("Please upload an Excel file.");
      return;
    }

    const isExcelFile =
      file.name?.toLowerCase().endsWith(".xlsx") ||
      file.name?.toLowerCase().endsWith(".xls");

    if (!isExcelFile) {
      setFormError("Only .xlsx or .xls files are allowed.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("attachment", file);
      await dispatch(uploadDietChart(formData));
      await dispatch(fetchDietCharts(1, 10));
      modalToggle();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Modal isOpen={viewModal} toggle={modalToggle} size="md" centered>
      <ModalHeader toggle={modalToggle}>Upload Excel File</ModalHeader>
      <hr />
      <ModalBody>
        <Form onSubmit={handleUploadDietChart}>
          <FormGroup>
            <Label className="col-sm-3 col-form-label">Upload File</Label>
            <Col sm="9">
              <Input
                innerRef={fileInputRef}
                type="file"
                onChange={handleInputChange}
                accept=".xlsx, .xls"
              />
            </Col>
          </FormGroup>
          <div className="text-muted small">
            Upload only Excel files. Diet chart rows will be created from the sheet data.
          </div>
          {formError ? <div className="text-danger mt-2 small">{formError}</div> : null}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Btn attrBtn={{ color: "secondary", onClick: modalToggle }}>Cancel</Btn>
        <Btn
          attrBtn={{
            color: "primary",
            onClick: handleUploadDietChart,
            disabled: uploadLoading,
          }}
        >
          {uploadLoading ? "Uploading..." : "Save"}
        </Btn>
      </ModalFooter>
    </Modal>
  );
};

export default AddModal;
