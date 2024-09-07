import React, { useState } from "react";
import "./Card.css";
import { CardData } from "./Card.types";
import { ClipLoader } from "react-spinners";
type CardProps = {
  item: CardData;
  onClick: (imageUrl: string) => void;
};
function Card({ item, onClick }: CardProps) {
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  const handleClick = () => {
    onClick(item.imageUrl);
  };

  return (
    <div className="card" onClick={handleClick}>
      <div>
        <h3>{item?.type}</h3>
        {isImageLoading && (
          <div className="spinner-container">
            <ClipLoader size={30} color={"#123abc"} />
          </div>
        )}
        <img
          src={item.imageUrl}
          height="300px"
          width="300px"
          alt={item.title}
          onLoad={handleImageLoad}
          style={{ display: isImageLoading ? "none" : "block" }}
        />
      </div>
    </div>
  );
}

export default Card;
