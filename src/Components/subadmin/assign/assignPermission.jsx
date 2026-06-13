import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Row, Col, Card, CardBody, CardHeader, Spinner } from 'reactstrap';
import fetchRoles from '../../../Redux/stateSlice/roleReducer';
import axios from 'axios';
import { API_URL } from '../../../Config/AppConstant';

const UserPermission = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector(state => state.roles); 
  const [selectedRole, setSelectedRole] = useState('');
  const [permissionList, setPermissionList] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const token = localStorage.getItem('token');

  const fetchPermission = async () => {
    await axios.get(`${API_URL}/permission/fetch`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      if (Array.isArray(res.data.data)) {
        setPermissionList(res.data.data);
      } else {
        console.error("Fetched data is not an array");
      }
    }).catch((error) => {
      console.log("error::", error);
    });
  };

  useEffect(() => {
    fetchPermission();
    dispatch(fetchRoles());
  }, [dispatch]);

  const handlePermissionChange = (e) => {
    const { checked, value } = e.target;
    setPermissions((prevPermissions) => {
      if (checked) {
        return [...prevPermissions, value]; 
      } else {
        return prevPermissions.filter((id) => id !== value);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Permissions array before submitting:', permissions);

    try {
      await axios.put(`${API_URL}/permission/role/${selectedRole}`, {
        permission: permissions,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Permissions updated successfully');
      setPermissions([]);
      setSelectedRole('')
    } catch (error) {
      console.log("Error:", error);
      alert('An error occurred while updating permissions');
    }
  };

  return (
    <div className="container mt-5">
      <Card>
        <CardHeader>
          <h3>Assign Permissions to Role</h3>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="role">Role</Label>
                  <Input
                    type="select"
                    name="role"
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.role}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <h5>Permissions</h5>
            <Row>
              {permissionList.length > 0 ? permissionList.map((res) => (
                <Col sm={6} md={4} key={res._id}>
                  <FormGroup check>
                    <Label check style={{ fontSize: '16px', marginBottom: '10px' }}>
                      <input
                        type="checkbox"
                        value={res._id}
                        checked={permissions.includes(res._id)} 
                        onChange={handlePermissionChange}
                        style={{ marginRight: '10px' }}
                      />
                      {res.name}
                    </Label>
                  </FormGroup>
                </Col>
              )) : (
                <Col>
                  <Spinner color="primary" />
                  <p>Loading permissions...</p>
                </Col>
              )}
            </Row>

            <Button type="submit" color="primary" className="mt-3" style={{ width: '100%' }}>
              Assign Permissions
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UserPermission;
