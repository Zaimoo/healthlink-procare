import React from "react";
import Form from 'react-bootstrap/Form';

export const GlobalFilter = ({ filter, setFilter}) => {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control 
                type="text" placeholder="Search..."
                onChange={(e) => setFilter(e.target.value)} />
               
            </Form.Group>
        </Form>
    )
}