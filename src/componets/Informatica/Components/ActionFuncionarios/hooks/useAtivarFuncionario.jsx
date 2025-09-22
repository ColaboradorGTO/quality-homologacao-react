import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import { getDataAtual } from "../../../../../utils/dataAtual";
import axios from 'axios';


export const useAtivarFuncionario = ({ handleClose, optionsModulos, usuarioLogado }) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
 
  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataAdmissao(dataAtual)
  }, [])

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

   const handleAtivarFuncionario = async (row) => {
      if(optionsModulos[0]?.ALTERAR == 'False') {
        Swal.fire({
          title: 'Acesso Negado',
          text: 'Você não tem permissão para acessar esta funcionalidade.',
          icon: 'warning',
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        })
        return;
      }
      const putData = {
        DATAULTIMAALTERACAO: data,
        STATIVO: 'True',
        DATA_DEMISSAO: '',
        ID: row.ID
      }
      try {
        const response = await put('/inativar-funcionario', putData)
        
  
        Swal.fire({
          title: 'Atualização',
          text: 'Atualizção Realizada com Sucesso',
          icon: 'success',
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        })
  
        const textDados = JSON.stringify(putData)
        let status = putData.STATIVO;
        let textoFuncao;
        if(status === 'True'){
          textoFuncao = 'INFORMATICA/ATIVA DESLIGAMENTO DE FUNCIONARIO';
        } else {
          textoFuncao = 'INFORMATICA/DESLIGAMENTO DE FUNCIONARIO';
        }
    
        const createData = {
          IDFUNCIONARIO: usuarioLogado.id,
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario
        }
    
        const responsePost = await post('/log-web', createData)
    
        
        return responsePost.data;
      } catch (error) {
        Swal.fire({
          title: 'Erro ao Atualizar',
          text: 'Erro ao Tentar Atualizar',
          icon: 'error',
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        })
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    }
    

  return {
    handleAtivarFuncionario
  }
}

