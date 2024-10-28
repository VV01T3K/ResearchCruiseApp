import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { ButtonProps } from 'react-bootstrap';
import { EmptyFunction } from '@consts/EmptyFunction';
import { Button } from 'bootstrap';

export const ClickableOnceButton = (props: ButtonProps) => {

    const [isClicked, setIsClicked] =
        useState<null | React.MouseEvent<HTMLButtonElement>>(null);

    useEffect(() => {
        if (props.onClick && isClicked)
            props.onClick(isClicked);
    }, [isClicked]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <button
            onClick={EmptyFunction} ref={buttonRef}>
            {props.children}
        </button>
    );
};