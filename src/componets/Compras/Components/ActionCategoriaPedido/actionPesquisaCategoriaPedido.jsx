import { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { InputField } from "../../../Buttons/Input";
import { ActionMain } from "../../../Actions/actionMain";
import { get, post, put } from "../../../../api/funcRequest";
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaCategoriaPedidos } from "./actionListaCategoriaPedido";
import { ActionCadastroCategoriaPedidoModal } from "./ActionCadastrar/actionCadastroCategoriaPedidoModal";
import { ActionListaCategoriaTamanho } from "./actionListaCategoriaTamanho";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useFetchData } from "../../../../hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const ActionPesquisaCategoriaPedido = () => {
  const [descricao, setDescricao] = useState('');
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [tabelaTamanhoCategoria, setTabelaTamanhoCategoria] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);  
  const [pageSize, setPageSize] = useState(1000);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();

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
    if(response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }

  const { data: dadosTamanho = [], error: errorTamanhos, isLoading: isLoadingTamanhos } = useFetchData('tamanhosPedidos', '/tamanhosPedidos');

  const fetchListaCategoria = async () => {
    try {
      const urlApi = `/categoriaPedidos?idCategoriaPedido=${categoriaSelecionada}&descricao=${descricao}`;
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
    
  const { data: dadosCategoria = [], error: errorCategoria, isLoading: isLoadingCategoria, refetch: refetchListaCategoria } = useQuery(
    ['categoriaPedidos', categoriaSelecionada, descricao, currentPage, pageSize],
    () => fetchListaCategoria(categoriaSelecionada, descricao,  currentPage, pageSize),
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )
    
  const fetchListaCategoriaTamanhos = async () => {
    try {
      const urlApi = `/vinculo-tamanho-categoria?idCategoriaPedido=${categoriaSelecionada}&descricao=${descricao}&idTamanho=${tamanhoSelecionado}`;
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
    
  const { data: dadosCategoriaTamanhos = [], error: errorCategoriaTamanhos, isLoading: isLoadingCategoriaTamanhos, refetch: refetchListaCategoriaTamanhos } = useQuery(
    ['vinculo-tamanho-categoria', categoriaSelecionada, descricao, tamanhoSelecionado, currentPage, pageSize],
    () => fetchListaCategoriaTamanhos(categoriaSelecionada, descricao,  currentPage, tamanhoSelecionado, pageSize),
    { enabled: Boolean(descricao), staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  )
  

    const { data: dadosVinculados = [], error: errorCPF, isLoading: isLoadingCPF } = useQuery(
      ['vinculo-tamanho-categoria', categoriaSelecionada, descricao, tamanhoSelecionado],
      async () => {
        const response = await get(`/vinculo-tamanho-categoria?idCategoriaPedido=${categoriaSelecionada}&descricao=${descricao}&idTamanho=${tamanhoSelecionado}`);
        return response.data;
      },
      { enabled: Boolean(categoriaSelecionada, tamanhoSelecionado), staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000}
    );
  
  
    useEffect(() => {
      if (dadosVinculados[0]?.IDCATEGORIAPEDIDO == categoriaSelecionada && dadosVinculados[0]?.IDTAMANHO == tamanhoSelecionado) {
        Swal.fire({
          title: 'Categoria e Tamanho já Vinculados!',
          icon: 'warning',
          confirmButtonText: 'Ok',
          customClass: {
            container: 'custom-swal',
          }
        });
      }
    }, [dadosVinculados]);

  const handleChangeCategoria = (e) => {
    setCategoriaSelecionada(e.value)
  }

  const handleChangeTamanho = (e) => {
    setTamanhoSelecionado(e.value)
  }
  
  const handlePesquisar = () => {
    setCurrentPage(+1)
    refetchListaCategoria()
    setTabelaVisivel(true)
    setTabelaTamanhoCategoria(false)
  }

  const handlePesquisarTamanhoCategoria = () => {
    setCurrentPage(+1)
    refetchListaCategoriaTamanhos()
    setTabelaTamanhoCategoria(true)
    setTabelaVisivel(false)
  }

  const handleExcluir = async (IDCATPEDIDOTAMANHO ) => {
    if(categoriaSelecionada == '') {
      Swal.fire({
        type: 'warning',
        icon: 'warning',
        title: 'A Categoria deve ser Informada!',
        showConfirmButton: false,
        timer: 1500
      })
    } else if(tamanhoSelecionado == '') {
      Swal.fire({
        type: 'warning',
        icon: 'warning',
        title: 'O Tamanho deve ser Informado!',
        showConfirmButton: false,
        timer: 1500
      })
    }
      Swal.fire({
        title: `Certeza que Deseja Excluir o Vínculo da Categoria?`,
        text: 'Você não poderá reverter a ação!',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger',
          loader: 'custom-loader'
        },
        buttonsStyling: false
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const putData = {  
              IDCATPEDIDOTAMANHO: IDCATPEDIDOTAMANHO,
            }
            const response = await put(`/deletar-vinculo-tamanho-categoria?idCategoriaPedidoTamanho=${IDCATPEDIDOTAMANHO}`, putData)
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'COMPRAS/EXCLUSÃO VINCULO CATEGORIA-TAMANHO'
  
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }
    
            const responsePost = await post('/log-web', postData)
  
            return responsePost.data;
          } catch (error) {
            Swal.fire({
              title: 'Erro!',
              text: `Erro ao excluir o Vínculo da Categoria: ${error}`,
              icon: 'success'
            });
          }
        }
      })
  }

  const vincularCategoriaTamanho = () => {
    if(categoriaSelecionada == '') {
      Swal.fire({
        type: 'warning',
        icon: 'warning',
        title: 'A Categoria deve ser Informada!',
        showConfirmButton: false,
        timer: 1500
      })
    } else if(tamanhoSelecionado == '') {
      Swal.fire({
        type: 'warning',
        icon: 'warning',
        title: 'O Tamanho deve ser Informado!',
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      try {
        
      } catch (error) {
        console.log(error, "não foi possivel vincular os dados ")
      }
    }
  }
  const handleModal = () => {
    setModalVisivel(true)
  }

  const handleClose = () => {
    setModalVisivel(false)
  }

  return (

    <Fragment>

      <ActionMain
        title="Relatórios -  Categorias de Pedido"
        subTitle=""
        linkComponentAnterior={["Home"]}
        linkComponent={["Lista de Categorias de Pedido"]}


        InputFieldComponent={InputField}
        labelInputField={"Descrição"}
        valueInputField={descricao}
        onChangeInputField={(e) => setDescricao(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Por Tamanhos de Pedido"}
        optionsEmpresas={[
          { value: '', label: 'Selecione...' },
          ...dadosTamanho.map((item) => {
            return { value: item.IDTAMANHO, label: item.DSTAMANHO }
          })
        ]}
        valueSelectEmpresa={tamanhoSelecionado}
        onChangeSelectEmpresa={handleChangeTamanho}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Por Categorias de Pedido"}
        optionsGrupos={[
          { value: '', label: 'Selecione...' },
          ...dadosCategoria.map((item) => {
            return { 
              value: item.IDCATEGORIAPEDIDO, 
              label: `${item.TIPOPEDIDO} - ${item.DSCATEGORIAPEDIDO}` 
            }
          })
        ]}
        valueSelectGrupo={categoriaSelecionada}
        onChangeSelectGrupo={handleChangeCategoria}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Categorias de Pedido"}
        onButtonClickSearch={handlePesquisar}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastro de Categorias de Pedido"}
        onButtonClickCadastro={handleModal}
        corCadastro={"success"}
        IconCadastro={MdAdd}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={" Vinculo Categorias - Tamanho"}
        onButtonClickCancelar={handlePesquisarTamanhoCategoria}
        corCancelar={"danger"}
        IconCancelar={AiOutlineSearch}

        ButtonTypeVendasEstrutura={ButtonType}
        linkNomeVendasEstrutura={"Vincular Categoria / Tamanho "}
        onButtonClickVendasEstrutura={vincularCategoriaTamanho}
        corVendasEstrutura={"warning"}
        iconVendasEstrutura={AiOutlineSearch}


      />

      {tabelaVisivel && (
        <ActionListaCategoriaPedidos dadosCategoria={dadosCategoria} />
      )}

      {tabelaTamanhoCategoria && (
        <ActionListaCategoriaTamanho dadosCategoriaTamanhos={dadosCategoriaTamanhos} />
        
      )}

      <ActionCadastroCategoriaPedidoModal 
        show={modalVisivel} 
        handleClose={handleClose} 
      />
    </Fragment>
  )
}

