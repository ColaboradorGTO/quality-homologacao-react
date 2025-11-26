import React, { Fragment, useEffect, useState } from 'react';
import { useSidebar } from './SidebarContext';
import { FaAngleDown } from "react-icons/fa";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import Swal from 'sweetalert2';

export const MenuSidebarAdmin = ({componentToShow, handleShowComponent }) => {
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);
  const [activeLink, setActiveLink] = useState('');
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [usuarioLogado, setUsuarioLogado] = useState(null);


  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      const parsedUsuario = JSON.parse(usuarioArmazenado);
      setUsuarioLogado(parsedUsuario);
    }
  }, [])

  useEffect(() => {
  }, [usuarioLogado, selectedModule])

// const hasPermission = () => {
//     const { IDPERFIL, id } = usuarioLogado || {};
//     return (
//       IDPERFIL === 1 ||
//       id === 5001 ||
//       id === 5026 ||
//       id === 200
//     );
//   };

//   // Função para lidar com o clique nos itens da sidebar
//   const handleClick = (componentName) => {
//     if (componentName === "/financeiro/ActionPesquisaSaldoLoja" || componentName === "/financeiro/ActionPesquisaExtratoLoja" && !hasPermission()) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Acesso não autorizado',
//         text: 'Você não tem permissão para acessar essa funcionalidade.',
//       })
//       return;
//     }
//     setActiveLink(componentName);
//     handleShowComponent(componentName);
//   };

  const handleClick = (componentName) => {
    setActiveLink(componentName);
    handleShowComponent(componentName);
    
  };


  const renderSideBarItems = () => {
  // const renderSideBarItems = () => {
    // const administrativoUser = selectedModule.sideBar
    const administrativoUser = selectedModule?.menuPai.menuFilho;

    if (administrativoUser && administrativoUser.length > 0) {
      return (
      <ul id="js-nav-menu" className="nav-menu">
        {administrativoUser.map((menuItem, index) => {
        const { ID, DSNOME, URL } = menuItem;
        // const { id, linkText, url } = menuItem;

        if (!URL) {
          return null;
        }
        return (
          <li key={ID || index} className={activeLink === URL ? "active" : ""}>
          <a href="#" onClick={() => handleClick(URL)}>
            <span className="nav-link-text">
            {/* {linkText} */}
            
            {DSNOME}
            </span>
          </a>
          </li>
        );
        })}
      </ul>
      );
    } else {
      return <p>{`Sem conteúdo na sidebar para o usuário ${usuarioLogado?.NOFUNCIONARIO}.`}</p>;
    }
    // if (administrativoUser) {
    //   const sideBarContents = administrativoUser.sideBar;
    //   console.log(administrativoUser.sideBar, 'sidebarContents')
      
    //   if (sideBarContents && sideBarContents.length > 0) {
        
    //     return (
    //       <ul id="js-nav-menu" className="nav-menu">
    //         {sideBarContents.map((sidebarItem, index) => {
         
    //           if (!sidebarItem.url) {
    //             return null
    //           }
    //           return (
    //             <>
              
    //               <li key={index} className={activeLink === sidebarItem.url ? "active" : ""} >
    //                 {/* <a href={'#'} onClick={() => handleClick(sidebarItem.url)}> */}
    //                 <a href="#" onClick={() => handleClick(sidebarItem.url)}>
    //                   {/* <img className='fal fa-info-circle' src={sidebarItem.icons} alt='' /> */}

    //                   <span className="nav-link-text">
    //                     {sidebarItem.linkText}
    //                   </span>

    //                 </a>
    //               </li>
    //             </>

    //           )
    //         })}
    //       </ul>
    //     );
    //   } else {
    //     return <p>Sem conteúdo na sidebar para o usuário Administrativo.</p>;
    //   }
    // } else {
    //   return <p>Usuário Administrativo não encontrado.</p>;
    // }
  };

  // const renderSideBarItems = () => {
  //   const administrativoUser = selectedModule;
  //   if (administrativoUser) {
  //     const sideBarContents = administrativoUser;
           
  //     if (sideBarContents && sideBarContents.length > 0) {  
  //       return (
  //         <ul id="js-nav-menu" className="nav-menu">
  //           {sideBarContents.map((sidebarItem, index) => {
         
  //             if (!sidebarItem.URL) {
  //               return null
  //             }
  //             return (
  //               <>
              
  //                 <li key={index} className={activeLink === sidebarItem.URL ? "active" : ""} >
  //                   <a href="#" onClick={() => handleClick(sidebarItem.URL)}>
  //                     {/* <img className='fal fa-info-circle' src={sidebarItem.icons} alt='' /> */}

  //                     <span className="nav-link-text">
  //                       {/* {console.log(sidebarItem)} */}
  //                       {sidebarItem.DSNOME}
  //                     </span>

  //                   </a>
  //                 </li>
  //               </>

  //             )
  //           })}
  //         </ul>
  //       );
  //     } else {
  //       return <p>Sem conteúdo na sidebar para o usuário Administrativo.</p>;
  //     }
  //   } else {
  //     return <p>Usuário Administrativo não encontrado.</p>;
  //   }
  // };

  return (
    <Fragment>
      
      <aside className={`page-sidebar ${sidebarOpen ? 'sidebar' : ''}`}>
  
  
        <div className="page-logo" style={{justifyContent: 'space-around'}} >
          <a href="#" className="page-logo-link press-scale-down d-flex align-items-center position-relative" data-toggle="modal" data-target="#modal-shortcut">
            {/* <img src="img/logo.png" alt="SoftQuality SAP" aria-roledescription="logo SoftQuality" /> */}
            <span className="page-logo-text mr-1">SoftQuality SAP  </span>
            {/* <span className="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span> */}
            {/* <i className="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i> */}
            {/* <FaAngleDown className="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300" size={0} colo="#fff" />  */}
          </a>

            {sidebarOpen ? (
              <Fragment>

                <button 
                  onClick={toggleSidebar} 
                  className="header-btn btn js-waves-off" 
                  data-action="toggle" 
                  data-className="nav-function-hidden"
                  style={{backgroundColor: '#fff'}}
                >
                  <AiOutlineMenuFold 
                    color={"#5d4286"}
                    
                    size={20} 
                  />
                </button>
              </Fragment>
              // <AiOutlineMenuUnfold className="fal fa-angle-down color-primary-300" size={40} />
            ) : (
              <Fragment>

                <button 
                  onClick={toggleSidebar} 
                  className="header-btn btn js-waves-off" 
                  data-action="toggle" 
                  data-className="nav-function-hidden"
                  style={{backgroundColor: '#fff'}}
                >
                  <AiOutlineMenuUnfold color={"#5d4286"}  size={20} />
                </button>
              </Fragment>
              // <AiOutlineMenuFold className="fal fa-angle-up color-primary-300" size={40} />
            )}
        </div>
  
        <nav id="js-primary-nav" className="primary-nav" role="navigation">
          {/* Restante do código... */}
  
          <div className="nav-filter">
            <div className="position-relative">
              <input type="text" id="nav_filter_input" placeholder="Filter menu" className="form-control" tabindex="0" />
              <a href="#" onclick="return false;" className="btn-primary btn-search-close js-waves-off" data-action="toggle" data-className="list-filter-active" data-target=".page-sidebar">
              <FaAngleDown size={25} color='#00ff' />
              </a>
             
          
            </div>
            
          </div>
          
          <div className="info-card">
            
            <img src="img/demo/avatars/avatar-admin.png" className="profile-image rounded-circle" alt="" />
            <div className="info-card-text">
              <a href="#" className="d-flex align-items-center text-white">
                <span className="text-truncate-lg d-inline-block NoFuncionarioTitulo">
                {usuarioLogado?.NOFUNCIONARIO}
                </span>
              </a>
              <span className="d-inline-block text-truncate-lg NoEmpresaTitulo">
                {usuarioLogado?.NOFANTASIA}
              </span>
            </div>
            <img src="img/card-backgrounds/cover-2-lg.png" className="cover" alt="cover" />
            <a href="#" onclick="return false;" className="pull-trigger-btn" data-action="toggle" data-className="list-filter-active" data-target=".page-sidebar" data-focus="nav_filter_input">
            <FaAngleDown size={15} color='#fff' />
            </a>
          </div>
  
  
          {renderSideBarItems()}
          <div className="filter-message js-filter-message bg-success-600"></div>
        </nav>
      </aside>
    </Fragment>
  );
};