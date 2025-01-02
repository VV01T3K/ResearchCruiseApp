import React, {CSSProperties, Ref, useContext,} from 'react';
import useWindowWidth from '../../../../hooks/useWindowWidth';
import {CellContext} from '@contexts/CellContext';
import {AutoSizer, CellMeasurer, CellMeasurerCache, List,} from 'react-virtualized';

// TODO: [Not important] Split to smaller parts

export const FieldTableWrapper = (
  title: string,
  colWidths: number[],
  colTitles: string[],
  cellMapper: () => (() => React.ReactNode)[],
  BottomMenu: React.JSX.Element | null,
  emptyText: string,
  content: any,
  reactWindow?: boolean
) => {
  const windowWidth = useWindowWidth();
  const tableHeight =
    window.innerHeight - 270 < 600 ? window.innerHeight - 270 : 600;
  const ColTitle = () => (
    <div className='table-field-column-title'>
      <b>{title}</b>
    </div>
  );
  const MdColTitle = (props: { title: string; colIndex: number }) => (
    <>
      {props.title && (
        <div
          className='table-field-column-title-md border-end border-white h-100 d-flex'
          style={cellWidth(props.colIndex)}
        >
          <b>{props.title}</b>
        </div>
      )}
      {!props.title && <></>}
    </>
  );
  const TableHeader = () => (
    <div className='table-field-header d-flex flex-row'>
      {colTitles.map((title, colIndex) => (
        <MdColTitle key={colIndex} title={title} colIndex={colIndex} />
      ))}
      <ColTitle />
    </div>
  );

  const EmptyRow = () => (
    <>
      {reactWindow && (
        <div
          style={{ height: tableHeight }}
          className='table-field-no-content align-items-center'
        >
          {emptyText}
        </div>
      )}
      {!reactWindow && (
        <div className='table-field-no-content'>{emptyText}</div>
      )}
    </>
  );

  const NonEmptyRow = ({
    index,
    style,
    _ref,
  }: {
    index: number;
    style: CSSProperties | undefined;
    _ref?: Ref<any>;
  }) => (
    <div
      ref={_ref}
      className={index % 2 ? 'table-field-odd-row' : 'table-field-even-row'}
      style={style}
    >
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
      <>
        {reactWindow && (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                width={width}
                height={tableHeight}
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
                    {({ registerChild }) => (
                      <NonEmptyRow
                        key={key}
                        index={index}
                        style={style}
                        _ref={registerChild}
                      />
                    )}
                  </CellMeasurer>
                )}
              />
            )}
          </AutoSizer>
        )}
        {!reactWindow && (
          <div
            className={
              'flex-grow-1 overflow-scroll-override d-flex flex-column'
            }
          >
            {content.map((_: any, rowIndex: number) => (
              <NonEmptyRow key={rowIndex} index={rowIndex} style={undefined} />
            ))}
          </div>
        )}
      </>
    </>
  );

  const CellContent = () => {
    const cellContext = useContext(CellContext);
    const RenderComponent = cellMapper()[cellContext!.colIndex];
    return (
      <div
        className='table-field-row-column'
        style={cellWidth(cellContext!.colIndex)}
      >
        {RenderComponent()}
      </div>
    );
  };

  const Cell = (props: { colIndex: number; rowIndex: number }) => (
    <CellContext.Provider
      value={{ colIndex: props.colIndex, rowIndex: props.rowIndex }}
    >
      <CellContent />
    </CellContext.Provider>
  );

  function cellWidth(colIndex: number) {
    return { width: windowWidth >= 768 ? `${colWidths[colIndex]}%` : '100%' };
  }

  const Render = (props: { className?: string }) => (
    <div
      className={'table-striped mh-100 d-flex flex-column ' + props.className}
    >
      <TableHeader />
      {!(content?.length > 0) && <EmptyRow />}
      {content && content.length > 0 && <TableContent />}
      {BottomMenu}
    </div>
  );
  return { Render };
};
