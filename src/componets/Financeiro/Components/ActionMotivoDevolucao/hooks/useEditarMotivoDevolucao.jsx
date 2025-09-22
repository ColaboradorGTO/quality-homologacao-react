import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import Swal from "sweetalert2";

export const useEditarMotivoDevolucao = ({dadosDetalheMotivoDevolucao, optionsModulos}) => {
  const [statusSelecionado, setStatusSelecionado] = useState('')
  const [dataCriacao, setDataCriacao] = useState('')
  const [horaAlteracao, setHoraAlteracao] = useState('')
  const [idMotivo, setIdMotivo] = useState('')
  const [motivo, setMotivo] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }


  useEffect(() => {
    if (dadosDetalheMotivoDevolucao && dadosDetalheMotivoDevolucao.length > 0) {
      setDataCriacao(dadosDetalheMotivoDevolucao[0]?.DTCRIACAO);
      setHoraAlteracao(dadosDetalheMotivoDevolucao[0]?.DTULTALTERACAO);
      setStatusSelecionado({ value: dadosDetalheMotivoDevolucao[0]?.STATIVO, label: dadosDetalheMotivoDevolucao[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' });
      setIdMotivo(dadosDetalheMotivoDevolucao[0]?.IDMOTIVODEVOLUCAO);
      setMotivo(dadosDetalheMotivoDevolucao[0]?.DSMOTIVO);
    }
  }, []);



  const onSubmit = async () => {
    if (optionsModulos[0]?.ALTERAR !== 'True') {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Você não tem permissão para realizar esta ação.',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    setIsSubmitting(true);

    const putData = {
      DSMOTIVO: motivo,
      STATIVO: statusSelecionado?.value,
      IDUSUARIO: usuarioLogado.id,
      IDMOTIVODEVOLUCAO: dadosDetalheMotivoDevolucao[0]?.IDMOTIVODEVOLUCAO,
    }

    console.log("putData:", putData);
    try {

      const response = await put('/atualizar-motivo-devolucao', putData)

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Motivo de Devolução Atualizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000
      });

      const textDados = JSON.stringify(putData);
      let textoFuncao = `FINANCEIRO/EMPRESAS/MOTIVO DEVOLUÇÃO: ${dadosDetalheMotivoDevolucao[0]?.IDMOTIVODEVOLUCAO}`;


      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      handleClose();

      const responsePost = await post('/log-web', postData)

      return responsePost.data;
    } catch (error) {

      const textDados = JSON.stringify(putData);
      let textoFuncao = `FINANCEIRO/ERRO NA EDIÇÃO DO MOTIVO DE DEVOLUÇÃO`;


      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }


      const responsePost = await post('/log-web', postData)

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000
      });

      return responsePost.data;
    } finally {
      setIsSubmitting(false);
    }
  }


  const optionsStatus = [
    { value: 'True', label: 'ATIVO' },
    { value: 'False', label: 'INATIVO' },
  ]

  return {
    statusSelecionado,
    setStatusSelecionado,
    dataCriacao,
    setDataCriacao,
    horaAlteracao,
    setHoraAlteracao,
    idMotivo,
    setIdMotivo,
    motivo,
    setMotivo,
    onSubmit,
    optionsStatus

  }
}