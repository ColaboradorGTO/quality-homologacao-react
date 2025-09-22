import axios from "axios";
import { put, post } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export const useEditarDespesa = (usuarioLogado,  optionsModulos) => {
  const [ipUsuario, setIpUsuario] = useState('');

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/');
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  };

 
  const onSubmit = async (row, status) => {
    if (optionsModulos[0]?.ALTERAR !== 'True') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        text: 'Você não tem permissão para alterar esta despesa.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }
    

    const postData = {
      IDDESPESASLOJA: row.IDDESPESASLOJA,
      STCANCELADO: status ? 'True' : 'False'
    };

    try {
      await put('/editar-status-despesa/:id', postData);
      Swal.fire({
        title: 'Sucesso',
        text: 'Despesa alterada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      const textDados = JSON.stringify(postData);
      const textoFuncao = 'FINANCEIRO/ATUALIZAÇÃO DE ESTATUS DA DESPESA';

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };

      await post('/log-web', createData);
    } catch (error) {
      const textDados = JSON.stringify(postData);
      const textoFuncao = 'FINANCEIRO/ERRO AO ATUALIZAR ESTATUS DA DESPESA';

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };

      await post('/log-web', createData);

      Swal.fire({
        title: 'Erro',
        text: 'Erro ao Tentar Editar Despesa',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
    }
  };

  return { onSubmit };
};
