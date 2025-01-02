import {useEffect, useRef, useState} from 'react';
import {ButtonProps} from 'react-bootstrap';

export const ClickableOnceButton = (props: ButtonProps) => {

    const [isClicked] =
        useState<null | React.MouseEvent<HTMLButtonElement>>(null);

    useEffect(() => {
        if (props.onClick && isClicked)
            props.onClick(isClicked);
    }, [isClicked]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <button
            onClick={() => {}} ref={buttonRef}>
            {props.children}
        </button>
    );
};