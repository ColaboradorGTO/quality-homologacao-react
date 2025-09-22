import { useState, useEffect } from "react";
import { post, put } from "../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'


export const useEditarTecido = ({dadosDetalheTipoTecido}) => {
    const [descricao, setDescricao] = useState('')
    const [statusSelecionado, setStatusSelecionado] = useState([])
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
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
      if(response.data) {
        setIpUsuario(response.data.ip);
      }
      return response.data;
    }
  
    useEffect(() => {
      if (dadosDetalheTipoTecido.length) {
        setStatusSelecionado({ value: dadosDetalheTipoTecido[0]?.STATIVO, label: dadosDetalheTipoTecido[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
        setDescricao(dadosDetalheTipoTecido[0]?.DSTIPOTECIDO)
      }
    }, [])

    const optionsStatus = [
      { value: 'True', label: 'ATIVO' },
      { value: 'False', label: 'INATIVO' }
    ]

    const onSubmit = async () => {
      const postData = {
        IDTPTECIDO: dadosDetalheTipoTecido[0]?.IDTPTECIDO,
        DSTIPOTECIDO: descricao,
        STATIVO: statusSelecionado.value,
      }
      try {
  
        const response = await put('/tipo-tecido/:id', postData)
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Atualizado com sucesso!',
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        });
        const textDados = JSON.stringify(postData);
        let textoFuncao = 'COMPRAS/CADASTRO DE TIPOS DE TECIDOS';
  
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
          position: 'center',
          icon: 'error',
          text: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          }
        });
        console.error(error);
      }
    }
  

    return {
        descricao,
        setDescricao,
        statusSelecionado,
        setStatusSelecionado,
        usuarioLogado,
        ipUsuario,
        navigate,
        getIPUsuario,
        optionsStatus,
        onSubmit,
    }
}