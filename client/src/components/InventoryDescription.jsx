import Markdown from "react-markdown";

function InventoryDescription({description}) {
    return ( <>
        <div className="text-start">
            <Markdown>{description == '' ? 'No description' : description}</Markdown>
        </div>
    </> );
}
export default InventoryDescription;