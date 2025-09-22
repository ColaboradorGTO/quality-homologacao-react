import { useEffect, useState } from "react"
import { post, put } from "../../../api/funcRequest"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2'


export const useEditarCategoriaPedido = ({dadosDetalheCategoriaPedido}) => {
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tipoCategoriaSelecionado, setTipoCategoriaSelecionado] = useState('')
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

    
    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]

    const optionsTipoCategoria = [
        { value: 'VESTUARIO', label: 'VESTUARIO' },
        { value: 'CALCADOS', label: 'CALCADOS' },
        { value: 'ARTIGOS', label: 'ARTIGOS' },
    ]

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
        setStatusSelecionado({value: dadosDetalheCategoriaPedido[0]?.STATIVO, label: dadosDetalheCategoriaPedido[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'})
        setDescricao(dadosDetalheCategoriaPedido[0].DSCATEGORIAPEDIDO)
        setTipoCategoriaSelecionado({value: dadosDetalheCategoriaPedido[0]?.TIPOPEDIDO , label: dadosDetalheCategoriaPedido[0]?.TIPOPEDIDO})
    }, [dadosDetalheCategoriaPedido])

    const handleEditar = async () => {
        if (descricao == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const postData = [{
            IDCATEGORIAPEDIDO: dadosDetalheCategoriaPedido[0].IDCATEGORIAPEDIDO,
            DSCATEGORIAPEDIDO: descricao,
            TIPOPEDIDO: tipoCategoriaSelecionado.value,
            STATIVO: statusSelecionado.value,
        }]
        try {

            const response = await put('/categoriaPedidos/:id', postData)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/CADASTRO DE CATEGORIA DE PEDIDO';

            const createtLog = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responseLog = await post('/log-web', createtLog)


            return responseLog.data;
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao criar categoria pedido:', error);
        }
    }

    return {
        optionsStatus,
        optionsTipoCategoria,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        tipoCategoriaSelecionado,
        setTipoCategoriaSelecionado,
        handleEditar
    }
}