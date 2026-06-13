import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button, FormFeedback,Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { fetchVacinations, updateVacination } from '../../../Redux/stateSlice/vacination';
import { Spinner } from '../../../AbstractElements';

const UpdateVacination = ({ data, editModal, setEditModal }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.vacination);

    const vacinationSchema = z.object({
        vaccinationType: z.string().min(1, { message: "Vaccination Type is required" }),
        description: z.string().min(1, { message: "Description is required" }),
    });

    const [formData, setFormData] = useState({
        vaccinationType: '',
        description: ''
    });

    const [errors, setErrors] = useState({
        vaccinationType: '',
        description: '',
    });

    useEffect(() => {
        if (data) {
            setFormData({
                vaccinationType: data.vaccinationType || '',
                description: data.description || '',
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
        const validationResult = vacinationSchema.safeParse(formData);
        if (!validationResult.success) {
            const newErrors = validationResult.error.errors.reduce((acc, error) => {
                acc[error.path[0]] = error.message;
                return acc;
            }, {});
            setErrors(newErrors);
            return;
        }
        dispatch(updateVacination(data._id, formData, setEditModal));
        dispatch(fetchVacinations());
    };

    if (loading) {
        return (
            <Col className="vh-100 d-flex align-items-center justify-content-center">
                <div className="loader-box">
                    <Spinner className="loader-5" />
                </div>
            </Col>
        );
    }

    return (
        <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="md" centered>
            <ModalHeader toggle={() => { setEditModal(false) }}>Update Vaccination</ModalHeader>
            <hr />
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="vaccinationType">Vaccination Type</Label>
                        <Input
                            type="text"
                            name="vaccinationType"
                            id="vaccinationType"
                            value={formData.vaccinationType}
                            onChange={handleChange}
                            invalid={!!errors.vaccinationType}
                        />
                        <FormFeedback>{errors.vaccinationType}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            type="text"
                            name="description" // Use 'name' here
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            invalid={!!errors.description}
                        />
                        <FormFeedback>{errors.description}</FormFeedback>
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

export default UpdateVacination;
