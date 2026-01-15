import { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { post, put } from "../../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import Swal from "sweetalert2";
import axios from "axios";

import { FormularioAjusteMovimentoCaixa } from "./formularioAjusteMovimentoCaixa";

export const ActionAjusteMovimentoCaixaModal = ({ show, handleClose, dadosDetalheFechamento, usuarioLogado, optionsModulos }) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        id="CadadiantamentoSalario"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <HeaderModal
          title={"Movimento de Caixa da Loja"}
          subTitle={"Ajustar Movimento de Caixa da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <FormularioAjusteMovimentoCaixa
            dadosDetalheFechamento={dadosDetalheFechamento}
            usuarioLogado={usuarioLogado}
            handleClose={handleClose}
            optionsModulos={optionsModulos}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}