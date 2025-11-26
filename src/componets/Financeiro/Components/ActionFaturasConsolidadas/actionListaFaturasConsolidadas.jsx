import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { IoMdCheckmark } from "react-icons/io";
import { toFloat } from "../../../../utils/toFloat";
import { useConfirmarConsolidacaoFatura } from "./hooks/useConfirmarConsolidacaoFatura";


export const ActionListaFaturasConsolidadas = ({ 
  dadosDetalheFatura, 
  optionsModulos, 
  usuarioLogado, 
  handleClick, 
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const {
    confirmar
  } = useConfirmarConsolidacaoFatura({ optionsModulos, usuarioLogado, handleClick });
  
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Consolidação Faturas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'dt. Recebimento', 'Valor', 'Qtd. Faturas', 'Qtd. Conferida', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.DTPROCESSAMENTO,
        formatMoeda(item.VRTOTALRECEBIDO),
        item.QTDFATURAS,
        item.QTDFATURASCONFERIDAS,
        item.QTDFATURAS != item.QTDFATURASCONFERIDAS ? 'Há Faturas Pedentes de Conferência' : 'Aguardando Confirmação',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('consolidacao_faturas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'dt. Recebimento', 'Valor', 'Qtd. Faturas', 'Qtd. Conferida', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 150, caption: 'dt. Recebimento' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 100, caption: 'Qtd. Faturas' },
      { wpx: 120, caption: 'Qtd. Conferida' },
      { wpx: 200, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consolidação Faturas');
    XLSX.writeFile(workbook, 'consolidacao_faturas.xlsx');
  };

  const dados = dadosDetalheFatura.map((item, index) => {
    let contador = index + 1;
    
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DTPROCESSAMENTO: item.DTPROCESSAMENTO,
      VRTOTALRECEBIDO: toFloat(item.VRTOTALRECEBIDO),
      QTDFATURAS: item.QTDFATURAS,
      QTDFATURASCONFERIDAS: item.QTDFATURASCONFERIDAS,
      IDEMPRESA: item.IDEMPRESA,
    }
  });

  const calcularTotalValorRecebido = () => {
    let total = 0;
    for (let result of dados) {
      total += parseFloat(result.VRTOTALRECEBIDO);
    }
    return total;
  }

  const colunasListaFatura = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{}}>  {row.contador} </th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th style={{}}>  {row.NOFANTASIA} </th>,
      sortable: true,
    },
    {
      field: 'DTPROCESSAMENTO',
      header: 'Data Recebimento',
      body: row => <th style={{}}>  {row.DTPROCESSAMENTO}  </th>,
      footer: 'Total Lançamentos',
      sortable: true,
    },
    {
      field: 'VRTOTALRECEBIDO',
      header: 'Valor',
      body: row => <th style={{}}> {formatMoeda(row.VRTOTALRECEBIDO)} </th>,
      footer: formatMoeda(calcularTotalValorRecebido()),
      sortable: true,
    },
    {
      field: 'QTDFATURAS',
      header: 'Qtd. Faturas',
      body: row => <th style={{}}> {row.QTDFATURAS} </th>,
      sortable: true,
    },
    {
      field: 'QTDFATURASCONFERIDAS',
      header: 'Qtd. Conferida',
      body: row => <th style={{}}> {row.QTDFATURASCONFERIDAS} </th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => {
        if (row.QTDFATURAS != row.QTDFATURASCONFERIDAS) {
          return <th style={{ color: 'red' }}> Há Faturas Pedentes de Conferência </th>
        } else {
          return (
            <th style={{ color: 'blue' }}>Aguardando Confirmação </th>
          )
        }
      },
    },
    {
      field: 'IDEMPRESA',
      header: 'Opções',
      button: true,
      width: '100%',
      body: (row) => {
        if (row.QTDFATURAS != row.QTDFATURASCONFERIDAS) {
          return null
        } else {
          return (
            <div className="p-1 " style={{ justifyContent: "space-between", display: "flex", width: "100%" }}>
              <div className="p-1">
                <ButtonTable
                  titleButton="Confirmar Consolidação Fatura"
                  // textButton={"Confirmar"}
                  cor="success"
                  Icon={IoMdCheckmark}
                  onClickButton={() => confirmar(row)}
                  iconSize={20}
                  width="30px"
                  height="30px"
                />
              </div>
            </div>
          );
        }
      },
    },
  ]

  return (

    <Fragment>
      <div className="panel">

        <div className="panel-hdr">
          <h2>Lista de Previas de Consolidação de Faturas </h2>
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
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, 200, 300, 500, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasListaFatura.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem', }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}