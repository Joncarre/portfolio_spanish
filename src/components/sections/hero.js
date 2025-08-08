import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import GradientText from '../GradientText';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hola, mi nombre es</h1>;
  const two = <h2 className="big-heading">Jonathan Carrero</h2>;
  const three = <h3 className="medium-heading">Especializado en la optimización de recursos</h3>;
  const four = (
    <>
      <p>
        Soy un Doctor {' '}
        <GradientText
          colors={['#e9d7a5', '#a18a7d', '#e9d7a5', '#a18a7d', '#e9d7a5']}
          animationSpeed={6}>
          Ingeniero de Software
        </GradientText>{' '}
        especializado en optimización de recursos, métodos formales, ciberseguridad y gestión de proyectos
        bajo la organización {' '}
        <GradientText
          colors={['#e9d7a5', '#a18a7d', '#e9d7a5', '#a18a7d', '#e9d7a5']}
          animationSpeed={6}>
          Project Management Institute.
        </GradientText>{' '}
        
      </p>
    </>
  );
  const five = (
    <a
      className="email-link"
      href="https://scholar.google.es/citations?user=TdwutvkAAAAJ&hl=en"
      target="_blank"
      rel="noreferrer">
      ¡Estas son mis áreas de investigación!
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
