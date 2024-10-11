import { KeyContext } from '@contexts/KeyContext';
import { FBoolField } from '@app/pages/FormPage/Inputs/CellFormFields';

export const BowStarboardField = () => {
    return (
        <KeyContext.Provider value={'bowStarboard'}>
            <div className={'w-50'}>
                <label>
                    Żurawik dziobowy
                    prawa burta
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const AftStarboardField = () => {
    return (
        <KeyContext.Provider value={'aftStarboard'}>
            <div className={'w-50'}>
                <label>
                    Żurawik rufowy
                    prawa burta
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const AftPortSideField = () => {
    return (
        <KeyContext.Provider value={'aftPortSide'}>
            <div className={'w-50'}>
                <label>
                    Żurawik rufowy
                    lewa burta
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const MainCraneField = () => {
    return (
        <KeyContext.Provider value={'mainCrane'}>
            <div className={'w-50'}>
                <label>
                    Dźwig
                    główny
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const BomSTBSField = () => {
    return (
        <KeyContext.Provider value={'bomSTBS'}>
            <div className={'w-50'}>
                <label>
                    Bom
                    STBS (prawa burta)
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const BomPSField = () => {
    return (
        <KeyContext.Provider value={'bomPS'}>
            <div className={'w-50'}>
                <label>
                    Bom
                    PS (lewa burta)
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const CableRope35kNField = () => {
    return (
        <KeyContext.Provider value={'cableRope35kN'}>
            <div className={'w-50'}>
                <label>
                    Kablolina
                    35 kN
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const CableRope5kNField = () => {
    return (
        <KeyContext.Provider value={'cableRope5kN'}>
            <div className={'w-50'}>
                <label>
                    Kablolina
                    5 kN
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const MainGantryField = () => {
    return (
        <KeyContext.Provider value={'mainGantry'}>
            <div className={'w-50'}>
                <label>
                    Bramownica
                    główna (rufowa)
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const STBSAuxiliaryGateField = () => {
    return (
        <KeyContext.Provider value={'STBSAuxiliaryGate'}>
            <div className={'w-50'}>
                <label>
                    Bramownica
                    pomocnicza STBS (prawa burta)
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const STBSTrawlElevatorField = () => {
    return (
        <KeyContext.Provider value={'STBSTrawlElevator'}>
            <div className={'w-50'}>
                <label>
                    Winda
                    trałowa STBS (prawa burta)
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const PSTrawlElevatorField = () => {
    return (
        <KeyContext.Provider value={'PSTrawlElevator'}>
            <div className={'w-50'}>
                <label>
                    Winda
                    trałowa PS (lewa burta)
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const WorkboatField = () => {
    return (
        <KeyContext.Provider value={'workboat'}>
            <div className={'w-50'}>
                <label>
                    Łódź
                    robocza
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const ObservatoryField = () => {
    return (
        <KeyContext.Provider value={'observatory'}>
            <div className={'w-50'}>
                <label>
                    Obserwatorium
                    (bocianie gniazdo)
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const ElementsColumn = () => (
    <div className={'w-100 d-flex flex-row flex-wrap'}>
        <BowStarboardField />
        <AftStarboardField />
        <AftPortSideField />
        <MainCraneField />
        <BomSTBSField />
        <BomSTBSField />
        <CableRope35kNField />
        <CableRope5kNField />
        <MainGantryField />
        <STBSAuxiliaryGateField />
        <STBSTrawlElevatorField />
        <PSTrawlElevatorField />
        <WorkboatField />
        <ObservatoryField />
    </div>
);


