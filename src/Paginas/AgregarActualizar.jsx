import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
    name: "",
    email: "",
    info: "",
    contact: "",
    img: ""
};

const AgregarActualizar = () => {
    const [data, setData] = useState(initialState);
    const { name, email, info, contact } = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        id && getSingleUser();
    }, [id]);

    const getSingleUser = async () => {
        const docRef = doc(db, "users", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            setData({ ...snapshot.data() });
        }
    };

    const handleFileUpload = async () => {
        if (id && data.img) {
            const oldImageRef = ref(storage, data.img);
            await deleteObject(oldImageRef).catch((error) => console.log("Error eliminando imagen antigua:", error));
        }

        const fileName = new Date().getTime() + "_" + file.name;
        const storageRef = ref(storage, `images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    setIsSubmit(false);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let errors = {};
        if (!name) {
            errors.name = "Nombre es requerido";
        }

        if (!email) {
            errors.email = "Email es requerido";
        }

        if (!info) {
            errors.info = "La información es requerida";
        }

        if (!contact) {
            errors.contact = "Contacto es requerido";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = validate();
        if (Object.keys(errors).length) return setErrors(errors);
        setIsSubmit(true);

        let imgURL = data.img;

        if (file) {
            try {
                imgURL = await handleFileUpload();
            } catch (error) {
                console.log("Error en la subida del archivo:", error);
                return;
            }
        }

        const updatedData = {
            ...data,
            img: imgURL,
            timestamp: serverTimestamp(),
        };

        try {
            if (!id) {
                await addDoc(collection(db, "users"), updatedData);
            } else {
                await updateDoc(doc(db, "users", id), updatedData);
            }
            navigate("/");
        } catch (error) {
            console.log("Error al guardar los datos:", error);
            setIsSubmit(false);
        }
    };

    return (
        <div>
            <Grid centered verticalAlign="middle" columns="3" style={{ height: "80vh" }}>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <div>
                            {isSubmit ? <Loader active inline="centered" size="huge" /> : (
                                <>
                                    <h2>{id ? "Actualizar Usuario" : "Agregar Usuario"}</h2>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Input
                                            label="Name"
                                            error={errors.name ? { content: errors.name } : null}
                                            placeholder="Tu nombre"
                                            name="name"
                                            onChange={handleChange}
                                            value={name}
                                            autoFocus
                                        />
                                        <Form.Input
                                            label="Email"
                                            error={errors.email ? { content: errors.email } : null}
                                            placeholder="Tu correo"
                                            name="email"
                                            onChange={handleChange}
                                            value={email}
                                        />
                                        <Form.TextArea
                                            label="Info"
                                            error={errors.info ? { content: errors.info } : null}
                                            placeholder="Información del producto"
                                            name="info"
                                            onChange={handleChange}
                                            value={info}
                                        />
                                        <Form.Input
                                            label="Contact"
                                            error={errors.contact ? { content: errors.contact } : null}
                                            placeholder="Tu contacto"
                                            name="contact"
                                            onChange={handleChange}
                                            value={contact}
                                        />
                                        <Form.Input
                                            label="Subir"
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                        <Button
                                            primary
                                            type="submit"
                                            disabled={progress !== null && progress < 100}
                                        >
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
