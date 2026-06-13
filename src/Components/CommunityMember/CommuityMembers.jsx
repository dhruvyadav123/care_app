import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Spinner, Image } from "../../AbstractElements";
import { API_URL, BASE_URL } from "../../Config/AppConstant";

const CommunityMembers = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_URL}/communityMembers/${id}`);
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.community?.members) {
          setMembers(data[0].community.members);
        }
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [id]);

  const columns = [
    {
      name: "Avatar",
      cell: (row) => (
        <Image
          attrImage={{
            body: true,
            className: "img-40 rounded-circle",
            src: `${BASE_URL}/uploads/${row.avatar}`,
            alt: "#",
          }}
        />
      ),
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Phone", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Email", selector: (row) => row.email || "N/A", sortable: true },
    { name: "DOB", selector: (row) => row.dob || "-", sortable: true },
    { name: "Address", selector: (row) => row.address || "-", sortable: true },
  ];

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner attrSpinner={{ className: "loader-5" }} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-3">Community Members</h4>
      <DataTable data={members} columns={columns} striped pagination highlightOnHover />
    </div>
  );
};

export default CommunityMembers;
