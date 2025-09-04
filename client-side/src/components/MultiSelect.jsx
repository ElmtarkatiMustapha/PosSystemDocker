import { useEffect, useState } from "react";
import { Lang } from "../assets/js/lang";


export default function MultiSelect({handleChange, list}) {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const selectAll = () => {
    if (selected.length === list.length) {
      setSelected([]); // unselect all
    } else {
      setSelected(list.map(item=>item.id)); // select all
    }
  };
  
  useEffect(()=>{
    handleChange(selected)
  },[selected])

  useEffect(()=>{
    selectAll()
  },[list])
  return (
    <div className="dropdown">
      {/* Toggle button */}
      <button
        className="btn btn-outline-dark rounded-pill dropdown-toggle  text-start"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
          <Lang>Select Users</Lang>
      </button>

      {/* Dropdown menu */}
      <ul className="dropdown-menu p-2" style={{ maxHeight: "250px", overflowY: "auto" }}>
        <li className="dropdown-item">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={selected.length === list?.length}
            onChange={selectAll}
          />
          <label className="form-check-label fw-bold">Select all</label>
        </li>
        <li><hr className="dropdown-divider" /></li>

        {list?.map((item) => (
          <li key={item.id} className="dropdown-item">
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={selected.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
            />
            <label className="form-check-label">{item.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}