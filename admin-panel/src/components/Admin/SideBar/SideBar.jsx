import React from "react";
import styles from "./SideBar.module.scss";
import { logoWhite } from "../../../assets/img";
import { LeftMenu } from "../LeftMenu/LeftMenu";
import axios from "axios";
import { domain } from "../../../constants/config";
import { LoadDataModal } from "../LeftMenu/sideBarScreen/loadDataModal";
import { SuccesfullDataLoad } from "../LeftMenu/sideBarScreen/SuccesfullDataLoad/SuccesfullDataLoad";
import { useDispatch } from "react-redux";
import { loadData, loadDataSuccesfull } from "../../../store/usersSlise";



export const SideBar = () => {
  const fileInputRef = React.useRef(null);

  const dispatch=useDispatch()
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    dispatch(loadData())
    handleUpload(selectedFile);
  };

  const handleUpload = (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      dispatch(loadData())

      //formData.append("limit", "5000");

      axios
        .post(`${domain}/api/admin/reviews/import-dataset`, formData)
        .then((response) => {
          console.log(response.data);
          dispatch(loadDataSuccesfull())
        })
        .catch((error) => {
          console.error(error);
          // Дополнительная обработка ошибки загрузки
        });
    } else {
      console.log("No file selected");
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();

  };
  return (
    <div className={styles.body}>
      <div className={styles.content}>
        <div className={styles.hiddenInput}></div>
        <img className={styles.logo} src={logoWhite} alt=""/>
        <LeftMenu />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className={styles.hi} />

        <button className={styles.button} onClick={handleClick}>
          Загрузить дата-сет
        </button>
      </div>

    </div>
  );
};
