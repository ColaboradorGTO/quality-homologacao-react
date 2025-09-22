import React, { Fragment} from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioCadastrar } from "./formularioCadastrar";


export const ActionCreateCaixaModal = ({show, handleClose, dadosListaCaixa}) => {
 
  return (
    
    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"

      >

        <HeaderModal
          title={"Dados do Caixa - PDV"}
          subTitle={"Cadastrar informações do Caixa - PDV"}
          handleClose={handleClose}
        />

        <Modal.Body>
      
          <FormularioCadastrar  handleClose={handleClose} dadosListaCaixa={dadosListaCaixa}/>
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}                      