import React, {Dispatch, useState} from "react";
import Select from "react-select";
import {SelectWrapper} from "../FormPage/Wrappers/ReactSelectWrapper";


export type AnyStringFilterOption = {
    label: string,
    setFilter: Dispatch<any>
}

export type SelectStringFilterOption = {
    label: string,
    selectValues: string[],
    setFilter: Dispatch<any>
}

type Props = {
    className?: string,
    anyStringFilters: AnyStringFilterOption[]
    selectStringFilters: SelectStringFilterOption[]
}

