import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { dataFormatada } from "../../../../utils/dataFormatada"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaCheck } from "react-icons/fa"
import HeaderTable from "../../../Tables/headerTable"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { BsTrash3 } from "react-icons/bs"
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useAtivarCancelar } from "./hooks/useAtivarCancelar";



export const ActionListaAdiantamentoSalarioLoja = ({ dadosAdiantamentoFuncionarios, optionsModulos, usuarioLogado, handleClick }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const {
    handleAtivar,
    handleCancelar,
  } = useAtivarCancelar({ usuarioLogado, optionsModulos, handleClick });

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current ,
    documentTitle: 'Adiantamento Salarial das Lojas',

  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Empresa', 'Data Mov', 'Funcionário', 'CPF', 'Valor', 'Situação']],
      body: dadosAdiantamentos.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.DTLANCAMENTO,
        item.NOFUNCIONARIO,
        item.NUCPF,
        formatMoeda(item.VRVALORDESCONTO),
        item.STATIVO === 'True' ? 'Ativo' : 'Cancelado',
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('adiantamento_salarial.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'Data Mov', 'Funcionário', 'CPF', 'Valor', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'Data Mov' },
      { wpx: 250, caption: 'Funcionário' },
      { wpx: 100, caption: 'CPF' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 100, caption: 'Situação' },
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Adiantamento Salarial das Lojas');
    XLSX.writeFile(workbook, 'adiantamento_salarial.xlsx');
  };


  const dadosExcel = Array.isArray(dadosAdiantamentoFuncionarios) ? dadosAdiantamentoFuncionarios.map((item, index) => {
    let contador = index + 1;
  
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DTLANCAMENTO: item.DTLANCAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NUCPF: item.NUCPF,
      VRVALORDESCONTO: item.VRVALORDESCONTO,
      STATIVO: item.STATIVO === 'True' ? 'Ativo' : 'Cancelado',

    }
  }) : [];

  const dadosAdiantamentos = dadosAdiantamentoFuncionarios.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      DTLANCAMENTO: item.DTLANCAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NUCPF: item.NUCPF,
      VRVALORDESCONTO: item.VRVALORDESCONTO,
      STATIVO: item.STATIVO,
      IDADIANTAMENTOSALARIO: item.IDADIANTAMENTOSALARIO,
    }
  });


  const calcularTotal = (field, condition = null) => {
    return dadosAdiantamentos.reduce((total, item) => {
      if (condition && !condition(item)) {
        return total;
      }
      return total + parseFloat(item[field]);
    }, 0);
  };
  
  const calcularTotalValorDesconto = () => {
    const total = calcularTotal('VRVALORDESCONTO', item => item.STATIVO === 'True');
    return total;
  };

  
  const colunasAdiantamentos = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
      width: "10%"
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th style={{ color: 'blue' }}>{row.NOFANTASIA}</th>,
      sortable: true,
      width: "10%"
    },
    {
      field: 'DTLANCAMENTO',
      header: 'Data Mov',
      body: row => <th style={{ color: 'blue' }}>{row.DTLANCAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Funcionário',
      body: row => <th style={{ color: 'blue' }}>{row.NOFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'NUCPF',
      header: 'CPF',
      body: row => <th style={{ color: 'blue' }}>{row.NUCPF}</th>,
      footer: 'Total Lançamentos',
      sortable: true,
    },
    {
      field: 'VRVALORDESCONTO',
      header: 'Valor',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRVALORDESCONTO)}</th>,
      footer: () => <th> {formatMoeda(calcularTotalValorDesconto())} </th> , 
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => (
        <div style={{ color: row.STATIVO === 'True' ? 'blue' : 'red' }}>
          {row.STATIVO === 'True' ? 'Ativo' : 'Cancelado'}
        </div>
      ),
    },
    {
      field: 'STATIVO',
      header: 'Opções',
      button: true,

      body: (row) => {
        if (row.STATIVO == 'True') {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between" }}
            >
              <div className="p-1">
                <ButtonTable
                  titleButton={"Cancelar Adiantamento"}
                  cor={"danger"}
                  Icon={BsTrash3}
                  iconSize={25}
                  width="35px"
                  height="35px"
                  onClickButton={() => handleClickCancelar(row)}
                />
              </div>
            </div>

          )
        } else {
          return (

            <div className="p-1 "
              style={{ justifyContent: "space-between" }}
            >
              <div className="p-1">
                <ButtonTable
                  titleButton={"Ativar Adiantamento"}
                  cor={"success"}
                  Icon={FaCheck}
                  iconSize={25}
                  width="35px"
                  height="35px"
                  onClickButton={() => handleClickAtivar(row)}
                />
              </div>
            </div>
          )

        }
      },
    },
  ]
  
  const handleClickAtivar = (row) => {
    if(optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDADIANTAMENTOSALARIO) {
        handleAtivar(row.IDADIANTAMENTOSALARIO);
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

  const handleClickCancelar = (row) => {
    if(optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDADIANTAMENTOSALARIO) {
        handleCancelar(row.IDADIANTAMENTOSALARIO);
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

  
  const footerGroup = (
    <ColumnGroup>

      <Row> 
        <Column footer="Total Lançamentos" colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={formatMoeda(calcularTotalValorDesconto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} /> 
        <Column footer={""} colSpan={2}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/>
      </Row>
    </ColumnGroup>
  )
   

  return (

    <Fragment>
      <div className="panel" >
        <div className="panel-hdr">
          <h2>Adiantamento Salarial das Lojas</h2>
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={() =>handlePrint(dadosAdiantamentos.length)}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />
        </div>
        <div className="card" ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dadosAdiantamentos}
            globalFilter={globalFilterValue}
            size="small"
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosAdiantamentos.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasAdiantamentos.map(coluna => (
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
  )
}