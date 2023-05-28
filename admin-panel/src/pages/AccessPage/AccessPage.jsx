import React from "react";
import styles from "./AccessPage.module.scss";
import { AcessHead } from "../../components/Admin/Access/AccessHead/AccessHead";
import { Divider } from "../../components/common/Divider/Divider";
import { UserCard } from "../../components/Admin/Access/UserCard/UserCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setDelSuccesfull, setUsers } from "../../store/usersSlise";
import { domain } from "../../constants/config";
import { SuccesfullModal } from "../../components/Admin/Access/AccessScreens/Modal/SuccesfullModal";
import { ErrorModal } from "../../components/Admin/Access/AccessScreens/Modal/Error";
import { UserDel } from "../../components/Admin/Access/AccessScreens/Modal/userDel";
import { DeleteScreenSuccesfull } from "../../components/Admin/Access/AccessScreens/DeleteScreenSuccesfull/DeleteScreenSuccesfull";


export const AccessPage = () => {

  const successIsActive=useSelector((state)=>state.users.SuccesfullisActive)
  const ErrorisActive=useSelector((state)=>state.users.ErrorisActive)
  const UserDelete=useSelector((state)=>state.users.UserDel)
  const UserDelSuccesfull=useSelector((state)=>state.users.UserDelSuccesfull)
  const currentRole=useSelector((state)=>state.auth.auth.role)
  const delEmail=useSelector((state)=>state.users.delEmail)
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.users.users);
  const adminArray=  usersData.filter((el)=>el.role==="admin")
  const userArray=  usersData.filter((el)=>el.role==="user")

  const getUsers = () => {
    axios
      .get(`${domain}/api/admin/users`)
      .then((response) => {
        dispatch(setUsers(response.data));
        dispatch(setDelSuccesfull())
      })
      .catch((error) => {
        console.log("запрос пользователей " + error);
      });
  };
  React.useEffect(() => getUsers(), []);
  return (
    <div className={styles.body}>
      <AcessHead />
      <Divider />
      <h1 className={styles.h1}>Администрация</h1>
      <div className={styles.dataArray}>
        {adminArray.length===0?<div className={styles.emptyArray}>Отсутствуют пользователи с этой ролью</div>:adminArray.map((el) => (
          <UserCard
            canDel={currentRole==="root"}
            name={el.name}
            email={el.email}
            id={el.id}
            role={"администратора"}
            key={el.id + el.name}
          />
        ))}
      </div>
      <h1 className={styles.h1}>Пользователи</h1>
      <div className={styles.dataArray}>
        {userArray.length===0?<div className={styles.emptyArray}>Отсутствуют пользователи с этой ролью</div>:userArray.map((el) => (
          <UserCard
            canDel={true}
            name={el.name}
            email={el.email}
            id={el.id}
            role={"пользователя"}
            key={el.id + el.name}
          />
        ))}
      </div>
      {successIsActive?<SuccesfullModal/>:<></>}
      {ErrorisActive?<ErrorModal/>:<></>}
      {UserDelete?<UserDel email={delEmail}/>:<></>}
      {/* {UserDelSuccesfull?<DeleteScreenSuccesfull email={delEmail}/>:<></>} */}
    </div>
  );
};
