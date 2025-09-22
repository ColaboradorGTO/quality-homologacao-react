import Swal from "sweetalert2"
import { post, put } from "../../../../../api/funcRequest"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const useEditarFatura = ({ dadosDetalheFatura, usuarioLogado, optionsModulos }) => {
    const [empresa, setEmpresa] = useState('')
    const [codAutorizacao, setCodAutorizacao] = useState('')
    const [valorFatura, setValorFatura] = useState(0)
    const [valorFaturaAntigo, setValorFaturaAntigo] = useState(0)
    const [numeroMovimento, setNumeroMovimento] = useState('')
    const [ipUsuario, setIpUsuario] = useState('')


    useEffect(() => {
        getIPUsuario();
    }, [usuarioLogado]);

    const getIPUsuario = async () => {
        const response = await axios.get('http://ipwho.is/')
        if(response.data) {
            setIpUsuario(response.data.ip);
        }
        return response.data;
    }

    useEffect(() => {
        if(dadosDetalheFatura && dadosDetalheFatura[0]?.NUCODAUTORIZACAO) {
            setCodAutorizacao(dadosDetalheFatura[0]?.NUCODAUTORIZACAO)
        
        }
    }, [dadosDetalheFatura])

    useEffect(() => {
        if(dadosDetalheFatura && dadosDetalheFatura[0]?.VRRECEBIDO) {
            setValorFatura(dadosDetalheFatura[0]?.VRRECEBIDO)
        }
    }, [dadosDetalheFatura])

    useEffect(() => {
        if(dadosDetalheFatura && dadosDetalheFatura[0]?.NUCODAUTORIZACAO) {
            setCodAutorizacao(dadosDetalheFatura[0]?.NUCODAUTORIZACAO)
        }
    }, [dadosDetalheFatura])

  const onSubmit = async () => {
    if(optionsModulos[0]?.ALTERAR == 'False') {
        Swal.fire({
            title: 'Atenção',
            text: 'Você não tem permissão para alterar faturas',
            icon: 'warning',
            timer: 3000,
            customClass: {
             container: 'custom-swal',
            }
        });
        return;
    }
    
    const putData = {
      IDDETALHEFATURA: dadosDetalheFatura[0]?.IDDETALHEFATURA,
      NUCODAUTORIZACAO: codAutorizacao,
      VRRECEBIDO: valorFatura,
    }

    try {
      const response = await put('/fatura-loja-atualizar', putData);

      Swal.fire({
        title: 'Atualização',
        text: 'Atualização Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      const textDados = JSON.stringify(putData)
      let textoFuncao = 'GERENCIA/ATUALIZAR FATURA';
  
  
      const postData = {
        IDFUNCIONARIO: usuarioLogado.id,
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
  
      const responsePost = await post('/log-web', postData)
  
      
      return responsePost.data;
    } catch (error) {
      let textoFuncao = 'GERENCIA/ERRO AO ATUALIZAR FATURA';
  
  
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }
  
      const responsePost = await post('/log-web', postData)
  
      
      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Confimar Alteração',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      
      console.log(error);
      return responsePost.data;
    }
  }

  return {
    empresa,
    setEmpresa,
    codAutorizacao,
    setCodAutorizacao,
    valorFatura,
    setValorFatura,
    valorFaturaAntigo,
    setValorFaturaAntigo,
    numeroMovimento,
    setNumeroMovimento,
    onSubmit
  }
}