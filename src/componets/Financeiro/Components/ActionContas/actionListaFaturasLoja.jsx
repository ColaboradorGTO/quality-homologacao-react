import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada } from "../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";
import { ActionEditarFaturaModal } from "./actionEditarFaturaModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { BsTrash3 } from "react-icons/bs";
import Swal from "sweetalert2";


export const ActionListaFaturasLoja = ({ dadosDetalheFatura, optionsModulos }) => {
  const [modalFaturaVisivel, setModalFaturaVisivel] = useState(false);
  const [dadosDetalheFaturaCaixa, setDadosDetalheFaturaCaixa] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Faturas Loja Período',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Empresa', 'Data Receb', 'Nº Mov', 'Caixa', 'Cod. Autorização', 'Valor', 'Recebedor', 'Situação', 'PIX']],
      body: dados.map(item => [
        item.NOFANTASIA,
        item.DTPROCESSAMENTO,
        item.IDMOVIMENTOCAIXAWEB,
        item.DSCAIXA,
        item.NUCODAUTORIZACAO,
        formatMoeda(item.VRRECEBIDO),
        item.NOFUNCIONARIO,
        item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado',
        item.STPIX == 'True' ? 'SIM' : 'NÃO'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('faturas_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Empresa', 'Data Recebimento', 'Nº Mov', 'Caixa', 'Cod. Autorização', 'Valor', 'Recebedor', 'Situação', 'PIX'];
    worksheet['!cols'] = [
      { wpx: 200, caption: 'Empresa' },
      { wpx: 150, caption: 'Data Recebimento' },
      { wpx: 150, caption: 'Nº Mov' },
      { wpx: 150, caption: 'Caixa' },
      { wpx: 150, caption: 'Cod. Autorização' },
      { wpx: 150, caption: 'Valor' },
      { wpx: 200, caption: 'Recebedor' },
      { wpx: 150, caption: 'Situação' },
      { wpx: 150, caption: 'PIX' },


    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturas Loja Período');
    XLSX.writeFile(workbook, 'faturas_loja.xlsx');
  };

  const dadosExcel = dadosDetalheFatura.map((item, index) => {

    return {
      NOFANTASIA: item.NOFANTASIA,
      DTPROCESSAMENTO: `${item.DTPROCESSAMENTO} - ${item.HRPROCESSAMENTO}`,
      IDMOVCAIXA: item.IDMOVCAIXA,
      DSCAIXA: item.DSCAIXA,
      NUCODAUTORIZACAO: item.NUCODAUTORIZACAO,
      VRRECEBIDO: item.VRRECEBIDO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      STCANCELADO: item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado',
      STPIX: item.STPIX == 'True' ? 'SIM' : 'NÃO',
    }
  });
  const dados = dadosDetalheFatura.map((item, index) => {
    let contador = index + 1;

    return {
      NOFANTASIA: item.NOFANTASIA,
      DTPROCESSAMENTO: item.DTPROCESSAMENTO,
      IDMOVIMENTOCAIXAWEB: item.IDMOVIMENTOCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      NUCODAUTORIZACAO: item.NUCODAUTORIZACAO,
      VRRECEBIDO: item.VRRECEBIDO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      STCANCELADO: item.STCANCELADO,
      STPIX: item.STPIX,

      IDDETALHEFATURA: item.IDDETALHEFATURA,
      HRPROCESSAMENTO: item.HRPROCESSAMENTO,
      IDMOVCAIXA: item.IDMOVCAIXA,

    }
  });

  const calcularTotalValorRecebido = () => {
    let total = 0;
    for (let result of dados) {
      total += parseFloat(result.VRRECEBIDO);
    }
    return total;
  }

  const colunasListaFatura = [
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <th style={{}}>  {row.NOFANTASIA} </th>,
      sortable: true,

    },
    {
      field: 'DTPROCESSAMENTO',
      header: 'Data Recebimento',
      body: row => <th style={{}}>  {row.DTPROCESSAMENTO}  {row.HRPROCESSAMENTO} </th>,
      sortable: true,
    },
    {
      field: 'IDMOVIMENTOCAIXAWEB',
      header: 'Nº Movimento Caixa',
      body: row => <th style={{}}>  {row.IDMOVCAIXA}</th>,
      sortable: true,
    },
    {
      field: 'DSCAIXA',
      header: 'Caixa',
      body: row => <th style={{}}> {row.DSCAIXA} </th>,
      sortable: true,
    },
    {
      field: 'NUCODAUTORIZACAO',
      header: 'Cod. Autorização',
      body: row => <th style={{}}> {row.NUCODAUTORIZACAO} </th>,
      footer: <p>Total Lançamentos</p>,
      sortable: true,
    },
    {
      field: 'VRRECEBIDO',
      header: 'Valor',
      body: row => <th style={{}}> {formatMoeda(row.VRRECEBIDO)} </th>,
      footer: formatMoeda(calcularTotalValorRecebido()),
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Recebedor',
      body: row => <th style={{}}> {row.NOFUNCIONARIO} </th>,
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => (
        <th style={{ color: row.STCANCELADO == 'False' ? 'blue' : 'red' }}>
          {row.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}
        </th>
      ),
    },
    {
      field: 'STPIX',
      header: 'PIX',
      body: row => (
        <th style={{ color: row.STPIX == 'True' ? 'blue' : 'red' }}>
          {row.STPIX == 'True' ? 'SIM' : 'NÃO'}
        </th>
      ),
    },
    {
      header: 'Opções',
      button: true,
      width: '10%',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          <div className="p-1">
            <ButtonTable
              titleButton={"Editar Fatura"}
              cor={"primary"}
              Icon={CiEdit}
              onClickButton={() => handleClickEditar(row)}
              iconSize={25}
              width="30px"
              height="30px"
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Cancelar Fatura"}
              cor={"danger"}
              Icon={BsTrash3}
              onClickButton
              iconSize={25}
              width="30px"
              height="30px"
            />
          </div>
        </div>
      ),
    },

  ]

  const handleEditar = async (IDDETALHEFATURA) => {
    try {
      const response = await get(`/detalhe-Fatura-id?idFatura=${IDDETALHEFATURA}`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheFaturaCaixa(response.data);

        setModalFaturaVisivel(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };


  const handleClickEditar = (row) => {
    if (optionsModulos[0]?.ALTERAR == 'True') {
      if (row && row.IDDETALHEFATURA) {
        handleEditar(row.IDDETALHEFATURA);
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
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
          filterDisplay="menu"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
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
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem', }}

            />
          ))}
        </DataTable>
      </div>
      <ActionEditarFaturaModal
        show={modalFaturaVisivel}
        handleClose={() => setModalFaturaVisivel(false)}
        dadosDetalheFaturaCaixa={dadosDetalheFaturaCaixa}
        optionsModulos={optionsModulos}
      />
    </Fragment>
  )
}

