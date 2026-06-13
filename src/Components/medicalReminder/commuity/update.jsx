import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createCommunity, fetchCommunity } from '../../../Redux/stateSlice/community';
import axios from 'axios';
import { LOCAL_URL } from '../../../Config/AppConstant';

const UpdateCommunity = ({ addModal, setAddModal }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.community);
    const [categories,setCategories] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        // creator: '',
        category: '',
        type: '',
        hobbies: [],
        // members: '',
        communityLogo: null,
    });

    const fetchCategory = async () => {
        const token = localStorage.getItem('token')
        await axios.get(`${LOCAL_URL}/getCategory`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        ).then((res) => {
            console.log("response::",res);
            setCategories(res.data.categories)
        }).catch((err) => {
            console.log("error",err)
        })
    }

    useEffect(() => {
        fetchCategory();
    },[])

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (name === 'communityLogo' && type === 'file') {
            setFormData({ ...formData, communityLogo: files[0] }); 
        } else if (name === 'hobbies') {
            setFormData({ ...formData, hobbies: value.split(',').map(item => item.trim()) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await dispatch(createCommunity(formData));
        dispatch(fetchCommunity());
        setAddModal(false);
    };

    return (
        <Modal isOpen={addModal} toggle={() => { setAddModal(false) }} size="md" centered>
            <ModalHeader toggle={() => { setAddModal(false) }}>Create Community</ModalHeader>
            <hr />
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Community Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </FormGroup>

                     <FormGroup>
                        <Label for="category">Category</Label>
                        <Input
                            type="select"
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option>Select Category</option>
                            {categories.map((res) => (
                                <option key={res._id} value={res._id}>
                                    {res.name}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="type">Type</Label>
                        <Input
                            type="select"
                            name="type"
                            id="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="hobbies">Hobbies</Label>
                        <Input
                            type="text"
                            name="hobbies"
                            id="hobbies"
                            value={formData.hobbies.join(',')}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="communityLogo">Community Logo</Label>
                        <Input
                            type="file"
                            name="communityLogo"
                            id="communityLogo"
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <ModalFooter>
                        <Button color="secondary" onClick={() => { setAddModal(false) }}>Cancel</Button>
                        <Button color="primary" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </ModalFooter>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default UpdateCommunity;
