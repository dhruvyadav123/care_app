import React, { Fragment, useCallback, useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, H6, Image, Spinner } from "../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers } from "../../../Redux/stateSlice/userReducer";
import { Col, FormGroup, Input, Form, Button } from "reactstrap";
import ViewModal from "./ViewModal";
import { BASE_URL } from "../../../Config/AppConstant";
import EditModal from "./EditModal";
import FilterModal from "../Vendor/FilterModal";
import { changeVendorStatus, fetchVendors, searchVendor } from "../../../Redux/stateSlice/vendorReducer";
import Switch from 'react-switch';

const DataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const dispatch = useDispatch();
  
  const { loading, vendors, error, pagination } = useSelector((state) => state.vendors);
  const [filterModal, setFilterModal] = useState(false);

  // Extract unique categories from vendors data
  const categories = useMemo(() => {
    if (!vendors || vendors.length === 0) return [];
    
    const allCategories = [];
    
    vendors.forEach(vendor => {
      const vendorCategories = isSearch ? vendor?.category : vendor?.expert?.category;
      
      if (vendorCategories && Array.isArray(vendorCategories)) {
        vendorCategories.forEach(cat => {
          if (cat && cat._id && !allCategories.find(existing => existing._id === cat._id)) {
            allCategories.push(cat);
          }
        });
      }
    });
    
    return allCategories;
  }, [vendors, isSearch]);

  // Helper function to get vendor data consistently - TOP LEVEL
  const getVendorData = (row, field) => {
    return isSearch ? row?.[field] : row?.expert?.[field];
  };

  // CustomOption component - TOP LEVEL
  const CustomOption = ({ row, handleDelete, EditModaltoggle }) => (
    <div className="d-flex">
      <button
        className="btn btn-light p-2 mx-1"
        onClick={() => handleView(row)}
      >
        <i
          style={{ fontSize: "large", color: "#494949" }}
          className="fa fa-arrows-alt"
        ></i>
      </button>
    </div>
  );

  // Define columns with memoization - TOP LEVEL (before any conditional returns)
  const tableColumns = useMemo(() => [
    {
      name: "Profile",
      sortable: true,
      center: false,
      cell: (row) => {
        const avatar = getVendorData(row, 'avatar');
        return (
          <div className="avatar">
            <Image
              attrImage={{
                body: true,
                className: "img-60 rounded-circle",
                src: avatar ? `${BASE_URL}/uploads/${avatar}` : "/default-avatar.png",
                alt: "#",
              }}
            />
          </div>
        );
      },
    },
    {
      name: "Name",
      selector: (row) => getVendorData(row, 'name') || 'N/A',
      sortable: true,
      center: true,
    },
    {
      name: "Email",
      selector: (row) => getVendorData(row, 'email') || 'N/A',
      sortable: true,
      center: true,
    },
    {
      name: "Phone",
      selector: (row) => getVendorData(row, 'phoneNumber') || 'N/A',
      sortable: true,
      center: true,
    },
    {
      name: "DOB",
      selector: (row) => getVendorData(row, 'dob') || 'N/A',
      sortable: true,
      center: true,
    },
    {
      name: "Category",
      sortable: true,
      cell: (row) => {
        const categoryData = getVendorData(row, 'category');
        return (
          <div>
            {categoryData?.map((cate, index) => (
              <span key={cate._id || index}>
                {cate.name}
                {index < categoryData.length - 1 ? ', ' : ''}
              </span>
            )) || 'N/A'}
          </div>
        );
      },
    },
    {
      name: "Status",
      cell: (row) => {
        const status = row?.expert?.status;
        const vendorId = isSearch ? row?._id : row?.expert?._id;
        
        return (
          <Switch
            onChange={(e) => handleStatusToggle(e, vendorId, status)}
            checked={status === "1"}
            offColor="#dc3545"
            onColor="#28a745"
            uncheckedIcon={false}
            checkedIcon={false}
            height={20}
            width={40}
          />
        );
      },
    },
    {
      name: "Option",
      center: true,
      minWidth: "150px",
      button: true,
      cell: (row) => (
        <CustomOption
          row={row}
          handleDelete={handleDelete}
          EditModaltoggle={EditModaltoggle}
        />
      ),
    },
  ], [isSearch, selectedCategory]);

  const toggleFilterModal = () => setFilterModal(!filterModal);

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch vendors with proper filtering
useEffect(() => {
  const filters = {};
  
  if (selectedCategory) {
    filters.category = selectedCategory;
  }

  dispatch(fetchVendors(currentPage, 10, filters));
}, [dispatch, currentPage, selectedCategory]);

  const EditModaltoggle = (data) => {
    setViewData(data);
    setEditModal(!editModal);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    dispatch(fetchUsers(currentPage, 10));
  };

  const handleView = (data) => {
    setViewModal(true);
    setViewData(data);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusToggle = async (e, id, currentStatus) => {
    const newStatus = currentStatus === "1" ? "0" : "1";
    await dispatch(changeVendorStatus(newStatus, id));
    
    // Refresh with current filters
    const filters = {};
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    dispatch(fetchVendors(currentPage, 10, Object.keys(filters).length > 0 ? filters : null));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      dispatch(searchVendor(search.trim()));
      setIsSearch(true);
      setSelectedCategory(''); // Clear category filter when searching
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setIsSearch(false);
    setSelectedCategory(''); // Clear category filter bhi
    setCurrentPage(1);
    dispatch(fetchVendors(1, 10));
  };

  const handleApplyFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filter applied
    setIsSearch(false); // Reset search
    setSearch(''); // Clear search text
  };

  const handleClearFilter = () => {
    setSelectedCategory('');
    setCurrentPage(1);
    dispatch(fetchVendors(1, 10));
  };

  const Modaltoggle = () => setViewModal(!viewModal);

  // Get selected category name for display
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return '';
    const category = categories.find(cat => cat._id === selectedCategory);
    return category ? category.name : '';
  }, [selectedCategory, categories]);

  // NOW the conditional returns - after all hooks are declared
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

  return (
    <Fragment>
      {/* Search and Filter Section */}
      <div className="d-flex align-items-center justify-content-between p-2 mb-2">
        <Form onSubmit={handleSearch}>
          <FormGroup>
            <div className="d-flex gap-3 align-items-center">
              <Input
                type="text"
                name="search"
                id="search"
                placeholder="Search Vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "250px" }}
              />
              <Btn attrBtn={{ color: "primary", type: "submit" }}>Search</Btn>
              
              {/* Show Clear buttons when search or filter is active */}
              {(isSearch || selectedCategory) && (
                <Button color="secondary" onClick={handleClearSearch}>
                  Clear All
                </Button>
              )}
            </div>
          </FormGroup>
        </Form>
        
        <div className="d-flex gap-2 align-items-center">
          {/* Show active filter badge */}
          {selectedCategory && (
            <div className="badge bg-primary d-flex align-items-center">
              Category: {selectedCategoryName}
              <button 
                className="btn btn-sm btn-light ms-2 p-0"
                onClick={handleClearFilter}
                style={{ width: '20px', height: '20px' }}
              >
                ×
              </button>
            </div>
          )}
          
          <Btn attrBtn={{ color: "primary", onClick: toggleFilterModal }}>
            Filter
          </Btn>
        </div>
      </div>

      {/* Show filter status */}
      {selectedCategory && (
        <div className="alert alert-info mb-3">
          Showing vendors for category: <strong>{selectedCategoryName}</strong>
          {vendors.length === 0 && " - No vendors found for this category"}
        </div>
      )}

      <DataTable
        data={vendors}
        columns={tableColumns}
        striped={true}
        center={true}
        pagination
        paginationServer
        paginationTotalRows={pagination?.totalExperts || 0}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        noDataComponent={
          <div className="text-center p-4">
            {selectedCategory ? 
              `No vendors found for category: ${selectedCategoryName}` : 
              "No vendors found"
            }
          </div>
        }
      />
      
      <ViewModal
        data={viewData}
        viewModal={viewModal}
        setViewModal={setViewData}
        Modaltoggle={Modaltoggle}
      />
      
      <EditModal
        data={viewData}
        editModal={editModal}
        setEditModal={setEditModal}
        EditModaltoggle={EditModaltoggle}
      />
      
      <FilterModal
        isOpen={filterModal}
        toggle={toggleFilterModal}
        categories={categories}
        selectedCategory={selectedCategory}
        applyFilter={handleApplyFilter}
        clearFilter={handleClearFilter}
      />
    </Fragment>
  );
};

export default DataTableComponent;
