// src/AppRouter.tsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Introducao from './pages/Introducao';
import Paciente from './pages/Paciente';
import ActionPage from './pages/ActionPage';
import Grafico from './components/Grafico';

// Importação dos assets
import bebendo from './assets/bebendo.gif';
import comendo from './assets/comendo.gif';
import seco from './assets/seco.png';
import biscoito from './assets/biscoito.gif';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota Inicial */}
        <Route path="/" element={<Introducao />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/paciente" element={<Paciente />} />

        {/* Rota: Deglutição a Seco */}
        <Route
          path="/engolir_seco"
          element={
            <ActionPage
              key="engolir_seco"
              title="Deglutição Seca"
              acao="engolir_seco"
              imageUrl={seco}
              imageAlt="Imagem de uma pessoa engolindo seco"
              initialTimer={12}
              backRoute="/"
              nextRoute="/idssi_0"
              backText="Voltar"
              nextText="Prosseguir"
            />
          }
        />

        {/* Rota: IDDSI 0 – Líquido Fino */}
        <Route
          path="/idssi_0"
          element={
            <ActionPage
              key="idssi_0"
              title="IDDSI 0 – Líquido Fino"
              acao="bebendo"
              imageUrl={bebendo}
              imageAlt="GIF de uma pessoa bebendo água"
              initialTimer={12}
              backRoute="/engolir_seco"
              nextRoute="/idssi_4"
              backText="Voltar"
              nextText="Prosseguir"
            />
          }
        />

        {/* Rota: IDDSI 4 – Purê Espesso */}
        <Route
          path="/idssi_4"
          element={
            <ActionPage
              key="idssi_4"
              title="IDDSI 4 – Pastoso"
              acao="comendo_pure"
              imageUrl={comendo}
              imageAlt="GIF de uma pessoa ingerindo purê espesso"
              initialTimer={12}
              backRoute="/idssi_0"
              nextRoute="/idssi_7"
              backText="Voltar"
              nextText="Prosseguir"
            />
          }
        />

        {/* Rota: IDDSI 7 – Sólido Regular */}
        <Route
          path="/idssi_7"
          element={
            <ActionPage
              key="idssi_7"
              title="IDDSI 7 – Sólido Normal"
              acao="comendo_solido"
              imageUrl={biscoito}
              imageAlt="GIF de uma pessoa comendo um sólido"
              initialTimer={25}
              backRoute="/idssi_4"
              nextRoute="/grafico"
              backText="Voltar"
              nextText="Finalizar"
            />
          }
        />

        {/* Rota: Gráfico */}
        <Route path="/grafico" element={<Grafico />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
