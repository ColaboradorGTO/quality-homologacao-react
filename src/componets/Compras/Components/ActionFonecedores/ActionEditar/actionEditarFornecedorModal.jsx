import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";

export const ActionEditarFornecedorModal = ({ show, handleClose, dadosDetalheFornecedor }) => {
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
          subTitle={"Alteração de Fornecedores"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditar handleClose={handleClose} dadosDetalheFornecedor={dadosDetalheFornecedor} />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}