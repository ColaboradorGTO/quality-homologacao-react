import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const useExcluirVinculoFabricanteFornecedor = () => {
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
        if (response.data) {
            setIpUsuario(response.data.ip);
        }
        return response.data;
    }

    const handleExcluir = async (IDFABRICANTEFORN) => {
        Swal.fire({
            title: `Certeza que Deseja Excluir o Vínculo do Fornecedor?`,
            text: 'Você não poderá reverter a ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-danger',
              loader: 'custom-loader'
            },
            buttonsStyling: false
        }).then(async (result) => {
        if (result.isConfirmed) {
            try {
            const putData = {
                IDFABRICANTEFORN: IDFABRICANTEFORN,
            }
            const response = await put(`/del-vinculo-Fabricante-Fornecedor/:id`, putData)
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'COMPRAS/EXCLUSÃO VINCULO FORNECEDOR-FABRICANTE'
    
            const postData = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
    
            const responsePost = await post('/log-web', postData)
    
            return responsePost.data;
            } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: `Erro ao excluir o Vínculo do Fornecedor: ${error}`,
                icon: 'success'
            });
            }
        }
        })
    }
    

    return {
        handleExcluir
    }
}