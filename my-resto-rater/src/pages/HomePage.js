import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import RestaurantTable from "./RestaurantTable";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Axios from "axios";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  // const isOwner = user.role === "owner";
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [ownerRestaurants, setOwnerRestaurants] = useState([]);

  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    cuisineType: "",
    city: "",
    state: "",
    numDishes: "",
  });

  const [editedRestaurant, setEditedRestaurant] = useState({
    name: "",
    cuisineType: "",
    city: "",
    state: "",
    numDishes: "",
  });

  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleOpen = () => {
    setErrorMessage(""); // Clear any previous error messages
    setOpen(true);
  };
  // const handleClose = () => setOpen(false);
  const handleClose = () => {
    setErrorMessage(""); // Clear any previous error messages
    setRestaurantDetails({
      name: "",
      cuisineType: "",
      city: "",
      state: "",
      numDishes: "",
    });
    setOpen(false);
  };
  const handleAddRestaurant = () => {
    const isFieldsValid = Object.values(restaurantDetails).every(
      (value) => value.trim() !== ""
    );
  
    if (isFieldsValid) {
      // Assuming ownerId is obtained from the logged-in user
      const ownerId = user.userId; // Adjust this based on your actual user structure
  
      // Make an API request to add the restaurant
      Axios.post("http://localhost:3001/addRestaurant", {
        ...restaurantDetails,
        ownerId,
      })
        .then((response) => {
          console.log(response.data.message);
          // Reset restaurant details after adding
          setRestaurantDetails({
            name: "",
            cuisineType: "",
            city: "",
            state: "",
            numDishes: "",
          });
  
          // Close the modal
          handleClose();
          window.location.reload(false);
        })
        .catch((error) => {
          console.error("Error adding restaurant:", error);
          // Display an error message
          setErrorMessage("Failed to add restaurant. Please try again.");
        });
    } else {
      // Display an error message
      setErrorMessage("All fields are required.");
    }
  };
  
  const [editedRestaurants, setEditedRestaurants] = useState({});


  const handleOpenEditModal = () => {
    // Fetch owner's restaurants
    Axios.get(`http://localhost:3001/ownerrestaurants?ownerId=${user.userId}`)
      .then((response) => {
        setOwnerRestaurants(response.data);

        // Initialize editedRestaurants object with the values of each restaurant
        const initialEditedRestaurants = {};
        response.data.forEach((restaurant) => {
          initialEditedRestaurants[restaurant.restId] = { ...restaurant };
        });
        setEditedRestaurants(initialEditedRestaurants);

        setOpenEditModal(true);
      })
      .catch((error) => {
        console.error("Error fetching owner's restaurants:", error);
        setErrorMessage("Failed to fetch owner's restaurants. Please try again.");
      });
  };
   
  

  const handleCloseEditModal = () => {
    setErrorMessage("");
    setOpenEditModal(false);
  };

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };





  // const handleEditRestaurant = (restaurant) => {
  //   // Set the initial state of editedRestaurant with the values of the selected restaurant
  //   setEditedRestaurant({
  //     restId: restaurant.restId,
  //     name: restaurant.name,
  //     cuisineType: restaurant.cuisineType,
  //     city: restaurant.city,
  //     state: restaurant.state,
  //     numDishes: restaurant.numDishes,
  //   });
  //   setOpenEditModal(true);
  // };
  const handleEditRestaurant = (restaurant) => {
    // Assuming editedRestaurant has the updated details
    const updatedDetails = editedRestaurants[restaurant.restId];
    // console.log(updatedDetails)
      // Check if any field is empty
  if (Object.values(updatedDetails).some((value) => {
    // Convert numbers to string before calling trim
    const trimmedValue = typeof value === 'number' ? String(value) : value;
    return trimmedValue.trim() === "";
  })) {
    setErrorMessage("All fields are required.");
    return;
  }
  
    // Make an API request to update the restaurant details
    Axios.put(`http://localhost:3001/updateRestaurant/${restaurant.restId}`, updatedDetails)
      .then((response) => {
        console.log(response.data.message);
        // Close the edit modal after making changes
        handleCloseEditModal();
        window.location.reload(false); // You may consider updating the state instead of reloading the entire page
      })
      .catch((error) => {
        console.error("Error updating restaurant:", error);
        // Display an error message
        setErrorMessage("Failed to update restaurant. Please try again.");
      });
  };
  

  const handleInputChangeEdit = (e, restaurant) => {
    const { name, value } = e.target;
    setEditedRestaurants((prevDetails) => ({
      ...prevDetails,
      [restaurant.restId]: {
        ...prevDetails[restaurant.restId],
        [name]: value,
      },
    }));
  };
  const [selectedRating, setSelectedRating] = useState(""); // State for selected rating
  const [selectedCuisine, setSelectedCuisine] = useState(""); // State for selected cuisine type
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [searchedRestaurantName, setSearchedRestaurantName] = useState("");
  const [searchedOwnerName, setSearchedOwnerName] = useState("");


  useEffect(() => {
    // Fetch distinct cuisine types
    Axios.get("http://localhost:3001/cuisineTypes")
      .then((response) => {
        setCuisineTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cuisine types:", error);
      });
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts
  
  const [ratingTypes, setRatingTypes] = useState([]);
  useEffect(() => {
    // Fetch distinct cuisine types
    Axios.get("http://localhost:3001/ratingTypes")
      .then((response) => {
        setRatingTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rating types:", error);
      });
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts
  

  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const handleOpenRemoveModal = () => {
    // Similar to editing, fetch owner's restaurants
    Axios.get(`http://localhost:3001/ownerrestaurants?ownerId=${user.userId}`)
      .then((response) => {
        setOwnerRestaurants(response.data);
        setOpenRemoveModal(true);
      })
      .catch((error) => {
        console.error("Error fetching owner's restaurants:", error);
        setErrorMessage(
          "Failed to fetch owner's restaurants. Please try again."
        );
      });
  };

  const handleCloseRemoveModal = () => {
    setErrorMessage("");
    setOpenRemoveModal(false);
  };
  const handleRemoveRestaurant = (restaurant) => {
    // Make an API request to remove the restaurant
    Axios.delete(
      `http://localhost:3001/removeRestaurant/${restaurant.restId}`
    )
      .then((response) => {
        console.log(response.data.message);
        // Close the remove modal after making changes
        handleCloseRemoveModal();
        window.location.reload(false); // You may consider updating the state instead of reloading the entire page
      })
      .catch((error) => {
        console.error("Error removing restaurant:", error);
        // Display an error message
        setErrorMessage(
          "Failed to remove restaurant. Please try again."
        );
      });
  };

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="App">
      <div className="homepage">
        <div className="user-info">
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Sign Out</button>
          <h1>Restaurants</h1>
          <div style={{ marginBottom: "10px" }}>
                <label>Filter by Rating:</label>
  <select
    value={selectedRating}
    onChange={(e) => setSelectedRating(e.target.value)}
  >
    <option value="">All Ratings</option>
    {ratingTypes.map((rating) => (
      <option key={rating} value={rating}>
        {rating}
      </option>
    ))}
  </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
  <label>Filter by Cuisine Type:</label>
  <select
    value={selectedCuisine}
    onChange={(e) => setSelectedCuisine(e.target.value)}
  >
    <option value="">All Cuisine Types</option>
    {cuisineTypes.map((cuisine) => (
      <option key={cuisine} value={cuisine}>
        {cuisine}
      </option>
    ))}
  </select>
</div>
<div style={{ marginBottom: "10px" }}>
  <label>Search by Restaurant Name:</label>
  <TextField
    value={searchedRestaurantName}
    onChange={(e) => setSearchedRestaurantName(e.target.value)}
  />
</div>
<div style={{ marginBottom: "10px" }}>
  <label>Search by Owner Name:</label>
  <TextField
    value={searchedOwnerName}
    onChange={(e) => setSearchedOwnerName(e.target.value)}
  />
</div>

          {user.role === "owner" && (
            <div className="owner-options">
      <Button onClick={handleOpen}>Add Your Restaurant</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
       <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Typography variant="h6" component="h2">
                    Add Your Restaurant
                  </Typography>
                  <TextField
                    label="Restaurant Name"
                    fullWidth
                    margin="normal"
                    name="name"
                    value={restaurantDetails.name}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="Cuisine Type"
                    fullWidth
                    margin="normal"
                    name="cuisineType"
                    value={restaurantDetails.cuisineType}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="City"
                    fullWidth
                    margin="normal"
                    name="city"
                    value={restaurantDetails.city}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="State"
                    fullWidth
                    margin="normal"
                    name="state"
                    value={restaurantDetails.state}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="Number of Dishes"
                    fullWidth
                    margin="normal"
                    name="numDishes"
                    type="number"
                    value={restaurantDetails.dishCount}
                    onChange={handleInputChange}
                    required
                  />
                  {errorMessage && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {errorMessage}
                    </Typography>
                  )}
                  <Button
                    onClick={handleAddRestaurant}
                    disabled={
                      Object.values(restaurantDetails).some(
                        (value) => value.trim() === ""
                      )
                    }
                  >
                    Add Your Restaurant
                  </Button>
                  <Button onClick={handleClose}>Cancel</Button>
                </Box>
      </Modal>
              <Button onClick={handleOpenEditModal}>Edit Your Restaurant</Button>
              <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 1000,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Typography variant="h6" component="h2">
                    Edit Your Restaurant
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Restaurant Name</TableCell>
                          <TableCell>Cuisine Type</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>State</TableCell>
                          <TableCell>Number of Dishes</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {ownerRestaurants.map((restaurant) => (
                          <TableRow key={restaurant.restId}>
                            <TableCell>
                              <TextField
                                value={editedRestaurants[restaurant.restId]?.name || ""}
                                onChange={(e) => handleInputChangeEdit(e, restaurant)}
                                name="name"
                                placeholder={restaurant.name}
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={editedRestaurants[restaurant.restId]?.cuisineType || ""}
                                onChange={(e) => handleInputChangeEdit(e, restaurant)}
                                name="cuisineType"
                                placeholder={restaurant.cuisineType}
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={editedRestaurants[restaurant.restId]?.city || ""}
                                onChange={(e) => handleInputChangeEdit(e, restaurant)}
                                name="city"
                                placeholder={restaurant.city}
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={editedRestaurants[restaurant.restId]?.state || ""}
                                onChange={(e) => handleInputChangeEdit(e, restaurant)}
                                name="state"
                                placeholder={restaurant.state}
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={editedRestaurants[restaurant.restId]?.numDishes || ""}
                                onChange={(e) => handleInputChangeEdit(e, restaurant)}
                                name="numDishes"
                                type="number"
                                placeholder={restaurant.dishCount}
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Button onClick={() => handleEditRestaurant(restaurant)}>Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {errorMessage && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {errorMessage}
                    </Typography>
                  )}
                  <Button onClick={handleCloseEditModal}>Cancel</Button>
                </Box>
              </Modal>



              <Button onClick={handleOpenRemoveModal}>Remove Your Restaurant</Button>
              <Modal
                open={openRemoveModal}
                onClose={handleCloseRemoveModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                  }}>
                  <Typography variant="h6" component="h2">
                    Remove Your Restaurant
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Restaurant Name</TableCell>
                          <TableCell>Cuisine Type</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>State</TableCell>
                          <TableCell>Number of Dishes</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ownerRestaurants.map((restaurant) => (
                          <TableRow key={restaurant.restId}>
                            <TableCell>{restaurant.name}</TableCell>
                            <TableCell>{restaurant.cuisineType}</TableCell>
                            <TableCell>{restaurant.city}</TableCell>
                            <TableCell>{restaurant.state}</TableCell>
                            <TableCell>{restaurant.dishCount}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleRemoveRestaurant(restaurant)}>Remove</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {errorMessage && (
                    <Typography color="error" sx={{ mt: 2 }}>
                      {errorMessage}
                    </Typography>
                  )}
                  <Button onClick={handleCloseRemoveModal}>Cancel</Button>
                </Box>
              </Modal>
            </div>
          )}
        </div>
        {/* <RestaurantTable /> */}
<RestaurantTable selectedCuisine={selectedCuisine} selectedRating={selectedRating} searchedRestaurantName={searchedRestaurantName} searchedOwnerName={searchedOwnerName}
 />

      </div>
    </div>
  );
};

export default HomePage;
