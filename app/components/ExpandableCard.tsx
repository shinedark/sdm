'use client';

import { useState, useCallback } from 'react';
import Image from "next/image";
interface ExpandableCardProps {
  imageUrl: string;
  imageAlt: string;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
export function ExpandableCard({
  imageUrl,
  imageAlt,
  rightContent,
  bottomContent,
  onMouseEnter,
  onMouseLeave
}: ExpandableCardProps) {
  const [isBottomExpanded, setIsBottomExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(true);
    onMouseEnter?.();
  }, [onMouseEnter]);
  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);
    onMouseLeave?.();
  }, [onMouseLeave]);
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);
  return <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <div className="card-header">
        <div className="header-text">MEDICAL ID</div>
      </div>
      
      <div className="card-content">
        {/* Left side - Photo */}
        <div className="photo-section">
          <div className="photo-container">
            <Image src={imageUrl} alt={imageAlt} fill unoptimized className="photo" sizes="(max-width: auto) 100vw, 50vw" />
          </div>
          <div className="signature-line">Signature</div>
        </div>

        {/* Right side - Information */}
        <div className="info-section">
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">SHINE DARK</span>
            </div>
            <div className="info-row">
              <span className="label">ID Number:</span>
              <span className="value">369-1832-64-128</span>
            </div>
            <div className="info-row">
              <span className="label">Date of Birth:</span>
              <span className="value">03/03/1990</span>
            </div>
            <div className="info-row">
              <span className="label">Address:</span>
              <span className="value">123 Kelly Ln, Importa, State</span>
            </div>
            <div className="info-row">
              <span className="label">Issued Date:</span>
              <span className="value">03/03/1990</span>
            </div>
            <div className="info-row">
              <span className="label">Expiry Date:</span>
              <span className="value">ASK JESUS</span>
            </div>
            <div className="info-row">
              <span className="label">Conditioon:</span>
              <span className="value">Gut realted Mental Health</span>
            </div>
            <div className="info-row">
              <span className="label">Intolerances :</span>
              <span className="value"></span>
            </div>
            <div className="info-row">
              <span className="label">Medicines:</span>
              <span className="value">Weed, L-glutamine, L-theanine, glucosamine, chondroitin, magnesium glycinate, vitamine e, fish oil, essential nutrients multivitamin, and more abilify 5 mg, Exercise</span>
            </div>
            <div className="info-row">
              <span className="label">Doses:</span>
              <span className="value">{`Due to the condition, the doses and days for some medicines are relative. Please ask the patient to determine the correct dose.`}</span>
            </div>
          </div>
        </div>
      </div>x

      {/* Bottom expandable section */}
      {bottomContent && <div className="expandable-section">
          <button onClick={e => {
        e.stopPropagation();
        setIsBottomExpanded(!isBottomExpanded);
      }} className="expand-button">
            <h3 className="arrow">
              FULL LIST OF FOODS
            </h3>
          </button>
          
          <div className={`expandable-content ${isBottomExpanded ? 'expanded' : ''}`}>
            {bottomContent}
          </div>
        </div>}

      <style jsx>{`
        .card {
          width: 75vw;
          height:50vh;
          top: 2vh;
          z-index: 1000;
          position: relative;
          margin: 0 auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          pointer-events: auto;
          z-index: 1000;
      -webkit-overflow-scrolling: touch;
        }

        .card-header {
          background: #1a365d;
          color: white;
          padding: 4px 8px;
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .card-content {
          display: flex;
          padding: 8px;
          height: calc(100% - 24px);
        }

        .photo-section {
          width: 35%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-right: 8px;
        }

        .photo-container {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 120%;
          border: 1px solid #ccc;

                      background-image: url('/images/game.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .photo {
          object-fit: cover;
          pointer-events: auto;
        }

        .signature-line {
          width: 100%;
          text-align: center;
   
          margin-top: 4px;
          border-top: 1px solid #ccc;
          padding-top: 2px;
        }

        .info-section {
          width: 65%;
          padding-left: 8px;
          border-left: 1px dashed #ccc;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-row {
          display: flex;
          font-size: 12px;
          line-height: 1.2;
        }

        .label {
          font-weight: bold;
          width: 40%;
          color: #1a365d;
        }

        .value {
          width: 60%;
          color:rgb(24, 24, 25);
        }

        .expandable-section {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e2e8f0;
          pointer-events: auto;
                    overflow-y: auto;
        }

        .expand-button {
          width: 100%;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 8px;
          font-weight: 500;
          transition: background-color 0.2s;
          pointer-events: auto;
        }

        .expand-button:hover {
          background-color: #f8fafc;
        }

        .arrow {
          font-size: 20px;
        
          color: black;
        }
        
        .arrow:hover {
          color: #1a365d;
        }

        .expandable-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
          pointer-events: auto;
          font-size: 8px;
                    overflow-y: auto;
        }

        .expandable-content.expanded {
          max-height: 300px;
                    overflow-y: auto;
        }

        .expandable-content > div {
          padding: 8px;
        }
      `}</style>
    </div>;
}