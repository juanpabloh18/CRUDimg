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
    contact: ""
}

const AgregarActualizar = () => {

    const [data, setData] = useState(initialState);
    const { name, email, info, contact } = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErros] = useState({});
    const [isSubmit, setIssubmit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("La carga esta pausada");
                        break;
                    case "running":
                        console.log("La carga esta ejecutando");
                    default:
                        break;
                }
            }, (error) => {
                console.log(error)
            },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setData((prev) => ({ ...prev, img: downloadURL }))
                    });
                }
            );
        };

        file && uploadFile();   
    }, [file]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let errors = {};
        if (!name) {
            errors.name = "nombre es requerido";
        }

        if (!email) {
            errors.email = "email es requerido";
        }

        if (!info) {
            errors.info = "la información es requerida";
        }

        if (!contact) {
            errors.contact = "contacto es requerido";
        }

        return errors;
    };

    const handleSubmit =  async (e) => {
        e.preventDefault();
        let errors = validate();
        if (Object.keys(errors).length) return setErros(errors);
        setIssubmit(true);
          await addDoc(collection(db, "users"), {
            ...data,
            timestamp: serverTimestamp()
          })
          navigate("/");
    };

    return (
        <div>
            <Grid centered verticalAlign="middle" columns="3" style={{ height: "80vh" }}>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <div>
                            {isSubmit ? <Loader active inline="centered" size="huge" /> : (
                                <>
                                    <h2>Agregar item</h2>
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
                                            label="subir"
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
