import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";


const initialState = {
    name: "",
    email: "",
    info: "",
    contact: "",
};

const AgregarActualizar = () => {
    const [data, setData] = useState(initialState);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();


    useEffect(() => {
        id && getSingleUser();
    }, [id])

    const getSingleUser = async () => {
        const docRef = doc(db, "users", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            setData({ ...snapshot.data() });
        }
    };

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date(). getTime() + file.name;
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) =>{
                    const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100;
                    setProgress (progress);
                    switch(snapshot.state){
                        case "paused":
                        console.log("Carga esta pausada");
                        break;
                        case "running":
                            console.log("Carga esta ejecutando");
                            break;
                            default:
                                break;
                        
                    }
                },
                (error) =>{
                    console.log(error)

                },
                () =>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        setData((prev) => ({... prev, img: downloadURL}));
                    });
                }
            );
        };

        file && uploadFile();
    }, [file])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const validate = () => {
        let errors = {};
        if (!data.name) {
            errors.name = "Nombre es requerido";
        }
        if (!data.email) {
            errors.email = "Email es requerido";
        }
        if (!data.info) {
            errors.info = "Información es requerida";
        }
        if (!data.contact) {
            errors.contact = "Contacto es requerido";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length) return setErrors(errors);
        setIsSubmit(true);
        if (!id) {
            try {
                await addDoc(collection(db, "users"), {
                    ...data,
                    timestamp: serverTimestamp(),
                });
            } catch (error) {
                console.log(error);
            }


        } else {
            try {
                await updateDoc(doc(db, "users", id), {
                    ...data,
                    timestamp: serverTimestamp(),
                });
            } catch (error) {
                console.log(error);
            }

        }

        navigate("/");
    };

    return (
        <div>
            <Grid centered verticalAlign="middle" columns="4" style={{ height: "80vh" }}>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <div>
                            {isSubmit ? (
                                <Loader active inline="centered" size="huge" />
                            ) : (
                                <>
                                    <h2>{id ? "Actualizar" : "Agregar"}</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input
                                            label="Nombre"
                                            error={errors.name ? { content: errors.name } : null}
                                            placeholder="Ingrese Nombre"
                                            name="name"
                                            onChange={handleChange}
                                            value={data.name}
                                        />
                                        <Form.Input
                                            label="Email"
                                            error={errors.email ? { content: errors.email } : null}
                                            placeholder="Ingrese Email"
                                            name="email"
                                            onChange={handleChange}
                                            value={data.email}
                                        />
                                        <Form.TextArea
                                            label="Información"
                                            error={errors.info ? { content: errors.info } : null}
                                            placeholder="Ingrese Información"
                                            name="info"
                                            onChange={handleChange}
                                            value={data.info}
                                        />
                                        <Form.Input
                                            label="Contacto"
                                            error={errors.contact ? { content: errors.contact } : null}
                                            placeholder="Ingrese Contacto"
                                            name="contact"
                                            onChange={handleChange}
                                            value={data.contact}
                                        />
                                        <Form.Input
                                            label="Cargar"
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <Button primary type="submit" disabled={progress !== null && progress < 100}>
                                            Subir
                                        </Button>
                                    </Form>
                                </>
                            )}
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export default AgregarActualizar;
