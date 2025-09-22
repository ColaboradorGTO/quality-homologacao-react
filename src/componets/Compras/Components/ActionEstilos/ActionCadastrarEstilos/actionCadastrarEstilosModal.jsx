import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { FormularioCadastrarEstilos } from "./formularioCadastrarEstilos";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";


export const ActionCadastrarEstilosModal = ({ show, handleClose }) => {

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="xl"
        centered
      >

        <HeaderModal
          title={"Estilos"}
          subTitle={"Cadastrar"}
          handleClose={handleClose}
        />



        <Modal.Body>
          <FormularioCadastrarEstilos  handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}