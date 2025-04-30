import React from "react";

function CollectionCard({ collection }) {
  return (
    <div className="collection-container">
    <div className="collection-card">
      <h3>{collection.name}</h3>
      
   
      <div className="collection-items">
        {collection.items && collection.items.length > 0 ? (
          collection.items.map(item => (
            <div key={item.id} className="collection-item">
              <p>{item.name}</p>
            </div>
          ))
        ) : (
          <p>No items in this collection</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default CollectionCard;
