import { useState } from "react";
import Swal from "sweetalert2"
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";

export const useConferirMalote = ({
  salvarDadosMalotes, 
  checkedItems, 
  handleClick, 
  handleClose,
  optionsModulos, 
  usuarioLogado
}) => {
  const [observacaoFinanceiro, setObservacaoFinanceiro] = useState('');
  const [observacaoLoja, setObservacaoLoja] = useState('');
  const [ipUsuario, setIpUsuario] = useState('');

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
  
  const onSalvarMalote = async (status) => {
    if(optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para alterar o Malote!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    if(!usuarioLogado?.id || !salvarDadosMalotes[0]?.IDEMPRESA) {
      if (!salvarDadosMalotes[0]?.IDEMPRESA) {
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
    }

    if(salvarDadosMalotes[0]?.STATUSMALOTE == 'Devolvido' && !observacaoFinanceiro.length && !checkedItems.length) {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nPara devolver o malote é necessário selecionar as pendências e/ou informar a observação!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    const putData = {
      IDMALOTE: salvarDadosMalotes[0]?.IDMALOTE,
      STATUS: status,
      OBSERVACAOADMINISTRATIVO: observacaoFinanceiro,
      PENDENCIAS: checkedItems.map(id => ({ IDPENDENCIA: id })),
      IDUSERULTIMAALTERACAO: usuarioLogado?.id
    };
    
    Swal.fire({
      icon: 'question',
      title: `Deseja realmente enviar o Malote?`,
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
        // Abrir uma textarea para o usuário inserir a observação
        const { value: observacao } = await Swal.fire({
          title: 'Observação',

          showCancelButton: true,
          cancelButtonColor: '#FD1381',
          confirmButtonColor: '#7352A5',
          confirmButtonText: 'Salvar',
          cancelButtonText: 'Cancelar',
          customClass: {
            container: 'custom-swal',
          },
        });
        /* 
          nescessário voltar daqui e entender o
          por que deste campo OBSERVACAOLOJA está sendo enviar já que em homologacao não está sendo enviado assim como exemplo abaixo

          [
            {
                "IDMALOTE": 31,
                "STATUS": "Conferido",
                "OBSERVACAOADMINISTRATIVO": "TESTE MYLTIANE HML",
                "PENDENCIAS": [
                    {
                        "IDPENDENCIA": 6
                    },
                    {
                        "IDPENDENCIA": 7
                    }
                ],
                "IDUSERULTIMAALTERACAO": 30514
            }
          ]

          e assim está sendo enviado atualmente: no react
          {
    "IDMALOTE": 31,
    "STATUS": "Conferência",
    "OBSERVACAOADMINISTRATIVO": "myltiane teste ",
    "PENDENCIAS": [
        {
            "IDPENDENCIA": 6
        },
        {
            "IDPENDENCIA": 7
        }
    ],
    "IDUSERULTIMAALTERACAO": 30514,
    "OBSERVACAOLOJA": true
}
 este segundo aqui deu certo depois que no envio da api coloquei entre []
{
    "IDMALOTE": 31,
    "STATUS": "Conferência",
    "OBSERVACAOADMINISTRATIVO": "myltiane teste react",
    "PENDENCIAS": [
        {
            "IDPENDENCIA": 6
        },
        {
            "IDPENDENCIA": 7
        }
    ],
    "IDUSERULTIMAALTERACAO": 30514,
    "OBSERVACAOLOJA": true
}
        */
        
        if (observacao) {
          putData.OBSERVACAOLOJA = observacao; 
        
          try {
            const response = await put(`/malotes-loja/:id`, putData);
  
            const textDados = JSON.stringify(putData);
            let textoFuncao = 'FINANCEIRO / CONFERÊNCIA DE MALOTE';
            const ipUsuario = await getIPUsuario();
            const createData = {
              IDFUNCIONARIO: String(usuarioLogado.id),
              PATHFUNCAO: textoFuncao,
              DADOS: textDados,
              IP: ipUsuario,
            };
  
            await post('/log-web', createData);
  
            Swal.fire({
              title: 'Sucesso!',
              html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Malote Recebido com Sucesso!`,
              icon: 'success',
              customClass: {
                container: 'custom-swal',
              },
              timer: 5000,
            });
  
            handleClick();
            handleClose();
            return response.data;
          } catch (error) {

            const textDados = JSON.stringify(putData);
            let textoFuncao = 'FINANCEIRO / ERRO AO ENVIAR MALOTE';
            const ipUsuario = await getIPUsuario();
            const createData = {
              IDFUNCIONARIO: String(usuarioLogado.id),
              PATHFUNCAO: textoFuncao,
              DADOS: textDados,
              IP: ipUsuario,
            };
  
            const responsePost = await post('/log-web', createData);
  
            Swal.fire({
              title: 'Erro!',
              html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Erro ao Enviar Malote!`,
              icon: 'error',
              customClass: {
                container: 'custom-swal',
              },
            });


            return responsePost.data;
          }
        } else {
          Swal.fire({
            title: 'Erro!',
            html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Necessário preencher a Observação!`,
            icon: 'error',
            customClass: {
              container: 'custom-swal',
            },
          });
        }
      }
    });
  };

  return {
    usuarioLogado,
    observacaoFinanceiro,
    setObservacaoFinanceiro,
    observacaoLoja,
    setObservacaoLoja,
    onSalvarMalote,
  };
};