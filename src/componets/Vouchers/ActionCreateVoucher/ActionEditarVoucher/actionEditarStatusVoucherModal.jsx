import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import Select from 'react-select';
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { useEditarStatusVoucher } from "../hooks/useEditarStatusVoucher";
import { ActionListaVendaOrigem } from "./actionListaVendaOrigem";
import { ActionListaVendaDestino } from "./actionListaVendaDestino";
import { ocultaParteDosDadosVoucher } from "../../../../utils/ocultarParte";


export const ActionEditarStatusVoucherModal = ({ show, handleClose, dadosEditarVoucher, usuarioLogado, optionsModulos,refetchListaVouchers }) => {
  const {
    onSubmit,
    handleChangeTroca,
    handleChangeStatus,
    optionsTroca,
    optionsStatus,
    customStyles,
    trocaSelecionado,
    statusSelecionado,
    motivoTroca,
    setMotivoTroca
  } = useEditarStatusVoucher({ dadosEditarVoucher,  optionsModulos, usuarioLogado, handleClose, refetchListaVouchers })


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
            title={"Detalhes do Voucher"}
            subTitle={"Detalhes e Atualização de Status"}
            handleClose={handleClose}
          />

          <Modal.Body>
            <form onSubmit={onSubmit}>

              <div>
                <div>
                  <p>Cliente: {dadosEditarVoucher[0]?.voucher.DSNOMERAZAOSOCIAL} </p>
                </div>
                <div>
                  <p>CPF/CNPJ: {dadosEditarVoucher[0]?.voucher.NUCPFCNPJ} </p>
                </div>
                <div>
                  <p>Voucher: {ocultaParteDosDadosVoucher(dadosEditarVoucher[0]?.voucher.NUVOUCHER)} </p>
                  <p>Valor Voucher: {formatMoeda(dadosEditarVoucher[0]?.voucher.VRVOUCHER)} </p>
                  <p>Venda Origem: {dadosEditarVoucher[0]?.voucher.IDRESUMOVENDAWEB ? dadosEditarVoucher[0]?.voucher.IDRESUMOVENDAWEB : 'Não Disponível'} </p>
                  <p>Motivo Troca: {dadosEditarVoucher[0]?.voucher.STCANCELADO == 'True' ? 'Motivo do Cancelamento/Negação' : dadosEditarVoucher[0]?.voucher.DSMOTIVOCANCELAMENTO ? '' : dadosEditarVoucher[0]?.voucher.MOTIVOTROCA ? '' : ''} </p>

                </div>
                <div className="row">
                  <div className="col-sm-6 mb-4">
                    <label>
                      Tipo Troca
                    </label>

                    <Select
                      value={optionsTroca.find(option => option.value === trocaSelecionado)}
                      options={optionsTroca}
                      onChange={handleChangeTroca}
                      isDisabled={trocaSelecionado == 'FINALIZADO' && usuarioLogado?.DSFUNCAO !== 'TI' ? 'disabled' : ''}
                      styles={customStyles}
                    />
                  </div>

                </div>
                <div className="row">

                  <div className="col-sm-6 mb-4">
                    <label>
                      Status do Voucher:
                    </label>
                    <Select
                      value={optionsStatus.find(option => option.value === statusSelecionado)}
                      options={optionsStatus}
                      onChange={handleChangeStatus}
                      styles={customStyles}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12 mb-4">
                    {statusSelecionado && (

                      <InputFieldModal
                        type="text"
                        label={"Motivo Troca"}
                        value={motivoTroca}
                        onChangeModal={(e) => setMotivoTroca(e.target.value)}
                        placeholder={"MOTIVO DA TROCA DE STATUS"}
                      />
                    )}
                  </div>
                </div>
              </div>
            </form>


            <div style={{marginTop: '2rem'}}>
              
              <ActionListaVendaOrigem
                dadosEditarVoucher={dadosEditarVoucher}
                usuarioLogado={usuarioLogado}
              />

              <ActionListaVendaDestino
                dadosEditarVoucher={dadosEditarVoucher}
                usuarioLogado={usuarioLogado}
              />
            </div>
          </Modal.Body>

          <FooterModal
            ButtonTypeConfirmar={ButtonTypeModal}
            textButtonConfirmar={"Confirmar"}
            onClickButtonConfirmar={onSubmit}
            corConfirmar="success"

            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Fechar"}
            corFechar="secondary"
          />

        </div>
      </Modal>
    </Fragment>
  )
}