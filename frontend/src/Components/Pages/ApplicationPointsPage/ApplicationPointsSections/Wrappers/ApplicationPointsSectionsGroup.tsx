import React, {ReactNode} from "react";


type Props = {
    children?: React.ReactElement<any>[],
    sections: any
}


function ApplicationPointsSectionsGroup(props: Props){

    return (
        <div className="flex-grow-1 overflow-y-scroll justify-content-center">
            {React.Children.map(props.children, (child, index) => {
                if (child) {
                    return React.cloneElement(child, {id: index + 1})
                }
            })}
        </div>
    )
}


export default ApplicationPointsSectionsGroup