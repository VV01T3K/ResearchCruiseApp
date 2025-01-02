import {useNavigate} from 'react-router-dom';

type Props = {
  to: string;
  // TODO: change type
  state?: any;
  label: string;
  className?: string;
};

export default function ButtonWithState(props: Props) {
  const navigate = useNavigate();
  const action = () =>
    navigate(props.to, {
      state: props.state,
    });

  return (
    <button
      className={props.className}
      style={{ cursor: 'pointer' }}
      onClick={action}
    >
      {props.label}
    </button>
  );
}
