import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { get, } from "../../../../api/funcRequest";
import { ModalImprimirQuebra } from "../../Components/ModalImprimirQuebra";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useAtivarCancelar } from "./hooks/useAtivarCancelar";
import Swal from "sweetalert2";


export const ActionListaQuebraCaixaLoja = ({ dadosQuebraDeCaixa, usuarioLogado, optionsModulos }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dadosQuebraCaixasModal, setDadosQuebraCaixasModal] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();
  const {
    handleCancelar
  } = useAtivarCancelar({ usuarioLogado, optionsModulos });
 
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Quebra de Caixas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'DT Lançamento', 'Nº Mov', 'Matrícula', 'Colaborador', 'Vr. Quebra Sistema', 'Vr. Quebra Lançado', 'Historíco', 'Situação']],
      body: dados.map(item => [
        item.IDQUEBRACAIXA,
        item.DTLANCAMENTO,
        item.IDMOVIMENTOCAIXA,
        item.IDFUNCIONARIO,
        item.NOMEOPERADOR,
        formatMoeda(item.VRQUEBRASISTEMA),
        formatMoeda(item.VRQUEBRAEFETIVADO),
        item.TXTHISTORICO,
        item.STATIVO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('quebra_caixa_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'DT Lançamento', 'Nº Mov', 'Matrícula', 'Colaborador', 'Vr. Quebra Sistema', 'Vr. Quebra Lançado', 'Historíco', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 80, caption: 'ID' },
      { wpx: 150, caption: 'DT Lançamento' },
      { wpx: 150, caption: 'Nº Mov' },
      { wpx: 100, caption: 'Matrícula' },
      { wpx: 250, caption: 'Colaborador' },
      { wpx: 150, caption: 'Vr. Quebra Sistema' },
      { wpx: 150, caption: 'Vr. Quebra Lançado' },
      { wpx: 200, caption: 'Historíco' },
      { wpx: 50, caption: 'Situação' }
      
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Quebra de Caixas');
    XLSX.writeFile(workbook, 'quebra_caixa_loja.xlsx');
  };

  const dados = dadosQuebraDeCaixa.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      IDQUEBRACAIXA: item.IDQUEBRACAIXA,
      NOFANTASIA: item.NOFANTASIA,
      DTLANCAMENTO: item.DTLANCAMENTO,
      IDMOVIMENTOCAIXA: item.IDMOVIMENTOCAIXA,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
      NOMEOPERADOR: item.NOMEOPERADOR,
      CPFOPERADOR:  item.CPFOPERADOR,
      VRQUEBRASISTEMA: item.VRQUEBRASISTEMA,
      VRQUEBRAEFETIVADO: item.VRQUEBRAEFETIVADO,
      TXTHISTORICO: item.TXTHISTORICO,
      STATIVO: item.STATIVO

    }
  });

  const colunasQuebraDeCaixa = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDQUEBRACAIXA',
      header: 'ID',
      body: row => <th style={{ color: 'blue' }}>{row.IDQUEBRACAIXA}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{ color: 'blue', width: '200px', margin: '0px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'DTLANCAMENTO',
      header: 'DT Lançamento',
      body: row => <th style={{ color: 'blue' }}>{row.DTLANCAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'IDMOVIMENTOCAIXA',
      header: 'Nº Movimento',
      body: row => <p style={{ color: 'blue',width: '150px', margin: '0px', fontWeight: 600  }}>{row.IDMOVIMENTOCAIXA}</p>,
      sortable: true,

    },
    {
      field: 'IDFUNCIONARIO',
      header: 'Nº Matrícula',
      body: row => <th style={{ color: 'blue' }}>{row.IDFUNCIONARIO}</th>,
      sortable: true,

    },
    {
      field: 'NOMEOPERADOR',
      header: 'Colaborador',
      body: row => <p style={{ color: 'blue', width: '200px', margin: '0px', fontWeight: 600  }}>{row.NOMEOPERADOR}</p>,
      sortable: true,

    },
    {
      field: 'CPFOPERADOR',
      header: 'CPF',
      body: row => <th style={{ color: 'blue' }}>{row.CPFOPERADOR}</th>,
      sortable: true,

    },
    {
      field: 'VRQUEBRASISTEMA',
      header: 'Vr Quebra Sistema',
      body: row => {
        if (row.VRQUEBRASISTEMA > 0) {
          return <th style={{ color: 'blue' }}> + {formatMoeda(row.VRQUEBRASISTEMA)}</th>
        } else {
          return <th style={{ color: 'red' }}> - {formatMoeda(row.VRQUEBRASISTEMA)}</th>
        }

      },
      sortable: true,
    },
    {
      field: 'VRQUEBRAEFETIVADO',
      header: 'Vr Quebra Lançado',
      body: row => {
        if (row.VRQUEBRAEFETIVADO > 0) {
          return <th style={{ color: 'blue' }}> + {formatMoeda(row.VRQUEBRAEFETIVADO)}</th>
        } else {
          return <th style={{ color: 'red' }}> - {formatMoeda(row.VRQUEBRAEFETIVADO)}</th>
        }
      },
      sortable: true,
    },
    {
      field: 'TXTHISTORICO',
      header: 'Histórico',
      body: row => <th style={{ color: 'blue' }}>{row.TXTHISTORICO}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (row) => <th style={{ color: row.STATIVO ? 'blue' : 'red' }}>{row.STATIVO ? "Ativo" : "Inativo"}</th>,
      sortable: true,
    },

    {
      field: 'IDQUEBRACAIXA',
      header: 'Opções',
      body: (row) => {
        if (row.STATIVO == 'True') {
          return (

            <div className="d-flex "
              style={{ justifyContent: "space-between" }}
            >
              <div className="mr-2">
                <ButtonTable
                  titleButton={"Cancelar Quebra"}
                  cor={"danger"}
                  Icon={FaRegTrashAlt}
                  iconSize={20}
                  width="30px"
                  height="30px"
                  onClickButton={() => handleClickCancelar(row, false)}
                />

              </div>
              <div>
                <ButtonTable
                  titleButton={"Imprimir Quebra"}
                  cor={"primary"}
                  Icon={MdOutlineLocalPrintshop}
                  iconSize={20}
                  width="30px"
                  height="30px"
                  onClickButton={() => handleClickImprimir(row)}
                />

              </div>

            </div>
          )
        } else {
          return (

            <div>
              <ButtonTable
                titleButton={"Ativar Quebra"}
                cor={"success"}
                Icon={FaCheck}
                onClickButton={() => handleCancelar(row, true)}
                iconSize={20}
                width="30px"
                height="30px"
              />

            </div>
          )
        }
      }

    },
  ]

  const handleImprimir = async (IDQUEBRACAIXA) => {
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

  const handleClickImprimir = (row) => {
    if (row && row.IDQUEBRACAIXA) {
      handleImprimir(row.IDQUEBRACAIXA);
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
            <h4>Lista de Quebras de Caixa</h4>
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
              title="Quebra de Caixa das Lojas"
            
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
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado negativa</div>}
            >
              {colunasQuebraDeCaixa.map(coluna => (
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