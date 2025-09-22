import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { dataFormatada, formatarDataDTW } from "../../../../utils/dataFormatada";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import axios from 'axios';
import Swal from "sweetalert2";
import { post, put } from "../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";


export const ActionListaVendasPIXCompensacao = ({ dadosVendasPixCompensacao }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [selecionarVendas, setSelecionarVendas] = useState([]);
  const [selectedVendas, setSelectedVendas] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
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
    documentTitle: 'Lista de Vendas Por PIX',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Loja', 'Loja', 'Venda', 'Tipo', 'Valor PIX', 'Data Venda', 'Autorização', 'Data Compensação', 'Conta Crédito', 'Conta Débito']],
      body: dadosListaVendasPix.map(item => [
        item.NOFANTASIA.substring(1, 5),
        item.NOFANTASIA,
        item.IDVENDA,
        item.DSTIPOPAGAMENTO,
        formatMoeda(item.PIX),
        item.DATAVENDA,
        item.NUAUTORIZACAO,
        item.DATA_COMPENSACAO,
        item.contaCreditoSap,
        item.contaDebitoSap
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_pix.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas PIX Compensação');
    const header = ['ID Loja', 'Loja', 'Venda', 'Tipo', 'Valor PIX', 'Data Venda', 'Autorização', 'Data Compensação', 'Conta Crédito', 'Conta Débito'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'ID Loja' },
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'Venda' },
      { wpx: 80, caption: 'Tipo' },
      { wpx: 100, caption: 'Valor PIX' },
      { wpx: 100, caption: 'Data Venda' },
      { wpx: 250, caption: 'Autorização' },
      { wpx: 100, caption: 'Data Compensação' },
      { wpx: 100, caption: 'Conta Crédito' },
      { wpx: 100, caption: 'Conta Débito' }

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.writeFile(workbook, 'vendas_pix_compensacao.xlsx');
  };

  const calcularTotalValorPix = () => {
    let total = 0;
    for (let dados of dadosVendasPixCompensacao) {
      total += parseFloat(dados.PIX);
    }
    return total;
  }

  const dadosExcel = Array.isArray(dadosVendasPixCompensacao) ? dadosVendasPixCompensacao.map((item, index) => {

    var contaDebitoSap = '1.01.01.02.0003';
    var contaCreditoSap = '1.01.01.01.9998';
    return {
      IDEMPRESA: item.NOFANTASIA.substring(1, 5),
      NOFANTASIA: item.NOFANTASIA,
      IDVENDA: item.IDVENDA,
      DSTIPOPAGAMENTO: item.DSTIPOPAGAMENTO,
      PIX: item.PIX,
      DATAVENDA: formatarDataDTW(item.DATAVENDA),
      NUAUTORIZACAO: item.NUAUTORIZACAO,
      DATA_COMPENSACAO: formatarDataDTW(item.DATA_COMPENSACAO),
      contaCreditoSap: contaCreditoSap,
      contaDebitoSap: contaDebitoSap
    }
  }) : [];

  const dadosListaVendasPix = Array.isArray(dadosVendasPixCompensacao) ? dadosVendasPixCompensacao.map((item, index) => {
    let contador = index + 1;
    var contaDebitoSap = '1.01.01.02.0003';
    var contaCreditoSap = '1.01.01.01.9998';
    return {
      Numero: contador,
      NOFANTASIA: item.NOFANTASIA,
      IDVENDA: item.IDVENDA,
      DSTIPOPAGAMENTO: item.DSTIPOPAGAMENTO,
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
      field: 'NOFANTASIA',
      header: 'ID Loja',
      body: row => <th style={{ color: '#212529' }}>{row.NOFANTASIA.substring(1, 5)}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{ color: '#212529', width: '200px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Venda',
      body: row => <th style={{ color: '#212529', width: 100 }}>{row.IDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'DSTIPOPAGAMENTO',
      header: 'Tipo',
      body: row => <th style={{ color: '#212529' }}>{row.DSTIPOPAGAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'PIX',
      header: 'Valor PIX',
      body: row => <th style={{ color: '#212529', width: 100 }}>{formatMoeda(row.PIX)}</th>,
      sortable: true,
    },
    {
      field: 'DATAVENDA',
      header: 'Data Venda',
      body: row => <th style={{ color: '#212529', width: 100 }}>{row.DATAVENDA}</th>,
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
      body: row => <th style={{ color: '#212529', width: 100 }}>{row.DATA_COMPENSACAO || 'NÃO INFORMADO'}</th>,
      sortable: true,
    },
    {
      field: 'contaCreditoSap',
      header: 'Conta Crédito',
      body: row => <th style={{ color: '#212529' }}>{row.contaCreditoSap}</th>,
      sortable: true,
    },
    {
      field: 'contaDebitoSap',
      header: 'Conta Débito',
      body: row => <th style={{ color: '#212529' }}>{row.contaDebitoSap}</th>,
      sortable: true,
    }
  ]

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Vendas " colSpan={4} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={formatMoeda(calcularTotalValorPix())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
      </Row>
    </ColumnGroup>
  )

  useEffect(() => {
    if (selectedIds.length > 0) {
      handleDetalhar(selectedIds, 'True');
    }
  }, [selectedIds]);


  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);

    const updatedSelectedIds = isChecked ? dadosListaVendasPix.map(item => item.IDVENDA) : [];
    setSelectedIds(updatedSelectedIds);

    if (updatedSelectedIds.length > 0) {
      handleDetalhar(updatedSelectedIds, 'True');
    }
  };




  const handleDetalhar = async (IDVENDA) => {
    try {
      if (typeof IDVENDA === 'string') {
        IDVENDA = [IDVENDA];
      }

      Swal.fire({
        title: 'Informe a Data de Compensação',
        html: '<input type="date" id="dtcompensacao" name="DTCompensacao" class="form-control" value="" >',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const dtCompensacao = document.getElementById('dtcompensacao').value;

          const dados = IDVENDA.map(id => ({
            "IDVENDA": id,
            "STCONFERIDO": 'True',
            "DATA_COMPENSACAO": dtCompensacao
          }));

          await put("/venda-pix-status-conferido", dados);
          console.log('Dados: ', dados);

          const textdados = JSON.stringify(dados);
          const textoFuncao = 'FINANCEIRO/CONFIRMADA CONFERENCIA DA VENDA';
          const dadosConfirmaDep = [{
            "IDFUNCIONARIO": usuarioLogado.IDFUNCIONARIO,
            "PATHFUNCAO": textoFuncao,
            "DADOS": textdados,
            "IP": ipUsuario
          }];

          await post("/log-web", dadosConfirmaDep);
          Swal.fire('Sucesso!', 'Venda detalhada com sucesso.', 'success');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log('Ação cancelada pelo usuário.');
        }
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };


  return (

    <Fragment>
      <div className="row">
        <div className="col-xl-12">
          <div id="panel-1" className="panel">
            <div className="panel-hdr">
              <h2>
                Lista de Vendas PIX Por Período<span className="fw-300"><i></i></span>
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
                    footerColumnGroup={footerGroup}
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