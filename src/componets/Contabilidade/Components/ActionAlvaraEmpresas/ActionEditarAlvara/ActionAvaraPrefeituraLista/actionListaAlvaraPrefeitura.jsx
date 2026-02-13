import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../../../Tables/headerTable";
import { ButtonTable } from "../../../../../ButtonsTabela/ButtonTable";
import { FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { get } from "../../../../../../api/funcRequest";
import { FaPlus, FaRegEye } from "react-icons/fa6";
import { ActionCadastrarAlvaraModal } from "./ActionCadastrarAlvaraModal/ActionCadastrarAlvaraModal";

export const ActionListaAlvaraPrefeitura = ({ dadosAlvaraEmpresaSelecionada, optionsModulos, usuarioLogado, refetchAlvaraEmpresa }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [rowSelection, setRowSelection] = useState(null);
    const [modalCadastrarAlvaraEmpresa, setModalCadastrarAlvaraEmpresa] = useState(false);
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Lista de Alvaras',
    });

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });

        doc.autoTable({
            head: [[
                "#",
                "Dt.Inicio",
                "Dt.Fim",
                "Status",
            ]],
            body: (dados || []).map((item) => [
                item?.IDEMPRESA,
                item?.DTINICIOCOMPETENCIAALVARA,
                item?.DTFIMCOMPETENCIAALVARA,
                item?.STATIVO,
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: "immediately",
            styles: { fontSize: 8 },
            headStyles: { fontSize: 8 },
        });

        doc.save("alvaras_empresas.pdf");
    };

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        const header = [
            "#",
            "Dt.Inicio",
            "Dt.Fim",
            "Status",
        ];

        const data = (dados || []).map(item => [
            item?.IDEMPRESA,
            item?.DTINICIOCOMPETENCIAALVARA,
            item?.DTFIMCOMPETENCIAALVARA,
            item?.STATIVO,
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);

        worksheet["!cols"] = [
            { wpx: 80 },
            { wpx: 220 },
            { wpx: 150 },
            { wpx: 120 },
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Alvarás Empresas");
        XLSX.writeFile(workbook, "alvaras_empresas.xlsx");
    };


    const dados = dadosAlvaraEmpresaSelecionada?.map((empresa) => {
        const prefeitura = empresa?.LISTA_ALVARAS?.find(
            (a) => a.IDALVARA === 4
        );

        const item = prefeitura?.ITEMS?.[0];

        return {
            IDEMPRESA: item?.IDEMPRESA,
            DATA_INICIO: item?.DTINICIOCOMPETENCIAALVARA,
            DATA_FIM: item?.DTFIMCOMPETENCIAALVARA,
            STATIVO: item?.STATIVO === "True" ? "Ativo" : "Inativo",
        };
    });

    const colunasEmpresasAlvaras = [
        {
            field: 'IDEMPRESA',
            header: '#',
            body: row => <th> {row.IDEMPRESA} </th>,
            sortable: true,
        },
        {
            field: 'DATA_INICIO',
            header: 'Dt.Inicio',
            body: row => <th> {row.DATA_INICIO} </th>,
            sortable: true,
        },
        {
            field: 'DATA_FIM',
            header: 'Dt.Fim',
            body: row => <th> {row.DATA_FIM} </th>,
            sortable: true,
        },
        {
            field: 'STATIVO',
            header: 'Status',
            body: row => <th style={{ color: row.STATIVO == 'Ativo' ? 'blue' : 'red' }}>{row.STATIVO}</th>,
            sortable: true,
        },
        {
            field: 'ARQUIVOALVARA',
            header: 'Opções',
            body: (row) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <ButtonTable
                        titleButton="Visualizar Detalhes do Alvará"
                        cor="info"
                        Icon={FaRegEye}
                        onClickButton={() => handleClickAjusteAlvara(row)}
                        iconSize={18}
                        width="35px"
                        height="35px"
                        lineHeight={1.3}
                    />

                    <ButtonTable
                        titleButton="Editar Alvará da Loja"
                        cor="warning"
                        Icon={FaPencilAlt}
                        onClickButton={() => console.log(row)}
                        iconSize={18}
                        width="35px"
                        height="35px"
                        lineHeight={1.3}
                    />
                </div>
            ),
            sortable: true,
        }
    ]

    const handleClickAjusteAlvara = (row) => {
        if (optionsModulos[0]?.ALTERAR === 'True') {
            if (row && row.IDEMPRESA) {
                handleEditarAlvara(row.IDEMPRESA);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Atenção!',
                text: 'Você não tem permissão para editar alvará.',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                },
            });
        }
    };

    const handleEditarAlvara = async (IDEMPRESA) => {
        try {
            const response = await get(`/alvaras-empresa-detalhe?idFilial=${IDEMPRESA}`);
            console.log(response, 'response.data')
            if (response.data && response.data.length > 0) {
                setDadosAlvaraEmpresaSelecionada(response.data);
                setModalAlvaraEmpresa(true);
            }
        } catch (error) {
            console.error('Erro ao buscar dados Alvaras: ', error);
        }
    };

    const handleClickCadastrarAlvara = () => {
        if (optionsModulos[0]?.ALTERAR === 'True') {
            setModalCadastrarAlvaraEmpresa(true);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Atenção!',
                text: 'Você não tem permissão para cadastrar alvará.',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                },
            });
        }
    };

    return (

        <Fragment>

            <div className="panel">
                <div className="panel-hdr mb-4">

                    <h3>ALVARÁS - PREFEITURA (LICENÇA DE FUNCIONAMENTO)</h3>
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                    <HeaderTable
                        globalFilterValue={globalFilterValue}
                        onGlobalFilterChange={onGlobalFilterChange}
                        handlePrint={handlePrint}
                        exportToExcel={exportToExcel}
                        exportToPDF={exportToPDF}
                    />
                    <div style={{ marginTop: "1rem", marginLeft: "0.8rem" }}>
                        <ButtonTable
                            titleButton="Adicionar Alvará"
                            className="btn btn-outline-success d-flex align-items-center justify-content-center gap-4"
                            Icon={FaPlus}
                            textButton="Add Alvará"
                            onClickButton={handleClickCadastrarAlvara}
                            iconSize={18}
                            width="110px"
                            height="37px"
                            flexDirection="row"
                        />
                    </div>
                </div>
                <div className="card" ref={dataTableRef}>
                    <DataTable
                        value={dados}
                        size="small"
                        globalFilter={globalFilterValue}
                        sortOrder={-1}
                        paginator={true}
                        rows={10}
                        selectionMode="single"
                        selection={rowSelection}
                        onSelectionChange={(e) => setRowSelection(e.value)}
                        rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                        filterDisplay="menu"
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                        {colunasEmpresasAlvaras.map(coluna => (

                            <Column
                                key={coluna.field}
                                field={coluna.field}
                                header={coluna.header}
                                body={coluna.body}
                                footer={coluna.footer}
                                sortable={coluna.sortable}
                                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                                bodyStyle={{ fontSize: '1rem' }}

                            />
                        ))}
                    </DataTable>
                </div>
            </div>
            <ActionCadastrarAlvaraModal
                show={modalCadastrarAlvaraEmpresa}
                handleClose={() => setModalCadastrarAlvaraEmpresa(false)}
                dadosAlvaraEmpresa={dadosAlvaraEmpresaSelecionada}
            />
        </Fragment>
    )
}