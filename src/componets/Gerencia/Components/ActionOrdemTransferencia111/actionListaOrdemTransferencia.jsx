import { Fragment, useRef, useState } from "react"
import { CiEdit } from "react-icons/ci";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { FaCheck, FaExclamation, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";
import { get } from "../../../../api/funcRequest";
import { ActionIncluirOTModal } from "./actionIncluirOTModal";

export const ActionListaOrdemTransferencia = ({ dadosConferencia, usuarioLogado, empresaSelecionadaOrigem }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [dadosDetalheOT, setDadosDetalheOT] = useState([])
  const [modalDetalheOT, setModalDetalheOT] = useState(false)
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Controle de Transferência',
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº OT', 'Data Criação', 'Loja Origem', 'Loja Destino', 'Número NF-e', 'Status'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº OT' },
      { wpx: 100, caption: 'Data Criação' },
      { wpx: 200, caption: 'Loja Origem' },
      { wpx: 200, caption: 'Loja Destino' },
      { wpx: 100, caption: 'Número NF-e' },
      { wpx: 100, caption: 'Status' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Controle de Transferência');
    XLSX.writeFile(workbook, 'controle_transferencia.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº OT', 'Data Criação', 'Loja Origem', 'Loja Destino', 'Número NF-e', 'Status']],
      body: dados.map(item => [item.IDRESUMOOT, item.DATAEXPEDICAOFORMATADA, item.EMPRESAORIGEM, item.EMPRESADESTINO, item.NUMERONOTASEFAZ, item.DESCRICAOOT]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('controle_transferencia.pdf');
  };

  const dados = dadosConferencia.map((item, index) => {
    let contador = index + 1;

    return {
      IDRESUMOOT: item.IDRESUMOOT,
      DATAEXPEDICAOFORMATADA: item.DATAEXPEDICAOFORMATADA,
      EMPRESAORIGEM: item.EMPRESAORIGEM,
      EMPRESADESTINO: item.EMPRESADESTINO,
      NUMERONOTASEFAZ: item.NUMERONOTASEFAZ,
      DESCRICAOOT: item.DESCRICAOOT,
      QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
      IDSTATUSOT: parseInt(item.IDSTATUSOT),


      IDSAPORIGEM: item.IDSAPORIGEM,
      IDSAPDESTINO: item.IDSAPDESTINO,
      ERRORLOGSAP: item.ERRORLOGSAP,

      contador
    }
  });

  const colunasConferencia = [
    {
      field: 'IDRESUMOOT',
      header: 'Nº OT',
      body: row => <th>{row.IDRESUMOOT}</th>,
      sortable: true,
    },
    {
      field: 'DATAEXPEDICAOFORMATADA',
      header: 'Data Criação',
      body: row => <th>{row.DATAEXPEDICAOFORMATADA}</th>,
      sortable: true,
    },
    {
      field: 'EMPRESAORIGEM',
      header: 'Loja Origem',
      body: row => <th>{row.EMPRESAORIGEM}</th>,
      sortable: true,
    },
    {
      field: 'EMPRESADESTINO',
      header: 'Loja Destino',
      body: row => <th>{row.EMPRESADESTINO}</th>,
      sortable: true,
    },
    {
      field: 'NUMERONOTASEFAZ',
      header: 'Número NF-e',
      body: row => <th>{row.NUMERONOTASEFAZ}</th>,
      sortable: true,
    },
    {
      field: 'DESCRICAOOT',
      header: 'Status',
      body: row => <th>{row.DESCRICAOOT}</th>,
      sortable: true,
    },
    {
      field: 'IDSTATUSOT',
      header: 'Opções',
      body: (row) => {
        if (usuarioLogado?.IDEMPRESA === empresaSelecionadaOrigem.IDEMPRESA) {
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
                titleButton={"Editar / Visualizar"}
                onClickButton={() => handleClickEditar(row)}
                Icon={CiEdit}
                iconSize={16}
                iconColor={"#fff"}
                cor={"primary"}
                disabledBTN={[1, 2].indexOf(row.IDSTATUSOT) >= 0}
              />
              <ButtonTable
                titleButton={"Cancelar"}
                onClickButton={() => handleClickEditar(row)}
                Icon={FaRegTrashAlt}
                iconSize={16}
                iconColor={"#fff"}
                cor={"danger"}
                disabledBTN={row.IDSTATUSOT === 1}
              />
              <ButtonTable
                titleButton={"Emitir / Visualizar NFe"}
                onClickButton={() => handleClickEditar(row)}
                Icon={FaCheck}
                iconSize={16}
                iconColor={"#fff"}
                cor={"info"}
                disabledBTN={row.IDSTATUSOT === 6}
              />

            </div>
          );

        } else {
          return (
            <Fragment>

              <ButtonTable
                titleButton={"Conferir OT"}
                onClickButton={() => handleClickEditar(row)}
                Icon={CiEdit}
                iconSize={16}
                iconColor={"#fff"}
                cor={"primary"}
                disabledBTN={[1, 2].indexOf(row.IDSTATUSOT) >= 0}
              />

              {[3, 5].indexOf(row.IDSTATUSOT) >= 0 && (
                <ButtonTable
                  titleButton={"Finalizar Recebimento OT"}
                  onClickButton={() => handleClickEditar(row)}
                  Icon={FaRegSave}
                  iconSize={16}
                  iconColor={"#fff"}
                  cor={"success"}
                  disabledBTN={[3, 5].indexOf(row.IDSTATUSOT) >= 0}
                />

              )}
            </Fragment>
          )

        }
      }
    }
  ]

  const handleClickEditar = async (row) => {
    if (row.IDRESUMOOT) {
      handleEditar(row.IDRESUMOOT)
    }

  }

  const handleEditar = async (IDRESUMOOT) => {
    try {
      const response = await get(`/detalhe-ordem-transferencia?idResumoOT=${IDRESUMOOT}`)
      if (response.data) {
        setDadosDetalheOT(response.data)
        setModalDetalheOT(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  return (
    <Fragment>

      <div className="panel" style={{ marginTop: "6rem" }}>
        <div className="panel-hdr">
          <h2>Lista Controle de Transferência </h2>
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />

        </div>
        <div className="card" ref={dataTableRef}>

          <DataTable

            title="Vendas por Loja"
            value={dados}
            ref={dataTableRef}
            globalFilter={globalFilterValue}
            size="small"
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
      </div>

      <ActionIncluirOTModal
        show={modalDetalheOT}
        handleClose={() => setModalDetalheOT(false)}
        usuarioLogado={usuarioLogado}
        dadosDetalheOT={dadosDetalheOT}
      />
    </Fragment>
  )
}