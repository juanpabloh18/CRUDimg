import React from "react";
import { Menu, Container, Button,Image } from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import reactLogo from '../assets/react.svg'


const navbar =() =>{
    const navigate = useNavigate();
    return(
        <Menu inverted borderless style ={{padding: "0.3rem", marginBotton:"20px"}} attached>
            <Container>
                <Menu.Item name="home">
                    <Link to= "/">
                    <Image size="mini" src={reactLogo}/>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <h2>Taller CRUD IMG</h2>
                </Menu.Item>
                <Menu.Item position="right">
                    <Button size="mini" primary onClick={()=> navigate("/Agregar")}>Agregar Usuario</Button>

                </Menu.Item>
            </Container>
        </Menu>
    )
}


export default navbar