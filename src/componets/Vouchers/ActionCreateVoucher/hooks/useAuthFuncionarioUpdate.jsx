import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { post } from '../../../../api/funcRequest';
import axios from 'axios';



export const useAuthFuncionarioUpdate = ({usuarioLogado}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioAutorizado, setUsuarioAutorizado] = useState([]);
  const [ipUsuario, setIpUsuario] = useState('');

  const getIPUsuario = async () => {
    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      let usuarioIP = ipWhoisData?.ip;

    if (!usuarioIP) {
      const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
      usuarioIP = ipifyData?.ip;
    }

      setIpUsuario(usuarioIP);
      return usuarioIP;
    } catch (error) {
    console.error("Erro ao buscar IP:", error);
    return null;
    }
  };

  const openSwal = async (callback, row) => {
    const { value: formValues } = await Swal.fire({
      title: 'Autorização',
      html: `
        <div>
          <label class="form-label" for="matricula">Matrícula</label>
          <input type="text" id="matricula" class="swal2-input" placeholder="Matrícula" style="text-align: center;" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
          <label class="form-label" for="senha">Senha</label>
          <input type="password" id="senha" class="swal2-input" placeholder="Senha">
        </div>      
      `,
      width: '25rem',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Entrar',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'container-swal',
      },
      didOpen: () => {
        const swalContainer = Swal.getPopup();
        swalContainer.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            Swal.clickConfirm();
          }
        });
      },
      preConfirm: async () => {
        const usuario = document.getElementById('matricula').value;
        const senha = document.getElementById('senha').value;
    
        const data = { 
          MATRICULA: usuario, 
          SENHA: senha, 
          IDEMPRESALOGADA: usuarioLogado.IDEMPRESA,
          IDGRUPOEMPRESARIAL: usuarioLogado.IDGRUPOEMPRESARIAL, 
          IDVOUCHER: row.IDVOUCHER,
        }; 

        try {
          const response = await post('/auth-funcionario-update-voucher', data);
        
          
          if (response.data) {
            return response.data;
          } else {
            Swal.showValidationMessage(`Credenciais inválidas`);
          }
          
        } catch (error) {
          let errorMessage = 'Erro desconhecido';
                              
          if (typeof error.response.data.error === 'string') {
            errorMessage = error.response.data.error;
          } else if (error.response.data.error?.error) {
            errorMessage = error.response.data.error.error;
          } else if (typeof error.response.data.error === 'object') {
            errorMessage = JSON.stringify(error.response.data.error);
          }
          
          Swal.showValidationMessage(`Erro ao autenticar: ${errorMessage}`);
        }
      }
    });
  
    if (formValues) {
      setIsLoggedIn(true);
      setUsuarioAutorizado(formValues);
      callback();
    }
  };

  return { openSwal, isLoggedIn, usuarioAutorizado };
};