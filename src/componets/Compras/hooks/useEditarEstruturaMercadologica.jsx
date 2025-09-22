import { useEffect, useState } from "react"
import { post, put } from "../../../api/funcRequest"
import { useFetchData } from "../../../hooks/useFetchData"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2'


export const useEditarEstruturaMercadologica = ({dadosDetalheSubGrupo}) => {
    const [statusSelecionado, setStatusSelecionado] = useState("")
    const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("")
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
        if (dadosDetalheSubGrupo) {
            setDescricao(dadosDetalheSubGrupo[0]?.DSSUBGRUPOESTRUTURA)
            setStatusSelecionado({ value: dadosDetalheSubGrupo[0]?.STATIVO, label: dadosDetalheSubGrupo[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
            setSubGrupoSelecionado({ value: dadosDetalheSubGrupo[0]?.IDSUBGRUPOESTRUTURA, label: `${dadosDetalheSubGrupo[0]?.CODGRUPOESTRUTURA} - ${dadosDetalheSubGrupo[0]?.DSGRUPOESTRUTURA}` })
        }
    }, [dadosDetalheSubGrupo])

    // console.log('dadosDetalheSubGrupo', dadosDetalheSubGrupo[0])

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
    
    console.log(dadosDetalheSubGrupo[0]?.IDGRUPOESTRUTURA, 'dadosDetalheSubGrupo[0]?.IDGRUPOESTRUTURA')
    const atualzarSubGrupoEstrutura = async () => {
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

        if (subGrupoSelecionado == '') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'O campo Grupo Cor é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        console.log(dadosDetalheSubGrupo[0]?.IDGRUPOESTRUTURA, 'dadosDetalheSubGrupo[0]?.IDGRUPOESTRUTURA')
        const postData = [{
            IDGRUPOESTRUTURAANTIGA: dadosDetalheSubGrupo[0]?.IDGRUPOESTRUTURA,
            IDGRUPOESTRUTURA: subGrupoSelecionado.value,
            DSSUBGRUPOESTRUTURA: descricao,
            CODSUBGRUPOESTRUTURA: dadosDetalheSubGrupo[0]?.CODSUBGRUPOESTRUTURA,
            IDSUBGRUPOESTRUTURA: dadosDetalheSubGrupo[0]?.IDSUBGRUPOESTRUTURA,
            STATIVO: statusSelecionado.value,
            DSSUBGRUPOESTRUTURAFIM: dadosDetalheSubGrupo[0]?.DSSUBGRUPOESTRUTURAFIM,
        }]
        try {
            console.log('postData', postData)
            const response = await put('/sub-grupo-estrutura/:id', postData)
            // cadastro-sub-grupo-estrutura
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
            let textFuncao = 'COMPRAS/ALTERAÇÃO DA ESTRUTURA MERCADOLÓGICA';

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
            console.error('Erro ao alterar a Cor:', error);
        }
    }

    return {
        optionsStatus,
        statusSelecionado,
        setStatusSelecionado,
        descricao,
        setDescricao,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        dadosDetalheSubGrupo,
        dadosGrupoEstrutura,
        atualzarSubGrupoEstrutura,
    
    }
}