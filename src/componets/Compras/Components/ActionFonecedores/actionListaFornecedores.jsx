import { Fragment, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrView } from 'react-icons/gr';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { CiEdit } from 'react-icons/ci';
import { AiOutlineDelete } from 'react-icons/ai';
import { get } from '../../../../api/funcRequest';

import { ActionEditarFornecedorModal} from './ActionEditar/actionEditarFornecedorModal';
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ActionEditarVinculoFabricanteModal } from '../ActionVincularFabricanteFornecedor/ActionEditar/actionEditarVinculoFabricanteModal';
import { useExcluirVinculoFabricanteFornecedor } from '../ActionVincularFabricanteFornecedor/hooks/useExluirViculoFabricanteFornecedor';

const formatarCNPJ = (cnpj) => {
  const x = cnpj.replace(/\D/g, '').match(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/);
  return !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');
};

export const ActionListaFornecedores = ({ dadosFornecedoresFabricantes }) => {
  const [dadosDetalheFornecedorFabricante, setDadosDetalheFornecedorFabricante] = useState([]);
  const [dadosDetalheFornecedor, setDadosDetalheFornecedor] = useState([]);
  const [dadosFornecedorSap, setDadosFornecedorSap] = useState([]);
  const [modalEditarFornecedor, setModalEditarFornecedor] = useState(false);
  const [modalEditarVinculo, setModalEditarVinculo] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const { handleExcluir } = useExcluirVinculoFabricanteFornecedor();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Relatório Fornecedores',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'CNPJ', 'Razão Social', 'Nome Fantasia', 'Fabricante', 'Telefone', 'Cidade', 'UF', 'ID SAP', 'Migrado SAP']],
      body: dados.map(item => [
        item.contador,
        item.NUCNPJFORN,
        item.NORAZAOFORN,
        item.NOFANTFORN,
        item.DSFABRICANTE,
        item.FONEFORN,
        item.CIDADEFORN,
        item.UFFORN,
        item.IDFORNECEDORSAP,
        item.STMIGRADOSAP,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relatorio_fornecedores.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'CNPJ', 'Razão Social', 'Nome Fantasia', 'Fabricante', 'Telefone', 'Cidade', 'UF', 'ID SAP', 'Migrado SAP'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 150, caption: 'CNPJ' },
      { wpx: 300, caption: 'Razão Social' },
      { wpx: 300, caption: 'Nome Fantasia' },
      { wpx: 200, caption: 'Fabricante' },
      { wpx: 100, caption: 'Telefone' },
      { wpx: 150, caption: 'Cidade' },
      { wpx: 50, caption: 'UF' },
      { wpx: 100, caption: 'ID SAP' },
      { wpx: 200, caption: 'Migrado SAP' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Fornecedores');
    XLSX.writeFile(workbook, 'relatorio_fornecedores.xlsx');
  };

  const dados = dadosFornecedoresFabricantes.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NUCNPJFORN: item.NUCNPJFORN,
      NORAZAOFORN: item.NORAZAOFORN,
      NOFANTFORN: item.NOFANTFORN,
      DSFABRICANTE: item.DSFABRICANTE,
      FONEFORN: item.FONEFORN,
      CIDADEFORN: item.CIDADEFORN,
      UFFORN: item.UFFORN,
      IDFORNECEDORSAP: item.IDFORNECEDORSAP,
      STMIGRADOSAP: item.STMIGRADOSAP == 'True' ? 'MIGRADO COM SUCESSO' : 'NÃO MIGRADO SAP',
      IDFABRICANTE: item.IDFABRICANTE,


      IDFABRICANTEFORN: item.IDFABRICANTEFORN,
      IDFORNECEDOR: item.IDFORNECEDOR,
      LOGFORNECEDORSAP: item.LOGFORNECEDORSAP,

    }
  })

  const colunasFornecedores = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true
    },
    {
      field: 'NUCNPJFORN',
      header: 'CNPJ',
      body: row => <th>{row.NUCNPJFORN}</th>,
      sortable: true
    },
    {
      field: 'NORAZAOFORN',
      header: 'Razão Social',
      body: row => <th>{row.NORAZAOFORN}</th>,
      sortable: true
    },
    {
      field: 'NOFANTFORN',
      header: 'Nome Fantasia',
      body: row => <th>{row.NOFANTFORN}</th>,
      sortable: true
    },
    {
      field: 'DSFABRICANTE',
      header: 'Fabricante',
      body: (row) => {
        if (row.IDFABRICANTE > 0) {
          return (
            <div>
              <th>{row.DSFABRICANTE?.toUpperCase()}</th>
            </div>
          )

        } else {
          return (
            <div>
              <th style={{ color: '#fd3995 ', fontWeight: 700 }} >SEM VINCULO</th>
            </div>
          )

        }
      },
      sortable: true
    },
    {
      field: 'FONEFORN',
      header: 'Telefone',
      body: row => <th>{row.FONEFORN}</th>,
      sortable: true
    },
    {
      field: 'CIDADEFORN',
      header: 'Cidade',
      body: row => <th>{row.CIDADEFORN}</th>,
      sortable: true
    },
    {
      field: 'UFFORN',
      header: 'UF',
      body: row => <th>{row.UFFORN}</th>,
      sortable: true
    },
    {
      field: 'IDFORNECEDORSAP',
      header: 'ID SAP',
      body: row => <th>{row.IDFORNECEDORSAP}</th>,
      sortable: true
    },
    {
      field: 'STMIGRADOSAP',
      header: 'Migrado SAP',
      body: (row) => {
        return (

          <th style={{ color: row.STMIGRADOSAP == 'MIGRADO COM SUCESSO' ? '#2196F3' : '#fd3995', fontWeight: 700 }}>{row.STMIGRADOSAP}</th>

        )
      },
      sortable: true
    },
    {
      field: 'IDFABRICANTEFORN',
      header: 'Opções',
      body: (row) => {
        if (row.IDFABRICANTE > 0) {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"info"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => clickEditarFonecedor(row)}
                  titleButton={"Editar Fornecedor"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => clickVinculoFonecedorFabricante(row)}
                  titleButton={"Editar Vínculo Fornecedor/Fabricante"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={AiOutlineDelete}
                  cor={"danger"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => handleExcluir(row.IDFABRICANTEFORN)}
                  titleButton={"Excluir Vínculo Fabricante/Fornecedor"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={GrView}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => hanldeClickVisualizarFornecedorSap(row)}
                  titleButton={"Consultar Fornecedor SAP"}
                />
              </div>
            </div>
          )

        } else {
          return (
            <div style={{ display: "flex" }}>
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"info"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => clickEditarFonecedor(row)}
                  titleButton={"Editar Fornecedor"}
                />
              </div>

              <div className="p-1">
                <ButtonTable
                  Icon={GrView}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => hanldeClickVisualizarFornecedorSap(row)}
                  titleButton={"Consultar Fornecedor SAP"}
                />
              </div>
            </div>

          )
        }
      }
    }
  ]

  const editarFornecedor = async (IDFORNECEDOR) => {
    try {
      const response = await get(`/fornecedores?idFornecedor=${IDFORNECEDOR}`);

      if (response.data) {
        setDadosDetalheFornecedor(response.data)
        setModalEditarFornecedor(true);
   
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };


  const clickEditarFonecedor = (row) => {
    if (row && row.IDFORNECEDOR) {
      editarFornecedor(row.IDFORNECEDOR);
    }
  };
  const handleVisualizarFornecedorSap = async (IDFORNECEDOR, NORAZAOFORN, NUCNPJFORN) => {
    try {
      const cnpjFormatado = formatarCNPJ(NUCNPJFORN);
      const response = await get(`/consulta-fornecedor-sap?byId=${IDFORNECEDOR}&descFornecedor=${NORAZAOFORN}&cnpjFornecedor=${cnpjFormatado}&cnpjFornecedorSemFormatar=${NUCNPJFORN}`);

      if (response.data) {
        setDadosFornecedorSap(response.data)
   
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };


  const hanldeClickVisualizarFornecedorSap = (row) => {
    if (row && row.IDFORNECEDOR && row.NORAZAOFORN && row.NUCNPJFORN) {
      handleVisualizarFornecedorSap(row.IDFORNECEDOR, row.NORAZAOFORN, row.NUCNPJFORN);
    }
  };

  const editarVinculoFornecedorFabricante = async (IDFABRICANTEFORN) => {
    try {
      const response = await get(`/vincularFabricanteFornecedor?idFornecedorFabricante=${IDFABRICANTEFORN}`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheFornecedorFabricante(response.data)
        setModalEditarVinculo(true);

      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };

  const clickVinculoFonecedorFabricante = (row) => {
    if (row && row.IDFABRICANTEFORN) {
      editarVinculoFornecedorFabricante(row.IDFABRICANTEFORN);
    }
  };




  return (
    <Fragment>
      <div className="panel" style={{ marginTop: "5rem" }}>
        <div className="panel-hdr">
          <h2>Relatório Fornecedores </h2>
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
        <div className="card mb-4" ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasFornecedores.map(coluna => (
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

      <ActionEditarVinculoFabricanteModal
        show={modalEditarVinculo}
        handleClose={() => setModalEditarVinculo(false)}
        dadosDetalheFornecedorFabricante={dadosDetalheFornecedorFabricante}
      />

      <ActionEditarFornecedorModal
        show={modalEditarFornecedor}
        handleClose={() => setModalEditarFornecedor(false)}
        dadosDetalheFornecedor={dadosDetalheFornecedor}
      />
    </Fragment>
  )
}