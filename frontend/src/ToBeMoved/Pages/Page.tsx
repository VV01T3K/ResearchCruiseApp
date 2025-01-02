import React from 'react';
import {OpenedWithLocation} from '../App';

type Props = {
    className?: string,
    children?: React.ReactElement[] | React.ReactElement
}

function Page(props: Props) {
    const openedWithLocation = OpenedWithLocation();
    return (
        <div className="page">
            {!openedWithLocation && <div className="page-header-spacing" />}
            <div className="page-content-container">
                <div className={props.className + ' page-content'}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}


export default Page;