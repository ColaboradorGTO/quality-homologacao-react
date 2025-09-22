import React, { Fragment, Suspense, lazy } from "react"
const ActionResumoVendas = lazy(() => import("../componets/ResumoVendasGerencial/Components/ResumoGeral/actionResumoVendas").then(module => ({ default: module.ActionResumoVendas })));

export const DashBoardResumoVendas = ({ }) => {

  return (
    <Fragment>
      <div className="page-wrapper">
        <div className="page-inner">
          <div className="page-content-wrapper">
            <main id="js-page-content" role="main" className="page-content">
              <div className="row">
                <div className="col-xl-12">
                  <div id="panel-1" className="panel">
                    <div className="panel-container show">
                      <div className="panel-content">
                        <Suspense fallback={<div>Loading...</div>}>
                          <ActionResumoVendas />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
