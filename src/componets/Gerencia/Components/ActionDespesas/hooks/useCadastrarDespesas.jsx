import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";
import { getDataHoraAtual, getHoraAtual } from "../../../../../utils/dataAtual";
import { useNavigate } from "react-router-dom";

export const useCadastrarDespesas = ({ handleClose, optionsModulos, usuarioLogado }) => {
  const [dsHistorio, setDSHistorio] = useState('');
  const [dsPagoA, setDsPagoA] = useState('');
  const [vrDespesa, setVrDespesa] = useState('');
  const [hora, setHora] = useState('');
  const [dtDespesa, setDtDespesa] = useState('');
  const [despesaSelecionada, setDespesaSelecionada] = useState('')
  const [tpNota, setTpNota] = useState('');
  const [nuNotaFiscal, setNuNotaFiscal] = useState('');
  const [categoriaRecDesp, setCategoriaRecDesp] = useState('')
  const [ipUsuario, setIpUsuario] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const horaAtual = getHoraAtual()
    const dataAtual = getDataHoraAtual()
    setHora(horaAtual)
    setDtDespesa(dataAtual)
  }, [])

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


  const { data: dadosReceitaDespesa = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
    'categoria-receita-despesa',
    async () => {
      const response = await get(`/categoria-receita-despesa`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const onSubmit = async (data) => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro',
        text: 'Você não tem permissão para cadastrar despesas.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (despesaSelecionada && dsHistorio && dsPagoA && tpNota && nuNotaFiscal && vrDespesa) {
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

    const postData = {
      IDEMPRESA: usuarioLogado.IDEMPRESA,
      IDUSR: usuarioLogado.id,
      DTDESPESA: dtDespesa,
      IDCATEGORIARECEITADESPESA: despesaSelecionada?.value,
      DSHISTORIO: dsHistorio,
      DSPAGOA: dsPagoA,
      TPNOTA: tpNota?.value,
      NUNOTAFISCAL: nuNotaFiscal,
      VRDESPESA: vrDespesa,
      STATIVO: 'True',
      STCANCELADO: 'False',

    }

    try {
      const response = await post('/cadastrar-despesa-loja', postData)
      Swal.fire({
        title: 'Cadastro',
        text: 'Despesa cadastrado com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      setDtDespesa('')
      setCategoriaRecDesp('')
      setDSHistorio('')
      setDsPagoA('')
      setTpNota('')
      setNuNotaFiscal('')
      setVrDespesa('')

      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/CADASTRO DE DESPESA';


      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)


      return responsePost.data;
    } catch (error) {

      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/CADASTRO DE DESPESA';


      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)


      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Cadastrar Despesa',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return responsePost.data;
    }
  }


  const Options = [
    { id: 0, value: "Selecione", label: "Selecione" },
    { id: 1, value: "NFCe", label: "NFCe" },
    { id: 2, value: "NFe", label: "NFe" },
  ]

  return {
    onSubmit,
    dadosReceitaDespesa,
    errorEmpresas,
    isLoadingEmpresas,
    refetch,
    despesaSelecionada,
    setDespesaSelecionada,
    dsHistorio,
    setDSHistorio,
    dsPagoA,
    setDsPagoA,
    vrDespesa,
    setVrDespesa,
    dtDespesa,
    setDtDespesa,
    categoriaRecDesp,
    setCategoriaRecDesp,
    tpNota,
    setTpNota,
    nuNotaFiscal,
    setNuNotaFiscal,
    Options,
    dadosReceitaDespesa
  }
}