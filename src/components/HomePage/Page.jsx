import React from "react";
import Service from "./Service";
import Trending from "./Trending";
import BestSeller from "./BestSeller";
import FlashSale from "./FlashSale";
import Testimonials from "./Testimonials";
import Subscribe from "./Subscribe";

const Pages = () => {
    return (
        <div>
            <Service />
            {/* <Trending /> */}
            <BestSeller />
            <FlashSale />
            <Testimonials />
            <Subscribe />
        </div>
    );
};

export default Pages;
