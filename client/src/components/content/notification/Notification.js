import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as types from './../../../constants/ActionTypes';
import moment from 'moment';

// react strap
import { Dropdown, Modal, Button } from 'react-bootstrap';

function Notification(props) {
    const [show, setShow] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {getNotification()}, []);
    const getNotification = async () => {
        try {
            let config = {
                headers: {
                    'Authorization': localStorage.getItem('user')
                }
            }
            const res = await axios.get(`${types.URL}/notifications/getList`, config);
            //console.log("fds");
            if (res.data.success) {
                setNotifications(res.data.notifications);
            }
        } catch (error) {
            console.log(error);
        }
    } 
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const config = {
            headers: {
                'Authorization': localStorage.getItem('user') 
            }
        };
        try {
            const res = await axios.post(`${types.URL}/notifications/send`, {title, content}, config);
            if (res.data.success) {
                getNotification();
                handleClose();
            }
        } catch (err) {
            console.log(err);
        }
        setContent('');
        setTitle('');
    }
    return (

        <div className="card">
            <div className="card-header d-flex justify-content-between">
                <h3>Featured</h3>
                <form className="form-inline my-2 my-lg-0 f-right">
                    <a className="btn btn-primary mr-3 text-white" onClick={handleShow}>+ Tạo thông báo</a>
                    {/* <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> */}
                </form>
            </div>
            <div className="card-body">
                {
                    notifications.map((ele, index) => {
                        return(
                            <div className="alert alert-primary alert-style" role="alert" key={index}>
                                <div className="d-flex mb-3">
                                    <img className="mr-3" src={ele.user.image} width="30px" height="30px" />
                                    <h4 className>{ele.user.name}</h4>
                                </div>
                                <p>{ele.notification.content}</p>
                                <h6><i className="fa fa-clock-o mr-2" />{moment(new Date(ele.notification.date)).format('MMMM Do YYYY, h:mm:ss a')}</h6>
                            </div>
                        )
                    })
                }

            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container tab">
                        <ul>
                            <li>
                                <div className="user-title">Title:</div>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={title}
                                     onChange={e => setTitle(e.target.value)}
                                />
                            </li>
                            <li>
                                <div className="user-title">Content:</div>
                                <textarea 
                                    class="form-control" 
                                    rows="5" 
                                    name="content"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                ></textarea>
                            </li>
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
}

export default Notification;