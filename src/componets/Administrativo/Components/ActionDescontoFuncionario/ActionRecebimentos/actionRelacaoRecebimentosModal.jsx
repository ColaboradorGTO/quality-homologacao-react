import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { ActionListaProdutos } from "./actionListaProdutos";
import { ActionListaPagamentos } from "./actionListaPagamentos";
import { FormularioAlteracaoPagamento } from "./formularioAlteracaoPagamento";

export const ActionRelacaoRecebimentosModal = ({ dadosPagamentoModal, dadosDetalheRecebimentos, show, handleClose }) => {

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

        <div className="" role="document">

          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Recebimentos da Venda"}
            handleClose={handleClose}
          />

          <Modal.Body>

            <ActionListaPagamentos  dadosPagamentoModal={dadosPagamentoModal} />
            <ActionListaProdutos dadosPagamentoModal={dadosPagamentoModal} />

            <FormularioAlteracaoPagamento dadosDetalheRecebimentos={dadosDetalheRecebimentos} handleClose={handleClose}/>
          </Modal.Body>

          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Fechar"}
            corFechar={"secondary"}

            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar={''}
            textButtonCadastrar={"Finalizar Alteração de Pagamentos"}
            corCadastrar={"success"}
          />
        </div>
      </Modal>
    </Fragment>
  )
}