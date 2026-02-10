import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrFormView } from "react-icons/gr";
import { get } from "../../../../api/funcRequest";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { dataFormatada } from "../../../../utils/dataFormatada";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { retornaDiasEntreDatas } from "../../../../utils/retornoEntreDias";

export const ActionListaVendasAutorizarTroca = ({ 
  dadosVendasPrazoExcedido, 
  tabelaPrincipal,
  setTabelaPrincipal,
  tabelaSecundaria,
  setTabelaSecundaria,
  setBtnVisivel
 }) => {
  const [dadosVisualizarProdutos, setDadosVisualizarProdutos] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vouchers Emitidos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Nº Venda', 'Cliente', 'CPF/CNPJ', 'Loja', 'Valor Pago', 'Data', 'Situação']],
      body: dados.map(item => [
        item.NUVOUCHER,
        item.EMPORIGEM,
        item.DSCAIXAORIGEM,
        dataFormatada(item.DTINVOUCHER),
        formatMoeda(item.VRVOUCHER),
        item.EMPDESTINO,
        item.DSCAIXADESTINO,
        dataFormatada(item.DTOUTVOUCHER),
        item.STATIVO == 'True' ? 'ATIVO' : 'USADO'

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('voucher_emitidos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Nº Venda', 'Cliente', 'CPF/CNPJ', 'Loja', 'Valor Pago', 'Data', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº Voucher' },
      { wpx: 200, caption: 'Loja Emissor' },
      { wpx: 200, caption: 'Caixa Emissor' },
      { wpx: 200, caption: 'Data Emissão' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 200, caption: 'Loja Recebido' },
      { wpx: 200, caption: 'Caixa Recebido' },
      { wpx: 200, caption: 'Data Recebida' },
      { wpx: 100, caption: 'Situação' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Vendedor');
    XLSX.writeFile(workbook, 'voucher_emitidos.xlsx');
  };



  const dados = dadosVendasPrazoExcedido.map((item, index) => {
    let contador = index + 1;
    let diasAposCompra;
    let stCortesia;
    let stDefeito;
    let nomeCliente = item.venda.DEST_CPF ? item.venda.DSNOMERAZAOSOCIAL + " " + item.venda.DSAPELIDONOMEFANTASIA : item.venda.DSNOMERAZAOSOCIAL;
    let cpfCnpjCliente = !item.venda.DEST_CNPJ ? item.venda.DEST_CPF : item.venda.DEST_CNPJ;
    const DATAHORAVENDA = new Date(item.venda.DTHORAFECHAMENTO.slice(6,10), (item.venda.DTHORAFECHAMENTO.slice(3,5) > 1 ? item.venda.DTHORAFECHAMENTO.slice(3,5)-1 : item.venda.DTHORAFECHAMENTO.slice(3,5)), item.venda.DTHORAFECHAMENTO.slice(0,2));
    const DATAHORAATUAL = new Date();
    const DIFERENCAEMDIAS = Math.ceil(Math.abs((DATAHORAATUAL.setHours(0, 0, 0, 0)) - DATAHORAVENDA.getTime())/(1000*60*60*24));

    console.log(nomeCliente, 'nome cliente')
    return {
      contador,
      IDVENDA: item.venda.IDVENDA,
      DSNOMERAZAOSOCIAL: item.venda.DSNOMERAZAOSOCIAL,
      DSAPELIDONOMEFANTASIA: item.venda.DSAPELIDONOMEFANTASIA,
      DEST_CPF: item.venda.DEST_CPF,
      DEST_CNPJ: item.venda.DEST_CNPJ,
      NOFANTASIA: item.venda.NOFANTASIA,
      VRTOTALPAGO: item.venda.VRTOTALPAGO,
      DTHORAFECHAMENTO: item.venda.DTHORAFECHAMENTO,
      STCANCELADO: item.venda.STCANCELADO,
      DTHORAFECHAMENTO: item.venda.DTHORAFECHAMENTO,
      diasAposCompra: diasAposCompra = retornaDiasEntreDatas(item.venda.DTHORAFECHAMENTO),
      DIFERENCAEMDIAS:  DIFERENCAEMDIAS,
      stCortesia: stCortesia = DIFERENCAEMDIAS <= 32 ? 'Ativa' : 'Inativa',
      stDefeito: stDefeito = DIFERENCAEMDIAS <= 90 ? 'Ativa' : 'Inativa',
      nomeCliente,
      cpfCnpjCliente
    }
  });

  const colunasVouchers = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <p >{row.contador}</p>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => <th >{row.IDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'nomeCliente',
      header: 'Cliente',
      body: row => <th >{row.nomeCliente}</th>,
      sortable: true,
    },
    {
      field: 'cpfCnpjCliente',
      header: 'CPF/CNPJ',
      body: row => <th >{row.cpfCnpjCliente}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{width: '200px', fontWeight: 600}} >{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'VRTOTALPAGO',
      header: 'Vr. Pago',
      body: row => <th >{formatMoeda(row.VRTOTALPAGO)}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Dt. Venda',
      body: row => <th >{row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Status',
      body: row => <th style={{ color: row.STCANCELADO == 'False' ? '#2196F3' || row.STCANCELADO == 'True' : '#fd3995 ', fontWeight: 900 }} >{row.STCANCELADO == 'False' ? 'Ativa' : 'Cancelada'} </th>,
      sortable: true,
    },
    {
      field: 'stCortesia',
      header: 'St.Cortesia',
      body: row => <th style={{ color: row.stCortesia == 'Ativa' ? '#2196F3' || row.stCortesia == 'Inativa' : '#fd3995 ', fontWeight: 900 }} >{row.stCortesia} </th>,
      sortable: true,
    },
    {
      field: 'stDefeito',
      header: 'St.Defeito',
      body: row => <th style={{ color: row.stDefeito == 'Ativa' ? '#2196F3' || row.stDefeito == 'Inativa' : '#fd3995 ', fontWeight: 900 }} >{row.stDefeito} </th>,
      sortable: true,
    },

    {
      field: 'DIFERENCAEMDIAS',
      header: 'Dias Passados',
      body: row => <th style={{color: row.DIFERENCAEMDIAS <= 32 ? '#fd3995' : '#2196F3', fontWeight: 900}}>{row.DIFERENCAEMDIAS}</th>,
      sortable: true,
    },
    {
      header: 'Opções',
      body: (row) => (
        <div style={{ display: "flex", justifyContent: "space-around", width: '7rem' }}>
          <div>

            <ButtonTable
              titleButton={"Detalhar Produtos"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={GrFormView}
              iconSize={30}
              iconColor={"#fff"}
              cor={"success"}
              width="35px"
              height="35px"
            />
          </div>
        </div>
      ),
    }

  ]


  const handleClickDetalhar = async (row) => {
    if (row.IDVENDA) {
      handleDetalhar(row.IDVENDA)
    }
  }

  const handleDetalhar = async (IDVENDA) => {
    try {
      const response = await get(`/lista-venda-cliente?idVenda=${IDVENDA}`)
      if (response.data) {
        setDadosVisualizarProdutos(response.data)
        setTabelaPrincipal(false)
        setTabelaSecundaria(true)
        setBtnVisivel(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }
  

  const dadosProdutos = dadosVisualizarProdutos.flatMap((item) => {
    const { venda, detalhe } = item;

    return detalhe.map((detalheItem, index) => {
      const contadorIndex = index + 1;
      return {

        CPROD: detalheItem.det.CPROD,
        IDVENDADETALHE: detalheItem.det.IDVENDADETALHE,
        XPROD: detalheItem.det.XPROD,
        NUCODBARRAS: detalheItem.det.NUCODBARRAS,
        QTD: detalheItem.det.QTD,
        VRTOTALLIQUIDO: detalheItem.det.VRTOTALLIQUIDO,
        VUNTRIB: detalheItem.det.VUNTRIB,
        VPROD: detalheItem.det.VPROD,
        STTROCA: detalheItem.det.STTROCA,
        VENDEDOR_MATRICULA: detalheItem.det.VENDEDOR_MATRICULA,
        STCANCELADO: detalheItem.det.STCANCELADO,
        contadorIndex: contadorIndex,

      };
    });
  });

  const dadosProdutosVenda = dadosVisualizarProdutos.flatMap((item) => {
    let diferenciaDias;
    return {
      IDVENDA: item.venda.IDVENDA,
      DTHORAFECHAMENTO: item.venda.DTHORAFECHAMENTO,
      diferenciaDias: diferenciaDias = retornaDiasEntreDatas(item.venda.DTHORAFECHAMENTOFORMATEUA),
    };

  });



  const colunasVouchers2 = [
    {
      field: 'contadorIndex',
      header: 'Nº',
      body: row => <p >{row.contadorIndex}</p>,
      sortable: true,
    },
    {
      field: 'CPROD',
      header: 'Codigo Produto',
      body: row => <th >{row.CPROD}</th>,
      sortable: true,
    },
    {
      field: 'XPROD',
      header: 'Produto',
      body: row => <th >{row.XPROD}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Codigo Barras',
      body: row => <th >{row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'QTD',
      header: 'Quantidade',
      body: row => <th >{row.QTD}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Valor Pago',
      body: row => <th style={{}} >{row.VRTOTALLIQUIDO} </th>,
      sortable: true,
    },
    {
      field: 'STTROCA',
      header: 'Status',
      body: row => <th style={{ color: row.STTROCA == 'Trocado' ? '#fd3995' || row.STTROCA == 'Não Trocado' : '#1dc9b7', fontWeight: 900 }} >{row.STTROCA == 'True' ? 'Trocado' : 'Não Trocado'} </th>,
      sortable: true,
    },
  ]


  return (

    <Fragment>
      {tabelaPrincipal && (
        <>
          <div className="panel">
            <div className="panel-hdr">
              <h2>Vendas Voucher por Loja</h2>
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
                title="Vendas Voucher por Loja"
                value={dados}
                globalFilter={globalFilterValue}
                size="small"
                selectionMode="single"
                selection={rowSelection}
                onSelectionChange={(e) => setRowSelection(e.value)}
                sortOrder={-1}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                filterDisplay="menu"
                showGridlines
                stripedRows
                emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
              >
                {colunasVouchers.map(coluna => (
                  <Column
                    key={coluna.field}
                    field={coluna.field}
                    header={coluna.header}

                    body={coluna.body}
                    footer={coluna.footer}
                    sortable={coluna.sortable}
                    headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                    footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                    bodyStyle={{ fontSize: '1rem' }}

                  />
                ))}
              </DataTable>
            </div>
          </div>

        </>
      )}

      {tabelaSecundaria && (
        <Fragment>
          <div className="panel">
            <div className="panel-hdr">
              {dadosProdutosVenda[0]?.diferenciaDias <= 32 && (
                <h2>

                  Produtos - Vendas {dadosProdutosVenda[0].IDVENDA} &nbsp; - &nbsp;
                  <span style={{ color: '#fd3995' }}>
                    Dias Passados Após a Compra <b><u>{dadosProdutosVenda[0].diferenciaDias} DIAS</u></b>
                  </span>
                </h2>
              )}
          
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
              <div className="card">

                <DataTable
                  title="Vendas Voucher por Loja"
                  value={dadosProdutos}
                  globalFilter={globalFilterValue}
                  size="small"
                  selectionMode="single"
                  selection={rowSelection}
                  onSelectionChange={(e) => setRowSelection(e.value)}
                  sortOrder={-1}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, dadosProdutos.length]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                  filterDisplay="menu"
                  showGridlines
                  stripedRows
                  emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                >
                  {colunasVouchers2.map(coluna => (
                    <Column
                      key={coluna.field}
                      field={coluna.field}
                      header={coluna.header}

                      body={coluna.body}
                      footer={coluna.footer}
                      sortable={coluna.sortable}
                      headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                      footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                      bodyStyle={{ fontSize: '1rem' }}

                    />
                  ))}
                </DataTable>
              </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}