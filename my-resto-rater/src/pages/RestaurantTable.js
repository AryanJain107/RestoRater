import React, { useState, useEffect } from "react";
import Axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const RestaurantTable = ({ selectedCuisine, selectedRating, searchedRestaurantName, searchedOwnerName }) => {
  const [restaurants, setRestaurants] = useState([]);
  // console.log(selectedRating)

  // useEffect(() => {
  //   // Fetch restaurant data from the backend when the component mounts
  //   Axios.get("http://localhost:3001/restaurants")
  //     .then((response) => {
  //       setRestaurants(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching restaurant data:", error);
  //     });
  // }, []); // Empty dependency array to ensure the effect runs once

  // Modify your RestaurantTable component or wherever you make the request
useEffect(() => {
  // Fetch restaurant data from the backend with optional query parameters
  Axios.get("http://localhost:3001/filterrestaurants", {
    params: {
      cuisine: selectedCuisine, // pass the selected cuisine
      rating: selectedRating,   // pass the selected rating
      name: searchedRestaurantName,
      ownerName: searchedOwnerName,
    },
  })
    .then((response) => {
      setRestaurants(response.data);
    })
    .catch((error) => {
      console.error("Error fetching restaurant data:", error);
    });
}, [selectedCuisine, selectedRating, searchedRestaurantName, searchedOwnerName]);


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Restaurant Name</TableCell>
            <TableCell>Type of Cuisine</TableCell>
            <TableCell>Dish Count</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Owner Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurants.map((restaurant) => (
            <TableRow key={restaurant.id}>
              <TableCell>{restaurant.name}</TableCell>
              <TableCell>{restaurant.cuisineType}</TableCell>
              <TableCell>{restaurant.dishCount}</TableCell>
              <TableCell>{restaurant.rating}</TableCell>
              <TableCell>{restaurant.ownerName}</TableCell>
              <TableCell>{restaurant.city}</TableCell>
              <TableCell>{restaurant.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RestaurantTable;
