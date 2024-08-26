import React, {createContext, useContext} from "react";
import useWindowWidth from "../../../CommonComponents/useWindowWidth";
import {FieldValues} from "react-hook-form";
export const CellContext =
    createContext<null | {rowIndex:number, colIndex:number}>(null)

export const FieldContext =
    createContext<null | {field:FieldValues, fieldName:string}>(null)
export const KeyContext =
    createContext<null | string >(null)


type TableRow = any
export const FieldTableWrapper = (title: string, colWidths: number[],
                                  colTitles: string[], cellMapper: () => (() => React.JSX.Element)[],
                                  BottomMenu: React.JSX.Element, emptyText: string, content: TableRow[]) => {
    const windowWidth = useWindowWidth()


    const ColTitle = () => (
        <div className="table-field-column-title">
            <b>{title}</b>
        </div>
    )
    const MdColTitle = (props:{title:string, colIndex:number}) => (
        <div className="table-field-column-title-md" style={cellWidth(props.colIndex)}>
            <b>{props.title}</b>
        </div>
    )
    const TableHeader = () => (
        <div className="table-field-header">
            {colTitles.map((title, colIndex) => (
                <MdColTitle key={colIndex} title={title} colIndex={colIndex}/>
            ))}
            <ColTitle/>
        </div>
    )

    const EmptyRow = () => (
        <div className="table-field-no-content">
            {emptyText}
        </div>
    )

    const NonEmptyRow = (props:{rowIndex:number}) => (
        <div className={props.rowIndex % 2 ? "table-field-odd-row" : "table-field-even-row"}>
            {colWidths.map((_, colIndex) => (
                        <Cell key={colIndex} rowIndex={props.rowIndex} colIndex={colIndex}/>
                ))}
        </div>
    )

    const TableContent = () =>  (
            <>
                {content.map((_,rowIndex: number) => (
                    <NonEmptyRow key={rowIndex} rowIndex={rowIndex}/>
                ))}
            </>
        )

    const CellContent = () => {
        const cellContext = useContext(CellContext)
        const RenderComponent = cellMapper()[cellContext!.colIndex]
        return (
            <div className="table-field-row-column" style={cellWidth(cellContext!.colIndex)}>
                <RenderComponent/>
            </div>
        )
    }

    const Cell = (props: { colIndex: number, rowIndex: number }) =>
        (
            <CellContext.Provider value={{colIndex: props.colIndex, rowIndex: props.rowIndex}}>
               <CellContent/>
            </CellContext.Provider>
        )

    function cellWidth (colIndex:number) {
        return {width: windowWidth >= 720 ? `${colWidths[colIndex]}%` : "100%"}
    }

    const _RenderIfContent = () => (
        <>
            {content &&
                <div className="table-striped">
                    <TableHeader/>
                    {content.length <= 0 && <EmptyRow/>}
                    {content.length > 0 && <TableContent/>}
                    {BottomMenu}
                </div>
            }
        </>
    )
    const Render = () => (
        <_RenderIfContent/>
    )
    return {Render}
}