import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import * as types from './../../../constants/ActionTypes';
//components
import ContentLeft from './ContentLeft/ContentLeft';
import ContentRight from './ContentRight/ContentRight';

function Main() {
    // const [users, setUsers] = useState([]);
    const [date, setDate] = useState(new Date());
    const [user, setUser] = useState('');
    const [work, setWork] = useState({});

    useEffect(() => {getDateWork(date)}, []);
    const handleDate = async (date) => {
        setDate(date);
        getDateWork(date);
    }
    const getDateWork = async (date) =>{
        try {
            let config = {
                headers: {
                    'Authorization': localStorage.getItem('user')
                }
            }
            const res = await axios.get(`${types.URL}/users/history/${date}`, config);
            //console.log("fds");
            if (res.data.success) {
                //console.log(res.data.users);
                setUser(res.data.user);
                setWork(res.data.work);
            } else {
                setUser('');
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="row">
            <div className="col-sm-6">
                <ContentLeft user={user} date={date} work={work} />
            </div>
            <div className="col-sm-6">
                <ContentRight handleDate={handleDate} />
            </div>
        </div>
    )
}
export default Main;