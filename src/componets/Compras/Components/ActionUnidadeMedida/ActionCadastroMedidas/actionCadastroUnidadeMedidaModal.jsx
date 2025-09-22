import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadatro } from "./formularioCadastro";


export const ActionCadastroUnidadeMedidaModal = ({ show, handleClose }) => {

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
          subTitle={"Inclusão "}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioCadatro handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
