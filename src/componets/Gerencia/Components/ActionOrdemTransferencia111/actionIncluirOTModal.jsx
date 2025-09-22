import { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FaCheck, FaExclamation, FaMinus, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Select from 'react-select';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";

export const ActionIncluirOTModal = ({ show, handleClose, dadosDetalheOT,usuarioLogado }) => {
  

  const dados = dadosDetalheOT.map((item, index) => {
    let contador = index + 1;

    return {
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VLRUNITCUSTO: item.VLRUNITCUSTO,
      VLRUNITVENDA: item.VLRUNITVENDA,
      QTDRECEPCAO: item.QTDRECEPCAO,

      IDRESUMOOT: item.IDRESUMOOT,
      DATAEXPEDICAOFORMATADA: item.DATAEXPEDICAOFORMATADA,
      EMPRESAORIGEM: item.EMPRESAORIGEM,
      EMPRESADESTINO: item.EMPRESADESTINO,
      NUMERONOTASEFAZ: item.NUMERONOTASEFAZ,
      QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
      IDSTATUSOT: parseInt(item.IDSTATUSOT),
      DESCRICAOOT: item.DESCRICAOOT,
      

      IDSAPORIGEM: item.IDSAPORIGEM,
      IDSAPDESTINO: item.IDSAPDESTINO,
      ERRORLOGSAP: item.ERRORLOGSAP,

      contador
    }
  });

  const colunasConferencia = [
    {
      field: 'IDPRODUTO',
      header: 'Produto',
      body: row => <th>{row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'VLRUNITCUSTO',
      header: 'R$ Custo',
      body: row => <th>{row.VLRUNITCUSTO}</th>,
      sortable: true,
    },
    {
      field: 'VLRUNITVENDA',
      header: 'R$ Venda',
      body: row => <th>{row.VLRUNITVENDA}</th>,
      sortable: true,
    },
    {
      field: 'QTDRECEPCAO',
      header: 'QTD',
      body: row => <th>{row.QTDRECEPCAO}</th>,
      sortable: true,
    },
    {
      field: 'IDSTATUSOT',
      header: 'Opções',
      body: (row) => {

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "150px",
              
            }}
          >
            <ButtonTable
              titleButton={"Diminuir Quantidade"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={FaMinus}
              iconSize={16}
              iconColor={"#fff"}
              cor={"warning"}
              disabledBTN={[1, 2].indexOf(row.IDSTATUSOT) >= 0}
            />
            <ButtonTable
              titleButton={"Excluir Produto"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={FaRegTrashAlt}
              iconSize={16}
              iconColor={"#fff"}
              cor={"danger"}
              disabledBTN={row.IDSTATUSOT === 1}
            />            
          </div>
        );
      }
    }
  ]

  return (
    <Fragment>
      <Modal
          show={show}
          onHide={handleClose}
          size="xl"

        >
          <div className="modal-content">

            <HeaderModal
              title="Ordem de Transferência"
              subtitle="Nome da Loja"
              handleClose={handleClose}
            />
            <div className="modal-body" id="resultadoot">

              <div className="form-group" >
                <div className="row" >
                  <div className="col-sm-6 col-xl-6">
                    <InputFieldModal
                      label={"Loja Origem"}
                      type="text"
                      value={dados[0]?.EMPRESAORIGEM}
                      readOnly={true}
                    />
                  </div>
                  <div className="col-sm-6 col-xl-6" >
                  <InputFieldModal
                      label={"Loja Destino"}
                      type="text"
                      value={dados[0]?.EMPRESADESTINO}
                      readOnly={true}
                    />
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-sm-3 col-xl-3">
                    <InputFieldModal
                      label={"ID"}
                      type="text"
                      value={dados[0]?.IDRESUMOOT}
                      // id="IDContaBanco"
                      readOnly={false}
                    />
                  </div>
                  <div className="col-sm-3 col-xl-3">
                    <InputFieldModal
                      label={"NF-e"}
                      type="text"
                      value={dados[0]?.NUMERONFE}
                      // id="IDContaBanco"
                      readOnly={false}
                    />
                  </div>
                  <div className="col-sm-3 col-xl-3">
                    <InputFieldModal
                      label={"Status"}
                      type="text"
                      value={dados[0]?.DESCRICAOOT}
                      // id="IDContaBanco"
                      readOnly={false}
                    />
                  </div>
                  <div className="col-sm-3 col-xl-3">
                    <InputFieldModal
                      label={"Data"}
                      type="text"
                      value={dados[0]?.DATAEXPEDICAOFORMATADA}
                      // id="IDContaBanco"
                      readOnly={false}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6 col-xl-4">
                    <InputFieldModal
                      label={"Produto"}
                      type="text"
                      // id="IDContaBanco"
                      readOnly={false}
                    />
                  </div>
                </div>
                
                <div className="row mt-5">
                  <div className="col-sm-8 col-xl-8">

                    <ButtonTypeModal
                      Icon={FaRegSave}
                      textButton={"Salvar"}
                      cor={"info"}
                      className={"mr-4"}
                    // onClickButtonType={salvarot}

                    />
                  </div>
                  <div className="col-sm-8 col-xl-8 mt-4">
                    <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
                  </div>
                </div>
              </div>

              <DataTable

                title="Vendas por Loja"
                value={dados}
                size="small"
                sortField="VRTOTALPAGO"
                sortOrder={-1}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 30, 50, 100]}

                showGridlines
                stripedRows
                emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
              >
                {colunasConferencia.map(coluna => (
                  <Column
                    key={coluna.field}
                    field={coluna.field}
                    header={coluna.header}
                    body={coluna.body}
                    footer={coluna.footer}
                    sortable={coluna.sortable}
                    headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                    footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                    bodyStyle={{ fontSize: '0.8rem' }}

                  />
                ))}
              </DataTable>
            </div>

            <FooterModal
              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar={""}
              textButtonCadastrar={"Cadastrar"}
              corCadastrar="success"

              ButtonTypeFechar={ButtonTypeModal}
              textButtonFechar={"Fechar"}
              onClickButtonFechar={handleClose}
              corFechar="secondary"
            />
          </div>
        </Modal>
    </Fragment>
  )
}