import React, {Dispatch} from "react";
import Select from "react-select";




type Props = {
    className?: string,
    collection: any[],
    options: {
        label: string,
        value: string,
        sortMethod: (a: boolean) => void,
        directionAscending: boolean
    }[]
}


export default function ListSortMenu(props: Props) {
    return (
        <div className="d-flex flex-wrap justify-content-start align-items-center col-12 col-xl-6 p-3">
            <div className="d-flex mb-1 col-12">Sortowanie</div>
            <Select
                className="d-flex col-12"
                options={props.options}
                placeholder={"Wybierz kryterium"}
                onChange={selectedOption =>
                    selectedOption?.sortMethod(selectedOption.directionAscending)
                }
            />
        </div>
    )
}