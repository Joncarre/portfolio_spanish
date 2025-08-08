import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import GradientText from '../GradientText';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: normal;
      filter: grayscale(100%);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'Resource optimization',
    'Formal methods',
    'Project management',
    'Cybersecurity',
    'UML',
    'LaTeX',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Soy un Ing. de Software e investigador que hace unos meses decidió dejar el ámbito educativo y buscar nuevas oportunidades en desarrollo, ciberseguridad, optimización de recursos y, sobre todo, en la{' '}
              <GradientText
                colors={['#e9d7a5', '#a18a7d', '#e9d7a5', '#a18a7d', '#e9d7a5']}
                animationSpeed={6}>
                gestión de proyectos 
              </GradientText>{' '}
              . Soy curioso, positivo,  {' '}
              <GradientText
                colors={['#e9d7a5', '#a18a7d', '#e9d7a5', '#a18a7d', '#e9d7a5']}
                animationSpeed={6}>
                organizado
              </GradientText>{' '}
              y me gusta abordar problemas complejos y estar siempre estudiando y aprendiendo cosas nuevas.
            </p>

            <p>
              Espero poder seguir desarrollando mis {' '}
              <GradientText
                colors={['#e9d7a5', '#a18a7d', '#e9d7a5', '#a18a7d', '#e9d7a5']}
                animationSpeed={6}>
                 habilidades
              </GradientText>{' '}
              y conocimiento en el mundo empresarial, y conocer personas increíbles con las que seguir {' '}
              <GradientText
                colors={['#e9d7a5', '#a18a7d', '#e9d7a5', '#a18a7d', '#e9d7a5']}
                animationSpeed={6}>
                creciendo
              </GradientText>{' '}
              .
            </p>

            <p>Estas son algunas de las cosas con las que me gusta trabajar:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
