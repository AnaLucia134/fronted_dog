import { useState } from 'react';
import BreedSelector from './BreedSelector';
import SubBreedList from './SubBreedList';
import MultipleRandomDogs from './MultipleRandomDogs';
import BreedImages from './BreedImages';
import SubBreedImages from './SubBreedImages';

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedSubBreed, setSelectedSubBreed] = useState('');

  const fetchRandomDog = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/dogs/random');
      const data = await response.json();
      setImageUrl(data.message);
    } catch (error) {
      console.error('Error al obtener imagen aleatoria:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5 bg-light d-flex flex-column align-items-center">
      <div className="mb-5 text-center">
        <h1 className="display-5 mb-3">🐕‍🦺 Mundo Perruno</h1>
        <p className="text-muted">Descubre razas y disfruta imágenes de nuestros mejores amigos 🐶</p>
      </div>

      <div className="row w-100 justify-content-center g-4" style={{ maxWidth: '1200px' }}>
        
        {/* Card: Imagen Aleatoria */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title">Imagen Aleatoria</h5>
              <p className="card-text">¿Suerte? ¡Haz clic y mira qué perrito aparece!</p>
              <button onClick={fetchRandomDog} className="btn btn-primary mb-3">
                🎲 Mostrar Imagen
              </button>
              {loading && <div className="spinner-border text-primary" role="status"></div>}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Perro aleatorio"
                  className="img-fluid rounded shadow-sm mt-3"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-center">Selecciona una Raza</h5>
              <BreedSelector
                onSelect={(breed) => {
                  setSelectedBreed(breed);
                  setSelectedSubBreed('');
                }}
              />
            </div>
          </div>
        </div>

        {selectedBreed && (
          <div className="col-12 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-center">Subrazas disponibles</h5>
                <SubBreedList breed={selectedBreed} onSelect={setSelectedSubBreed} />
              </div>
            </div>
          </div>
        )}

        {selectedBreed && !selectedSubBreed && (
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Imágenes de la Raza: {selectedBreed}</h5>
                <BreedImages breed={selectedBreed} />
              </div>
            </div>
          </div>
        )}

        {selectedBreed && selectedSubBreed && (
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">
                  Imágenes de {selectedSubBreed} ({selectedBreed})
                </h5>
                <SubBreedImages breed={selectedBreed} subBreed={selectedSubBreed} />
              </div>
            </div>
          </div>
        )}

        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-center">Más imágenes aleatorias</h5>
              <MultipleRandomDogs />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
