import { useState } from 'react';
import { Button, Form, Spinner, Card } from 'react-bootstrap';

export default function MultipleRandomDogs() {
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(3); // Por defecto 3 imágenes
  const [loading, setLoading] = useState(false);

  const fetchMultipleDogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.241.148.118:3000/api/dogs/random/${quantity}`);
      const data = await response.json();
      if (data.message) {
        setImages(data.message);
      }
    } catch (error) {
      console.error('Error al obtener imágenes aleatorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <div className="mt-5">
      <h3>🐶 Múltiples Imágenes Aleatorias</h3>

      <Form className="d-flex align-items-center justify-content-center mb-3">
        <Form.Control
          type="number"
          min="1"
          max="50"
          value={quantity}
          onChange={handleQuantityChange}
          style={{ maxWidth: '120px' }}
          className="me-2"
        />
        <Button variant="success" onClick={fetchMultipleDogs}>
          Obtener
        </Button>
      </Form>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className="d-flex flex-wrap justify-content-center">
          {images.map((url, index) => (
            <Card key={index} className="m-2" style={{ width: '12rem' }}>
              <Card.Img variant="top" src={url} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

