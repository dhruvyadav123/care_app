import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicines, updateMedicine } from '../../../Redux/stateSlice/medicine';
import { z } from 'zod';

const UpdateMedicine = ({ data, editModal, setEditModal }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.roles);

    const medicineSchema = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        short_composition1: z.string().min(1, { message: "Short Composition 1 is required" }),
        short_composition2: z.string().min(1, { message: "Short Composition 2 is required" }),
    });

    const [formData, setFormData] = useState({
        name: '',
        short_composition1: '',
        short_composition2: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        short_composition1: '',
        short_composition2: '',
    });

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                short_composition1: data.short_composition1 || '',
                short_composition2: data.short_composition2 || '',
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationResult = medicineSchema.safeParse(formData);
        if (!validationResult.success) {
            const newErrors = validationResult.error.errors.reduce((acc, error) => {
                acc[error.path[0]] = error.message;
                return acc;
            }, {});
            setErrors(newErrors);
            return;
        }
        dispatch(updateMedicine(data._id, formData, setEditModal));
        dispatch(fetchMedicines());
    };

    return (
        <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="md" centered>
            <ModalHeader toggle={() => { setEditModal(false) }}>Update Medicine</ModalHeader>
            <hr />
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            invalid={!!errors.name}
                        />
                        <FormFeedback>{errors.name}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label for="short_composition1">Short Composition1</Label>
                        <Input
                            type="text"
                            name="short_composition1"
                            id="short_composition1"
                            value={formData.short_composition1}
                            onChange={handleChange}
                            invalid={!!errors.short_composition1}
                        />
                        <FormFeedback>{errors.short_composition1}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label for="short_composition2">Short Composition2</Label>
                        <Input
                            type="text"
                            name="short_composition2"
                            id="short_composition2"
                            value={formData.short_composition2}
                            onChange={handleChange}
                            invalid={!!errors.short_composition2}
                        />
                        <FormFeedback>{errors.short_composition2}</FormFeedback>
                    </FormGroup>

                    <ModalFooter>
                        <Button color="secondary" onClick={() => { setEditModal(false) }}>Cancel</Button>
                        <Button color="primary" type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update'}
                        </Button>
                    </ModalFooter>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default UpdateMedicine;
