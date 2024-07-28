import React, {useEffect, useState} from "react";

type Props = {
    title: string,
}


function PageTitle(props: Props){
    return (
        <div className="page-title">
                {props.title}
        </div>
    )
}


export default PageTitle