import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Input, FormGroup, Form } from "reactstrap";
import { Btn } from "../../AbstractElements";
import alzheimerService from "../../Services/alzheimer";
import AddAppointment from "./create";
import UpdateAppointment from "./update";
import ViewAppointment from "./view";
import Delete from "./delete";

const getDoctorNames = (appointment) => {
  const doctors = Array.isArray(appointment?.doctor)
    ? appointment.doctor
    : Array.isArray(appointment?.doctors)
    ? appointment.doctors
    : [];

  return doctors
    .map((doctor) => doctor?.name || doctor?.doctorName || doctor?.fullName || "")
    .filter(Boolean)
    .join(", ");
};

const getPatientIdValue = (appointment) => {
  const patient = appointment?.patientId || appointment?.patient || appointment?.userId;

  if (!patient) {
    return "";
  }

  if (typeof patient === "string") {
    return patient;
  }

  return (
    patient?._id ||
    patient?.patientId ||
    patient?.id ||
    patient?.patientCode ||
    ""
  );
};

const getAppointmentSortValue = (appointment) => {
  const createdAt = appointment?.createdAt ? new Date(appointment.createdAt).getTime() : 0;
  const updatedAt = appointment?.updatedAt ? new Date(appointment.updatedAt).getTime() : 0;
  const appointmentDate = appointment?.appointmentDate
    ? new Date(appointment.appointmentDate).getTime()
    : 0;

  return Math.max(createdAt, updatedAt, appointmentDate, 0);
};

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await alzheimerService.getAppointments();
      if (res?.success) {
        const normalizedAppointments = Array.isArray(res.data) ? [...res.data] : [];
        normalizedAppointments.sort(
          (first, second) => getAppointmentSortValue(second) - getAppointmentSortValue(first)
        );
        setAppointments(normalizedAppointments);
      } else {
        console.warn("No appointments found:", res);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await alzheimerService.deleteAppointment(selected._id);
      setDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const filteredData = appointments.filter((item) => {
    const normalizedSearch = search.trim().toLowerCase();
    const doctorNames = getDoctorNames(item).toLowerCase();
    const patientIdValue = getPatientIdValue(item).toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return doctorNames.includes(normalizedSearch) || patientIdValue.includes(normalizedSearch);
  });

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "Doctor(s)",
      selector: (row) => getDoctorNames(row) || "No Doctor Linked",
      sortable: true,
      center: true,
    },
    {
      name: "Patient ID",
      selector: (row) => getPatientIdValue(row) || "-",
      center: true,
    },
    {
      name: "Appointment Date",
      selector: (row) =>
        new Date(row.appointmentDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      sortable: true,
      center: true,
    },
    {
      name: "Time",
      selector: (row) => row.appointmentTime || "-",
      center: true,
    },
  ];

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form inline onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Input
              type="text"
              placeholder="Search by Doctor or Patient ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormGroup>
        </Form>
        <Btn attrBtn={{ color: "primary", onClick: () => setAddModal(true) }}>
          Add Appointment
        </Btn>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        striped
        highlightOnHover
      />

      <AddAppointment modal={addModal} setModal={setAddModal} refresh={fetchData} />
      <UpdateAppointment
        modal={editModal}
        setModal={setEditModal}
        data={selected}
        refresh={fetchData}
      />
      <ViewAppointment modal={viewModal} setModal={setViewModal} data={selected} />
      <Delete
        isDelete={deleteModal}
        setIsDelete={setDeleteModal}
        onDelete={handleDelete}
      />
    </Fragment>
  );
};

export default AppointmentTable;
