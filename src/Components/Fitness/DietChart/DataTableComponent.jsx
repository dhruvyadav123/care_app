import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Spinner } from "../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Input, Form, Button } from "reactstrap";
import { fetchDietCharts } from "../../../Redux/stateSlice/dietChartReducer";
import AddModal from "./AddModal";

const DataTableComponent = () => {
  const [viewModal, setViewModal] = useState(false);
  const dispatch = useDispatch();
  const { loading, dietCharts, error, pagination } = useSelector(
    (state) => state.dietCharts
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const toggleModal = () => setViewModal((prev) => !prev);

  useEffect(() => {
    dispatch(fetchDietCharts(currentPage, 10));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  // filtered data based on search
  const filteredData = isSearch
    ? dietCharts.filter((item) =>
        String(item?.name || "").toLowerCase().includes(searchInput.toLowerCase())
      )
    : dietCharts;

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
    { name: "Name", selector: (row) => row.name, sortable: true, center: true },
    { name: "Serving Size", selector: (row) => row.servingSize, sortable: true, maxWidth: "120px" },
    { name: "Protein", selector: (row) => row.protein, sortable: true, maxWidth: "100px" },
    { name: "Fat", selector: (row) => row.fat, sortable: true, maxWidth: "100px" },
    { name: "Carbs", selector: (row) => row.carbs, sortable: true, maxWidth: "100px" },
    { name: "Calories", selector: (row) => row.calories, sortable: true, maxWidth: "100px" },
    { name: "Ideal Time", selector: (row) => row.idealTime, sortable: true },
    { name: "Suitable For", selector: (row) => row.suitableFor, sortable: true, maxWidth: "150px" }
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2 mb-2">
        <Form
          inline
          onSubmit={(e) => {
            e.preventDefault();
            setIsSearch(true);
            setCurrentPage(1); // reset page on search
          }}
        >
          <FormGroup className="d-flex gap-2">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button color="primary" type="submit">
              Search
            </Button>
            {isSearch && (
              <Button
                color="secondary"
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setIsSearch(false); // reset search
                }}
              >
                Clear
              </Button>
            )}
          </FormGroup>
        </Form>

        <Btn attrBtn={{ color: "primary", onClick: toggleModal }}>Add Diet Chart</Btn>
      </div>

      <DataTable
        data={filteredData}
        columns={tableColumns}
        striped
        center
        pagination
        paginationServer
        paginationTotalRows={pagination?.total || 0}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
      />

      <AddModal viewModal={viewModal} modalToggle={toggleModal} />
    </Fragment>
  );
};

export default DataTableComponent;
