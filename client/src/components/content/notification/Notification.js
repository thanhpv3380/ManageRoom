import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as types from './../../../constants/ActionTypes';
import moment from 'moment';

function Notification(props) {
    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    useEffect(() => {
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
        getNotification();
    }, []);
    return (

        <div className="card">
            <div className="card-header d-flex justify-content-between">
                <h3>Featured</h3>
                <form className="form-inline my-2 my-lg-0 f-right">
                    <button className="btn btn-primary mr-3">+ Tạo thông báo</button>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
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
                                <h6><i className="fa fa-clock-o mr-2" />{moment(ele.notification.date).format('MMMM Do YYYY, h:mm:ss a')}</h6>
                            </div>
                        )
                    })
                }

            </div>
        </div>

    );
}

export default Notification;