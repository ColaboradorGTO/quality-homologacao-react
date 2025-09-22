import React, { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineDoubleLeft, AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { MdAdd } from "react-icons/md";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionListaVendaCLiente } from "./actionListaVendaCliente";
import { ActionCadastroClienteVoucherCPF } from "./ActionCadastroCliente/ActionCadastroCPF/actionCadastroClienteVoucheCPF";
import { ActionCadastroClienteVoucherCNPJ } from "./ActionCadastroCliente/ActionCadastroCNPJ/actionCadastroClienteVoucheCNPJ";
import Swal from "sweetalert2";

export const ActionPesquisaCreateVoucherCliente = ({
  actionSecundaria,
  setActionSecundaria,
  actionPrincipal,
  setActionPrincipal,
  usuarioLogado,
  optionsModulos
}) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaVisivelVoucherSelecionados, setTabelaVisivelVoucherSelecionados] = useState(false);
  const [tabelaVendasClientes, setTabelaVendasClientes] = useState(false);
  const [modalCadastroClienteCPF, setModalCadastroClienteCPF] = useState(false);
  const [modalCadastroClienteCNPJ, setModalCadastroClienteCNPJ] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [cpf, setCPF] = useState('');
  const [serie, setSerie] = useState('');
  const [numeroNF, setNumeroNF] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const navigate = useNavigate();


  useEffect(() => {
    const dataInicio = getDataAtual()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicio)
    setDataPesquisaFim(dataFim)

  }, []);

  useEffect(() => {
  
  }, [usuarioLogado]);


  const fetchListaEmpresasVouchers = async () => {
    try {
      const urlApi = `/empresasVoucher?idSubGrupoEmpresa=${usuarioLogado.IDGRUPOEMPRESARIAL}&idEmpresa=${usuarioLogado.IDEMPRESA}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
  
        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }
  
        await fetchNextPage(currentPage);
        return allData;
      } else {
       
        return response.data;
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
   
  const { data: dadosEmpresasVoucher = [], refetch: refetchListaEmpresaVouchers } = useQuery(
    ['empresasVoucher', usuarioLogado?.IDEMPRESA, usuarioLogado?.IDGRUPOEMPRESARIAL, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaEmpresasVouchers(usuarioLogado?.IDEMPRESA, usuarioLogado?.IDGRUPOEMPRESARIAL, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: false, 
    }
  );

  useEffect(() => {
    refetchListaEmpresaVouchers();
  }, [usuarioLogado, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize]);
  const fetchListaVendasClientes = async () => {
    try {
      const urlApi = `/lista-venda-cliente?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
  
        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }
  
        await fetchNextPage(currentPage);
        return allData;
      } else {
       
        return response.data;
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
   
  const { data: dadosVendasClientes = [], error: errorVendasClientes, isLoading: isLoadingVendas, refetch: refetchListaVendasClientes } = useQuery(
    ['lista-venda-cliente', usuarioLogado?.IDEMPRESA, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaVendasClientes(usuarioLogado?.IDEMPRESA,  dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: false, 
    }
  );

  const handleSelectEmpresa = (e) => {
    setEmpresaSelecionada(e.value);
  }


  const handleOpenModalCPF = () => {
    setModalCadastroClienteCPF(true);
    setModalCadastroClienteCNPJ(false);
  };
  
  const handleOpenModalCNPJ = () => {
    setModalCadastroClienteCNPJ(true);
    setModalCadastroClienteCPF(false);
  };

  
  const handleClickModalCPFCNPJ = () => {
    Swal.fire({
      title: 'Qual o tipo de Cliente?',
      text: 'Clique na opção desejada!',
      showCancelButton: true,
      confirmButtonText: 'CPF',
      cancelButtonText: 'CNPJ',
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#7A5FA3',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleOpenModalCPF(); 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        handleOpenModalCNPJ();
      }
    });
  };  


  const handleClick = () => {
    
    setCurrentPage(+1);
    // refetchListaVouchers()
    setTabelaVisivel(true);
    setTabelaVendasClientes(false);
    setTabelaVisivelVoucherSelecionados(false);
    setActionPrincipal(true);
    setActionSecundaria(false);
   
  }


  const handleClickClientes = () => {
    setTabelaVendasClientes(true);
    setTabelaVisivel(false);
    setTabelaVisivelVoucherSelecionados(false);
    refetchListaVendasClientes()
  }



  return (

    <Fragment>
      

        <div className="">
            <div className="header">
              <h1 className="title">Vouchers</h1>
            </div>
            <ActionMain
              linkComponentAnterior={["Home"]}
              linkComponent={["Vendas"]}
              title="Vendas "
              subTitle="Relação de Vendas para Troca"

              // buttonHeader={ButtonType}
              // onClickButtonTypeHeader={handleClick}
              // textButtonHeader={"Voltar"}
              // disabledBTNHeader={false}
              // iconSizeHeader={20}
              // iconHeader={AiOutlineSearch}
              // corHeader={"primary"}
    
    
              InputFieldDTInicioComponent={InputField}
              labelInputFieldDTInicio={"Data Venda Início"}
              valueInputFieldDTInicio={dataPesquisaInicio}
              onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}
    
              InputFieldDTFimComponent={InputField}
              labelInputFieldDTFim={"Data Venda Fim"}
              valueInputFieldDTFim={dataPesquisaFim}
              onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}
    
              InputSelectEmpresaComponent={InputSelectAction}
              labelSelectEmpresa={"Empresa"}
              optionsEmpresas={dadosEmpresasVoucher.map((empresa) => ({
                value: empresa.IDEMPRESA,
                label: empresa.NOFANTASIA,
              }))}
              valueSelectEmpresa={empresaSelecionada}
              onChangeSelectEmpresa={handleSelectEmpresa}
    
              InputFieldCodBarraComponent={InputField}
              valueInputFieldCodBarra={cpf}
              onChangeInputFieldNumeroVoucher={(e) => setCPF(e.target.value)}
              labelInputFieldCodBarra={"Nº Venda ou CPF/CNPJ"}
              placeHolderInputFieldCodBarra={"Digite o Nº da Venda ou CPF/CNPJ"}
    
              InputFieldComponent={InputField}
              labelInputField={"Serie"}
              valueInputField={serie}
              onChangeInputField={(e) => setSerie(e.target.value)}
              placeHolderInputFieldComponent={"Digite a Série"}
    
              InputFieldNumeroNFComponent={InputField}
              labelInputFieldNumeroNF={"Nº NFCE"}
              valueInputFieldNumeroNF={numeroNF}
              onChangeInputFieldNumeroNF={(e) => setNumeroNF(e.target.value)}
              placeHolderInputFieldNumeroNF={"Digite o Nº da NFCE"}
    
              ButtonSearchComponent={ButtonType}
              linkNomeSearch={"Pesquisar"}
              onButtonClickSearch={handleClickClientes}
              corSearch={"primary"}
              IconSearch={AiOutlineSearch}
    
              ButtonTypeCadastro={ButtonType}
              linkNome={"Cadastro Cliente"}
              onButtonClickCadastro={handleClickModalCPFCNPJ}
              corCadastro={"success"}
    
              ButtonTypeCancelar={ButtonType}
              linkCancelar={"Voltar"}
              onButtonClickCancelar={handleClick}
              corCancelar={"danger"}
              IconCancelar={AiOutlineDoubleLeft}
    
              ButtonTypeVendasEstrutura={ButtonType}
              linkNomeVendasEstrutura={"Adicionar Voucher"}
              onButtonClickVendasEstrutura={handleClick}
              corVendasEstrutura={"info"}
              iconVendasEstrutura={MdAdd}
    
            />
        </div>


      <ActionCadastroClienteVoucherCPF
        show={modalCadastroClienteCPF}
        handleClose={() => setModalCadastroClienteCPF(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />

      <ActionCadastroClienteVoucherCNPJ
        show={modalCadastroClienteCNPJ}
        handleClose={() => setModalCadastroClienteCNPJ(false)}
      /> 

      {tabelaVendasClientes && (

        <ActionListaVendaCLiente dadosVendasClientes={dadosVendasClientes} />
      )}

    </Fragment>
  )
}
// 552