// GlobalFilter.js
import React from "react";
import Form from 'react-bootstrap/Form';

const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Control 
                    type="text" 
                    placeholder="Search..."
                    value={filter || ""}
                    onChange={(e) => setFilter(e.target.value)} />
            </Form.Group>
        </Form>
    )
}

export default GlobalFilter;
