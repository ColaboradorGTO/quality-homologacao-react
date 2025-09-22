import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { animacaoCarregamento, animationLodadingStart } from "../../../../../utils/animationCarregamento";

export const useIntegrarConciliarDepositoNoSAP = ({ optionsModulos, usuarioLogado, handleClick }) => {
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

    const handleConciliar = async (IDDEPOSITOLOJA) => {
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
            title: 'Certeza que Deseja Integrar a Conciliação do Depósito no SAP?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-success mx-2', 
                cancelButton: 'btn btn-danger mx-2', 
                loader: 'custom-loader'
            },
            buttonsStyling: false
        }).then(async (result) => {
            if (result.isConfirmed) {
            try {
                const putData = { 
                    IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                }
                animationLodadingStart('Integrando Depósito no SAP', 1000, false);
                const response = await post('/deposito-integracao', putData)
                console.log('Resposta da integração:', response);
                
                const textDados = JSON.stringify(putData)
                let textoFuncao = 'FINANCEIRO/INTEGRACAO CONCILIAÇÃO DO DEPOSITO'
            
                const postData = {  
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO:  textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario.ip,
                }
        
                const responsePost = await post('/log-web', postData)
            
                Swal.fire({
                    title: 'Integrado', 
                    text: 'Conciliação do Depósito Integrada no SAP com Sucesso!', 
                    icon: 'success'
                })
                handleClick()
          
                return responsePost.data;
            } catch (error) {
                // const textDados = JSON.stringify(putData)
                let textoFuncao = 'FINANCEIRO/ERRO AO CANCELAR CONCILIAÇÃO DO DEPOSITO';
            
                const postData = {  
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO:  textoFuncao,
                    DADOS: '',
                    IP: ipUsuario.ip,
                }
        
                const responsePost = await post('/log-web', postData)

          
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Erro ao cancelar ao conciliar o depósito no SAP!',
                    customClass: {
                        container: 'custom-swal',
                    },
                    showConfirmButton: false,
                    timer: 4000 
                });
                handleClick()
                return responsePost.data;
            }
            }
        })
    
    }
      
    return {
        handleConciliar,
        ipUsuario,
        getIPUsuario,
        setIpUsuario,
    }
}