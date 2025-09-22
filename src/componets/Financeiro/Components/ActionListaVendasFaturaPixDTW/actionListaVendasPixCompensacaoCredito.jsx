import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { formatarDataDTW, formatMesAnoDTW } from "../../../../utils/dataFormatada";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export const ActionListaVendasPIXCompensacaoCredito = ({ dadosVendasPixCompensacao }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'PIX compensação capa',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'LineNum', 'Line_ID', 'Conta Crédito', 'Conta Débito', 'Data Compensação', 'Loja', 'Data Compensação', 'Tipo', 'Autorização', 'Data Compensação', 'ID']],
      body: dadosListaVendasPix.map(item => [
        item.contador,
        item.lineNum,
        item.line_ID,
        item.contaCreditoSap,
        item.contaDebitoSap,
        item.DATA_COMPENSACAO,
        item.NOFANTASIA,
        item.DATA_COMPENSACAO,
        item.DSTIPOPAGAMENTO,
        item.NUAUTORIZACAO,
        item.DATA_COMPENSACAO,
        item.IDEMPRESA,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_pix_compensacao_credito.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas PIX Compensação');
    const header = ['JdtNum', 'LineNum', 'Line_id', 'Account', 'Debit', 'Credit', 'DueDate', 'LineMemo', 'RefDate', 'Ref1', 'Ref2', 'TaxDate', 'BPLId'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'JdtNum' },
      { wpx: 50, caption: 'LineNum' },
      { wpx: 50, caption: 'Line_ID' },
      { wpx: 100, caption: 'Account' },
      { wpx: 50, caption: 'Debit' },
      { wpx: 50, caption: 'Credit' },
      { wpx: 100, caption: 'DueDate' },
      { wpx: 200, caption: 'LineMemo' },
      { wpx: 100, caption: 'RefDate' },
      { wpx: 150, caption: 'Ref1' },
      { wpx: 250, caption: 'Ref2' },
      { wpx: 100, caption: 'TaxDate' },
      { wpx: 50, caption: 'BPLId' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.writeFile(workbook, 'vendas_pix_compensacao_credito.xlsx');
  };



  const dadosExcel = Array.isArray(dadosVendasPixCompensacao) ? dadosVendasPixCompensacao.map((item, index) => {
    let contador = index + 1;
    let lineNum = '';
    let line_ID = '1';
    let contaDebitoSap = '';
    let contaCreditoSap = '1.01.01.01.9998'
    return {
      contador,
      lineNum,
      line_ID,
      contaCreditoSap: contaCreditoSap,
      contaDebitoSap: contaDebitoSap,
      PIX: item.PIX,
      DATA_COMPENSACAO: formatarDataDTW(item.DATA_COMPENSACAO),
      NOFANTASIA: item.NOFANTASIA,
      DATA_COMP: formatarDataDTW(item.DATA_COMPENSACAO),
      DSTIPOPAGAMENTO: `Vendas ${item.DSTIPOPAGAMENTO} ${formatMesAnoDTW(item.DATA_COMPENSACAO)} `,
      NUAUTORIZACAO: item.NUAUTORIZACAO,
      DATA_COM: formatarDataDTW(item.DATA_COMPENSACAO),
      IDEMPRESA: item.NOFANTASIA.substring(1, 5),
    }
  }) : [];

  const dadosListaVendasPix = Array.isArray(dadosVendasPixCompensacao) ? dadosVendasPixCompensacao.map((item, index) => {
    let contador = index + 1;
    let lineNum = '';
    let line_ID = '1';
    let contaDebitoSap = '';
    let contaCreditoSap = '1.01.01.01.9998';
    return {
      contador,
      lineNum,
      line_ID,
      contaCreditoSap: contaCreditoSap,
      contaDebitoSap: contaDebitoSap,
      PIX: item.PIX,
      DATA_COMPENSACAO: item.DATA_COMPENSACAO,
      NOFANTASIA: item.NOFANTASIA,
      DATA_COMPENSACAO: item.DATA_COMPENSACAO,
      DSTIPOPAGAMENTO: `Vendas ${item.DSTIPOPAGAMENTO} ${formatMesAnoDTW(item.DATA_COMPENSACAO)} `,
      NUAUTORIZACAO: item.NUAUTORIZACAO,
      DATA_COMP: formatarDataDTW(item.DATA_COMPENSACAO),
      IDEMPRESA: item.NOFANTASIA.substring(1, 5),
    }
  }) : [];

  const colunasVendasPix = [
    {
      field: 'JdtNum',
      header: 'JdtNum',
      body: row => <th style={{ color: '#212529' }}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'lineNum',
      header: 'LineNum',
      body: row => <p style={{ color: '#212529' }}>{row.lineNum}</p>,
      sortable: true,
    },
    {
      field: 'line_ID',
      header: 'Line_ID',
      body: row => <th style={{ color: '#212529' }}>{row.line_ID}</th>,
      sortable: true,
    },
    {
      field: 'contaCreditoSap',
      header: 'account',
      body: row => <th style={{ color: '#212529', width: 100 }}>{row.contaCreditoSap}</th>,
      sortable: true,
    },
    {
      field: 'contaDebitoSap',
      header: 'Debit',
      body: row => <th style={{ color: '#212529' }}></th>,
      sortable: true,
    },
    {
      field: 'PIX',
      header: 'Credit',
      body: row => <th style={{ color: '#212529' }}>{row.PIX}</th>,
      sortable: true,
    },
    {
      field: 'DATA_COMPENSACAO',
      header: 'DueDate',
      body: row => <th style={{ color: '#212529' }}>{row.DATA_COMPENSACAO || 'NÃO INFORMADO'}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'LineMemo',
      body: row => <p style={{ color: '#212529', width: '150px', fontWeight: 600 }}> {row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'DATA_COMPENSACAO',
      header: 'RefDate',
      body: row => <th style={{ color: '#212529' }}>{row.DATA_COMPENSACAO || 'NÃO INFORMADO'}</th>,
      sortable: true,
    },
    {
      field: 'DSTIPOPAGAMENTO',
      header: 'Ref1',
      body: row => <th style={{ color: '#212529' }}>{row.DSTIPOPAGAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'NUAUTORIZACAO',
      header: 'Ref2',
      body: row => <th style={{ color: '#212529' }}>{row.NUAUTORIZACAO}</th>,
      sortable: true,
    },
    {
      field: 'DATA_COMPENSACAO',
      header: 'TaxDate',
      body: row => <th style={{ color: '#212529' }}>{row.DATA_COMPENSACAO || 'NÃO INFORMADO'}</th>,
      sortable: true,
    },
    {
      field: 'IDEMPRESA',
      header: 'BPLId',
      body: row => <th style={{ color: '#212529' }}>{row.IDEMPRESA}</th>,
      sortable: true,
    },

  ]

  return (

    <Fragment>
      <div className="row">
        <div className="col-xl-12">
          <div id="panel-1" className="panel">
            <div className="panel-hdr">
              <h2>
                Lista de Vendas PIX Por Período<span className="fw-300"><i>Crédito</i></span>
              </h2>

            </div>
            <div className="panel-container show">
              <div className="panel-content">
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
                    title="Vendas por PIX"
                    value={dadosListaVendasPix}
                    globalFilter={globalFilterValue}
                    size="small"
                    sortOrder={-1}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50, 100, dadosListaVendasPix.length]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                    filterDisplay="menu"
                    showGridlines
                    stripedRows
                    emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}

                  >

                    {colunasVendasPix.map(coluna => (
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
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  )
}