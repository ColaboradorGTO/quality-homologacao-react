import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastrar } from "./formularioCadastrar";

export const ActionCadastrarFornecedorModal = ({ show, handleClose,  }) => {
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="lg"
        centered
      >

        <HeaderModal
          title={"Fornecedores"}
          subTitle={"Inclusão de Fornecedores "}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastrar handleClose={handleClose} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}