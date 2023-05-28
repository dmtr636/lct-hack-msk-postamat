import React from "react";
import styles from "./Search.module.scss";
import { searchButton } from "../../../../assets/img";
import axios from "axios";
import { domain } from "../../../../constants/config";
import { observer } from "mobx-react-lite";
import { searchStore } from "../../../../mobxStore/store";
import { useNavigate } from "react-router-dom";

export const SearchField = observer(() => {
  const navigate= useNavigate()
  const [searchValue, setSearchValue] = React.useState("");
  const searchFetch = () => {
    axios
      .get(`${domain}/api/admin/reviews?search=${searchValue}`)
      .then((response) => {
        searchStore.reviews = response.data;
        navigate("/search");
        
        searchStore.setIsActive(true)

      })

      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${domain}/api/admin/tasks?search=${searchValue}`)
      .then((response) => {
        searchStore.tasks = response.data;
   
        navigate("/search", {replace:true});
        searchStore.setIsActive(true)
      })

      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div style={{ position: "relative", with: "100%" }}>
        <form action="" onSubmit={(e)=>e.preventDefault()}>
        <input
          onChange={(e) => {setSearchValue(e.target.value);}}
          value={searchValue}
          className={styles.input}
          type="text"
          placeholder="ID комментария или задачи, адрес постамата, телефон клиента"
        />
        <button
          disabled={searchValue.length===0}
          onClick={() => searchFetch()}
          className={styles.button}
        >
          <img src={searchButton} alt=""/>
        </button></form>
      </div>
      {/* {isActive?<></>:<SearchResult setIsActive={setIsActive} searchValue={searchValue}/>} */}
    </>
    /*  <div style={{ position: "relative", with: "100%" }}>
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        className={styles.input}
        type="text"
        placeholder="№ комментария, почта, телефон, адрес постамата "
      />
      <button
        onClick={() => searchFetch()}
        style={{
          position: "absolute",
          top: "50%",
          right: "1px",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <img src={searchButton} alt=/>
      </button>
    </div> */
  );
});
