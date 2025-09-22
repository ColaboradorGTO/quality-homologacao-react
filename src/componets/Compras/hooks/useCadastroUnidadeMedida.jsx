import Swal from "sweetalert2"
import { post } from "../../../api/funcRequest"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { getDataAtual } from "../../../utils/dataAtual"


export const useCadastroUnidadeMedida = () => {
    const [statusSelecionado, setStatusSelecionado] = useState("")
    const [descricao, setDescricao] = useState("")
    const [sigla, setSigla] = useState("")
    const [dataCampo, setDataCampo] = useState("")
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const dataAtual = getDataAtual();
        setDataCampo(dataAtual);
    })

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

    const handleCadastro = async () => {
        if(descricao === '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        if(sigla === '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'O campo sigla é obrigatório.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
        }

        const postData = {
            DSUNIDADE: descricao,
            DSSIGLA: sigla,
            DTCADASTRO: dataCampo,
            DTULTATUALIZACAO: dataCampo,
            STATIVO: statusSelecionado.value,
        }
        
        try {

            const response = await post('/cadastrar-unidades-de-medidas', postData)
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
            let textoFuncao = 'COMPRAS/CADASTRO DE UNIDADES DE MEDIDAS';
            
            const createLog = {
                IDUSUARIO: usuarioLogado.id,
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
            const responseLog = await post('/log-web', createLog)
            return responseLog.data;
    
        } catch (error) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.log(error)
        }      
    }

    return {
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        sigla,
        setSigla,
        dataCampo,
        usuarioLogado,
        ipUsuario,
        optionsStatus,
        handleCadastro,
    }
}