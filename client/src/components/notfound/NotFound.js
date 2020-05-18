import React from 'react';

import {Link} from 'react-router-dom';

function NotFound(props) {
    return (
        <div className="container pt-5">
            <Link to="/home" className="float-right text-white"><i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back To Home</Link>
            <h1 className="text-center mt-5 text-white display-1 border">404</h1>
            
        </div>
    );
}

export default NotFound;