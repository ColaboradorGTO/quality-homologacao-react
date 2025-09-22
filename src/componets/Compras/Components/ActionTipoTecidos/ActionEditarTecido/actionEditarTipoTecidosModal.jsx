import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { get, post, put } from "../../../../../api/funcRequest"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import Swal from 'sweetalert2'
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FormularioEditarTecido } from "./formularioEditarTecido";

export const ActionEditarTipoTecidosModal = ({ show, handleClose, dadosDetalheTipoTecido }) => {

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
          title={"Tipo de Tecidos"}
          subTitle={"Alteração"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioEditarTecido dadosDetalheTipoTecido={dadosDetalheTipoTecido}/>
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}