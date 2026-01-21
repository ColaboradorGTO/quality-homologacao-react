import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from 'axios';
import Swal from 'sweetalert2';
import { get, post, put } from "../../../../../api/funcRequest";

export const useAjusteDespesa = ({ dadosDespesasLojaDetalhe, usuarioLogado,  optionsModulos, }) => {
  const [horarioAtual, setHorarioAtual] = useState('');
  const [despesaSelecionada, setDespesaSelecionada] = useState(null);
  const [dsHistorio, setDsHistorio] = useState('');
  const [dsPagoA, setDsPagoA] = useState('');
  const [vrDespesa, setVrDespesa] = useState('');
  const [tpNota, setTpNota] = useState('');
  const [nuNotaFiscal, setNuNotaFiscal] = useState('');
  const [ipUsuario, setIpUsuario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
        const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
        usuarioIP = ipWhoisData?.ip;
    } catch (error) {
        console.error("Erro ao buscar IP via ipwho.is:", error);
    }

    if (!usuarioIP) {
        try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
        } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
        }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };

  const { data: dadosReceitaDespesa = [], error: errorDespesasLoja, isLoading: isLoadingDespesasLoja } = useQuery(
    'categoria-receita-despesa',
    async () => {
      const response = await get(`/categoria-receita-despesa`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );



  useEffect(() => {
    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setHorarioAtual(formattedTime);
  }, []);

  useEffect(() => {
    if (dadosDespesasLojaDetalhe) {
      setDespesaSelecionada({ value: dadosDespesasLojaDetalhe[0]?.IDCATEGORIARECEITADESPESA, label: `${dadosDespesasLojaDetalhe[0]?.DSCATEGORIARECDESP} `});
      setDsHistorio(dadosDespesasLojaDetalhe[0]?.DSHISTORICO);
      setDsPagoA(dadosDespesasLojaDetalhe[0]?.DSPAGOA);
      setTpNota({ value: dadosDespesasLojaDetalhe[0]?.TPNOTA, label: dadosDespesasLojaDetalhe[0]?.TPNOTA == 'NFCe' ? 'NFCe' : 'NFe' });
      setNuNotaFiscal(dadosDespesasLojaDetalhe[0]?.NUNOTAFISCAL);
      setVrDespesa(dadosDespesasLojaDetalhe[0]?.VRDESPESA);
    }
  }, [dadosDespesasLojaDetalhe]);

  const onSubmit = async (data) => {
    if (dsHistorio === '') {
      Swal.fire({
        title: 'Erro',
        text: 'Informe o Motivo para o Ajuste da Despesa.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }
    if (dsPagoA === '') {
      Swal.fire({
        title: 'Erro',
        text: 'Informe Para quem foi pago a Despesa.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    setIsSubmitting(true);

    const postData = {

      IDCATEGORIARECEITADESPESA: despesaSelecionada?.value,
      VRDESPESA: vrDespesa,
      DSPAGOA: dsPagoA,
      DSHISTORIO: dsHistorio,
      TPNOTA: tpNota?.value,
      NUNOTAFISCAL: nuNotaFiscal,
      IDUSRCACELAMENTO: usuarioLogado.id,
      DSMOTIVOCANCELAMENTO: ' Despesa Editada',
      IDDESPESASLOJA: dadosDespesasLojaDetalhe[0]?.IDDESPESASLOJA,

    }

    try {
      const response = await put('/editar-despesa/:id', postData)
      Swal.fire({
        title: 'Sucesso',
        text: 'Despesa alterada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })


      const textDados = JSON.stringify(postData)
      let textoFuncao = 'FINANCEIRO/ATUALIZAÇÃO DE DESPESA';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      handleClose();
      return responsePost.data;
    } catch (error) {
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao Tentar Editar Despesa',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChangeDespesa = (selectedOption) => {
    setDespesaSelecionada(selectedOption);
  };

  const handleChangeTpNota = (selectedOption) => {
    setTpNota(selectedOption);
  };
  const Options = [

    { id: 0, value: "NFCe", label: "NFCe" },
    { id: 1, value: "NFe", label: "NFe" },
  ]

  return {
    despesaSelecionada,
    dsHistorio,
    dsPagoA,
    vrDespesa,
    tpNota,
    nuNotaFiscal,
    usuarioLogado,
    ipUsuario,
    isSubmitting,
    horarioAtual,
    onSubmit,
    handleChangeDespesa,
    handleChangeTpNota,
    setVrDespesa,
    setDespesaSelecionada,
    setDsHistorio,
    setDsPagoA,
    setTpNota,
    Options,
    dadosReceitaDespesa
  }
}