import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import fetchRoles from '../../../Redux/stateSlice/roleReducer';
import { API_URL } from '../../../Config/AppConstant';

const RoleCreate = ({ addRoleModal, setAddRoleModal }) => {
    const dispatch = useDispatch();
    const [roleName, setRoleName] = useState('');
    const handleRoleChange = (e) => {
        setRoleName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        await axios.post(`${API_URL}/role/create`, { role: roleName }, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            if (res) {
                dispatch(fetchRoles());
                setRoleName('')
            }
            console.log("User Role Added Successfullly")
        }).catch((error) => {
            console.log("error::", error)
        })
        setAddRoleModal(false);
    };

    return (
        <Modal isOpen={addRoleModal} toggle={() => setAddRoleModal(false)} size="md" centered>
            <ModalHeader toggle={() => setAddRoleModal(false)}>Add New Role</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="roleName">Role Name</Label>
                        <Input
                            type="text"
                            id="roleName"
                            value={roleName}
                            onChange={handleRoleChange}
                            required
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => setAddRoleModal(false)}>
                    Cancel
                </Button>
                <Button color="primary" onClick={handleSubmit}>
                    Save Role
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default RoleCreate;
