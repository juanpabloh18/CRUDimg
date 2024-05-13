import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { Button, Card, Grid, Container, Image, GridColumn, CardDescription, Item, Modal } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import ModalComponente from "../Componentes/ModalComponente";

const Home = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() })

            });
            setUsers(list);
            setLoading(false)
        },
            (error => {
                console.log(error);
            })
        );

        return () => {
            unsub();
        }
    }, []);

    const handleModal = (item) =>{
        setOpen (true);
        setUser(item);
    };

    const  HandleDelete = async(id) =>{
        if(window.confirm("seguro que quieres eliminar")){
            try{
                setOpen(false);
                await deleteDoc(doc(db, "users",id));
                setUsers(users.filter((user) => user.id !== id));
            }catch (err){
              console.log(err);
            }
        }
    }
    return (
        <>
            <Container>
                
                    <Grid  columns={3}stackable >
                        {users && users.map((item) => (
                            <GridColumn key={item.id}>
                                <Card >
                                    <Card.Content>
                                        <Image
                                        src={item.img}
                                        size="medium"
                                        style={{
                                            height:"150px",
                                            width: "150px",
                                            borderRadius: "50%"
                                        }}
                                        />
                                        <Card.Header style={{marginTop: "10px"}}>{item.name}</Card.Header>
                                        <CardDescription>{item.info}</CardDescription>
                                    </Card.Content>
                                    <Card.Content extra>
                                      <div>
                                        <Button color="green" onClick={() => navigate(`/Actualizar/${item.id}`)}> Actualizar</Button>
                                        <Button color="blue" onClick={() => handleModal(item)} > Ver</Button>
                                        {open && (
                                            <ModalComponente
                                            open={open}
                                            setOpen={setOpen}
                                            HandleDelete={ HandleDelete}
                                            {...user}
                                            />
                                        )}
                                      </div>
                                    </Card.Content>
                                 
                                </Card>
                            </GridColumn>
                        ))}
                    </Grid>
                
            </Container>
        </>
    )
}

export default Home;