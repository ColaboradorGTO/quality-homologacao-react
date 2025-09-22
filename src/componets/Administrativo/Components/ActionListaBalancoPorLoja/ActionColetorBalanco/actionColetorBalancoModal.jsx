import { Fragment, useEffect, useRef, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import Swal from "sweetalert2";
import { get, put } from "../../../../../api/funcRequest";
import 'jspdf-autotable';
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { ActionListaBalanco } from "./actionListaBalanco";


export const ActionColetorBalancoModal = ({ 
  show, 
  handleClose, 
  dadosColetorBalanco, 
  dados,
  optionsModulos, 
  usuarioLogado,
  handleClickResumoBalanco 
}) => {
  const [modalResumo, setModalResumo] = useState(true)
  const [tabelaDetalhe, setTabelaDetalhe] = useState(false);

  const handleCloseWrapper = () => {
    setModalResumo(true);
    setTabelaDetalhe(false);
    if (handleClose) {
      handleClose();
    }
  };

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
          title={"Resumo do Balanço"}
          subTitle={"Relação dos Coletores"}
          handleClose={() => { handleClose(), setTabelaDetalhe(false); setModalResumo(true) }}
        />
        <Modal.Body>
          
          <ActionListaBalanco
            dadosColetorBalanco={dadosColetorBalanco} 
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            handleClickResumoBalanco={handleClickResumoBalanco}
          />
           
        </Modal.Body>
        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleCloseWrapper}
          corFechar={"secondary"}
        />
      </Modal>
    </Fragment>
  )
}