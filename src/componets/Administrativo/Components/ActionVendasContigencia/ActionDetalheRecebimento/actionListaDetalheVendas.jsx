import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { toFloat } from "../../../../../utils/toFloat";
import HeaderTable from "../../../../Tables/headerTable";


export const ActionListaDetalheVendas = ({ dadosDetalheRecebimentos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [size, setSize] = useState('small')

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Relação de Produtos ',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['VR. Dinheiro', 'Vr. Cartão', 'Vr. POS', 'Vr. PIX', 'Vr. MP', 'Vr. Convênio', 'Vr. Voucher']],
      body: dadosVendas.map(item => [
        item.contador,
        item.CPROD,
        item.XPROD,
        item.CEAN,
        toFloat(item.QTD),
        formatMoeda(item.VUNCOM),
        formatMoeda(item.VRTOTALLIQUIDO)

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relacao_recebimentos_venda.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosVendas);
    const workbook = XLSX.utils.book_new();
    const header = ['VR. Dinheiro', 'Vr. Cartão', 'Vr. POS', 'Vr. PIX', 'Vr. MP', 'Vr. Convênio', 'Vr. Voucher'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'VR. Dinheiro' },
      { wpx: 250, caption: 'Vr. Cartão' },
      { wpx: 100, caption: 'Vr. POS' },
      { wpx: 100, caption: 'Vr. PIX' },
      { wpx: 100, caption: 'Vr. MP' },
      { wpx: 100, caption: 'Vr. Convênio' },
      { wpx: 100, caption: 'Vr. Voucher' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relação de Produtos');
    XLSX.writeFile(workbook, 'relacao_recibimentos_venda.xlsx');
  }

  const exportToPDFProduto = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Pagamento', 'Parcelas', 'NSU_CTF', 'Autorizador', 'Valor Recebido', 'Valor Liquido']],
      body: dados.map(item => [
        item.contador,
        item.DSTIPOPAGAMENTO,
        item.NOTEF,
        item.NOAUTORIZADOR,
        item.NUAUTORIZACAO,
        item.NPARCELAS,
        formatMoeda(item.VALORRECEBIDO),
        formatMoeda(item.VALORLIQUIDO)

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relacao_pagamento.pdf');
  };

  const exportToExcelProduto = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Pagamento', 'Parcelas', 'NSU_CTF', 'Autorizador', 'Valor Recebido', 'Valor Liquido'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Pagamento' },
      { wpx: 100, caption: 'Parcelas' },
      { wpx: 250, caption: 'NSU_CTF' },
      { wpx: 100, caption: 'Autorizador' },
      { wpx: 100, caption: 'Valor Recebido' },
      { wpx: 100, caption: 'Valor Liquido' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relação de Pagamentos');
    XLSX.writeFile(workbook, 'relacao_pagamentos.xlsx');
  }

  const dadosVendas = dadosDetalheRecebimentos?.map((item) => {

    return {
      IDVENDA: item.venda?.IDVENDA,
      IDEMPRESA: item.venda?.IDEMPRESA,
      IDCAIXAWEB: item.venda?.IDCAIXAWEB,
      IDOPERADOR: item.venda?.IDOPERADOR,
      VRDINHEIRO: item.venda?.VRDINHEIRO,
      VRRECCARTAO: item.venda?.VRRECCARTAO,
      VRRECPOSVENDA: item.venda?.VRRECPOSVENDA,
      VRRECPOS: item.venda?.VRRECPOS,
      VRRECPIX: item.venda?.VRRECPIX,
      VRRECMOOVPAY: item.venda?.VRRECMOOVPAY,
      VRRECCONVENIO: item.venda?.VRRECCONVENIO,
      VRRECVOUCHER: item.venda?.VRRECVOUCHER,
      VRTOTALVENDA: item.venda?.VRTOTALVENDA,
      ULTNITEM: item.venda?.ULTNITEM,

    }
  });

  const dadosPagamentos = dadosDetalheRecebimentos?.flatMap((item) =>

    item.vendaPagamento.map((pagamento) => ({

      DSTIPOPAGAMENTO: pagamento.pag.DSTIPOPAGAMENTO,
      NPARCELAS: pagamento.pag.NPARCELAS,
      NUOPERACAO: pagamento.pag.NUOPERACAO,
      NSUAUTORIZADORA: pagamento.pag.NSUAUTORIZADORA,
      VALORRECEBIDO: pagamento.pag.VALORRECEBIDO
    }))
  );

  const colunasPagamento = [
    {
      field: 'VRDINHEIRO',
      header: 'VR. Dinheiro',
      body: row => <th style={{}}> {formatMoeda(row.VRDINHEIRO)} </th>,
      sortable: true,
    },
    {
      field: 'VRRECCARTAO',
      header: 'Vr. Cartão',
      body: row => <th style={{}}> {formatMoeda(row.VRRECCARTAO)}</th>,
      sortable: true,
    },
    {
      field: 'VRRECPOS',
      header: 'Vr. POS',
      body: row => <th style={{}}> {formatMoeda(row.VRRECPOS)}</th>,
      sortable: true,
    },
    {
      field: 'VRRECPIX',
      header: 'Vr. PIX',
      body: row => <th style={{}}> {formatMoeda(row.VRRECPIX)}</th>,
      sortable: true,
    },
    {
      field: 'VRRECMOOVPAY',
      header: 'Vr. MP',
      body: row => <th style={{}}> {formatMoeda(row.VRRECMOOVPAY)}</th>,
      sortable: true,
    },
    {
      field: 'VRRECCONVENIO',
      header: 'Vr. Convênio',
      body: row => <th style={{}}> {formatMoeda(row.VRRECCONVENIO)}</th>,
      sortable: true,
    },
    {
      field: 'VRRECVOUCHER',
      header: 'Vr. Voucher',
      body: row => <th style={{}}> {formatMoeda(row.VRRECVOUCHER)}</th>,
      sortable: true,
    },

  ]
  const colunasPagPos = [
    {
      field: 'DSTIPOPAGAMENTO',
      header: 'Pagamento',
      body: row => <th style={{}}> {row.DSTIPOPAGAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'NPARCELAS',
      header: 'Parcelas',
      body: row => <th style={{}}> {toFloat(row.NPARCELAS)}</th>,
      sortable: true,
    },
    {
      field: 'NUOPERACAO',
      header: 'NSU_CTF',
      body: row => <th style={{}}> {toFloat(row.NUOPERACAO)}</th>,
      sortable: true,
    },
    {
      field: 'NSUAUTORIZADORA',
      header: 'Autorização',
      body: row => <th style={{}}> {toFloat(row.NSUAUTORIZADORA)}</th>,
      sortable: true,
    },
    {
      field: 'VALORRECEBIDO',
      header: 'Vr. Recebido',
      body: row => <th style={{}}> {formatMoeda(row.VALORRECEBIDO)}</th>,
      sortable: true,
    }
  ]


  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>{`Lista de Produtos da Venda Nº  ${dadosPagamentos[0]?.IDVENDA} `}</h2>

        </div>
        <div style={{ marginBottom: "1rem" }}>
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
            value={dadosVendas}
            size={size}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            // rowsPerPageOptions={[5, 10, 20, 50]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasPagamento.map(coluna => (
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
      <div className="panel">
        <div className="panel-hdr">
          <h2>{`Lista de Pagamentos da Venda `}</h2>
        </div>
        <div>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcelProduto}
            exportToPDF={exportToPDFProduto}
          />
        </div>
        <div className="mt-4" ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dadosPagamentos}
            size={size}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            // rowsPerPageOptions={[5, 10, 20, 50]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasPagPos.map(coluna => (
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
    </Fragment>
  )
}