import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { formatarDataDTW, formatMesAnoDTW} from "../../../../utils/dataFormatada";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export const ActionListaVendasPIXCompensacaoCapa = ({ dadosVendasPixCompensacao }) => {
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
      head: [['Nº', 'Data Compensação', 'Loja', 'Tipo', 'Autorização', 'Data Compensação', 'Data Compensação']],
      body: dadosListaVendasPix.map(item => [
        item.contador,
        item.DATA_COMPENSACAO,
        item.NOFANTASIA,
        item.DSTIPOPAGAMENTO,
        item.NUAUTORIZACAO,
        item.DATA_COMPENSACAO,
        item.DATA_COMPENSACAO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_pix_compensacao_capa.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas PIX Compensação');
    const header = ['JDT_NUM', 'RefDate', 'Memo', 'Ref1', 'Ref2', 'TaxDate', 'DueDate'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'JDT_NUM' },
      { wpx: 100, caption: 'RefDate' },
      { wpx: 200, caption: 'Memo' },
      { wpx: 130, caption: 'Ref1' },
      { wpx: 250, caption: 'Ref2' },
      { wpx: 100, caption: 'TaxDate' },
      { wpx: 100, caption: 'DueDate' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.writeFile(workbook, 'vendas_pix_compensacao_capa.xlsx');
  };



  const dadosExcel = Array.isArray(dadosVendasPixCompensacao) ? dadosVendasPixCompensacao.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      DATA_COMPENSACAO: item.DATA_COMPENSACAO,
      NOFANTASIA: item.NOFANTASIA,
      DSTIPOPAGAMENTO: `Vendas ${item.DSTIPOPAGAMENTO} ${item.DATA_COMPENSACAO} `,
      NUAUTORIZACAO: item.NUAUTORIZACAO,
      DATA_COMP: item.DATA_COMPENSACAO,
      DATA_COM: item.DATA_COMPENSACAO,

    }
  }) : [];

  const dadosListaVendasPix = Array.isArray(dadosVendasPixCompensacao) ? dadosVendasPixCompensacao.map((item, index) => {
    let contador = index + 1;
    var contaDebitoSap = '1.01.01.02.0003';
    var contaCreditoSap = '1.01.01.01.9998';
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      IDVENDA: item.IDVENDA,
      DSTIPOPAGAMENTO: `Vendas ${item.DSTIPOPAGAMENTO} ${item.DATA_COMPENSACAO} `,
      PIX: item.PIX,
      DATAVENDA: item.DATAVENDA,
      DATA_COMPENSACAO: item.DATA_COMPENSACAO,
      NUAUTORIZACAO: item.NUAUTORIZACAO,
      contaCreditoSap: contaCreditoSap,
      contaDebitoSap: contaDebitoSap
    }
  }) : [];

  const colunasVendasPix = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: '#212529' }}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DATA_COMPENSACAO',
      header: 'Data Compensação',
      body: row => <p style={{ color: '#212529', width: 100, fontWeight: 600 }}>{row.DATA_COMPENSACAO}</p>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{ color: '#212529', width: '200px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'DSTIPOPAGAMENTO',
      header: 'Tipo',
      body: row => <p style={{ color: '#212529', width: '150px', fontWeight: 600 }}> {row.DSTIPOPAGAMENTO}</p>,
      sortable: true,
    },
    {
      field: 'NUAUTORIZACAO',
      header: 'Autorização',
      body: row => <th style={{ color: '#212529' }}>{row.NUAUTORIZACAO}</th>,
      sortable: true,
    },
    {
      field: 'DATA_COMPENSACAO',
      header: 'Data Compensação',
      body: row => <p style={{ color: '#212529', width: 100, fontWeight: 600 }}>{row.DATA_COMPENSACAO || 'NÃO INFORMADO'}</p>,
      sortable: true,
    },
    {
      field: 'DATA_COMPENSACAO',
      header: 'Data Compensação',
      body: row => <p style={{ color: '#212529', width: 100, fontWeight: 600 }}>{row.DATA_COMPENSACAO || 'NÃO INFORMADO'}</p>,
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
                Lista de Vendas PIX Por Período<span className="fw-300"><i>CAPA</i></span>
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
                    sortField="VRTOTALPAGO"
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