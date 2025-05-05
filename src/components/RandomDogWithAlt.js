import { useState } from 'react';
import { Button, Spinner, Card } from 'react-bootstrap';

export default function RandomDogWithAlt() {
  const [dogData, setDogData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDogWithAlt = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/dogs/random/alt');
      const data = await response.json();
      if (data.message) {
        setDogData(data.message);
      }
    } catch (error) {
      console.error('Error al obtener imagen con descripción:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h3>📝 Imagen Aleatoria con Descripción</h3>
      <Button variant="info" onClick={fetchDogWithAlt} className="mb-3">
        Obtener Imagen con Alt
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : dogData && (
        <Card className="text-center mx-auto" style={{ maxWidth: '20rem' }}>
          <Card.Img variant="top" src={dogData.image} />
          <Card.Body>
            <Card.Text>{dogData.alt}</Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
