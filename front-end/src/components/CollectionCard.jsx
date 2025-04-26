import React from "react";

function CollectionCard({ collection }) {
  return (
    <div className="collection-card">
      <h3>{collection.name}</h3>
      <p>{collection.description || "No description available"}</p>
      
   
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
  );
}

export default CollectionCard;
