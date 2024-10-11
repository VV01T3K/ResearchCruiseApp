import React, { useContext } from 'react';
import useWindowWidth from '../../../../hooks/useWindowWidth';
import { CellContext } from '@contexts/CellContext';

// TODO: [Not important] Split to smaller parts

export const FieldTableWrapper = (title: string, colWidths: number[],
                                  colTitles: string[], cellMapper: () => (() => React.ReactNode)[],
                                  BottomMenu: React.JSX.Element | null, emptyText: string, content: any) => {
    const windowWidth = useWindowWidth();


    const ColTitle = () => (
        <div className="table-field-column-title">
            <b>{title}</b>
        </div>
    );
    const MdColTitle = (props: { title: string, colIndex: number }) => (
        <div className="table-field-column-title-md" style={cellWidth(props.colIndex)}>
            <b>{props.title}</b>
        </div>
    );
    const TableHeader = () => (
        <div className="table-field-header d-flex">
            {colTitles.map((title, colIndex) => (
                <MdColTitle key={colIndex} title={title} colIndex={colIndex} />
            ))}
            <ColTitle />
        </div>
    );

    const EmptyRow = () => (
        <div className="table-field-no-content">
            {emptyText}
        </div>
    );

    const NonEmptyRow = (props: { rowIndex: number }) => (
        <div className={props.rowIndex % 2 ? 'table-field-odd-row' : 'table-field-even-row'}>
            {colWidths.map((_, colIndex) => (
                <Cell key={colIndex} rowIndex={props.rowIndex} colIndex={colIndex} />
            ))}
        </div>
    );

    const TableContent = () => (
        <div className={'flex-grow-1 overflow-scroll d-flex flex-column'}>
            {content.map((_: any, rowIndex: number) => (
                <NonEmptyRow key={rowIndex} rowIndex={rowIndex} />
            ))}
        </div>
    );

    const CellContent = () => {
        const cellContext = useContext(CellContext);
        const RenderComponent = cellMapper()[cellContext!.colIndex];
        return (
            <div className="table-field-row-column" style={cellWidth(cellContext!.colIndex)}>
                {RenderComponent()}
            </div>
        );
    };

    const Cell = (props: { colIndex: number, rowIndex: number }) =>
        (
            <CellContext.Provider value={{ colIndex: props.colIndex, rowIndex: props.rowIndex }}>
                <CellContent />
            </CellContext.Provider>
        );

    function cellWidth(colIndex: number) {
        return { width: windowWidth >= 720 ? `${colWidths[colIndex]}%` : '100%' };
    }

    const Render = (props: { className?: string }) => (
        <div className={'table-striped d-flex flex-column ' + props.className}>
            <TableHeader />
            {!(content?.length > 0) && <EmptyRow />}
            {content && content.length > 0 && <TableContent />}
            {BottomMenu}
        </div>
    );
    return { Render };
};