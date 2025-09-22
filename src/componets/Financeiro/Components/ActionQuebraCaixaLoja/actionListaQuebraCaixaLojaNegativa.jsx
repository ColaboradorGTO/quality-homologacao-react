import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada } from "../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { get } from "../../../../api/funcRequest";
import { ModalImprimirQuebra } from "../../Components/ModalImprimirQuebra";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { useAtivarCancelar } from "./hooks/useAtivarCancelar";


export const ActionListaQuebraCaixaLojaNegativa = ({ dadosQuebraDeCaixaNegativa, usuarioLogado, optionsModulos }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dadosQuebraCaixasModal, setDadosQuebraCaixasModal] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const {
    handleCancelar
  } = useAtivarCancelar({ usuarioLogado, optionsModulos });

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Quebra de Caixas Negativas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'DT Lançamento', 'Nº Mov', 'Matrícula', 'Colaborador', 'CPF', 'Vr. Quebra Sistema', 'Vr. Quebra Lançado', 'Historíco', 'Situação']],
      body: dadosNegativo.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.DTLANCAMENTO,
        item.IDMOVIMENTOCAIXA,
        item.IDFUNCIONARIO,
        item.NOMEOPERADOR,
        item.CPFOPERADOR,
        formatMoeda(item.VRQUEBRASISTEMA),
        formatMoeda(item.VRQUEBRAEFETIVADO),
        item.TXTHISTORICO,
        item.STATIVO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('quebra_caixa_negativa.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosNegativo);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'DT Lançamento', 'Nº Mov', 'Matrícula', 'Colaborador', 'CPF', 'Vr. Quebra Sistema', 'Vr. Quebra Lançado', 'Historíco', 'Situação', 'IDQUEBRACAIXA'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 150, caption: 'DT Lançamento' },
      { wpx: 150, caption: 'Nº Mov' },
      { wpx: 100, caption: 'Matrícula' },
      { wpx: 250, caption: 'Colaborador' },
      { wpx: 100, caption: 'CPF' },
      { wpx: 150, caption: 'Vr. Quebra Sistema' },
      { wpx: 150, caption: 'Vr. Quebra Lançado' },
      { wpx: 200, caption: 'Historíco' },
      { wpx: 50, caption: 'Situação' },
      { wpx: 100, caption: 'IDQUEBRACAIXA'}
      
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quebra de Caixas Negativas');
    XLSX.writeFile(workbook, 'quebra_caixa_negativa.xlsx');
  };

  const dadosNegativo = dadosQuebraDeCaixaNegativa.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DTLANCAMENTO: item.DTLANCAMENTO,
      IDMOVIMENTOCAIXA: item.IDMOVIMENTOCAIXA,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
      NOMEOPERADOR: item.NOMEOPERADOR,
      CPFOPERADOR: item.CPFOPERADOR,
      VRQUEBRASISTEMA: item.VRQUEBRASISTEMA,
      VRQUEBRAEFETIVADO: item.VRQUEBRAEFETIVADO,
      TXTHISTORICO: item.TXTHISTORICO,
      STATIVO: item.STATIVO,
      IDQUEBRACAIXA: item.IDQUEBRACAIXA,

    }
  });

  const colunasQuebraDeCaixaNegativa = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <p style={{ color: 'blue' }}> {row.contador}</p>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{ color: 'blue' }}> {row.NOFANTASIA} </p>,
      sortable: true,
    },
    {
      field: 'DTLANCAMENTO',
      header: 'DT Lançamento',
      body: row => <p style={{ color: 'blue' }}> {dataFormatada(row.DTLANCAMENTO)}</p>,
      sortable: true,
    },
    {
      field: 'IDMOVIMENTOCAIXA',
      header: 'Nº Movimento',
      body: row => <p style={{ color: 'blue' }}> {row.IDMOVIMENTOCAIXA}</p>,
      sortable: true,
    },
    {
      field: 'IDFUNCIONARIO',
      header: 'Matrícula',
      body: row => <p style={{ color: 'blue' }}> {row.IDFUNCIONARIO}</p>,
      sortable: true,
    },
    {
      field: 'NOMEOPERADOR',
      header: 'Colaborador',
      body: row => <p style={{ color: 'blue' }}> {row.NOMEOPERADOR}</p>,
      sortable: true,
    },
    {
      field: 'CPFOPERADOR',
      header: 'CPF',
      body: row => <p style={{ color: 'blue' }}> {row.CPFOPERADOR}</p>,
      sortable: true,
    },
    {
      field: 'VRQUEBRASISTEMA',
      header: 'Vr Quebra Sistema',
      body: row => <p style={{ color: row.VRQUEBRASISTEMA > 0 ? 'blue' : 'red' }}> {formatMoeda(row.VRQUEBRASISTEMA)}</p>,
      sortable: true,
    },
    {
      field: 'VRQUEBRAEFETIVADO',
      header: 'Vr Quebra Lançado',
      body: row => <p style={{ color: row.VRQUEBRAEFETIVADO > 0 ? 'blue' : 'red' }}> {formatMoeda(row.VRQUEBRAEFETIVADO)}</p>,
      sortable: true,
    },
    {
      field: 'TXTHISTORICO',
      header: 'Histórico',
      body: row => <p style={{ color: 'blue' }}> {row.TXTHISTORICO}</p>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (row) => {
        return (
          <div style={{ color: row.STATIVO == "True" ? 'blue' : 'red' }}>
            <p style={{ color: 'blue' }}> {row.STATIVO == 'True' ? "Ativo" : "Inativo"}</p>
          </div>
        )
      },
      sortable: true,
    },

    {
      header: 'Opções',
      button: true,
      body: (row) => (
        <div className="d-flex "
          style={{ justifyContent: "space-between" }}
        >
          <div>
            <ButtonTable
              titleButton="Imprimir"
              cor="primary"
              onClickButton={() => handleClickEdit(row)}
              Icon={MdOutlineLocalPrintshop}
              iconSize={20}
              width="30px"
              height="30px"
            />
          </div>
          <div className="ml-2">
            <ButtonTable
              titleButton="Cancelar"
              cor="danger"
              onClickButton={() => handleClickCancelar(row, false)}
              Icon={AiOutlineDelete}
              iconSize={20}
              width="30px"
              height="30px"
            />
          </div>

        </div>
      )
    },
  ]

  const handleEdit = async (IDQUEBRACAIXA) => {
    try {
      const response = await get(`/quebra-caixa?idQuebraCaixa=${IDQUEBRACAIXA}`);
      if (response.data && response.data.length > 0) {
        setDadosQuebraCaixasModal(response.data);
        setModalVisivel(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickEdit = (row) => {
    if (row && row.IDQUEBRACAIXA) {
      handleEdit(row.IDQUEBRACAIXA);
    }
  };

  const handleClickCancelar = (row) => {
    if(optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDQUEBRACAIXA) {
        handleCancelar(row.IDQUEBRACAIXA, row.STATIVO);
        
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        text: 'Você não tem permissão para editar esta despesa.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'custom-swal',
        }
      })
    }
  };

  return (

    <Fragment>
      <div className="panel">
          <div className="panel-hdr">
            <h4>Lista de Quebras de Caixa Negativa</h4>
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
              title="Quebra Negativas de Caixa das Lojas"
              value={dadosNegativo}
              globalFilter={globalFilterValue}
              size="small"
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[10, 20, 50, 100, dadosNegativo.length]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
              filterDisplay="menu"
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado negativa</div>}
            >
              {colunasQuebraDeCaixaNegativa.map(coluna => (
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

      <ModalImprimirQuebra
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosQuebraCaixasModal={dadosQuebraCaixasModal}
      />
    </Fragment>
  )
}
