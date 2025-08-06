import { Lang } from "../assets/js/lang";

export function FilterDate({onChange,filter="default"}) {
    
    return (
        <div className="d-inline-block ps-1 pe-1">
            <select onChange={onChange} className=" pt-1 pb-1 ps-2 pe-2  blueFilterSelect" defaultValue={filter}>
                <option value="default"><Lang>filter by(Week)</Lang></option>
                <option value="today"><Lang>Today</Lang></option>
                <option value="yesterday"><Lang>Yesterday</Lang></option>
                <option value="week"><Lang>Current Week</Lang></option>
                <option value="month"><Lang>Current Month</Lang></option>
                <option value="year"><Lang>Current Year</Lang></option>
                <option value="range"><Lang>Range</Lang></option>
            </select>
        </div>
    )
}