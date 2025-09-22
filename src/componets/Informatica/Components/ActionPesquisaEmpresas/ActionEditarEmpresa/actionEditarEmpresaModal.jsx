import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioEditar } from "./formularioEditar"


export const ActionEditarEmpresa = ({ show, handleClose, dadosEditarEmpresa }) => {
 return (
    <Fragment>
        <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndx={-1}
        role="dialog"
        aria-hidden="true"
        >

        <HeaderModal
          title={"Dados da Empresa"}
          subTitle={"Detalhes da Empresa"}
          handleClose={handleClose}
        />

        <Modal.Body>
            <FormularioEditar handleClose={handleClose} dadosEditarEmpresa={dadosEditarEmpresa} />
        </Modal.Body>
        </Modal>
    </Fragment>
 )
}