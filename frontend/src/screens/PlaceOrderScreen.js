import React,{useEffect} from 'react';
import {Button,Row,Col,ListGroup,Image,Card,Alert} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {CheckoutSteps} from '../components/CheckoutSteps';
import {Link} from 'react-router-dom';
import { createOrder } from '../actions';


const PlaceOrderScreen =({history})=>{
    const cart=useSelector(state=>state.cart);
    const dispatch=useDispatch();
    cart.itemsPrice=cart.cartItems.reduce((acc,item)=>acc+item.qty*item.price,0).toFixed(2);
    cart.shippingPrice=cart.itemsPrice>100?0:100;
    cart.totalPrice=Number(cart.itemsPrice)+Number(cart.shippingPrice);

    const orderCreate=useSelector(state=>state.orderCreate);
    const {success,order,error}=orderCreate;

    useEffect(()=>{
        if(success){
            history.push(`/order/${order._id}`)
        }
        // eslint-disable-next-line
    },[history,success])


    const PlaceOrderHandler=()=>{
        dispatch(createOrder({
            orderItems:cart.cartItems,
            shippingAddress:cart.shippingAddress,
            paymentMethod:cart.paymentMethod,
            itemsPrice:cart.itemsPrice,
            shippingPrice:cart.shippingPrice,
            totalPrice:cart.totalPrice

        }))
        
    }


    return (
        <>
        <CheckoutSteps step1 step2 step3 step4 />
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong>Address: </strong>{cart.shippingAddress.address}, {cart.shippingAddress.city}{''}, {cart.shippingAddress.postCode},{''} {cart.shippingAddress.country}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {cart.cartItems.length===0 ? <Alert>Your Cart is empty</Alert> :(
                            <ListGroup variant='flush'>
                                {cart.cartItems.map((item,index)=>(
                                    <ListGroup.Item key={item.product}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x £{item.price} =£{item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}

                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>£{cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>£{cart.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>£{cart.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                                {error&& <Alert variant='danger'>{error}</Alert>}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button type='button' className='btn-block' disabled={cart.cartItems===0} onClick={PlaceOrderHandler}>Place Order</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
        

        </>
    )
}

export default PlaceOrderScreen;