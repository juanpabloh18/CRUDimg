import React from "react";
import { Modal, Header, Image, Button } from "semantic-ui-react";


const ModalComponente = ({ open, setOpen, img, name, info, email, contact, id, HandleDelete }) => {
    return (
        <>
            <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
                <Modal.Header>Info Usuario</Modal.Header>
                <Modal.Content image>
                    <Image size="medium" src={img} wrapped />
                    <Modal.Description>
                        <Header>{name}</Header>
                        <p>{email}</p>
                        <p>{info}</p>
                        <p>{contact}</p>

                    </Modal.Description>

                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setOpen(false)}> cancelar</Button>
                    <Button  color="red"content="Delete" labelPosition="right"  icon="checkmark"onClick={()=> HandleDelete(id)}> Eliminar</Button>
                </Modal.Actions>

            </Modal>
        </>
    )
}

export default ModalComponente
