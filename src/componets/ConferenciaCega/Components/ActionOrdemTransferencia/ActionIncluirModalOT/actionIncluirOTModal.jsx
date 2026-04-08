import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FormularioIncuirOT } from "./formularioIncluirOT";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";

export const ActionIncluirOTModal = ({
  show,
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
}) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
      >
        <div className="modal-content">
          <HeaderModal
            title="Controle Ordem de Transferência"
            subtitle="Nome da Loja"
            handleClose={handleClose}
          />
          <Modal.Body >
            <FormularioIncuirOT
              handleClose={handleClose}
              refetchListaConferencia={refetchListaConferencia}
              optionsModulos={optionsModulos}
              usuarioLogado={usuarioLogado}
            />
          </Modal.Body>

          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar={"secondary"}
          />
        </div>
      </Modal>
    </Fragment>
  )
}
