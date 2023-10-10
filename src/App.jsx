import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dogInfo, setDogInfo] = useState(null);
  const [banAttributes, setBanAttributes] = useState({
    breed: [],
    origin: [],
    weight: [],
  });
  const [viewedDogs, setViewedDogs] = useState([]);

  const API_KEY =
    'live_OQWST9uMnx710EFItrTXDoTMezIdIgBsYc0HpSB9cjt33Z5axq7AZWTU2quIlxYi';

  useEffect(() => {
    fetchRandomDog();
  }, []);

  const fetchRandomDog = async () => {
    try {
      let url = 'https://api.thedogapi.com/v1/images/search';
      const response = await fetch(url, {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      const data = await response.json();

      if (data && data.length && data[0].breeds && data[0].breeds[0]) {
        const dog = data[0];
        const breed = dog.breeds[0];

        if (
          !banAttributes.breed.includes(breed.name || '') &&
          !banAttributes.origin.includes(breed.country_code || '') &&
          breed.weight &&
          !banAttributes.weight.includes(breed.weight.imperial || '')
        ) {
          setDogInfo(dog);
          setViewedDogs((prevDogs) => [
            ...prevDogs,
            { breed: breed.name || 'Unknown Breed', image: dog.url },
          ]);
        } else {
          fetchRandomDog();
        }
      }
    } catch (error) {
      console.error('Error fetching the dog info:', error);
    }
  };

  const banAttribute = (attributeType, value) => {
    setBanAttributes((prevState) => ({
      ...prevState,
      [attributeType]: [...prevState[attributeType], value],
    }));
  };

  return (
    <div className="app-background">
      <div className="left-panel">
        <h3>Previously Viewed:</h3>
        <div className="scrollable-content">
          <ul>
            {viewedDogs.map((dog, index) => (
              <li key={index}>
                <img src={dog.image} alt={dog.breed} className="thumbnail" />
                {dog.breed}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="center-panel">
        {dogInfo && (
          <div className="translucent-box">
            <div className="title-container">
              <h1>Paws & Explore🐾</h1>
              <h3>Discover the best buds tail-wagging around!</h3>
              <h1>🐶🐶🐶🐶</h1>
            </div>

            <div className="attribute-buttons">
              <button
                onClick={() => banAttribute('breed', dogInfo.breeds[0].name)}
              >
                {dogInfo.breeds[0].name || 'Unknown Breed'}
              </button>
              <button
                onClick={() =>
                  banAttribute('origin', dogInfo.breeds[0].country_code)
                }
              >
                {dogInfo.breeds[0].country_code || 'USA'}
              </button>
              <button
                onClick={() =>
                  banAttribute('weight', dogInfo.breeds[0].weight.imperial)
                }
              >
                {(dogInfo.breeds[0].weight &&
                  dogInfo.breeds[0].weight.imperial) ||
                  'Unknown Weight'}{' '}
                lbs
              </button>
            </div>

            <img
              src={dogInfo.url}
              alt={dogInfo.breeds[0].name}
              className="main-image"
            />
            <button className="next-button" onClick={fetchRandomDog}>
              Show another dog!
            </button>
          </div>
        )}
        {!dogInfo && (
          <button className="start-button" onClick={fetchRandomDog}>
            Start stumbling upon dogs!
          </button>
        )}
      </div>
      <div className="right-panel">
        <h3>Banned Attributes:</h3>
        <ul>
          {Object.entries(banAttributes).map(([key, values]) =>
            values.map((value, index) => (
              <li key={index}>
                <button className="banned-breed-button">{value}</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
