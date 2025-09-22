import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { FormularioEditarEstilos } from "./formularioEditarEstilos";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";


export const ActionEditarEstilosModal = ({ show, handleClose, dadosDetalheEstilos }) => {

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
          subTitle={" Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditarEstilos dadosDetalheEstilos={dadosDetalheEstilos} handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}