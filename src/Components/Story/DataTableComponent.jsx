import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H5, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import { deleteStory, fetchStories } from "../../Redux/stateSlice/storyReducer";
import { resolveAssetUrl } from "../../Utils/media";

const DEFAULT_STORY_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><rect width='60' height='60' rx='12' fill='%23f3f4f6'/><circle cx='30' cy='22' r='10' fill='%23d1d5db'/><path d='M14 48c3-9 10-14 16-14s13 5 16 14' fill='%23d1d5db'/></svg>";
const STORY_IMAGE_OVERRIDE_KEY = "story-image-overrides";

const getStoryImageOverride = (storyId) => {
  if (!storyId || typeof window === "undefined") {
    return null;
  }

  try {
    const overrides = JSON.parse(window.localStorage.getItem(STORY_IMAGE_OVERRIDE_KEY) || "{}");
    return overrides?.[storyId] || null;
  } catch (error) {
    return null;
  }
};

const withCacheBust = (src, story) => {
  if (!src || src.startsWith("data:")) {
    return src;
  }

  const version =
    story?.updatedAt ||
    story?.updated_at ||
    story?.modifiedAt ||
    story?.modified_at ||
    story?.createdAt ||
    story?._id;

  if (!version) {
    return src;
  }

  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${encodeURIComponent(version)}`;
};

const resolveImage = (story) => {
  const overriddenImage = getStoryImageOverride(story?._id);
  if (overriddenImage) {
    return overriddenImage;
  }

  return (
    withCacheBust(
      resolveAssetUrl(
      story?.image ||
        story?.imageUrl ||
        story?.imageURL ||
        story?.image_url ||
        story?.filepath ||
        story?.filePath ||
        story?.storyImage ||
        story?.storyImageUrl ||
        story?.story_image ||
        story?.story_image_url ||
        story?.banner ||
        story?.bannerImage ||
        story?.bannerUrl ||
        story?.thumbnail ||
        story?.thumbnailUrl ||
        story?.coverImage ||
        story?.coverUrl ||
        story?.media ||
        story?.asset ||
        story?.file ||
        story
      ),
      story
    ) || DEFAULT_STORY_IMAGE
  );
};

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { loading, stories, error, pagination, deleteLoading } = useSelector(
    (state) => state.stories
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("story-image-cache");
    }
    dispatch(fetchStories(currentPage, 10));
  }, [dispatch, currentPage]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this story?");
    if (!shouldDelete) return;
    await dispatch(deleteStory(id));
    dispatch(fetchStories(currentPage, 10));
  };

  const handleEditToggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };

  if (loading || deleteLoading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const tableColumns = [
    {
      name: "Image",
      cell: (row) => (
        <Image
          attrImage={{
            className: "img-60 rounded-circle",
            src: resolveImage(row),
            alt: row?.title || "Story Image",
            onError: (event) => {
              event.currentTarget.src = DEFAULT_STORY_IMAGE;
            },
          }}
        />
      ),
    },
    {
      name: "Title",
      selector: (row) => row?.title || "-",
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Short Description",
      selector: (row) => row?.shortDescription || "-",
      sortable: true,
      grow: 2,
      cell: (row) => (
        <span title={row?.shortDescription || "-"}>
          {(row?.shortDescription || "-").slice(0, 60)}
          {(row?.shortDescription || "").length > 60 ? "..." : ""}
        </span>
      ),
    },
    {
      name: "Order",
      selector: (row) => row?.order || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      cell: () => <span className="badge badge-light-success">Active</span>,
      center: true,
    },
    {
      name: "Option",
      center: true,
      minWidth: "150px",
      button: true,
      cell: (row) => (
        <div className="d-flex">
          <button className="btn btn-light p-2 mx-1" onClick={() => handleEditToggle(row)}>
            <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-edit" />
          </button>
          <button className="btn btn-light p-2 mx-1" onClick={() => handleDelete(row._id)}>
            <i style={{ fontSize: "large", color: "#494949" }} className="fa fa-trash-o" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <H5 attrH5={{ className: "text-muted m-0" }}>Story</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => setViewModal(true) }}>
          Add Story
        </Btn>
      </div>

      <DataTable
        data={Array.isArray(stories) ? stories : []}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalItems || pagination?.totalStories || stories.length}
        onChangePage={setCurrentPage}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        noDataComponent={<div className="text-center p-4">No stories found</div>}
      />

      <AddModal viewModal={viewModal} setViewModal={setViewModal} />
      <EditModal category={viewData} editModal={editModal} setEditModal={setEditModal} />
    </Fragment>
  );
};

export default DataTableComponent;
