import React, { useEffect, useState } from 'react'
import Hero from '../Components/Layout/Hero'
import GenderCollection from '../Components/Product/GenderCollection'
import NewArrivals from '../Components/Product/NewArrivals'
import ProductDetails from '../Components/Product/ProductDetails'
import ProductGrid from '../Components/Product/ProductGrid'
import FeaturedCollection from '../Components/Product/FeaturedCollection'
import FeaturedSection from '../Components/Product/FeaturedSection'
import {useDispatch, useSelector} from "react-redux"
import { fetchProductsFilters } from '../redux/slices/productSlice';
import axios from "axios"


const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProducts, setbestSellerProducts] = useState(null);

  useEffect(()=>{
    dispatch(fetchProductsFilters({
      gender: "Women",
      category: "Bottom Wear",
      limit: 8,
    })
  );
  const fetchBestSeller = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
      setbestSellerProducts(response.data)
      
    } catch (err) {
      console.error(err)
    }
  };
  fetchBestSeller()
  }, [dispatch])
  return (
    <>
    <div>
        <Hero/>

        <GenderCollection/>
        <NewArrivals/>

        <h2 className="text-3xl text-center font-bold mb-4">
          Best Seller
        </h2>
        {bestSellerProducts ? (  <ProductDetails productId={bestSellerProducts._id}/> ):
        (
          <p className='text-center'>Loading bestSeller Product...</p>
        )
        }

        <div className="container mx-auto ">
          <h2 className="text-3xl text-center font-bold mb-4">
            Top Wears for  Women
          </h2>
          <ProductGrid products={products} loading={loading} error={error}/>
        </div>
        <FeaturedCollection/>
        <FeaturedSection/>
    </div>

    </>
  )
}

export default Home