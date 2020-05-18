import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import * as types from './../../../../constants/ActionTypes';
//css 
import './ContentLeft.css';

function ContentLeft(props) {
    const [currentUser, setCurrentUser] = useState({});
    const handleConfirm = async (e) => {
        e.preventDefault();
        const today = new Date();
        if (moment(props.date).format("MMM Do YY") === moment(today).format("MMM Do YY")){
            try {
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('user')
                    }
                }
                const res = await axios.get(`${types.URL}/users/updateWork`, config);
                //console.log("fds");
                if (res.data.success){
                    alert('success');
                    //console.log(res.data.users);
                    //setUsers(res.data.users);
                } 
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Not today');
        }
    }

    return (
        <div className="container-left">

            <div className="card">
                {
                    props.user ?
                        <div className="card-body d-flex flex-wrap">
                            <div className="box">
                                <div className="imgBx">
                                    <img src={props.user.image} />
                                </div>
                                <div className="content">
                                    <div>
                                        <h1>{props.user.name}</h1>
                                        <p>Quê quán: {props.user.address}</p>
                                        <p>Thời gian: {moment(props.work.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="card-body flex-wrap">
                            {/* <input type="file" className="mb-3" /> */}
                            <div className="d-flex">
                                {/* <select className="custom-select mr-2" onChange={handleChange}>
                                    {
                                        props.users.map((user, index) => {
                                            return (
                                                <option key={index} value={user}>{user.name}</option>
                                            )
                                        })
                                    }
                                </select> */}
                                <button className="btn btn-success" onClick={handleConfirm}>Confirm</button>
                            </div>
                            <div className="mt-3">
                                <h1>Nobody</h1>
                            </div>
                        </div>
                }
            </div>
        </div>       
    )
}
export default ContentLeft