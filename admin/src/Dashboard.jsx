import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    
    // State for the form data and products
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        imageUrl: null, // File input
    });

    // State for storing fetched products
    const [products, setProducts] = useState([]);

    // Fetch products and update state
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/admin/products/fetch");
            console.log('Fetched products:', response.data);
            setProducts(response.data); // Update products state
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }

    useEffect(() => {
        fetchProducts(); // Call to fetch products when the component loads
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, imageUrl: e.target.files[0] });
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("stock", formData.stock);
        data.append("imageUrl", formData.imageUrl);

        const fd = new FormData()
        fd.append('name', formData.name)
        fd.append('price', formData.price)
        fd.append('description', formData.description)
        fd.append('category', formData.category)
        fd.append('stock', formData.stock)
        fd.append('imageUrl', formData.imageUrl)
        if (formData.imageUrl) {
            fd.append('profileImage', formData.imageUrl)
        }
        
        try {
            await axios.post(
                'http://localhost:8000/api/v1/admin/products', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })

            } catch (error) {
            console.log('no response');
            
            console.error("Error adding product:", error || error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/login");
    }

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <p>Manage your products below.</p>

            <form className="product-form" onSubmit={handleAddProduct}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    name="imageUrl"
                    onChange={handleFileChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                />
                <button type="submit">Add Product</button>
            </form>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.description || "N/A"}</td>
                                <td>
                                    {product.imageUrl ? (
                                        <img
                                            src={`http://localhost:8000${product.imageUrl}`}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>{product.category || "N/A"}</td>
                                <td>{product.stock}</td>
                                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No products available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Dashboard;
