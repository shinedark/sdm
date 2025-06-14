import React from 'react';
import GlobeGallery from './GlobeGallery';
import { imageUrls } from './Images'; // Import the image array
import './ExpandingAnimation.css';
import { ExpandableCard } from './ExpandableCard';

interface ExpandingAnimationProps {
  isExpanded: boolean;
}

const ExpandingAnimation: React.FC<ExpandingAnimationProps> = ({ isExpanded }) => {
  // Select a random image from the array
  const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

  return (
    <div
      className="expanding-animation-container"
      style={{ backgroundImage: `url(${randomImage})` }}
    >
      {/* <GlobeGallery /> */}
      <ExpandableCard
  imageUrl="/images/6.png"
  imageAlt="Description of the image"
  rightContent={
    <div>
      <h2 className="text-2xl text-black font-bold mb-4">Title</h2>
      <p className='text-black'>Your content here</p>
    </div>
  }
  bottomContent={
    <div className='text-black flex flex-row  wrap justify-between'>
  <div className="text-lg text-black font-bold mb-4">
    Camilo’s Food Sensitivity &amp; Histamine Avoidance Guide
  </div>
  <div style={{  fontStyle: 'italic', marginBottom: 8 }}>
    (Based on IgG Test + Histamine Intolerance)
  </div>

  <div style={{ fontWeight: 'bold',  marginBottom: 2 }}>🚫 IgG Sensitivities (Class 1 or Higher)</div>
  <ul style={{  marginBottom: 6, paddingLeft: 12 }}>
    <li><b>Proteins:</b>
      <ul>
        <li>Beef (0.178)</li>
        <li>Crab (0.237)</li>
        <li>Haddock (0.210)</li>
        <li>Egg Yolk (0.238)</li>
        <li>Cow’s Milk (0.247)</li>
        <li>Yogurt (0.226)</li>
      </ul>
    </li>
    <li><b>Grains/Starches:</b>
      <ul>
        <li>Gluten (0.216)</li>
        <li>Rice (0.276)</li>
        <li>Wheat (0.249)</li>
      </ul>
    </li>
    <li><b>Legumes/Nuts/Seeds:</b>
      <ul>
        <li>Black Bean (0.220)</li>
        <li>Pinto Bean (0.257)</li>
        <li>Sesame (0.235)</li>
        <li>Sunflower Seed (0.253)</li>
        <li>Walnut (0.213)</li>
      </ul>
    </li>
    <li><b>Vegetables:</b>
      <ul>
        <li>Broccoli (0.256)</li>
        <li>Carrot (0.226)</li>
        <li>Mushroom (0.222)</li>
        <li>Potato (0.260)</li>
      </ul>
    </li>
    <li><b>Fruits:</b>
      <ul>
        <li>Coconut (0.259)</li>
        <li>Grape (0.234)</li>
      </ul>
    </li>
    <li><b>Misc:</b>
      <ul>
        <li>Black Tea (0.221)</li>
        <li>Honey (0.220)</li>
        <li>Brewer’s Yeast (0.236)</li>
      </ul>
    </li>
  </ul>

  <div style={{ fontWeight: 'bold', marginBottom: 2 }}>🚫 High-Histamine Foods to Avoid</div>
  <div style={{   marginBottom: 4 }}>
    (Due to Slow MAO/DAO Genes)
  </div>
  <ul style={{  marginBottom: 6, paddingLeft: 12 }}>
    <li><b>Proteins:</b>
      <ul>
        <li>Aged/Cured Meats (salami, bacon)</li>
        <li>Braised or Slow-Cooked Meats (e.g., short ribs)</li>
        <li>Shellfish (crab, shrimp)</li>
        <li>Canned Fish (tuna, sardines)</li>
      </ul>
    </li>
    <li><b>Dairy/Fermented:</b>
      <ul>
        <li>Yogurt, Kefir</li>
        <li>Aged Cheeses (Parmesan, Gouda)</li>
      </ul>
    </li>
    <li><b>Vegetables:</b>
      <ul>
        <li>Spinach (despite IgG-safe score)</li>
        <li>Eggplant</li>
        <li>Tomatoes</li>
      </ul>
    </li>
    <li><b>Fruits:</b>
      <ul>
        <li>Citrus (oranges, lemons)</li>
        <li>Strawberries</li>
        <li>Bananas (ripe)</li>
      </ul>
    </li>
    <li><b>Condiments:</b>
      <ul>
        <li>Soy Sauce</li>
        <li>Vinegar</li>
        <li>Fermented Foods (kimchi, sauerkraut)</li>
      </ul>
    </li>
    <li><b>Alcohol:</b>
      <ul>
        <li>Wine, Beer, Champagne</li>
      </ul>
    </li>
  </ul>
</div>
  }
/>
      {/* <div className="expanding-animation-content">
        This is for no reason other than fun
      </div> */}
    </div>
  );
};

export default ExpandingAnimation;
