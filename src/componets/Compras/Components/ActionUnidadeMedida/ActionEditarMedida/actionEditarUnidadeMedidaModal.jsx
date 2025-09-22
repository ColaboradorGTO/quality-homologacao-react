import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { FormularioEditar } from "./formularioEditar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";


export const ActionEditarUnidadeMedidaModal = ({ show, handleClose, dadosDetalheUnidadeMedida }) => {

  

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
          title={"Unidades de Medida"}
          subTitle={"Alteração"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioEditar dadosDetalheUnidadeMedida={dadosDetalheUnidadeMedida} handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
