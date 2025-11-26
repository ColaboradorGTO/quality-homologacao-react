import { Routes, Route, Navigate } from "react-router-dom";
import { DashBoardAdministrativo } from "../pages/DashBoardAdministrativo";
import { DashBoardCadastro } from "../pages/DashBoardCadastro";
import { DashBoardComercial } from "../pages/DashBoardComercial";
import { DashBoardCompras } from "../pages/DashBoardCompras";
import { DashBoardConferenciaCega } from "../pages/DashBoardConferenciaCega";
import { DashBoardContabilidade } from "../pages/DashBoardContabilidade";
import { DashBoardExpedicao } from "../pages/DashBoardExpedicao";
import { DashBoardFinanceiro } from "../pages/DashBoardFinanceiro";
import { DashBoardGerencia } from "../pages/DashBoardGerencia";
import { DashBoardInformatica } from "../pages/DashBoardInformatica";
import { DashBoardMarketing } from "../pages/DashBoardMarketing";
import { Fragment, useEffect, useState } from "react";
import AuthProvider from "../Providers/AuthContext";
import { Home } from "../pages/Home";
import { DashBoardComprasDM } from "../pages/DashBoardComprasDm";
import { DashBoardEtiquetagem } from "../pages/DashBoardEtiquetagem";
import { DashBoardMalotes } from "../pages/DashBoardMalotes";
import { DashBoardVoucher } from "../pages/DashBoardVoucher";
import { DashBoardPromocao } from "../pages/DashBoardPromocao";
import { Permissoes } from "../pages/Permissoes";
import { ModuloTeste } from "../pages/ModuloTeste";
import { DashBoardRecursosHumanos } from "../pages/DashBoardRecursosHumanos";
import { DashBoardResumoVendas } from "../pages/DashBoardResumoVendas";
import { DashBoardMenus } from "../pages/DashBoardMenus";

export const RoutesMain = () => {
  const [componentToShow, setComponentToShow] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');
    if (usuarioArmazenado) {
      const parsedUsuario = JSON.parse(usuarioArmazenado);
      setUsuarioLogado(parsedUsuario);
    }
  }, []);

  useEffect(() => {

  }, [usuarioLogado]);

 

  const handleShowComponent = (componentName) => {
    setComponentToShow(componentName);
  };

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modulo" element={usuarioLogado ? <ModuloTeste  /> : <Navigate to="/"  />} />
        <Route path="/DashBoardFinanceiro" element={<DashBoardFinanceiro componentToShow={componentToShow} handleShowComponent={handleShowComponent}   />  } />
        <Route path="/DashBoardAdministrativo" element={<DashBoardAdministrativo componentToShow={componentToShow} handleShowComponent={handleShowComponent}  />  } />
        <Route path="/DashBoardGerencia" element={<DashBoardGerencia componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> } />
        <Route path="/DashBoardInformatica" element={<DashBoardInformatica componentToShow={componentToShow} handleShowComponent={handleShowComponent}   />  } />
        <Route path="/DashBoardContabilidade" element={ <DashBoardContabilidade componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> } />
        <Route path="/DashBoardRecursosHumanos" element={ <DashBoardRecursosHumanos componentToShow={componentToShow} handleShowComponent={handleShowComponent}  />  } />
        <Route path="/DashBoardPromocao" element={<DashBoardPromocao componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> }  />
        <Route path="/DashBoardMarketing" element={ <DashBoardMarketing componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> } />
        <Route path="/DashBoardPermissoes" element={<Permissoes  />  } />
        <Route path="/DashBoardMalotes" element={<DashBoardMalotes componentToShow={componentToShow} handleShowComponent={handleShowComponent}   /> } />  
        <Route path="/DashBoardVouchers" element={<DashBoardVoucher componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> } />
        <Route path="/DashBoardMenus" element={<DashBoardMenus componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> } />
        <Route path="/DashBoardCompras" element={<DashBoardCompras componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> } />
    
        {/* <Route path="/DashBoardPromocao" element={usuarioLogado ? <DashBoardPromocao componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> : <Navigate to="/"/>}  /> */}

        <Route path="/DashBoardResumoVendas" element={<DashBoardResumoVendas componentToShow={componentToShow} handleShowComponent={handleShowComponent}  />  } />

        <Route path="/DashBoardExpedicao" element={usuarioLogado ? <DashBoardExpedicao componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> : <Navigate to="/"/> } />
        <Route path="/DashBoardConferenciaCega" element={usuarioLogado ? <DashBoardConferenciaCega componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> : <Navigate to="/"/>} />
        <Route path="/DashBoardCadastro" element={usuarioLogado ? <DashBoardCadastro componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> : <Navigate to="/"/>} />
        <Route path="/DashBoardComprasDM" element={usuarioLogado ? <DashBoardComprasDM componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> : <Navigate to="/"/> } />
        <Route path="/DashBoardComercial" element={usuarioLogado ? <DashBoardComercial componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> : <Navigate to="/"/> } />
        <Route path="/DashBoardEtiquetagem" element={usuarioLogado ? <DashBoardEtiquetagem componentToShow={componentToShow} handleShowComponent={handleShowComponent}  /> : <Navigate to="/"/> } />

      </Routes>
  );
};