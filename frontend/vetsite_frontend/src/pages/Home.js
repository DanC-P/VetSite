import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories'; // O componente refatorado
import ProductGrid from '../components/ProductGrid';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Novo estado para categorias

  useEffect(() => {
    // No futuro: buscar os dois do Django
    // getProducts().then(setProducts);
    // getCategories().then(setCategories);
  }, []);

  const featured = products.find(p => p.is_featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero featuredProduct={featured} />
      <main>
        {/* Passando os dados dinâmicos para o componente refatorado */}
        <Categories categoriesData={categories} />
        
        <ProductGrid products={products} />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Home;