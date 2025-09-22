import { Fragment, useState } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { FormularioCadastrar } from "./formularioCadastrar"


export const ActionCadastroCategoriaPedidoModal = ({ show, handleClose }) => {

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
          title={"Categoria de Pedidos"}
          subTitle={"Inclusão de Categoria de Pedidos"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <FormularioCadastrar handleClose={handleClose}/>
        </Modal.Body>


      </Modal>

    </Fragment>
  )
}

