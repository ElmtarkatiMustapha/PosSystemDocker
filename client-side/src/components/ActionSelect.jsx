import { Lang } from "../assets/js/lang";

export function ActionSelect({onChange}) {
    return (
        <div className="d-inline-block ps-1 pe-1">
            <select  onChange={onChange} className=" pt-1 pb-1 ps-2 pe-2  greenSelect" defaultValue={"default"} name="" id="">
                <option value="default">Actions</option>
                <option value="edit"><Lang>Edit</Lang></option>
                <option value="remove"><Lang>Remove</Lang></option>
            </select>
        </div>
    )
}