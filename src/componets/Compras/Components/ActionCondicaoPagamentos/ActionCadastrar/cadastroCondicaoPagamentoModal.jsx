import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastro } from "./formularioCadastro";


export const ActionCadastroCondicaoPagamentoModal = ({ show, handleClose }) => {

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
          title={"Condições de Pagamento"}
          subTitle={"Inclusão de Pagamento"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastro handleClose={handleClose} />

        </Modal.Body>
      </Modal>
    </Fragment>
  )
}