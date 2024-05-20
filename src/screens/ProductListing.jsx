import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Grid, Button, Modal, Box, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    allergenInfo: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/products')
      .then(response => {
        const sortedProducts = response.data.sort((a, b) => a.selling_price - b.selling_price);
        setProducts(sortedProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    axios.post('/products', newProduct)
      .then(response => {
        setProducts([...products, response.data]);
        handleClose();
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  return (
    <div>
        <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Add New Product</Typography>
          <TextField label="Product Name" name="name" value={newProduct.name} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Product Description" name="description" value={newProduct.description} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Product Allergen Info" name="allergenInfo" value={newProduct.allergenInfo} onChange={handleChange} fullWidth margin="normal" />
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add
          </Button>
        </Box>
      </Modal>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4} onClick={() => navigate(`/products/${product.id}`)}>
             <img src={product.productImage} alt={product.name} style={{ width: '100%', height: 'auto' }} />
             <Typography variant="subtitle1" gutterBottom>{product.name}</Typography>
             <Typography variant="body1" color="textSecondary" gutterBottom>${product.selling_price}</Typography>
             <Typography variant="subtitle1" gutterBottom>{product.description}</Typography>
             <Typography variant="body1" color="textSecondary" gutterBottom>{product.cooking_instruction}</Typography>
            </Grid>
          ))}
        </Grid>
      )}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Product
      </Button>
    </div>
  );
};

const modalStyle = {
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

export default ProductListing;
