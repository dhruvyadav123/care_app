import React, { Fragment, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Image, Spinner } from "../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { Col, Input, FormGroup, Form, Button } from "reactstrap";
import { BASE_URL } from "../../Config/AppConstant";
import { fetchCommunityCategories } from "../../Redux/stateSlice/allcommunityCategory";

const DataTableComponent = () => {
  const dispatch = useDispatch();
  const { loading, categories, error } = useSelector(
    (state) => state.communityCategoreis
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCommunityCategories());
    }
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredData = useMemo(() => {
    const safeCategories = Array.isArray(categories) ? categories : [];

    if (!isSearch) {
      return safeCategories;
    }

    return safeCategories.filter((row) =>
      row?.name?.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [categories, isSearch, searchInput]);

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  if (error) return <p>Error: {error}</p>;

  const tableColumns = [
    { name: "Name", selector: (row) => row.name, sortable: true, center: true },
    {
      name: "Category Icon",
      cell: (row) => (
        <div className="avatar">
          <Image
            attrImage={{
              body: true,
              className: "img-60 rounded-circle",
              src: `${BASE_URL}/uploads/${row?.image}`,
              alt: row?.name || "category",
            }}
          />
        </div>
      ),
    },
    { name: "User Count", selector: (row) => `${row.userCount}`, sortable: true },
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between p-2 mb-2">

        <Form
          inline
          onSubmit={(e) => {
            e.preventDefault();
            setIsSearch(true); // search trigger
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
                  setIsSearch(false);
                }}
              >
                Clear
              </Button>
            )}
          </FormGroup>
        </Form>

      </div>

      <DataTable
        data={filteredData}
        columns={tableColumns}
        striped
        center
        pagination
        paginationTotalRows={filteredData.length}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
      />
    </Fragment>
  );
};

export default DataTableComponent;
