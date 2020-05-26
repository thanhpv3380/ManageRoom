import React, { useState, useEffect } from 'react';
import * as types from './../../constants/ActionTypes';
import axios from 'axios';
import moment from 'moment';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useHistory
} from "react-router-dom";

//css
import './Header.css';

// react strap
import { Dropdown, Modal, Button } from 'react-bootstrap';

// image
import Logo from './../../images/logo.png';

function Header() {
    let history = useHistory();
    const [show, setShow] = useState(false);

    const [user, setUser] = useState({});
    const [file, setFile] = useState();

    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        async function getDataUser() {

            try {
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('user')
                    }
                }
                const res = await axios.get(`${types.URL}/users`, config);
                //console.log("fds");
                if (res.data.success) {
                    setUser(res.data.user);
                    setDob(res.data.user.dob);
                    setEmail(res.data.user.email);
                    setPhone(res.data.user.phone);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getDataUser();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', file);
        const config = {
            headers: {
                'Authorization': localStorage.getItem('user'),
                'content-type': 'multipart/form-data'
            }
        };
        try {
            const res = await axios.post(`${types.URL}/users/update`, formData, config);
            if (res.data.success) {
                setUser(res.data.user);
                setDob(res.data.user.dob);
                setEmail(res.data.user.email);
                setPhone(res.data.user.phone);
                handleClose();
            }
        } catch (err) {
            console.log(err);
        }

    }
    const handleLogout = () => {
        localStorage.removeItem('user');
        history.push('/');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow p-3 mb-5 bg-white rounded">
            <Link className="navbar-brand mr-3" to="/home">
                <img src={Logo} width="50px" />
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/home">Lịch phân công</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/home/notification">Thông báo</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/home/betgame">Bầu cua</Link>
                    </li>
                </ul>
                <div className="d-flex align-items-center">
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" className="bg-white text-muted border border-white" vaid="dropdown-basic">
                            <img src={user.image} width="50px" height="50px" className="rounded-circle mr-2" />
                            {user.name}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="" onClick={handleShow}>Information</Dropdown.Item>
                            <Dropdown.Item href="" onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container tab">
                        <div className="user-img text-center mb-5">
                            <img src={user.image} className="tab-user-img mb-15" alt="avatar" />
                            <input type="file"
                                name="image"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="form-control-file border w-50 m-auto "
                            />
                        </div>
                        <ul>
                            <li>
                                <div className="user-title">Name:</div>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={user.name}
                                    // onChange={e => setName(e.target.value)}
                                    disabled
                                />
                            </li>
                            <li>
                                <div className="user-title">Address:</div>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    value={user.address}
                                    // onChange={e => setAddress(e.target.value)}
                                    disabled
                                />
                            </li>
                            <li>
                                <div className="user-title">Dob:</div>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="dob"
                                    placeholder="MM/DD/YYYY"
                                    value={moment(new Date(user.dob)).format("DD/MM/YYYY")}
                                    // onChange={e => setDob(e.target.value)}
                                    disabled
                                />
                            </li>
                            <li>
                                <div className="user-title">Email:</div>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={user.email}
                                    // onChange={e => setEmail(e.target.value)}
                                    disabled
                                />
                            </li>
                            <li>
                                <div className="user-title">Phone:</div>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={user.phone}
                                    // onChange={e => setPhone(e.target.value)}
                                    disabled
                                />
                            </li>

                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </nav>
    )
}
export default Header;