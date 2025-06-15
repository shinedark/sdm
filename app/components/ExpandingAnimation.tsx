import React from 'react';
import GlobeGallery from './GlobeGallery';
import { imageUrls } from './Images'; // Import the image array
import './ExpandingAnimation.css';
import { ExpandableCard } from './ExpandableCard';

interface ExpandingAnimationProps {
  isExpanded: boolean;
}

const FoodList = () => {
  return (
    <div className="food-guide">
      {/* IgG Sensitivities Section */}
      <section className="food-section">
        <h2 className="section-title">🚫 IgG Sensitivities (Class 1 or Higher)</h2>
        
        <div className="food-grid">
          <div className="food-block">
            <h3 className="block-title">Proteins</h3>
            <ul className="food-items">
              <li>Beef (0.178)</li>
              <li>Crab (0.237)</li>
              <li>Haddock (0.210)</li>
              <li>Egg Yolk (0.238)</li>
              <li>Cow's Milk (0.247)</li>
              <li>Yogurt (0.226)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Grains/Starches</h3>
            <ul className="food-items">
              <li>Gluten (0.216)</li>
              <li>Rice (0.276)</li>
              <li>Wheat (0.249)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Legumes/Nuts/Seeds</h3>
            <ul className="food-items">
              <li>Black Bean (0.220)</li>
              <li>Pinto Bean (0.257)</li>
              <li>Sesame (0.235)</li>
              <li>Sunflower Seed (0.253)</li>
              <li>Walnut (0.213)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Vegetables</h3>
            <ul className="food-items">
              <li>Broccoli (0.256)</li>
              <li>Carrot (0.226)</li>
              <li>Mushroom (0.222)</li>
              <li>Potato (0.260)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Fruits</h3>
            <ul className="food-items">
              <li>Coconut (0.259)</li>
              <li>Grape (0.234)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Misc</h3>
            <ul className="food-items">
              <li>Black Tea (0.221)</li>
              <li>Honey (0.220)</li>
              <li>Brewer's Yeast (0.236)</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* High-Histamine Foods Section */}
      <section className="food-section">
        <h2 className="section-title">🚫 High-Histamine Foods to Avoid</h2>
        <p className="section-subtitle">(Due to Slow MAO/DAO Genes)</p>
        
        <div className="food-grid">
          <div className="food-block">
            <h3 className="block-title">Proteins</h3>
            <ul className="food-items">
              <li>Aged/Cured Meats (salami, bacon)</li>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <li>Braised or Slow-Cooked Meats (e.g., short ribs)</li>
              <li>Shellfish (crab, shrimp)</li>
              <li>Canned Fish (tuna, sardines)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Dairy/Fermented</h3>
            <ul className="food-items">
              <li>Yogurt, Kefir</li>
              <li>Aged Cheeses (Parmesan, Gouda)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Vegetables</h3>
            <ul className="food-items">
              <li>Spinach (despite IgG-safe score)</li>
              <li>Eggplant</li>
              <li>Tomatoes</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Fruits</h3>
            <ul className="food-items">
              <li>Citrus (oranges, lemons)</li>
              <li>Strawberries</li>
              <li>Bananas (ripe)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Condiments</h3>
            <ul className="food-items">
              <li>Soy Sauce</li>
              <li>Vinegar</li>
              <li>Fermented Foods (kimchi, sauerkraut)</li>
            </ul>
          </div>

          <div className="food-block">
            <h3 className="block-title">Alcohol</h3>
            <ul className="food-items">
              <li>Wine, Beer, Champagne</li>
            </ul>
          </div>
        </div>
      </section>

      <style jsx>{`
        .food-guide {
          padding: 1rem;
          font-family: var(--font-inter);
        }

        .food-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 0.875rem;
          color: #4a5568;
          margin-bottom: 1.5rem;
        }

        .section-divider {
          border-top: 2px solid #e2e8f0;
          margin: 2rem 0;
        }

        .food-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .food-block {
          background: #f8fafc;
          border-radius: 0.5rem;
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .block-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .food-items {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .food-items li {
          font-size: 0.875rem;
          color: #4a5568;
          padding: 0.25rem 0;
          border-bottom: 1px dashed #e2e8f0;
        }

        .food-items li:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

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
  bottomContent={<FoodList />}
/>
      {/* <div className="expanding-animation-content">
        This is for no reason other than fun
      </div> */}
    </div>
  );
};

export default ExpandingAnimation;
