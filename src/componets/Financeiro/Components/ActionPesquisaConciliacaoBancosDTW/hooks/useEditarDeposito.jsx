import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";

export const useEditarDeposito = ({ optionsModulos, usuarioLogado, handleClick, handleClickCompensacao }) => {
    const [ipUsuario, setIpUsuario] = useState('');

    useEffect(() => {
        getIPUsuario();
    }, [usuarioLogado]);

    const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
        setIpUsuario(response.data);
    }
    return response.data;
    }

    const handleCancelar = async (IDDEPOSITOLOJA) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Você não tem permissão para cancelar a conciliação do depósito!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000 
            });
            return
        }

        Swal.fire({
            title: 'Tem Certeza que Deseja Cancelar a Conciliação do Depósito?',
            text: 'Você não poderá reverter esta ação!',
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
                    IDDEPOSITOLOJA: IDDEPOSITOLOJA,
        
                }
                                                    
                const response = await put('/atualizar-deposito-loja/:id', putData)
                
                const textDados = JSON.stringify(putData)
                let textoFuncao = 'FINANCEIRO/CANCELADO CONCILIAÇÃO DO DEPOSITO';
            
                const postData = {  
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO:  textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario.ip,
                }
        
                const responsePost = await post('/log-web', postData)
            
                Swal.fire({
                    title: 'Cancelado', 
                    text: 'Conciliação do Depósito cancelado com Sucesso', 
                    icon: 'success'
                })
                handleClick()
                handleClickCompensacao()
          
                return responsePost.data;
            } catch (error) {
                const textDados = JSON.stringify(putData)
                let textoFuncao = 'FINANCEIRO/ERRO AO CANCELAR CONCILIAÇÃO DO DEPOSITO';
            
                const postData = {  
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO:  textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario.ip,
                }
        
                const responsePost = await post('/log-web', postData)

          
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Erro ao cancelar a conciliação do depósito!',
                    customClass: {
                        container: 'custom-swal',
                    },
                    showConfirmButton: false,
                    timer: 4000 
                });
                handleClick()
                handleClickCompensacao()
                return responsePost.data;
            }
            }
        })
    
    }
      
    return {
        handleCancelar,
        ipUsuario,
        getIPUsuario,
        setIpUsuario,
    }
}