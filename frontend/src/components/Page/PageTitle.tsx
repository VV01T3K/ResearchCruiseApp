type Props = {
    title: string,
}


function PageTitle(props: Props) {
    return (
        <div className="page-title-default">
            {props.title}
        </div>
    );
}


export default PageTitle;