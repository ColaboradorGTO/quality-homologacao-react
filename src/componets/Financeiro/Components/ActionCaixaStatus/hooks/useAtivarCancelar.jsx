import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios";

export const useAtivarCancelar = ({ usuarioLogado, handleClick, IDMOVIMENTO }) => {
    const [ipUsuario, setIpUsuario] = useState('');

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


    const handleCancelar = async (IDMOVIMENTO) => {
        try {
          
          const putData = {
            ID: IDMOVIMENTO
          }
    
          const response = await put('/fechar-caixas-zerados', putData)
    
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Caixa Fechado com sucesso!',
            showConfirmButton: false,
            timer: 15000
          })
    
          const textDados = JSON.stringify(putData)
          let textoFuncao = 'FINANCEIRO/FECHAMENTO DE CAIXAS ZERADOS';
    
          const postData = {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          }
          
    
          const responsePost = await post('/log-web', postData)
          
          return responsePost.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'FINANCEIRO/ERRO AO FAZER FECHAMENTO DE CAIXAS ZERADOS';
    
            const postData = {
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO: textoFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }
            
    
            const responsePost = await post('/log-web', postData)
    
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
              showConfirmButton: false,
              timer: 1500
            });
    
            console.error('Erro ao buscar detalhes da venda: ', error);
            return responsePost.data
        }
    
      }

    return { handleCancelar, ipUsuario };
}