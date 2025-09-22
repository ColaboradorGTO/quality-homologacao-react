import React, { Fragment, useState, useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";;
import { Checkbox } from "primereact/checkbox";
import { useEditarPermissaoUsuario } from "./hooks/useEditarPermissao";
import { ButtonType } from "../../../Buttons/ButtonType";
import { FaRegClone } from "react-icons/fa";
import Swal from "sweetalert2";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { ActionUpdatePermissaoModal } from "./ActionUpdatePermissao/actionUpdatePermissaoModal";
import { get } from "../../../../api/funcRequest";

export const ActionListaPerfilPermissao = ({ dadosPermissoes, handleClick, copiarPermissao, setCopiarPermissao, handleClonar, usuarioSelecionado, optionsModulos }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [data, setData] = useState('');
  const [rowClick, setRowClick] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dadosEditarPermissao, setDadosEditarPermissao] = useState([]);
  const [modalEditarPermissao, setModalEditarPermissao] = useState(false);

  const {
    handleSubmit
  } = useEditarPermissaoUsuario({ selectedItems, copiarPermissao })

  const handleClonarPermissao = () => {
    if (!copiarPermissao && !usuarioSelecionado && optionsModulos[0]?.ALTERAR !== 'True') {
      Swal.fire({
        icon: 'info',
        text: 'Selecione o funcionário para copiar a permissão e o funcionário para clonar a permissão!',
        timer: 3000,
      })
    } else {
      handleSubmit();
    }
  };

  const onSelectAllChange = (e) => {
    if (e.checked) {
      setSelectedItems([...dados, ...copiarPermissao]);
    } else {
      setSelectedItems([]);
    }
  };
 
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Perfil de Permissão',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['idPerfil', 'Modulo', 'Menu', 'Menu Filho', 'Administrador', 'Criar', 'Alterar', 'Nível 1', 'Nível 2', 'Nível 3', 'Nível 4']],
      body: dados.map(item => [
        item.IDPERFIL,
        item.modulo,
        item.ARRAYIDMENU,
        item.ARRAYIDMFILHOS,
        item.ADMINISTRADOR,
        item.CRIAR,
        item.ALTERAR,
        item.N1,
        item.N2,
        item.N3,
        item.N4,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('perfil_permissao.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['idPerfil', 'Modulo', 'Menu', 'Menu Filho', 'Administrador', 'Criar', 'Alterar', 'Nível 1', 'Nível 2', 'Nível 3', 'Nível 4'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'idPerfil ' },
      { wpx: 70, caption: 'Modulo' },
      { wpx: 70, caption: 'Menu' },
      { wpx: 70, caption: 'Menu Filho' },
      { wpx: 70, caption: 'Administrador' },
      { wpx: 70, caption: 'Criar' },
      { wpx: 70, caption: 'Alterar' },
      { wpx: 70, caption: 'Nível 1' },
      { wpx: 70, caption: 'Nível 2' },
      { wpx: 70, caption: 'Nível 3' },
      { wpx: 70, caption: 'Nível 4' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Perfil de Permissão');
    XLSX.writeFile(workbook, 'perfil_permissao.xlsx');
  };

  const dados = dadosPermissoes.map((item, index) => {
    let contador = index + 1;
    const MODULO_MAP = {
      "1": "DashBoardAdministrativo",
      "2": "DashBoardGerencia",
      "3": "DashBoardInformatica",
      "4": "DashBoardFinanceiro",
      "5": "DashBoardComercial",
      "6": "DashBoardCompras",
      "7": "DashBoardContabilidade",
      "8": "DashBoardMarketing",
      "9": "DashBoardRecursosHumanos",
      "10": "DashBoardComprasDM",
      "11": "DashBoardExpedicao",
      "12": "DashBoardConferenciaCega",
      "13": "DashBoardCadastro",
      "14": "DashBoardEtiquetagem",
      "15": "DashBoardResumoVendas",
      "16": "DashBoardVouchers",
      "17": "DashBoardMalotes",
      "18": "DashBoardPermissoes"
    };

    const MENU_MAP = {
      1: "Administrativo",
      2: "Gerência",
      3: "Informática",
      4: "Financeiro",
      5: "Comercial",
      6: "Compras",
      7: "Contabilidade",
      8: "Marketing",
      9: "Recursos Humanos",
      10: "Compras ADM",
      11: "Expedição",
      12: "Conferência Cega",
      13: "Cadastro",
      14: "Etiquetagem",
      15: "Resumo Vendas",
      16: "Vouchers",
      17: "Malotes",
      18: "Permissões"
    };

    const menuNome = MENU_MAP[item.IDMENU] || 'Menu Desconhecido';
    const menuFromApi = item.modulos?.[0]?.NOME || menuNome;
    const moduloIds = [
      item.IDMODULOADMINISTRATIVO,
      item.IDMODULOCOMERCIAL,
      item.IDMODULOCONTABILIDADE,
      item.IDMODULOFINANCEIRO,
      item.IDMODULOGERENCIA,
      item.IDMODULOINFORMATICA,
      item.IDMODULOMARKETING,
      item.IDMODULOCOMPRAS,
      item.IDMODULOCADASTRO,
      item.IDMODULOEXPEDICAO,
      item.IDMODULOCOMPRASADM,
      item.IDMODULOETIQUETAGEM,
      item.IDMODULOCONFERENCIACEGA,
      item.IDMODULOVOUCHER,
      item.IDMODULOMALOTE,
      item.IDMODULORH,
      item.IDMODULORESUMOVENDAS
    ];

    let modulo = "Módulo Desconhecido";

    const moduloId = moduloIds.find(id => id && MODULO_MAP[id]);
    if (moduloId) {
      modulo = MODULO_MAP[moduloId];
    }

  
    const menuFilho = item?.modulos?.[0]?.menuPai?.menuFilho?.find(
      filho => filho.ID === item.IDMENUFILHO
    );

    const nomeMenuFilho = menuFilho?.DSNOME || 'Menu Filho Desconhecido';

    return {
      IDPERFIL: item.IDPERFIL,
      CRIAR: item.CRIAR == 'True' ? 'Sim' : 'Não',
      ALTERAR: item.ALTERAR == 'True' ? 'Sim' : 'Não',
      IDMODULOADMINISTRATIVO: item.IDMODULOADMINISTRATIVO,
      IDMODULOCOMERCIAL: item.IDMODULOCOMERCIAL,
      IDMODULOCONTABILIDADE: item.IDMODULOCONTABILIDADE,
      IDMODULOFINANCEIRO: item.IDMODULOFINANCEIRO,
      IDMODULOGERENCIA: item.IDMODULOGERENCIA,
      IDMODULOINFORMATICA: item.IDMODULOINFORMATICA,
      IDMODULOMARKETING: item.IDMODULOMARKETING,
      IDMODULOCOMPRAS: item.IDMODULOCOMPRAS,
      IDMODULOCADASTRO: item.IDMODULOCADASTRO,
      IDMODULOEXPEDICAO: item.IDMODULOEXPEDICAO,
      IDMODULOCOMPRASADM: item.IDMODULOCOMPRASADM,
      IDMODULOETIQUETAGEM: item.IDMODULOETIQUETAGEM,
      IDMODULOCONFERENCIACEGA: item.IDMODULOCONFERENCIACEGA,
      IDMODULOVOUCHER: item.IDMODULOVOUCHER,
      IDMODULOMALOTE: item.IDMODULOMALOTE,
      IDMODULORH: item.IDMODULORH,
      IDUSERULTIMAALTERACAO: item.IDUSERULTIMAALTERACAO,
      IDPERMISSAO: item.IDPERMISSAO,
      IDMODULORESUMOVENDAS: item.IDMODULORESUMOVENDAS,
      ADMINISTRADOR: item.ADMINISTRADOR == 'True' ? 'Sim' : 'Não',
      N4: item.N4 == 'True' ? 'Sim' : 'Não',
      N3: item.N3 == 'True' ? 'Sim' : 'Não',
      N2: item.N2 == 'True' ? 'Sim' : 'Não',
      N1: item.N1 == 'True' ? 'Sim' : 'Não',
      ARRAYIDMENU: menuFromApi,
      ARRAYIDMFILHOS: nomeMenuFilho,
      IDMENU: item.IDMENU,
      IDMENUFILHO: item.IDMENUFILHO,
      modulo: modulo,
    };
  });

  const colunasFuncionarios = [
    {
      field: '',
      selectionMode: 'multiple',
      header: (
        <div className="custom-control custom-checkbox">
          <Checkbox
            checked={selectedItems.length === dados.length && dados.length > 0}
            onChange={onSelectAllChange}
          />
        </div>
      ),
      body: (rowData) => {
        return (
          <div className="custom-control custom-checkbox">
            <Checkbox
              checked={selectedItems.some(item => item.IDPERFIL === rowData.IDPERFIL)}
              onChange={(e) => {
                let _selectedItems = [...selectedItems];

                if (e.checked) {
                  _selectedItems.push(rowData);
                } else {
                  _selectedItems = _selectedItems.filter(item => item.IDPERFIL !== rowData.IDPERFIL);
                }

                setSelectedItems(_selectedItems);
              }}
            />
          </div>
        );
      },
      sortable: true,
    },
    {
      field: 'IDPERFIL',
      header: 'Nº',
      body: row => <th>{row.IDPERFIL}</th>,
      sortable: true,

    },
    {
      field: 'modulo',
      header: 'Modulo',
      body: row => <p style={{width: '200px', fontWeight: 600, margin: '0px'}}>{row.modulo}</p>,
      sortable: true,

    },
    {
      field: 'ARRAYIDMENU',
      header: 'Menu',
      body: (row) => <th>{row.ARRAYIDMENU}</th>,
      sortable: true,
    },
    {
      field: 'ARRAYIDMFILHOS',
      header: 'Menu Filho',
      body: (row) => <p style={{width: '200px', fontWeight: 600, margin: '0px'}}>{row.ARRAYIDMFILHOS}</p>,
      sortable: true,

    },
        {
      field: 'ADMINISTRADOR',
      header: 'Administrador',
      body: row => <th>{row.ADMINISTRADOR}</th>,        
      sortable: true,
    },
    {
      field: 'CRIAR',
      header: 'Criar',
      body: row => <th>{row.CRIAR}</th>,
      sortable: true,

    },
    {
      field: 'ALTERAR',
      header: 'Alterar',
      body: row => <th>{row.ALTERAR}</th>,
      sortable: true,
    },
    {
      field: 'N1',
      header: 'Nível 1',
      body: row => <p style={{width: '100px', fontWeight: 600, margin: '0px'}}>{row.N1}</p>,
      sortable: true,
    },
    {
      field: 'N2',
      header: 'Nível 2',
      body: row => <p style={{width: '100px', fontWeight: 600, margin: '0px'}}>{row.N2}</p>,
      sortable: true,
    },
    {
      field: 'N3',
      header: 'Nível 3',
      body: row => <p style={{width: '100px', fontWeight: 600, margin: '0px'}}>{row.N3}</p>,
      sortable: true,
    },
    {
      field: 'N4',
      header: 'Nível 4',
      body: row => <p style={{width: '100px', fontWeight: 600, margin: '0px'}}>{row.N4}</p>,
      sortable: true,
    },
    {
      field: 'IDPERFIL',
      header: 'Editar',
      body: (row) => {
        return (
          <ButtonTable
            onClickButton={() => handleClickEdit(row)}
            Icon={CiEdit}
            iconColor={"white"}
            iconSize={30}
            cor={"success"}
            width="40px"
            height="40px"
          />
        )
      },
      sortable: true,
    }
  ]

   const handleEdit = async (IDPERFIL) => {
      try {
        const response = await get(`/perfil-permissao?idPerfil=${IDPERFIL}`)
        if (response.data) {

          setDadosEditarPermissao(response.data);
          setModalEditarPermissao(true);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da venda: ', error);
      }
    };
  
    const handleClickEdit = (row) => {
      if(optionsModulos[0]?.ALTERAR == 'True') {
        if (row && row.IDPERFIL) {
          handleEdit(row.IDPERFIL);
        }

      } else {
        Swal.fire({
          icon: 'info',
          title: 'Atenção',
          text: 'Você não tem permissão para editar!',
          showConfirmButton: true,
          timer: 3000,
        })
      }
    };


  const headerTemplate = () => {
    return (
      <div style={{ width: '100%', backgroundColor: '' }} >
        <ButtonType
          textButton={"Clonar Permissão"}
          onClickButtonType={handleClonarPermissao}
          Icon={FaRegClone}
          iconColor={"white"}
          iconSize={20}
          cor={"success"}
        />

      </div>
    )
  }

  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista Perfil de Usuário</h2>
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
            title="Lista de Funcionários"
            value={dados}
            size="small"
            dataKey="IDPERFIL"
            header={headerTemplate}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode={rowClick ? null : 'checkbox'}
            selection={data}
            onSelectionChange={e => setData(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasFuncionarios.map(coluna => (

              <Column
                key={coluna.field || 'selection'}
                field={coluna.field}
                header={coluna.header}
                // selectionMode={coluna.selectionMode}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', border: '1px solid #e9e9e9' }}
              />
            ))}
          </DataTable>

        </div>
      </div>

      <ActionUpdatePermissaoModal
        show={modalEditarPermissao}
        handleClose={() => setModalEditarPermissao(false)}
        handleClick={handleClick}
        dadosEditarPermissao={dadosEditarPermissao}
      />
    </Fragment>
  )
}