import React, { Fragment, useEffect, useState, useRef } from "react"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Select from 'react-select';
import { get, post, put } from "../../../../../api/funcRequest";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import HeaderTable from "../../../../Tables/headerTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import axios from "axios";

export const InformaticaActionUpdateEmpresaModal = ({ show, handleClose, dadosListaCaixa, dadosAtualizaEmpresa }) => {
  const { register, handleSubmit, errors } = useForm();
  const navigate = useNavigate();
  const [selectedCaixa, setSelectedCaixa] = useState('');
  const [selectedCaixaLimpar, setSelectedCaixaLimpar] = useState('');
  const [statusAtualizado, setStatusAtualizado] = useState('');
  const [atualizacao, setAtualizacao] = useState('');
  const [horaAtualizado, setHoraAtualizado] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [caixaListaAtualiza, setCaixaListaAtualiza] = useState([]);
  const [caixaListaLimpar, setCaixaListaLimpar] = useState([]);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Empresas'
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Caixa' ]],
      body: dados.map(item => [
        item.IDCAIXAWEB, 
        item.DSCAIXA,
        item.NOFANTASIA,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_caixas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID', 'Caixa' ]
    worksheet['!cols'] = [
      { wpx: 100,  caption: 'ID' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 250, caption: 'Empresa' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Caixas');
    XLSX.writeFile(workbook, 'lista_caixas.xlsx');
  };

  const handleCheckboxChange = (id, tipo) => {
    if (tipo === 'atualizar') {
      setCaixaListaAtualiza(prevState => {
        const item = `A${id}`;
        return prevState.includes(item) ? prevState.filter(i => i !== item) : [...prevState, item];
      });
    } else if (tipo === 'limpar') {
      setCaixaListaLimpar(prevState => {
        const item = `L${id}`;
        return prevState.includes(item) ? prevState.filter(i => i !== item) : [...prevState, item];
      });
    }
  };

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

  useEffect(()  => {
    if(dadosAtualizaEmpresa){
      setStatusAtualizado(dadosAtualizaEmpresa[0]?.STLOJAABERTA)
      setAtualizacao(dadosAtualizaEmpresa[0]?.STATUALIZADIARIO)
      setHoraAtualizado(dadosAtualizaEmpresa[0]?.HRATUALIZACAO)
      setEmpresa(dadosAtualizaEmpresa[0]?.NOFANTASIA)
      setSelectedCaixa(dadosAtualizaEmpresa[0]?.IDCAIXAWEB)
      setSelectedCaixaLimpar(dadosAtualizaEmpresa[0]?.IDCAIXAWEB)
    }
  }, [dadosListaCaixa])

  const dados = dadosListaCaixa.map((item, index) => {
    return {
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      NOFANTASIA: item.NOFANTASIA,
    }
  });

  const colunasCaixa = [
    {
      field: 'IDCAIXAWEB',
      header: 'ID',
      body: row => <th>{row.IDCAIXAWEB}</th>,
      sortable: true,

    },
    {
      field: 'DSCAIXA',
      header: 'CAIXA',
      body: row => <th>{row.DSCAIXA}</th>,
      sortable: true,

    },
    {
      field: 'IDCAIXAWEB',
      header: 'Atualizar',
      body: (row) => {
        return (
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              id={row.IDCAIXAWEB}
              checked={caixaListaAtualiza.includes(row.IDCAIXAWEB)}
              onChange={() => handleCheckboxChange(row.IDCAIXAWEB, 'atualizar')}
            />
          </div>
        )
      },
      sortable: true,

    },
    {
      field: 'IDCAIXAWEB',
      header: 'Limpar e Atualizar',
      body: (row) => {
        return (
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              id={row.IDCAIXAWEB}
              checked={caixaListaLimpar.includes(row.IDCAIXAWEB)}
              onChange={() => handleCheckboxChange(row.IDCAIXAWEB, 'limpar')}

            />
          </div>
        )
      },
      sortable: true,
    },


  ]

  const atualizacaoDiario = [
    { value: "True", label: "SIM" },
    { value: "False", label: "NÃO" }
  ]
  const status = [
    { value: "True", label: "Aberta" },
    { value: "False", label: "Fechada" }
  ]

  
  const onSubmit = async () => {
    let idFuncionarioSupervisor = 0;
    
    
    // if(statusAtualizado != 'True'){
      //   horaAtualizado = '00:00:00';
      //   console.log('statusAtualizado if', statusAtualizado)
      // }
      
      if(statusAtualizado == 'True' ) {
        idFuncionarioSupervisor = usuarioLogado.id;
      }
      
      try {
        const postData = {
          IDEMPRESA: dadosListaCaixa[0]?.IDEMPRESA,
          HORAATUALIZA: horaAtualizado,
          STATUALIZADIARIO: atualizacao,
          STLOJAABERTA: statusAtualizado,
          IDFUNCIONARIOSUPERVISOR: idFuncionarioSupervisor,
      }
      
      
      const postDataSTCaixa = {
        STATUALIZA: caixaListaAtualiza,
        STLIMPAR: caixaListaLimpar
      };

      const response = await put('/atualiza-empresa-diario/:id', postData)
      const responseSTCaixa = await put('/atualizar-todos-caixa', postDataSTCaixa)
      console.log('responseSTCaixa', responseSTCaixa.data)
      console.log(postDataSTCaixa, 'postDataSTCaixa')
      const textDados = JSON.stringify(postData);
      let textFuncao = 'INFORMATICA/EDIÇÃO DE ATUALIZAÇÃO DIÁRIA DOS PDVs DA EMPRESA';
      
      const postDataEditarCaixa = {

        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
      const responseEditarCaixa = await post('/log-web', postDataEditarCaixa)
  
       
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Relatório atualizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3500
      })
      // handleClose()

      return responseEditarCaixa.data;
    } catch (error) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao atualizar Relatório!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000
      });
      console.log(error);
    }
  }

  
  return (
    <Fragment>
    
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Dados de Empresa"}
          subTitle={"Atualização Diária dos PDVs da Empresa"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    value={empresa}
                    onChangeModal={(e) => setEmpresa(e.target.value)}
                    label="Empresa"
                  />
                </div>
                <div className="col-sm-6 col-xl-3">
                  <label className="form-label" htmlFor="statualizadiario">Atualizar Status Loja</label>
                  <Select
                    className="basic-single"
                    classNamePrefix={"select"}
                    options={status}
                    Value={status.find(item => item.value === statusAtualizado)}
                    onChange={(e) => setStatusAtualizado(e.value)}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-sm-6 col-xl-3">
                  <label className="form-label" htmlFor="statualizadiario">Atualizar PDVs Diário</label>
                  <Select
                    className="basic-single"
                    classNamePrefix={"select"}
                    options={atualizacaoDiario}
                    defaultValue={atualizacaoDiario.find(item => item.value === atualizacao)}
                    onChange={(e) => setAtualizacao(e.value)}
                  />
                </div>
                <div className="col-sm-6 col-xl-2">
                  <InputFieldModal
                    type="time"
                    className="form-control input"
                    readOnly={false}
                    value={horaAtualizado}
                    onChangeModal={(e) => setHoraAtualizado(e.target.value)}
                    label="Horário"
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="panel" style={{ marginTop: "4rem", marginBottom: "1rem" }}>
            <div className="panel-hdr">
              <h2> Caixas </h2>
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
                value={dados}
                globalFilter={globalFilterValue}
                size="small"
                sortOrder={-1}
                rows={true}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                filterDisplay="menu"
                showGridlines
                stripedRows
              >
                {colunasCaixa.map(coluna => (
                  <Column
                    key={coluna.field}
                    field={coluna.field}
                    header={coluna.header}
                    body={coluna.body}
                    footer={coluna.footer}
                    sortable={coluna.sortable}
                    headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
                    footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                    bodyStyle={{ fontSize: '0.8rem', border: '1px solid #e9e9e9' }}
                  />
                ))}
              </DataTable>

            </div>
          </div>


        </Modal.Body>
        <FooterModal
          ButtonTypeCadastrar={ButtonTypeModal}
          textButtonCadastrar={"Atualizar"}
          onClickButtonCadastrar={onSubmit}
          corCadastrar="success"

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"

        />
      </Modal>
    </Fragment>
  )
}                      
