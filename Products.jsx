import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  CardText,
  Col,
  Container,
  Form,
  FormGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { addToCart } from "../store/Slices/cartSlice";

export default function Products() {

  // product > cart 
    const dispatch =useDispatch();
  // 1- all products
  const [products, setProducts] = useState([]);

  // Search > ui
  const [searchValue, setSearchValue] = useState("");

  // number of limit >  products pf page // 10
  // 1- limit
  const limit = 20;
  // 2 - page > skip product > 1 > 20 , 2> 20 : 20
  const [skip, setskip] = useState(0);
  // 3 total page
  const [totalPage, setTotalPage] = useState(0);
  //curent page
  const [currentPage, setCurrentPage] = useState(1);
  // updatpaignation
  function updatePaigntion(page) {
    // setcurrentpage > change  > page
    setCurrentPage(page);
    // skip > product skip
    // limit 1 -1 * limit  >  1  , 0 *20 , 2 , skip  1 *20  > skip 20 , 3 > 2 *20 , 60
    setskip((page - 1) * limit);
  }
  useEffect(() => {
    async function fetchProducts() {
      try {
        const reponse = await axios.get(
          `https://dummyjson.com/products/search?q=${searchValue}&limit=${limit}&skip=${skip}`,
        );
        console.log(reponse.data);
        console.log(reponse.data.products);
        setProducts(reponse.data.products);
        // total of page  total/limit
        setTotalPage(Math.ceil(reponse.data.total / limit)); // page 10 <button></button>
        console.log(totalPage);
        // console.log(searchValue);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProducts();
  }, [searchValue, skip]);
  return (
    <Container className="my-3">
      <div className="border my-3 rounded p-4">
        <h3>Search</h3>
        <FormGroup className="flex-fill">
          {/* event > onchange input , onsumbit */}
          <Form.Control
            type="seach"
            placeholder="search product...."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </FormGroup>
      </div>
      <Row className="g-3">
        {/* product not found */}
        {products.length === 0 && <h1>Product Not Found</h1>}
        {products.map((product) => (
          <Col key={product.id} md={2} lg={3} xl={4}>
            <Card className="shadow">
              <CardImg
                src={product.thumbnail}
                variant="top"
                alt={product.title}
              />
              <CardBody>
                <Card.Title>{product.title}</Card.Title>
                <CardText className="text-truncate">
                  {product.description}
                </CardText>
                <CardText className="fw-bold text-success-emphasis">
                  ${product.price}
                </CardText>
              </CardBody>
              <CardFooter className="d-flex justify-content-between align-items-center gap-2">
                <Button
                  as={Link}
                  variant="outline-success"
                  to={`/product-details/${product.id}`}
                >
                  Show More
                </Button>
                <Button variant="dark" onClick={()=> dispatch(addToCart(product))}>
                   Add To Cart</Button>
              </CardFooter>
            </Card>
          </Col>
        ))}
      </Row>
      {products.length != 0 && (
        <Pagination className="d-flex flex-wrap justify-content-center my-3">
          {currentPage !=1 && (
            <Pagination.First onClick={()=> updatePaigntion(1 )} />)}
          <Pagination.Prev  onClick={()=> updatePaigntion(currentPage -1)}  disabled={currentPage == 1} />
          {/* total page > pagination item > 10 page  [1,2,3,4,5,6,7,8,9] */}
          {Array.from({ length: totalPage }).map((item, index) => (
            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => updatePaigntion(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={()=> updatePaigntion(currentPage +1)} 
           disabled={currentPage == totalPage} /> 
           {currentPage !=totalPage && (<Pagination.Last  onClick={()=> updatePaigntion(totalPage)} />)}
        </Pagination>
      )}
    </Container>
  );
}
