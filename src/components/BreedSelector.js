import { useEffect, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';

export default function BreedSelector({ onSelect }) {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBreeds = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.241.148.118:3000/api/dogs/breeds');
      const data = await response.json();
      if (data.message) {
        setBreeds(Object.keys(data.message));
      }
    } catch (error) {
      console.error('Error al obtener las razas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  const handleChange = (e) => {
    const selectedBreed = e.target.value;
    onSelect(selectedBreed);
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label>Selecciona una raza</Form.Label>
      {loading ? (
        <div><Spinner animation="border" /> Cargando razas...</div>
      ) : (
        <Form.Select onChange={handleChange}>
          <option value="">-- Selecciona una raza --</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed.charAt(0).toUpperCase() + breed.slice(1)}
            </option>
          ))}
        </Form.Select>
      )}
    </Form.Group>
  );
}

