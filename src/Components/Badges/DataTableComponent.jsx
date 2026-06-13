import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, H5, Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "reactstrap";
import AddModal from "./AddModal";
import { fetchBadges } from "../../Redux/stateSlice/badgeReducer";
import { resolveAssetUrl } from "../../Utils/media";

const DEFAULT_BADGE_ICON =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><rect width='60' height='60' rx='30' fill='%23f3f4f6'/><circle cx='30' cy='24' r='10' fill='%23d1d5db'/><path d='M15 48c4-8 9-12 15-12s11 4 15 12' fill='%23d1d5db'/></svg>";

const resolveBadgeIcon = (badge) =>
  resolveAssetUrl(
    badge?.icon ||
      badge?.iconUrl ||
      badge?.iconURL ||
      badge?.badgeIcon ||
      badge?.badgeImage ||
      badge?.image ||
      badge?.imageUrl ||
      badge?.imageURL ||
      badge?.filepath ||
      badge?.filePath ||
      badge
  ) || DEFAULT_BADGE_ICON;

const DataTableComponent = () => {
  const [viewModal, setViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const dispatch = useDispatch();
  const { loading, badges, error, pagination } = useSelector((state) => state.badges);

  useEffect(() => {
    dispatch(fetchBadges(currentPage, perPage));
  }, [dispatch, currentPage, perPage]);

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
    return <p>Error: {error}</p>;
  }

  const tableColumns = [
    {
      name: "Icon",
      cell: (row) => (
        <Image
          attrImage={{
            className: "img-60 rounded-circle",
            src: resolveBadgeIcon(row),
            alt: row?.name || "Badge",
            onError: (event) => {
              event.currentTarget.src = DEFAULT_BADGE_ICON;
            },
          }}
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row?.name || "-",
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row?.price || "-",
      sortable: true,
      center: true,
      cell: (row) => <span>{row?.price ? `Rs. ${row.price}` : "-"}</span>,
    },
    {
      name: "Status",
      center: true,
      cell: () => <span className="badge badge-light-success">Active</span>,
    },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2">
        <H5 attrH5={{ className: "text-muted m-0" }}>Badges</H5>
        <Btn attrBtn={{ color: "primary", onClick: () => setViewModal(true) }}>
          Add Badge
        </Btn>
      </div>

      <DataTable
        data={Array.isArray(badges) ? badges : []}
        columns={tableColumns}
        striped
        pagination
        paginationServer
        paginationPerPage={perPage}
        paginationTotalRows={pagination?.totalItems || pagination?.totalBadges || badges.length}
        onChangePage={setCurrentPage}
        paginationDefaultPage={currentPage}
        noDataComponent={<div className="text-center p-4">No badges found</div>}
      />

      <AddModal viewModal={viewModal} setViewModal={setViewModal} />
    </Fragment>
  );
};

export default DataTableComponent;
