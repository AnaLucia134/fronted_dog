import { useEffect, useState, useCallback } from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';

export default function SubBreedList({ breed, onSelect }) {
  const [subBreeds, setSubBreeds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mueve fetchSubBreeds dentro de un useCallback para memoización
  const fetchSubBreeds = useCallback(async () => {
    if (!breed) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/dogs/breed/${breed}/subbreeds`);
      const data = await response.json();
      if (data.message) {
        setSubBreeds(data.message);
      }
    } catch (error) {
      console.error('Error al obtener las subrazas:', error);
    } finally {
      setLoading(false);
    }
  }, [breed]); // breed es una dependencia aquí

  useEffect(() => {
    fetchSubBreeds();
  }, [breed, fetchSubBreeds]); // Ahora incluye todas las dependencias

  if (!breed) return null;

  const handleSubBreedClick = (sub) => {
    if (onSelect) {
      onSelect(sub);
    }
  };

  return (
    <div className="mt-4">
      <h4>Subrazas de {breed.charAt(0).toUpperCase() + breed.slice(1)}</h4>
      {loading ? (
        <div><Spinner animation="border" /> Cargando subrazas...</div>
      ) : (
        subBreeds.length > 0 ? (
          <ListGroup>
            {subBreeds.map((sub, idx) => (
              <ListGroup.Item
                key={idx}
                action
                onClick={() => handleSubBreedClick(sub)}
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted">Esta raza no tiene subrazas.</p>
        )
      )}
    </div>
  );
}
