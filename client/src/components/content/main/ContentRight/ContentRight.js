import React, { useState } from 'react';

// big calendar
import Calendar from 'react-calendar';

//css
import 'react-calendar/dist/Calendar.css';

function ContentRight(props) {
    const [date, setDate] = useState(new Date());

    const handleChange = (date) => {
        setDate(date);
        props.handleDate(date);
    }
    return (
        <div style={{zIndex: 10}}>
            <Calendar
                onChange={handleChange}
                value={date}
            />
        </div>
    );
}
export default ContentRight;