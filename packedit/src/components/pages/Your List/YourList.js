import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../../firebase-config";
import { collection, getDocs, doc } from "firebase/firestore";
import NavBar from "../../NavBar";
import AddItem from "./AddItem";
import Item from "./ListBody/Item";
import ListBody from "./ListBody/ListBody";
import DisplayCategories from "./DisplayCategories/DisplayCategories";
import ListInfo from "./ListInfo";
import "../../../../src/styles/YourList.scss";
import { propTypes } from "react-bootstrap/esm/Image";
import AddCategory from "./DisplayCategories/AddCategory";
import CategoriesOption from "./CategoriesOption";

function YourList() {
  // Setting states
  // setList function used to alter the list
  const [myList, setMyList] = useState([]);
  //getting data from firebase
  // const myListCollectionRef = collection(db, "myList");
  const myListCollectionRef = collection(db, "trips")
  const [isLoading, setIsLoading] = useState(true);

  const [theTrip, setTheTrip] = useState("");

  const updateTheTrip = (theChosenTrip) => {
      setTheTrip(theChosenTrip);
  };

  
  
  // useEffect to show data immediately when someone opens the page
  // it's a function that is called every time the page renders
  useEffect(() => {
    const getMyList = async () => {
      const data = await getDocs(myListCollectionRef);
      setMyList(data.docs.map((doc) => ({...doc.data(), id: doc.id}))); // at the moment this displays all documents in the collection, we want only one
      //after receiving data, set isLoading to false
      setIsLoading(false);
    };

    getMyList();
  }, []);

  //Ternary operator to display data appropriately
  //If isLoading === true, page is still loading
  //If isLoading === false, display data
  return isLoading ? (
    <div>
      <h2>Data Loading...</h2>
    </div>
  ) : (
    <div className="home-bg">
      <div className="container-fluid" style={{ paddingBottom: "7%" }}>
        <div className="row">
          <div className="col">
            <nav>
              <NavBar />
            </nav>
          </div>
        </div>
        <div className="row" style={{ paddingTop: "170px", paddingLeft: "2%" }}>
          <div className="col-3 mx-5 your-list-card">
            <h3>Categories</h3>
            <DisplayCategories theTrip={theTrip}/>
            {theTrip == "" ? <></> : <AddCategory theTrip={theTrip}/>}
            
            {/* {myList.map((list, i) => {
                return <div key={i}>
                  {list.ListCategories.map((category, i) => {
                    return <div key={i}>
                      {category.CategoryName}
                      </div>
                  })}
                </div>
              })} */}

          </div>
          <div className="col ml-5" style={{ paddingRight: "7%" }}>
            <div className="row your-list-info-card">
              {/* <div>chosen: {theTrip}</div> */}
              <CategoriesOption trips={myList} updateTheTrip={updateTheTrip}/>
              
              {/* {myList.map((list, i) => {
                return <div key={i}>
                  <p>List Name: {list.ListName}</p>
                  <p>Destination: {list.Destination}</p>
                  <p>Date: {list.Date.toDate().toDateString()}</p>
                  <p>{list.id}</p>
                </div>
              })} */}
              {theTrip != "" ? myList.filter(theList => theList.id.includes(theTrip)).map((trip) => (
                <>
              <h3>List Info</h3>
              <div>
                <p>List Name: {trip.ListName}</p>
                <p>Destination: {trip.Destination}</p>
                <p>Date: {trip.Date.toDate().toDateString()}</p>
              </div>
              </>)) : <></>}
            </div>
            <div className="row mt-3">
              <h3>List Body</h3>
              <ListBody theTrip={theTrip}/>
              {/* {myList.map((list, i) => {
                return <div key={i}>
                  {list.ListCategories.map((category, i) => {
                    return <div key={i}>
                      {category.CategoryItems.map((item, i) => {
                        return <div key={i}>
                          {item}
                          </div>
                      })}
                      </div>
                  })}
                </div>
              })} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourList;
