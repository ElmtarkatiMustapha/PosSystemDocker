import { Lang } from "../assets/js/lang";

export function SelectActionBlue({options, onChange,id = 0, defTitle = "Actions", defaultValue = "default", defaultOption= "default"}) {
    return (
            <select onChange={onChange} data-id={id} className=" pt-1 pb-1 ps-2 pe-2 w-100  blueFilterSelect" defaultValue={defaultValue}>
                <option value={defaultOption}><Lang>{defTitle}</Lang></option>
                {options.map((item) => {
                    return <option key={item.value?item.value : item.id } value={item.value?item.value : item.id}>{item.name}</option>
                })}
            </select>
    )
}