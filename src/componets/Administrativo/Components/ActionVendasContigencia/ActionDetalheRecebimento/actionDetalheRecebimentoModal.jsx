import { Fragment, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ActionListaDetalheVendas } from "./actionListaDetalheVendas";
import { FormularioAlteracaoPagamento } from "./formularioAlteracaoPagamento";


export const ActionDetalheRecebimentoModal = ({ show, handleClose, dadosDetalheRecebimentos, usuarioLogado, optionsModulos }) => {

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
          title={"Detalhe da Venda"}
          subTitle={"Relação de Recebimentos da Venda"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <ActionListaDetalheVendas dadosDetalheRecebimentos={dadosDetalheRecebimentos} />
          <FormularioAlteracaoPagamento  
            dadosDetalheRecebimentos={dadosDetalheRecebimentos} 
            handleClose={handleClose} 
            usuarioLogado={usuarioLogado} 
            optionsModulos={optionsModulos}
          />
        </Modal.Body>
        <FooterModal

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar={"secondary"}
        />
      </Modal>
    </Fragment>
  )
}