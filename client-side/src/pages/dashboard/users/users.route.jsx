import { Route, Routes } from "react-router-dom";
import UsersContext from "../../../context/usersContext";
import { Users } from ".";
import { SingleUser } from "./singlePage";


export function UsersRoute() {
    return (
      <UsersContext>
        <Routes>
            <Route index element={<Users/>} />
            <Route path="/:id" element={<SingleUser/>} />
        </Routes>
      </UsersContext>
  );
}