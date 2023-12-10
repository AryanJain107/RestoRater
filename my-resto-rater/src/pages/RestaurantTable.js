import React, { useState, useEffect } from "react";
import Axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import { useAuth } from "./AuthContext";


const RestaurantTable = ({ selectedCuisine, selectedRating, searchedRestaurantName, searchedOwnerName }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [comments, setComments] = useState([]);

useEffect(() => {
  Axios.get("http://localhost:3001/filterrestaurants", {
    params: {
      cuisine: selectedCuisine,
      rating: selectedRating,   
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
const [selectedRestaurant, setSelectedRestaurant] = useState(null);
const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    Axios.get(`http://localhost:3001/getComments/${restaurant.restId}`)
   .then((response) => {
     setComments(response.data);
   })
   .catch((error) => {
     console.error("Error fetching comments:", error);
   });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRestaurant(null);
    setOpenModal(false);
  };

  const [openAddReviewModal, setOpenAddReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(1);
  const [reviewComment, setReviewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleOpenAddReviewModal = () => {
    setOpenAddReviewModal(true);
  };

  const handleCloseAddReviewModal = () => {
    setReviewRating(1);
    setReviewComment("");
    setErrorMessage("");
    setOpenAddReviewModal(false);
  };
  const { user, isAuthenticated, logout } = useAuth();

  const handleAddReview = () => {
    if (reviewRating < 1 || reviewRating > 5) {
      setErrorMessage("Rating must be between 1 and 5");
      return;
    }

    if (reviewComment.trim() === "") {
      setErrorMessage("Comment cannot be empty");
      return;
    }

    const reviewerId = user.userId;
 const userHasReviewed = comments.some(comment => comment.userId === reviewerId);
 if (userHasReviewed) {
   setErrorMessage("You have already reviewed this restaurant.");
   return;
 }

    Axios.post(`http://localhost:3001/addReview/${selectedRestaurant.restId}`, {
      rating: reviewRating,
      comment: reviewComment,
      userId: reviewerId,
    })
      .then((response) => {
        console.log(response.data.message);


        Axios.post(`http://localhost:3001/addRating/${selectedRestaurant.restId}`)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Error adding review:", error);
      });


        handleCloseAddReviewModal();
        window.location.reload(false);

      })
      .catch((error) => {
        console.error("Error adding review:", error);
        setErrorMessage("Failed to add review. Please try again.");
      });
      
  };
  

  return (
    <div>
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
            <TableCell>Details</TableCell>
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
              <TableCell>
                  <Button onClick={() => handleOpenModal(restaurant)}>
                    View Details
                  </Button>
                </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
     <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
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
       {selectedRestaurant && (
         <>
           <Typography variant="h6" component="h2">
             {selectedRestaurant.name}
           </Typography>
           <Typography>
             Rating: {selectedRestaurant.rating}
           </Typography>
           <Typography>
             Number of Ratings: {comments.length}
           </Typography>
           <Typography variant="h6" component="h2">
             Reviews
           </Typography>
           <Table>
 <TableHead>
   <TableRow>
     <TableCell>Name</TableCell>
     <TableCell>Rating</TableCell>
     <TableCell>Comment</TableCell>
   </TableRow>
 </TableHead>
 <TableBody>
   {comments.map((comment) => (
     <TableRow key={comment.id}>
       <TableCell>{comment.userName}</TableCell>
       <TableCell>{comment.userRating}</TableCell>
       <TableCell>{comment.userComment}</TableCell>
     </TableRow>
   ))}
 </TableBody>
</Table>
{user.role === "reviewer" && (<Button onClick={handleOpenAddReviewModal}>Add Your Review</Button>)}
           <Button onClick={handleCloseModal}>Close</Button>
         </>
       )}
     </Box>
   </Modal>
    <Modal open={openAddReviewModal} onClose={handleCloseAddReviewModal} aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
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
            Add Your Review
          </Typography>
          <label>Rating:</label>
          <input
            type="number"
            value={reviewRating}
            onChange={(e) => setReviewRating(parseInt(e.target.value))}
            min={1}
            max={5}
          />
          <br />
          <label>Comment:</label>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <br />
          <Button onClick={handleAddReview}>Add Review</Button>
          <Button onClick={handleCloseAddReviewModal}>Cancel</Button>
        </Box>
      </Modal>
   </div>
  );
};

export default RestaurantTable;
