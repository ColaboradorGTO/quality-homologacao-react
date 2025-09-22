import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDataAtual, getDataHoraAtual } from "../../../../../utils/dataAtual";

export const useCadastroDeposito = ({ handleClose, optionsModulos, usuarioLogado }) => {

  const [dsHistorio, setDSHistorio] = useState('');
  const [numeroDocDeposito, setNumeroDocDeposito] = useState('');
  const [valorDeposito, setValorDeposito] = useState(0);
  const [contaBancoSelecionada, setContaBancoSelecionada] = useState('');
  const [horarioAtual, setHorarioAtual] = useState('');
  const [dataMovCaixa, setDataMovCaixa] = useState('');
  const [empresa, setEmpresa] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();


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


  useEffect(() => {
    const dataAtual = getDataAtual()
    const horaAtual = getDataHoraAtual()
    setData(dataAtual)
    setHora(horaAtual)

  }, []);

  
  const { data: dadosContaBanco = [], error: errorContaBanco, isLoading: isLoadingContaBanco } = useQuery(
    'contaBanco',
    async () => {
      const response = await get(`/contaBanco`);
      return response.data;
    },
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const onSubmit = async (data) => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro',
        text: 'Você não tem permissão para cadastrar depósitos.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (contaBancoSelecionada && dsHistorio && numeroDocDeposito && valorDeposito && dataMovCaixa && horarioAtual) {
      Swal.fire({
        title: 'Erro',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (contaBancoSelecionada == '0') {
      Swal.fire({
        title: 'Erro',
        text: ' Informe a Conta do Depósito.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (numeroDocDeposito == '0') {
      Swal.fire({
        title: 'Erro',
        text: 'Informe o Nº Doc do Depósito.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (valorDeposito == '' || valorDeposito == '0') {
      Swal.fire({
        title: 'Erro',
        text: 'Informe o Valor do Depósito.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (dataMovCaixa == '') {
      Swal.fire({
        title: 'Erro',
        text: 'Informe a Data do Movimento do Caixa.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (horarioAtual == '') {
      Swal.fire({
        title: 'Erro',
        text: 'Informe a Hora do Movimento do Caixa.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    const putData = {
      IDEMPRESA: usuarioLogado.IDEMPRESA,
      IDUSR: usuarioLogado.id,
      IDCONTABANCO: contaBancoSelecionada,
      DTDEPOSITO: dataMovCaixa,
      DTMOVIMENTOCAIXA: hora,
      DSHISTORIO: dsHistorio,
      NUDOCDEPOSITO: numeroDocDeposito,
      VRDEPOSITO: valorDeposito,

      STATIVO: 'True',
      STCANCELADO: 'False',
    }

    try {

      const response = await post('/cadastrar-deposito-loja', putData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Depósito cadastrado com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      setDSHistorio('');
      setNumeroDocDeposito('');
      setValorDeposito(0);
      setContaBancoSelecionada(null);
      setHorarioAtual('');
      setDataMovCaixa('');


      const textDados = JSON.stringify(putData)
      let textoFuncao = 'GERENCIA/CADASTRO DEPOSITO ';

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
      
      const responsePost = await post('/log-web', postData)

      handleClose();


      return responsePost.data;
    } catch (error) {
      const textDados = JSON.stringify(putData)
      let textoFuncao = 'GERENCIA/ERRO AO CADASTRAR DEPOSITO ';

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
      
      const responsePost = await post('/log-web', postData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Cadastrar Depósito',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      return responsePost.data;
    }
  }

  return {
    dsHistorio,
    setDSHistorio,
    numeroDocDeposito,
    setNumeroDocDeposito,
    valorDeposito,
    setValorDeposito,
    contaBancoSelecionada,
    setContaBancoSelecionada,
    horarioAtual,
    setHorarioAtual,
    hora,
    setHora,
    data,
    setData,
    dataMovCaixa,
    setDataMovCaixa,
    dadosContaBanco,
    onSubmit,
  }

}