
function ErrorCode(props: {code:string}){

    return (<p className={"m-1 text-center text-danger"} style={{fontSize: "12px"}}>
            {props.code}
        </p>
    )
}
export default ErrorCode