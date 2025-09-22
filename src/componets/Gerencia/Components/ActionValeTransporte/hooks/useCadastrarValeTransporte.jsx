import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import axios from "axios";
import { useQuery } from "react-query";
import { getHoraAtual } from "../../../../../utils/dataAtual";
import { useEffect, useState } from "react";

export const useCadastrarValeTransporte = ({ handleClose, usuarioLogado, optionsModulos }) => {
  const [dsHistorio, setDSHistorio] = useState('');
  const [dsPagoA, setDsPagoA] = useState('');
  const [vrDespesa, setVrDespesa] = useState('');
  const [horarioAtual, setHorarioAtual] = useState('');
  const [dtDespesa, setDtDespesa] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState()
  const [ipUsuario, setIpUsuario] = useState('')

  useEffect(() => {
    const hora = getHoraAtual()
    setHorarioAtual(hora)
  }, [])
  
  const { data: dadosFuncionarios = [], error: errorGrupo, isLoading: isLoadingGrupo } = useQuery(
    'todos-funcionario',
    async () => {
      const response = await get(`/todos-funcionario?idEmpresa=${usuarioLogado.IDEMPRESA}`);
      console.log('response', response.data)
      return response.data;
    },
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 10 * 60 * 1000 }
  );

  useEffect(() => {
    getIPUsuario();
  }, []);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }

  const onSubmit = async (data) => {
    if(optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Você não tem permissão para cadastrar!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000,
      })
      return;
    }
    const postData = {
      IDEMPRESA: usuarioLogado.IDEMPRESA,
      IDUSR: usuarioLogado.id,
      DTDESPESA: dtDespesa,
      IDCATEGORIARECEITADESPESA: 248,
      DSHISTORIO: dsHistorio,
      DSPAGOA: '',
      IDFUNCIONARIO: usuarioSelecionado,
      TPNOTA: '',
      NUNOTAFISCAL: '',
      VRDESPESA: vrDespesa,
      STATIVO: 'True',
      STCANCELADO: 'False'

    }

    try {

      const response = await post('/cadastrar-despesa-loja', postData)


      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/CADASTRO DE VALE TRANSPORTE';


      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Cadastro Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      return responsePost.data;
    } catch (error) {
      let textoFuncao = 'GERENCIA/CADASTRO DE VALE TRANSPORTE';


      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Cadastrar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      console.error('Erro ao parsear o usuário do localStorage:', error);
      responsePost.data;
    }

  }

  return {
    onSubmit,
    handleClose,
    dsHistorio,
    setDSHistorio,
    dsPagoA,
    setDsPagoA,
    vrDespesa,
    setVrDespesa,
    horarioAtual,
    dtDespesa,
    setDtDespesa,
    usuarioSelecionado,
    usuarioLogado,
    setUsuarioSelecionado,
    dadosFuncionarios
  }
}