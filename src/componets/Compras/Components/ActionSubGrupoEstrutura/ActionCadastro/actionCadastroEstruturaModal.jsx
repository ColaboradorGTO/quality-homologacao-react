import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { FormularioCadastro } from "./formularioCadastro"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"

export const ActionCadastroEstruturaModal = ({ show, handleClose }) => {

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
          title={"Estrutura Mercadológica"}
          subTitle={"Inclusão "}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastro handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}