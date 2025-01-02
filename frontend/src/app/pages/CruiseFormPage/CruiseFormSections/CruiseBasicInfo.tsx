import {Cruise} from 'Cruise';
import SimpleInfoTile from '../../../../ToBeMoved/CommonComponents/SimpleInfoTile';
import ReadOnlyTextInput from '../../../../ToBeMoved/CommonComponents/ReadOnlyTextInput';

type Props = {
    cruise?: Cruise;
};

export default function CruiseBasicInfo(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12">
            <SimpleInfoTile title="Numer rejsu">
                <ReadOnlyTextInput
                    value={props.cruise?.number ?? ''}
                    className={!props.cruise ? 'bg-secondary' : ''}
                />
            </SimpleInfoTile>
            <SimpleInfoTile title="Status">
                <ReadOnlyTextInput
                    value={props.cruise?.status ?? ''}
                    className={!props.cruise ? 'bg-secondary' : ''}
                />
            </SimpleInfoTile>
        </div>
    );
}
