import { useEffect, useState } from "react"
import { post, put } from "../../../api/funcRequest"
import { useFetchData } from "../../../hooks/useFetchData"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2'

export const useCadastroCores = () => {
    const [statusSelecionado, setStatusSelecionado] = useState("")
    const [grupoCorSelecionado, setGrupoCorSelecionado] = useState("")
    const [descricao, setDescricao] = useState("")
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

    const { data: dadosGrupoCores = [] } = useFetchData('grupoCores', '/grupoCores');
    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
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
    const cadastrarCores = async () => {
        if (descricao == '') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (grupoCorSelecionado == '') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'O campo Grupo Cor é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        
        const putData = [{
            IDGRUPOCOR: grupoCorSelecionado.value,
            DSCOR: descricao,
            STATIVO: statusSelecionado.value
        }]
        try {

            const response = await post('/cadastrar-cores', putData)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 30000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            const textDados = JSON.stringify(putData)
            let textFuncao = 'COMPRAS/CADASTRO DE CORES';

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
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 30000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao alterar a venda:', error);
        }
    }

    return {
        optionsStatus,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        grupoCorSelecionado,
        setGrupoCorSelecionado,
        dadosGrupoCores,
        cadastrarCores,
    }
}