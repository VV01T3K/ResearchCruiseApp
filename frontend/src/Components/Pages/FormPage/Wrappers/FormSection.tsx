import React, {useState} from "react";


type Props = {
    id?: string,
    index?: number
    children?: React.ReactNode
    title: string,
}

export type SectionProps = {
    index?: number
}


function FormSection(props: Props) {
    // Check conditions for each child
    // const isChildInvalid =
    //     (child: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>> | undefined):boolean =>{
    //         const required = child!.props.required ?? true
    //         const childName = child!.props.name;
    //         if (React.Children.count(child) === 0)
    //             return false
    //         return (
    //             (required &&(
    //             !(childName in props.form!.formState.dirtyFields)
    //             ||
    //             !(childName in props.form!.formState.touchedFields)
    //             )) ||
    //             (childName in props.form!.formState.errors)
    //         )
    //     };
    //
    // const { dispatchEvent } = useCustomEvent('sectionStateChange');

    const [isActive, setIsActive] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false)
    // const key = Object.keys(props.sections!).find((k) => props.sections![k] === props.title);
    //
    // useEffect(()=>{
    //     const invalidChildren = React.Children.map(props.children, (child) => {
    //         return isChildInvalid(child)}) as boolean[]
    //     const validChildren =
    //         !Object.values(invalidChildren).some((child)=>child)
    //     dispatchEvent( {[key as string]:validChildren})
    //     setIsCompleted(validChildren)
    //
    // },[props.form!.watch()])

    const SectionScrollReference = () => ( <div id={props.id}/> )

    const ExpansionMark = () => (
        <div className={isCompleted ? "form-section-expansion-mark-default" : "form-section-expansion-mark-error"}>
            {isActive ? "▲" : "▼"}
        </div>
    )

    const SectionLabel = () => (
        <div onClick={() => setIsActive(!isActive)} className={"form-section-label"}>
            <Title/>
            <ExpansionMark/>
        </div>
    )

    const SectionContent = () => (
        <div className={isActive ? 'form-section-children' : 'visually-hidden'}>
            {/*{React.Children.map(props.children, (child, index) => {*/}
            {/*    return React.cloneElement(child as React.ReactElement, {*/}
            {/*        form: props.form,*/}
            {/*        readonly: props.readonly*/}
            {/*    });*/}
            {/*})}*/}
            {props.children}
        </div>
    )
    const Title = () =>
        (<div className={"form-section-title"}> {props.index && props.index + ". "}{props.title} </div>)

    return (
        <>
            <SectionScrollReference/>
            <div className="form-section">
                <SectionLabel/>
                <SectionContent/>
            </div>
        </>
    )
}


export default FormSection