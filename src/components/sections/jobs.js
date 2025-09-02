import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 700px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
    text-align: center;
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const StyledQuotesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Cambio a una sola columna en todos los tamaños de pantalla */
  grid-gap: 15px;
  margin-top: 50px;
  width: 100%;
  max-width: 600px; /* Añadido un ancho máximo para limitar el tamaño de las tarjetas */
  margin-left: auto; /* Centrar el grid horizontalmente */
  margin-right: auto;
`;

const StyledQuoteCard = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  border-radius: var(--border-radius);
  background-color: var(--navy);
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;

  .author-name {
    color: var(--lightest-slate);
    font-size: 11px; /* Tamaño de letra más pequeño */
    transition: color 0.5s ease; /* Transición de 0.5 segundos para el cambio de color */
  }

  &:hover,
  &:focus-within {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(233, 215, 165, 0.5);

    &::before {
      opacity: 1;
      transform: rotate(-45deg) translateY(100%);
    }

    .author-name {
      color: #e9d7a5; /* Color dorado al hacer hover en toda la tarjeta */
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -25%;
    width: 200%;
    height: 200%;
    background: linear-gradient(0deg, transparent, transparent 30%, rgba(233, 215, 165, 0.3));
    transform: rotate(-45deg);
    transition: all 0.7s ease;
    opacity: 0;
    z-index: 1;
  }

  .quote-text {
    color: var(--light-slate);
    font-size: var(--fz-md); /* Reducido de var(--fz-lg) a var(--fz-md) */
    line-height: 1.5;
    margin-bottom: 15px;
    font-style: italic;
    position: relative;
    z-index: 2;
    padding: 0 10px;

    &::before,
    &::after {
      font-family: 'Georgia', serif;
      font-size: 2.5rem;
      line-height: 0;
      position: relative;
      color: #e9d7a5; /* Color dorado que coincide con tu tema */
      font-style: normal;
    }

    &::before {
      content: '\\201C'; /* Comilla inicial estilizada Unicode */
      margin-right: 5px;
      vertical-align: -0.3em;
    }

    &::after {
      content: '\\201D'; /* Comilla final estilizada Unicode */
      margin-left: 5px;
      vertical-align: -0.4em;
    }
  }

  .quote-author {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs); /* Reducido de var(--fz-sm) a var(--fz-xs) */
    text-align: right;
    position: relative;
    z-index: 2;

    a {
      position: relative;
      display: inline-block;
      color: var(--lightest-slate);
      text-decoration: none;
      transition: var(--transition);
      font-size: 10px; /* Tamaño aún más pequeño, especificado en píxeles */

      /* Variable para el color dorado en formato RGB */
      --link-color: 233, 215, 165;

      &:hover {
        color: rgb(var(--link-color));
      }

      &:hover::after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 0.05em;
        bottom: -0.2em; /* Más separado de la palabra */

        /* Gradiente dorado que se desvanece en los extremos */
        background-image: linear-gradient(
          to right,
          transparent 0%,
          rgba(var(--link-color), 0.6) 30%,
          rgba(var(--link-color), 0.7) 50%,
          rgba(var(--link-color), 0.6) 70%,
          transparent 100%
        );

        /* Configuración de animación de aparición más lenta */
        opacity: 0;
        animation: fadeIn 600ms ease-out forwards; /* Aumentado de 400ms a 600ms */
      }

      /* Keyframes para la animación de aparición */
      @keyframes fadeIn {
        100% {
          opacity: 1;
        }
      }
    }
  }
`;

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              location
              range
              url
            }
            html
          }
        }
      }
    }
  `);

  const jobsData = data.jobs.edges;

  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Trabajos anteriores</h2>

      <div className="inner">
        <StyledTabList role="tablist" aria-label="Job tabs" onKeyDown={e => onKeyDown(e)}>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { company } = node.frontmatter;
              return (
                <StyledTabButton
                  key={i}
                  isActive={activeTabId === i}
                  onClick={() => setActiveTabId(i)}
                  ref={el => (tabs.current[i] = el)}
                  id={`tab-${i}`}
                  role="tab"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-selected={activeTabId === i ? true : false}
                  aria-controls={`panel-${i}`}>
                  <span>{company}</span>
                </StyledTabButton>
              );
            })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { title, url, company, range } = frontmatter;

              return (
                <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? '0' : '-1'}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}>
                    <h3>
                      <span>{title}</span>
                      <span className="company">
                        &nbsp;@&nbsp;
                        <a href={url} className="inline-link">
                          {company}
                        </a>
                      </span>
                    </h3>

                    <p className="range">{range}</p>

                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>

      {/* Grid de citas famosas */}
      <StyledQuotesGrid>
        <a
          href="/fernando.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}>
          <StyledQuoteCard>
            <p className="quote-text">
              Siempre ha demostrado una actitud magnífica. Es una persona trabajadora, con muy buena formación y con ilusión por afrontar nuevos retos.
            </p>
            <p className="quote-author">
              - <span className="author-name">Fernando, Dpto. Sistemas Informáticos y Computación</span>
            </p>
          </StyledQuoteCard>
        </a>
      </StyledQuotesGrid>
            <StyledQuotesGrid>
        <a
          href="/litterator.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}>
          <StyledQuoteCard>
            <p className="quote-text">
              Demuestra una empatía y paciencia notables en su día a día, cuyas contribuciones han tenido un impacto significativo.
            </p>
            <p className="quote-author">
              - <span className="author-name">María, Directora en Litterator</span>
            </p>
          </StyledQuoteCard>
        </a>
      </StyledQuotesGrid>
    </StyledJobsSection>
  );
};

export default Jobs;
