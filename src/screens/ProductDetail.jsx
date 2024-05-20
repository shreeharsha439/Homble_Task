import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRequest, API_ENDPOINTS } from '../axios';
import { Box, Typography, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getRequest(API_ENDPOINTS.PRODUCT_BY_ID(id));
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>{product.name}</Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>${product.selling_price}</Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{product.description}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Allergen Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{product.allergen_info}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Usage Instructions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{product.cooking_instruction}</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ProductDetail;
