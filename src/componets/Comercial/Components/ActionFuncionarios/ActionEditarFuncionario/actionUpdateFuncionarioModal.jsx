import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditarFuncionario } from "./formularioEditar";


export const ActionUpdateFuncionarioModal = ({ show, handleClose, dadosAtualizarFuncionarios }) => {
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Dados do Funcionário"}
          subTitle={"Cadastrar ou Atualizar Informações do Funcionário"}
          handleClose={handleClose}
        />

        <Modal.Body>

          <FormularioEditarFuncionario 
            dadosAtualizarFuncionarios={dadosAtualizarFuncionarios} 
            handleClose={handleClose} 
          />
        
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}