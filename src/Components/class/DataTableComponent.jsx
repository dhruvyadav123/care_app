import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H5, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { fetchClasses } from "../../Redux/stateSlice/classReducer";

const DataTableComponent = () => {
  const [viewData, setViewData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [classData, setClassData] = useState([]);

  const dispatch = useDispatch();
  const { loading, error, classes } = useSelector((state) => state.class);

  const getImageUrl = (image) => {
    if (!image) return "";

    const imagePath =
      typeof image === "string"
        ? image
        : image?.path || image?.url || image?.filename || "";

    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    const normalizedPath = imagePath.startsWith("/")
      ? imagePath
      : `/uploads/${imagePath}`;

    return `${BASE_URL}${normalizedPath}`;
  };

  const getClassImages = (row) => {
    const rawImages = row?.image || row?.images || row?.filepath || row?.filePath;
    const imageList = Array.isArray(rawImages) ? rawImages : [rawImages];

    return imageList.map(getImageUrl).filter(Boolean);
  };

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(classes?.onlineClass)) {
      setClassData(classes.onlineClass);
    } else {
      setClassData([]);
    }
  }, [classes]);

  const EditModaltoggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };

  const Modaltoggle = () => setViewModal(!viewModal);

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
  }

  const tableColumns = [
    {
      name: "Image",
      selector: (row) => row.image,
      sortable: false,
      center: true,
      className: "text-center",
      cell: (row) => {
        const images = getClassImages(row);
        console.log("class images:", images);

        return (
          <div className="d-flex justify-content-center flex-wrap">
            {images.length > 0 ? (
              images.map((img, index) => (
              <img
                key={`${img}-${index}`}
                className="img-60 rounded mx-1"
                src={img}
                alt={row?.name || "Class"}
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              ))
            ) : (
              <span className="text-muted">No Image</span>
            )}
          </div>
        );
      },
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      center: true,
      className: "text-center",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      center: true,
      className: "text-center",
    },
    {
      name: "Category",
      selector: (row) => row?.classCategoryId?.name,
      sortable: true,
      center: true,
      className: "text-center",
    },
    {
      name: "Creator",
      selector: (row) => row?.creatorId?.name,
      sortable: true,
      center: true,
      className: "text-center",
    },
    {
      name: "Video",
      selector: (row) => row.video,
      sortable: false,
      center: true,
      className: "text-center",
      cell: (row) => (
        <div className="d-flex justify-content-center flex-wrap">
          {Array.isArray(row.video) && row.video.length > 0 ? (
            row.video.map((vid, index) => (
              <video key={index} width="80" height="50" controls>
                <source src={`${BASE_URL}/uploads/video-1735880867518.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))
          ) : (
            <span className="text-muted">No Video</span>
          )}
        </div>
      ),
    },
    {
      name: "Actions",
      center: true,
      minWidth: "150px",
      button: true,
      className: "text-center",
      cell: (row) => (
        <div className="d-flex justify-content-center">
          <button className="btn btn-light p-2 mx-1" onClick={() => EditModaltoggle(row)}>
            <i className="fa fa-edit" style={{ fontSize: "large", color: "#494949" }}></i>
          </button>
          {/* <button className="btn btn-light p-2 mx-1">
            <i className="fa fa-trash-o" style={{ fontSize: "large", color: "#494949" }}></i>
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <H5 attrH5={{ className: "text-muted m-0" }}>Class</H5>
        <Btn attrBtn={{ color: "primary", onClick: Modaltoggle }}>
          Add Online Class
        </Btn>
      </div>

      <DataTable
        data={classData}
        columns={tableColumns}
        striped
        center
        pagination
        selectableRows
      />

      <AddModal viewModal={viewModal} setViewModal={setViewModal} Modaltoggle={Modaltoggle} />
      <EditModal category={viewData} editModal={editModal} setEditModal={setEditModal} EditModaltoggle={EditModaltoggle} />
    </Fragment>
  );
};

export default DataTableComponent;
