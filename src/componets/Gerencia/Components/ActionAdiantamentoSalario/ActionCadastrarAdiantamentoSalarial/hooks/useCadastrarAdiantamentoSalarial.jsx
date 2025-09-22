import axios from "axios";
import { useEffect, useState } from "react";
import { get, post } from "../../../../../../api/funcRequest";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getDataAtual } from "../../../../../../utils/dataAtual";

export const useCadastrarAdiantamentoSalarial = ({handleClose, optionsModulos, usuarioLogado}) => {
  const [textoMotivo, setTextoMotivo] = useState('')
  const [valorDesconto, setValorDesconto] = useState(0)
  const [status, setStatus] = useState('')
  const [usuarioSelecionado, setUsuarioSelecionado] = useState()
  const [dataLancamento, setDataLancamento] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const data = getDataAtual()
    setDataLancamento(data);
    getIPUsuario();
  }, []);


  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }



  const { data: dadosFuncionarios = [], error: errorFuncionario, isLoading: isLoadingFuncionario } = useQuery(
    'todos-funcionario',
    async () => {
      const response = await get(`/todos-funcionario?idEmpresa=${usuarioLogado.IDEMPRESA}`);
      console.log('response', response.data)
      return response.data;
    },
    {enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 10 * 60 * 1000 }
  );

  const onSubmit = async (data) => {
    if(optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Você não tem permissão para cadastrar adiantamento salarial',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    const postData = {
      IDEMPRESA: usuarioLogado.IDEMPRESA,
      IDFUNCIONARIO: usuarioSelecionado,
      DTLANCAMENTO: dataLancamento,
      TXTMOTIVO: textoMotivo,
      VRVALORDESCONTO: valorDesconto,
      STATIVO: status,
      IDUSR: usuarioLogado.id,

    }

    try {
      const response = await post('/adiantamento-salarial', postData)

      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/CADASTRO DE ADIANTAMENTO SALARIAL';

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)
      
      Swal.fire({
        title: 'Cadastro',
        text: 'Adiantamento Salarial Cadastrado com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      
      setTextoMotivo('');
      setValorDesconto('');
      setStatus('');
      
      handleClose();
    
      
      return responsePost.data;
    } catch (error) {
      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/ERRO AO CADASTRAR ADIANTAMENTO SALARIAL';

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Erro',
        text: 'Erro ao Tentar Cadastrar Adiantamento Salarial',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      return responsePost.data;
    }

  }

  const handleChangeUsuario = (e) => {
    setUsuarioSelecionado(e.value);
  }


  return {
    textoMotivo,
    setTextoMotivo,
    valorDesconto,
    setValorDesconto,
    status,
    setStatus,
    dataLancamento,
    setDataLancamento,
    usuarioSelecionado,
    setUsuarioSelecionado,
    usuarioLogado,
    setUsuarioLogado,
    dadosFuncionarios,
    onSubmit
  }
}