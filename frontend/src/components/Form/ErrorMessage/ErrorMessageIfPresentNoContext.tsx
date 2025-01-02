import {ErrorMessage} from './ErrorMessageIfPresent';

export const ErrorMessageIfPresentNoContext = (props: {
    message?: string;
    className?: string;
}) => (
    <ErrorMessage
        display={!props.message}
        message={props.message}
        className={props.className}
    />
);
