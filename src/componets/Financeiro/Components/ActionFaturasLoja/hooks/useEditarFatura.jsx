import { useEffect, useState } from "react";
import { post, put } from "../../../../../api/funcRequest";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useEditarFatura = ({dadosDetalheFaturaCaixa, optionsModulos}) => {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [horarioAtual, setHorarioAtual] = useState('');
    const [despesaSelecionada, setDespesaSelecionada] = useState(null);
    const [valorFatura, setValorFatura] = useState('');
    const [codAutorizacao, setCodAutorizacao] = useState('');
    const [codPix, setCodPix] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [stPixSelecionado, setStPixSelecionado] = useState('')
    const [empresaSelecionada, setEmpresaSelecionada] = useState('');
    const [caixa, setCaixa] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();

   
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
        if(dadosDetalheFaturaCaixa.length > 0) {
            setEmpresaSelecionada(dadosDetalheFaturaCaixa[0].NOFANTASIA);
            setCaixa(`${dadosDetalheFaturaCaixa[0]?.IDDETALHEFATURA} - ${dadosDetalheFaturaCaixa[0]?.DSCAIXA} - ${dadosDetalheFaturaCaixa[0].NUCODAUTORIZACAO} `);
            setCodAutorizacao(dadosDetalheFaturaCaixa[0].NUCODAUTORIZACAO);
            setCodPix(dadosDetalheFaturaCaixa[0].NUAUTORIZACAO);
            setValorFatura(dadosDetalheFaturaCaixa[0].VRRECEBIDO);
            setStPixSelecionado({value: dadosDetalheFaturaCaixa[0].STPIX, label: dadosDetalheFaturaCaixa[0].STPIX ? 'SIM' : 'NÃO'});
            setStatusSelecionado({value: dadosDetalheFaturaCaixa[0].STCANCELADO, label: dadosDetalheFaturaCaixa[0].STCANCELADO ? 'CANCELADO' : 'ATIVO'});
        }
        
    }, [dadosDetalheFaturaCaixa]);
    

    useEffect(() => {
        const currentDate = new Date();
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
        setHorarioAtual(formattedTime);
    }, []);


    const onSubmit = async (data) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Você não tem permissão para alterar a fatura.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            return;
        }
        
        if(codAutorizacao == '') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'O campo Código Autorização é obrigatório.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            return;
        }

        if(valorFatura == '') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'O campo Valor da Fatura é obrigatório.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            return;
        }

        const putData = {
            IDDETALHEFATURA: dadosDetalheFaturaCaixa[0].IDDETALHEFATURA,
            NUCODAUTORIZACAO: codAutorizacao,
            VRRECEBIDO:  parseFloat(valorFatura),
            NUAUTORIZACAO: codPix,
            STPIX: stPixSelecionado,
            STCANCELADO: statusSelecionado,
        }

        try {

            const response = await put('/atualizarFatura/:id', putData)
            const textDados = JSON.stringify(putData)

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ALTERAÇÃO DE FATURA`,
                DADOS: textDados,
                IP: ipUsuario
            }
            
            const responsePost = await post('/log-web', postData)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            })

            handleClose();
            return responsePost.data;
        } catch (error) {

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ERRO AO ALTERAR FATURA`,
                DADOS: textDados,
                IP: ipUsuario
            }
            
            const responsePost = await post('/log-web', postData)


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
            console.error('Erro Alterar Fatura:', error);
            return responsePost.data;
        }
    }

    const OptionsStatus = [
        {id:  0,  value: "True", label: "CANCELADO" },
        {id:  1,  value: "False", label: "ATIVO" },
    ]
    const OptionsPIX = [
        {id:  0,  value: "True", label: "SIM" },
        {id:  1,  value: "False", label: "NÃO" },
    ]
    
    return {
        valorFatura,
        despesaSelecionada,
        caixa,
        empresaSelecionada,
        codAutorizacao,
        codPix,
        statusSelecionado,
        stPixSelecionado,
        OptionsStatus,
        OptionsPIX,
        onSubmit,
        setCodAutorizacao,
        setCodPix,
        setStatusSelecionado,
        setStPixSelecionado,
        setValorFatura,
        setEmpresaSelecionada,
        setCaixa

    }
}