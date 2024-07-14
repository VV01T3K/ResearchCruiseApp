import React, {Dispatch, useState} from "react";
import Select from "react-select";


export type ListSortOption = {
    label: string,
    value: string,
    sortMethod: (directionAscending: boolean) => void,
    directionAscending: boolean
}

type Props = {
    className?: string,
    options: ListSortOption[]
}


export default function ListSortMenu(props: Props) {
    const [showDropDown, setShowDropDown] = useState(false)

    return (
        <div className={`d-flex flex-wrap justify-content-start align-items-start p-2 ${props.className ?? ""}`}>
            <div className="d-flex flex-wrap justify-content-start align-items-center col-12">
                <button
                    className="btn btn-outline-info mb-2"
                    onClick={() => setShowDropDown(!showDropDown)}
                    style={{ fontSize: "inherit" }}
                >
                    {showDropDown ? "Sortowanie ▲" : "Sortowanie ▼"}
                </button>

                {showDropDown &&
                    <Select
                        className="d-flex col-12"
                        options={props.options}
                        placeholder={"Wybierz kryterium"}
                        onChange={selectedOption =>
                            selectedOption?.sortMethod(selectedOption.directionAscending)
                        }
                    />
                }
            </div>
        </div>
    )
}