import React, { CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import useWindowWidth from '../../../../hooks/useWindowWidth';
import { CellContext } from '@contexts/CellContext';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';


// TODO: [Not important] Split to smaller parts

export const FieldTableWrapper = (title: string, colWidths: number[],
                                  colTitles: string[], cellMapper: () => (() => React.ReactNode)[],
                                  BottomMenu: React.JSX.Element | null, emptyText: string, content: any,
                                  reactWindow?: boolean) => {
    const windowWidth = useWindowWidth();

    const rootRef = useRef<HTMLDivElement>(null);


    const ColTitle = () => (
        <div className="table-field-column-title">
            <b>{title}</b>
        </div>
    );
    const MdColTitle = (props: { title: string, colIndex: number }) => (
        <>
            {props.title && <div className="table-field-column-title-md border-end border-white h-100 d-flex"
                                 style={cellWidth(props.colIndex)}>
                <b>{props.title}</b>
            </div>}
            {!props.title && <></>}
        </>

    );
    const TableHeader = () => (
        <div className="table-field-header d-flex flex-row">
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

    const NonEmptyRow = ({ index, style }: { index: number, style: CSSProperties | undefined }) => (
        <div className={index % 2 ? 'table-field-odd-row' : 'table-field-even-row'} style={style}>
            {colWidths.map((_, colIndex) => (
                <Cell key={colIndex} rowIndex={index} colIndex={colIndex} />
            ))}
        </div>
    );

    const cache = new CellMeasurerCache({
        defaultHeight: 50,
        fixedWidth: true,
    });
    const TableContent = () => (
        <>
            {reactWindow &&
                // <div ref={rootRef} className={'h-100 '}>
                <div ref={rootRef} className="vh-100">
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                width={width}
                                height={height}
                                rowCount={content.length}
                                rowHeight={cache.rowHeight}
                                deferredMeasurementCache={cache}
                                rowRenderer={({ index, key, parent, style }) => (
                                    <CellMeasurer
                                        key={key}
                                        cache={cache}
                                        parent={parent}
                                        columnIndex={0}
                                        rowIndex={index}
                                    >
                                        <NonEmptyRow key={key} index={index} style={style} />
                                    </CellMeasurer>
                                )}
                            />
                        )
                        }
                    </AutoSizer>
                </div>
                // </div>
            }
            {!reactWindow &&
                <div className={'flex-grow-1 overflow-scroll-override d-flex flex-column'}>
                    {content.map((_: any, rowIndex: number) => (
                        <NonEmptyRow key={rowIndex} index={rowIndex} style={undefined} />
                    ))}
                </div>
            }
        </>


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
        return { width: windowWidth >= 768 ? `${colWidths[colIndex]}%` : '100%' };
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