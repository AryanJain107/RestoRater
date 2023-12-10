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
  const handleOpen = () => {
    setErrorMessage("");
    setOpen(true);
  };
  const handleClose = () => {
    setErrorMessage("");
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
      const ownerId = user.userId; 
  
      
      Axios.post("http://localhost:3001/addRestaurant", {
        ...restaurantDetails,
        ownerId,
      })
        .then((response) => {
          console.log(response.data.message);
          
          setRestaurantDetails({
            name: "",
            cuisineType: "",
            city: "",
            state: "",
            numDishes: "",
          });
  
          
          handleClose();
          window.location.reload(false);
        })
        .catch((error) => {
          console.error("Error adding restaurant:", error);
          
          setErrorMessage("Failed to add restaurant. Please try again.");
        });
    } else {
      
      setErrorMessage("All fields are required.");
    }
  };
  
  const [editedRestaurants, setEditedRestaurants] = useState({});


  const handleOpenEditModal = () => {
    
    Axios.get(`http://localhost:3001/ownerrestaurants?ownerId=${user.userId}`)
      .then((response) => {
        setOwnerRestaurants(response.data);
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

  const handleEditRestaurant = (restaurant) => {
    const updatedDetails = editedRestaurants[restaurant.restId];

  if (Object.values(updatedDetails).some((value) => {
    const trimmedValue = typeof value === 'number' ? String(value) : value;
    return trimmedValue.trim() === "";
  })) {
    setErrorMessage("All fields are required.");
    return;
  }
  
    Axios.put(`http://localhost:3001/updateRestaurant/${restaurant.restId}`, updatedDetails)
      .then((response) => {
        console.log(response.data.message);
        handleCloseEditModal();
        window.location.reload(false);
      })
      .catch((error) => {
        console.error("Error updating restaurant:", error);
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
  const [selectedRating, setSelectedRating] = useState(""); 
  const [selectedCuisine, setSelectedCuisine] = useState(""); 
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [searchedRestaurantName, setSearchedRestaurantName] = useState("");
  const [searchedOwnerName, setSearchedOwnerName] = useState("");


  useEffect(() => {
    
    Axios.get("http://localhost:3001/cuisineTypes")
      .then((response) => {
        setCuisineTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cuisine types:", error);
      });
  }, []);
  
  const [ratingTypes, setRatingTypes] = useState([]);
  useEffect(() => {
    
    Axios.get("http://localhost:3001/ratingTypes")
      .then((response) => {
        setRatingTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rating types:", error);
      });
  }, []); 
  

  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const handleOpenRemoveModal = () => {
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
    Axios.delete(
      `http://localhost:3001/removeRestaurant/${restaurant.restId}`
    )
      .then((response) => {
        console.log(response.data.message);
        handleCloseRemoveModal();
        window.location.reload(false);
      })
      .catch((error) => {
        console.error("Error removing restaurant:", error);
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
