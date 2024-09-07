import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Card from "./components/Card/Card";
import { CardData } from "./components/Card/Card.types";
import { ClipLoader } from "react-spinners";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

function App() {
  const [data, setData] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<{ data: CardData[] }>("data.json");
      const modifiedResponse = response?.data?.data.map((item: CardData) => ({
        ...item,
        id: uuid(),
      }));
      setData(modifiedResponse);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCardClick = (imageUrl: string) => {
    setOverlayImage(imageUrl);
  };

  const closeOverlay = () => {
    setOverlayImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedData = Array.from(data);
    const [movedItem] = reorderedData.splice(result.source.index, 1);
    reorderedData.splice(result.destination.index, 0, movedItem);
    setData(reorderedData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={uuid()}>
        {(provided) => (
          <div
            className="grid-container"
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {isLoading && (
              <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
            )}
            {error && <div>{error}</div>}
            {!isLoading &&
              data.length > 0 &&
              data.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <Card item={item} onClick={handleCardClick} />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {overlayImage && (
        <div className="overlay" onClick={closeOverlay}>
          <div className="overlay-content">
            <img src={overlayImage} alt="Enlarged view" />
          </div>
        </div>
      )}
    </DragDropContext>
  );
}

export default App;
