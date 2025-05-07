import { useEffect, useState } from 'react';
import { Accordion, Button, Form, Spinner, Card } from 'react-bootstrap';

export default function BreedImages({ breed }) {
  const [allImages, setAllImages] = useState([]);
  const [randomImage, setRandomImage] = useState('');
  const [multipleImages, setMultipleImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(3);

  useEffect(() => {
    setAllImages([]);
    setRandomImage('');
    setMultipleImages([]);
  }, [breed]);

  const fetchAllImages = async () => {
    if (!breed) return;
    setLoading(true);
    try {
      const response = await fetch(`http://192.241.148.118:3000/api/dogs/breed/${breed}/images`);
      const data = await response.json();
      if (data.message) {
        setAllImages(data.message);
      }
    } catch (error) {
      console.error('Error al obtener todas las imágenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomImage = async () => {
    if (!breed) return;
    setLoading(true);
    try {
      const response = await fetch(`http://192.241.148.118:3000/api/dogs/breed/${breed}/random`);
      const data = await response.json();
      if (data.message) {
        setRandomImage(data.message);
      }
    } catch (error) {
      console.error('Error al obtener imagen random:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMultipleRandomImages = async () => {
    if (!breed || !quantity) return;
    setLoading(true);
    try {
      const response = await fetch(`http://192.241.148.118:3000/api/dogs/breed/${breed}/random/${quantity}`);
      const data = await response.json();
      if (data.message) {
        setMultipleImages(data.message);
      }
    } catch (error) {
      console.error('Error al obtener múltiples imágenes random:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!breed) return null;

  return (
    <div className="mt-5">
      <h3>📸 Imágenes de la raza: {breed.charAt(0).toUpperCase() + breed.slice(1)}</h3>

      <Accordion className="mt-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Ver todas las imágenes</Accordion.Header>
          <Accordion.Body>
            <Button variant="primary" onClick={fetchAllImages} className="mb-3">
              Mostrar Todas
            </Button>
            {loading && <Spinner animation="border" />}
            <div className="d-flex flex-wrap justify-content-center">
              {allImages.map((img, idx) => (
                <Card key={idx} className="m-2" style={{ width: '10rem' }}>
                  <Card.Img variant="top" src={img} />
                </Card>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Ver una imagen aleatoria</Accordion.Header>
          <Accordion.Body>
            <Button variant="success" onClick={fetchRandomImage} className="mb-3">
              Mostrar Random
            </Button>
            {loading && <Spinner animation="border" />}
            {randomImage && (
              <Card className="text-center mx-auto" style={{ width: '18rem' }}>
                <Card.Img variant="top" src={randomImage} />
              </Card>
            )}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Ver múltiples imágenes aleatorias</Accordion.Header>
          <Accordion.Body>
            <Form className="d-flex align-items-center justify-content-center mb-3">
              <Form.Control
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ maxWidth: '100px' }}
                className="me-2"
              />
              <Button variant="warning" onClick={fetchMultipleRandomImages}>
                Mostrar
              </Button>
            </Form>
            {loading && <Spinner animation="border" />}
            <div className="d-flex flex-wrap justify-content-center">
              {multipleImages.map((img, idx) => (
                <Card key={idx} className="m-2" style={{ width: '10rem' }}>
                  <Card.Img variant="top" src={img} />
                </Card>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

