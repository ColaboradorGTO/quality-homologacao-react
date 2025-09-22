import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { post, put } from "../../../../api/funcRequest";

export const useReceberMalote = ({salvarDadosMalotes}) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
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


  const onSalvarMalote = async () => {


    if(!usuarioLogado?.id || !salvarDadosMalotes[0]?.IDEMPRESA) {
  
        Swal.fire({
          title: 'Erro!',
          text: `Erro ao tentar recuperar os dados da Sessão do Usuário ${usuarioLogado?.NOFUNCIONARIO}, faça o logoff e entre novamente no sistema!`,
          icon: 'error',
          customClass: {
            container: 'custom-swal',
          },
        });
        return;
      
    }

    const putData = [{
      IDMALOTE: salvarDadosMalotes?.IDMALOTE,
      STATUS: 'Recepcionado',
      IDUSERULTIMAALTERACAO: usuarioLogado?.id
    }];
    
  
    Swal.fire({
      icon: 'question',
      text: `${usuarioLogado?.NOFUNCIONARIO} \n Deseja realmente confirmar a RECEPÇÃO do Malote?`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#7352A5',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      customClass: {
        container: 'custom-swal',
      },

    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
          const response = await put(`/malotes-por-loja/${salvarDadosMalotes?.IDMALOTE}`, putData);
 
          if(response.data?.status == 'success') {

            const textDados = JSON.stringify(putData);
            let textoFuncao = 'RECEPÇÃO DE MALOTE / RECEBIMENTO DE MALOTE';
  
            const createData = {
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO: textoFuncao,
              DADOS: textDados,
              IP: ipUsuario,
            };
  
            await post('/log-web', createData);
  
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: `${usuarioLogado?.NOFUNCIONARIO} \n Malote Recebido com Sucesso!`,
              customClass: {
                container: 'custom-swal',
              },
            });

          } else {
              throw new Error((response.data?.message || 'Resposta inesperada da API'));
          }
        } catch (error) {

          // const textDados = JSON.stringify(putData);
          let textoFuncao = 'RECEPÇÃO DE MALOTE / ERRO AO RECEBER MALOTE';

          const createData = {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: textoFuncao,
            DADOS: '',
            IP: ipUsuario,
          };

          const responsePost = await post('/log-web', createData);

         
        }
      }
    });
  };

  return {
    usuarioLogado,
    setUsuarioLogado,
    onSalvarMalote,
  };
};