import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, CircularProgress, Typography } from '@mui/material';
import axios from '../axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/dashboard');
        const sortedProducts = response.data.sort((a, b) => a.selling_price - b.selling_price);
        setProducts(sortedProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.id.toString().includes(searchQuery)
        ));
      } catch (error) {
        setError(error.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [searchQuery]);
  

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const sortedProducts = [...products].sort((a, b) => {
      if (key === 'id' || key === 'selling_price') {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      } else {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
    setProducts(sortedProducts);
    setSortConfig({ key, direction });
  };
  

  const handleCheck = async (id) => {
    try {
      // Remove the checked product
      await axios.delete(`/dashboard/${id}`);
      // Refetch data
      const response = await axios.get('/dashboard');
      setProducts(response.data);
    } catch (error) {
      setError(error.message || 'Something went wrong.');
    }
  };

  return (
    <Box className="dashboard-container">
      <TextField
        className="search-bar"
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading && <CircularProgress className="loading-text" />}
      {error && <Typography variant="h6" className="error-text">{error}</Typography>}
      {!loading && !error && (
        <Box className="table-container">
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'id'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('id')}
                  >
                    Product ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'name'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'selling_price'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('selling_price')}
                  >
                    Selling Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.selling_price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleCheck(product.id)}
                    >
                      Check
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
