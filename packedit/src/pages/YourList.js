import React, { useState, useEffect } from "react";
import { db } from "../Firebase/firebase-config";
import { collection, getDocs, doc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import NavBar from "../components/NavBar";
import ListBody from "../components/ListBody";
import DisplayCategories from "../components/DisplayCategories";
import AddCategory from "../components/AddCategory";
import TripSelector from "../components/TripSelector";
import Button from "react-bootstrap/Button";
import "../styles/YourList.scss";


function YourList() {
  // Setting states
  // setList function used to alter the list
  const [myList, setMyList] = useState([]);
  //getting data from firebase
  const [isLoading, setIsLoading] = useState(true);

  const [theTrip, setTheTrip] = useState("");

  const updateTheTrip = (theChosenTrip) => {
    setTheTrip(theChosenTrip);
  };

  const deleteDocument = async (TripID, CategoryID) => {

    await deleteDoc(doc(db, "trips/" + TripID + "/categories", CategoryID));
  };

  const deleteDocumentTrip = async (TripID) => {
    await deleteDoc(doc(db, "trips", TripID));
  };

  const DeleteTrip = async (id) => {
    const querySnapshot = await getDocs(collection(db, "trips/" + id + "/categories"));
    querySnapshot.forEach((doc) => {
      deleteDocument(id, doc.id);
    })

    deleteDocumentTrip(id);
    setTheTrip("");
  };

  // useEffect to show data immediately when someone opens the page
  // it's a function that is called every time the page renders
  useEffect(() => {
    const getMyList = async () => {
      const q = query(collection(db, "trips"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const theTrips = [];
        querySnapshot.forEach((doc) => {
          theTrips.push({ ...doc.data(), id: doc.id });
        });

        setMyList(theTrips);
        setIsLoading(false);
      });
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
            <DisplayCategories theTrip={theTrip} />
            {theTrip === "" ? <></> : <AddCategory theTrip={theTrip} />}
          </div>
          <div className="col ml-5" style={{ paddingRight: "7%" }}>
            <div className="row your-list-info-card">
              <TripSelector trips={myList} updateTheTrip={updateTheTrip} />
              {theTrip !== "" ? myList.filter(theList => theList.id.includes(theTrip)).map((trip) => (
                <>

                  <div>
                    <span className="your-list-info-card-trip">{trip.ListName}</span>
                    <span>{trip.Destination}</span>
                    <span className="your-list-info-card-date">{trip.Date.toDate().toDateString()}</span>
                    <Button onClick={() => DeleteTrip(trip.id)}>Delete this trip</Button>
                  </div>


                </>)) : <></>}
            </div>
            <div className="row mt-3">
              <ListBody theTrip={theTrip} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourList;
