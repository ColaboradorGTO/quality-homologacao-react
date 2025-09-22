import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrView } from 'react-icons/gr';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { CiEdit } from 'react-icons/ci';
import { SiSap } from "react-icons/si";
import { BsTrash3 } from "react-icons/bs";
import { get } from "../../../../api/funcRequest";
// import { ActionVincularFabricanteFornecedorModal } from "../ActionFonecedores/actionVincularFabricanteFornecedorModal";
import { ActionEditarFabricanteModal } from "./ActionEditar/actionEditarFabricanteModal";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaFabricantes = ({ dadosFabricantesFornecedo }) => {
  const [dadosDetalheFornecedorFabricante, setDadosDetalheFornecedorFabricante] = useState([]);
  const [dadosDetalheFabricante, setDadosDetalheFabricante] = useState([]);
  const [modalEditarFabricante, setModalEditarFabricante] = useState(false);
  const [modalEditarVinculo, setModalEditarVinculo] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Relatório Fabricantes',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Fabricante', 'Fornecedor', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.NUCNPJ,
        item.NORAZAOSOCIAL,
        item.NOFANTASIA,
        item.NUTELEFONE1,
        item.ECIDADE,
        item.SGUF,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relatorio_fabricantes.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Fabricante', 'Fornecedor', 'Situação']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Fabricante' },
      { wpx: 200, caption: 'Fornecedor' },
      { wpx: 200, caption: 'Situação' },

    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Fabricantes');
    XLSX.writeFile(workbook, 'relatorio_fabricantes.xlsx');
  };

  const dadosListaFornecedoresFabricantes = dadosFabricantesFornecedo.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      DSFABRICANTE: item.DSFABRICANTE,
      IDFABSAP: item.IDFABSAP,
      NOFANTFORN: item.NOFANTFORN,
      STATIVO: item.STATIVO,

      IDFORNECEDOR: item.IDFORNECEDOR,
      IDFABRICANTE: item.IDFABRICANTE,
      IDFABRICANTEFORN: item.IDFABRICANTEFORN,
      LOGFABSAP: item.LOGFABSAP,
    }
  })

  const colunasFornecedores = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => row.contador,
      sortable: true
    },
    {
      field: 'DSFABRICANTE',
      header: 'Fabricante',
      body: row => row.DSFABRICANTE,
      sortable: true
    },
    {
      field: 'IDFABSAP',
      header: 'St. SAP',
      body: (row) => {
        return (
          <div>
            <p style={{ fontWeight: 700, color: row.IDFABSAP && !row.IDFABSAP ? '#fd3995' : '#2196F3' }}>
              {row.IDFABSAP && !row.IDFABSAP ? 'NÃO MIGRADO' : 'MIGRADO'}
              {/* {row.IDFABSAP} */}
            </p>
          </div>
        )
      }
    },
    {
      field: 'NOFANTFORN',
      header: 'Fornecedor Vinculado',
      body: row => {
        return (
          <p style={{ fontWeight: 700, color: row.NOFANTFORN || 'SEM VINCULO' ? '' : '#fd3995' }} >
            {row.NOFANTFORN || 'SEM VINCULO'}
          </p>
        )
      },
      sortable: true
    },

    {
      field: 'STATIVO',
      header: 'Situação',
      body: (row) => {
        return (
          <p style={{ color: row.STATIVO == 'True' ? '#2196F3' : '#fd3995', fontWeight: 700 }}>{row.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'}</p>
        )
      },
      sortable: true
    },
    {
      field: 'IDFORNECEDOR',
      header: 'Opções',
      body: (row) => {
        if (row.IDFORNECEDOR > 0) {
          return (
            <div className="p-1 "
              style={{ justifyContent: "space-between", width: "150px", display: "flex" }}
            >
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"success"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => clickEditarFabricante(row)}
                  titleButton={"Editar Fabricante"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={CiEdit}
                  cor={"warning"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => clickVinculoFonecedorFabricante(row)}
                  titleButton={"Editar Vínculo Fabricante/Fornecedor"}
                />
              </div>
              <div className="p-1">
                <ButtonTable
                  Icon={BsTrash3}
                  cor={"danger"}
                  iconColor={"white"}
                  iconSize={20}
                  onClickButton={() => clickVinculoFonecedorFabricante(row)}
                  titleButton={"Excluir Vínculo Fabricante/Fornecedor"}
                />
              </div>
              <div className="p-1">
                {!row.IDFABSAP ?
                  <ButtonTable
                    Icon={SiSap}
                    cor={"primary"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton={() => clickVinculoFonecedorFabricante(row)}
                    titleButton={"Migrar Fabricante SAP"}
                  />

                  : ''}
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
                  onClickButton={() => clickEditarFabricante(row)}
                  titleButton={"Editar Fabricante"}
                />
              </div>

              <div className="p-1">
                {row.IDFABSAP ?
                  <ButtonTable
                    Icon={GrView}
                    cor={"success"}
                    iconColor={"white"}
                    iconSize={20}
                    onClickButton
                    titleButton={"Migrar Fabricante SAP"}
                  />
                  : ''}
              </div>
            </div>

          )
        }
      }
    }
  ]

  const editarFabricante = async (IDFABRICANTE) => {
    try {
      const response = await get(`/fabricantes?idFabricante=${IDFABRICANTE}`);

      if (response.data) {
        setDadosDetalheFabricante(response.data)
        setModalEditarFabricante(true);
        console.log(response.data)
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da despesa: ', error);
    }
  };


  const clickEditarFabricante = (row) => {
    if (row && row.IDFABRICANTE) {
      editarFabricante(row.IDFABRICANTE);
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
          <h2>Relatório Transportadoras </h2>
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
            value={dadosListaFornecedoresFabricantes}
            // header={header}
            sortField="VRTOTALPAGO"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
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

      <ActionEditarFabricanteModal
        show={modalEditarFabricante}
        handleClose={() => setModalEditarFabricante(false)}
        dadosDetalheFabricante={dadosDetalheFabricante}
      />
{/* 
      <ActionVincularFabricanteFornecedorModal
        show={modalEditarVinculo}
        handleClose={() => setModalEditarVinculo(false)}
        dadosDetalheFornecedorFabricante={dadosDetalheFornecedorFabricante}
      /> */}
    </Fragment>
  )
}