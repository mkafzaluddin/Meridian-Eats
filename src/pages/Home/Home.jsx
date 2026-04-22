import React from "react";
import "./Home.css";
import Header from "../../components/Header";
import ExploreMenu from "../../components/ExploreMenu";
import { useState } from "react";
import FoodDisplay from "../../components/FoodDisplay";
import Footer from "../../components/Footer";
import AppDownload from "../../components/AppDownload";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
      <Footer />
    </div>
  );
};

export default Home;
