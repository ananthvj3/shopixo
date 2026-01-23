import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../Components/Product/FilterSidebar';
import SortOption from '../Components/Product/SortOption';
import ProductGrid from '../Components/Product/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsFilters } from '../redux/slices/productSlice';

const CollectionPage = () => {
  const {collection} = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
 const {products, loading, error} = useSelector((state)=>state.products)

  const queryParams = Object.fromEntries([...searchParams])

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebaropen] = useState(false);

  useEffect(()=>{
    dispatch(fetchProductsFilters({collection, ...queryParams}))
  },[dispatch,collection, searchParams])

  const toggleSidebar = () => {
    setIsSidebaropen(!isSidebarOpen)
  }
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebaropen(false)
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return()=>{
      document.removeEventListener("mousedown", handleClickOutside);
    }
  },[]);
  
if(error) return<p>{error}</p>

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <button className="lg:hidden border p-2 flex justify-center items-center cursor-pointer"
          onClick={toggleSidebar}>
          <FaFilter className="mr-2" />
        </button>

        <div ref={sidebarRef}
          className={`${isSidebarOpen ? "translate-x-0 " : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto
        transition-transform duration-300 lg:static lg:translate-x-0`}
        >
          <FilterSidebar />Filters
        </div>
        <div className="flex-grow p-4 ">
          <h2 className="text-2xl uppercase mb-4 ">All Collection</h2>

          <SortOption />

          <ProductGrid products={products} loading={loading} error= {error}/>

        </div>
      </div>
    </>
  )
}

export default CollectionPage