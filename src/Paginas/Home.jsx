import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { Button, Card, Grid, Container, Image, GridColumn, CardDescription, Item, Modal } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import ModalComponente from "../Componentes/ModalComponente";

const Home = () => {
   
    return (
        <>
    <h1>Este es el inicio</h1>
        </>
    )
}

export default Home;