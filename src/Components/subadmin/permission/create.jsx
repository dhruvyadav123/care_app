import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { API_URL } from '../../../Config/AppConstant';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const PermissionCreate = ({ addRoleModal, setAddRoleModal,allPermission }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const handleRoleChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        await axios.post(`${API_URL}/permission/create`, { name }, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            if (res) {
                setName('')
                allPermission();
            }
        }).catch((error) => {
            console.log("error::", error)
        })
        setAddRoleModal(false);
    };

    return (
        <Modal isOpen={addRoleModal} toggle={() => setAddRoleModal(false)} size="md" centered>
            <ModalHeader toggle={() => setAddRoleModal(false)}>Add New Permission</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="roleName">Permission</Label>
                        <Input
                            type="text"
                            id="roleName"
                            value={name}
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
                    Create
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default PermissionCreate;
