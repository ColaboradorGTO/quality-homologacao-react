import { useEffect, useState } from "react"
import { post, put } from "../../../api/funcRequest"
import { useFetchData } from "../../../hooks/useFetchData"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2'


export const useCadastrarGrupoEstruturaMercadologica = () => {
    const [statusSelecionado, setStatusSelecionado] = useState("")
    const [descricao, setDescricao] = useState("")
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

    const { data: dadosGrupoEstrutura = [] } = useFetchData('grupoEstrutura', '/grupoEstrutura');
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
    
    
    const cadastrarGrupoEstrutura = async () => {
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
           
            // IDGRUPOESTRUTURA: dadosDetalheGrupo[0]?.IDGRUPOESTRUTURA,
            // IDGRUPOEMPRESARIAL: dadosDetalheGrupo[0]?.IDGRUPOEMPRESARIAL,
            DSGRUPOESTRUTURA: descricao,
            STATIVO: statusSelecionado.value,
            
        }]
        try {
            const response = await post('/cadastro-grupoEstrutura', postData)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ALTERAÇÃO DO GRUPO DA ESTRUTURA MERCADOLÓGICA';

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
            console.error('Erro ao Cadastrar:', error);
        }
    }

    return {
        optionsStatus,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        dadosGrupoEstrutura,
        cadastrarGrupoEstrutura,
    
    }
}