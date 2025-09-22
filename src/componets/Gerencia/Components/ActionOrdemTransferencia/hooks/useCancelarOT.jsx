import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";


export const useCancelarOT = (row, usuarioLogado, optionsModulos) => {
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

    const handleCancelar = async (row) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Atenção',
                text: 'Você não tem permissão para cancelar essa OT.',
                icon: 'warning',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }
        const putData = {
          IDSTATUSOT: parseInt(2),
          IDRESUMOT: row.IDRESUMOT,
          IDUSRCANCELAMENTO: usuarioLogado?.id,
        };
    
        Swal.fire({
          icon: 'question',
          title: `Deseja realmente CANCELAR essa OT?`,
          showCloseButton: true,
          showCancelButton: true,
          cancelButtonColor: '#FD1381',
          confirmButtonColor: '#7352A5',
          confirmButtonText: 'Sim, quero Cancelar!',
          cancelButtonText: 'Não',
          customClass: {
            container: 'custom-swal',
          },
          timer: 3000,
          preConfirm: async () => {
            try {
    
                await put('/resumo-ordem-transferencia/:id', putData);
                const textDados = JSON.stringify(putData);
                let textoFuncao = 'GERENCIA/CANCELAR OT';
            
                const createData = {
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO: textoFuncao,
                    DADOS: textDados,
                    IP: ipUsuario
                };
            
                const responsePost = await post('/log-web', createData)
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'OT Cancelada com Sucesso',
                    icon: 'success',
                    confirmButtonColor: '#7352A5',
                    customClass: {
                        container: 'custom-swal',
                    }
                });
                handleClick();
                return responsePost.data;
            } catch (error) {
                let textoFuncao = 'GERENCIA/ERRO AO CANCELAR OT';
            
                const createData = {
                    IDFUNCIONARIO: String(usuarioLogado.id),
                    PATHFUNCAO: textoFuncao,
                    DADOS: 'GERENCIA/ERRO AO CANCELAR OT',
                    IP: ipUsuario
                };
            
                const responsePost = await post('/log-web', createData)
                Swal.fire({
                    title: 'Erro',
                    text: 'Ocorreu um erro ao cancelar a OT!',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    customClass: {
                        container: 'custom-swal',
                    }
                });
                handleClick();
                return responsePost.data;
            }
          }
        });
    };

    return {
        handleCancelar,
    }
}